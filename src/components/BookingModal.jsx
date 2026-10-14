import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, Check, ChevronLeft, ChevronRight, FileCheck2, Minus, Plus, RefreshCw, UploadCloud, X } from 'lucide-react';
import PhoneInput, { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { isBlockedCalendarDate, toLocalDateKey } from '../utils/dates.js';

const API = (import.meta.env.VITE_API_BASE_URL || 'https://api.kezoistays.com').replace(/\/$/, '');
const CODE = 'TG-0002';
const JSON_HEADERS = { Accept: 'application/json' };
const asDate = value => value ? new Date(`${value}T00:00:00`) : null;
const today = () => toLocalDateKey(new Date());
const labelDate = value => asDate(value)?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) || 'Select date';
const money = (value, currency = 'INR') => new Intl.NumberFormat('en-IN', { style: 'currency', currency: currency || 'INR' }).format(Number(value || 0));
const keyFor = form => [form.checkIn, form.checkOut, form.adults, form.children, form.infants, form.pets].join('|');
const json = response => response.json().catch(() => ({}));

function quoteError(status, data) {
  if (status === 400 || status === 409) return data.message || 'The selected stay could not be quoted.';
  if (status === 404) return 'Property not found.';
  if (status >= 500) return 'We could not calculate the current price. Please try again.';
  return data.message || 'We could not calculate the current price. Please try again.';
}

function Month({ value, start, end, blocked, mode, onSelect }) {
  const first = new Date(value.getFullYear(), value.getMonth(), 1);
  const count = new Date(value.getFullYear(), value.getMonth() + 1, 0).getDate();
  const cells = [...Array(first.getDay()).fill(null), ...Array.from({ length: count }, (_, i) => new Date(value.getFullYear(), value.getMonth(), i + 1))];
  return <div className="booking-month"><h5>{value.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</h5><div className="booking-weekdays">{['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <span key={day}>{day}</span>)}</div><div className="booking-days">{cells.map((date, i) => {
    if (!date) return <span key={`blank-${i}`} />;
    const day = toLocalDateKey(date), unavailable = isBlockedCalendarDate(date, blocked), selected = day === start || day === end;
    const disabled = day < today() || unavailable || (mode === 'checkout' && (!start || day <= start));
    return <button type="button" key={day} title={unavailable ? 'Unavailable' : undefined} disabled={disabled} aria-pressed={selected} className={`${selected ? 'selected' : ''} ${start && end && day > start && day < end ? 'in-range' : ''} ${unavailable ? 'booked' : ''}`} onClick={() => onSelect(date)}>{date.getDate()}</button>;
  })}</div></div>;
}

function Counter({ title, hint, value, min, max, onChange }) {
  return <div className="guest-counter"><div><strong>{title}</strong><span>{hint}</span></div><div className="counter-controls"><button type="button" disabled={value <= min} onClick={() => onChange(value - 1)}><Minus size={15} /></button><output>{value}</output><button type="button" disabled={value >= max} onClick={() => onChange(value + 1)}><Plus size={15} /></button></div></div>;
}

function Price({ quote }) {
  if (!quote) return <p className="quote-placeholder">Choose valid dates and guest counts to see the live price.</p>;
  const rows = [
    ['Number of nights', quote.nights], ['Base price per night', money(quote.base_price_per_night, quote.currency)], ['Base amount', money(quote.base_amount, quote.currency)],
    ['Included guests', quote.included_guests], ['Extra guests', quote.extra_guests], ['Extra-guest price per night', money(quote.extra_guest_price_per_night, quote.currency)],
    ['Extra-guest amount', money(quote.extra_guest_amount, quote.currency)], ['Original amount', money(quote.original_amount, quote.currency)], ['Discount percentage', `${Number(quote.discount_percentage || 0)}%`],
    ['Discount amount', money(quote.discount_amount, quote.currency)], ['Taxable amount', money(quote.taxable_amount, quote.currency)], ['CGST', money(quote.cgst_amount, quote.currency)],
    ['SGST', money(quote.sgst_amount, quote.currency)], ['IGST', money(quote.igst_amount, quote.currency)], ['Total GST', money(quote.gst_amount, quote.currency)],
  ];
  return <div className="price-card quote-breakdown">{rows.map(([name, value]) => <div key={name}><span>{name}</span><span>{value}</span></div>)}<div className="price-total"><strong>Final total</strong><strong>{money(quote.total_amount, quote.currency)}</strong></div><small>Currency: {quote.currency || 'INR'}</small></div>;
}

export default function BookingModal({ isOpen, onClose, property }) {
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [picker, setPicker] = useState(null);
  const pickerRef = useRef(null);
  const quoteController = useRef(null);
  const [form, setForm] = useState({ checkIn: '', checkOut: '', adults: 1, children: 0, infants: 0, pets: 0, fullName: '', email: '', phone: '', whatsapp: '', hearAbout: '', referralName: '', referralMobile: '', idType: 'AADHAAR_CARD', idFile: null, message: '', accepted: false });
  const [backendProperty, setBackendProperty] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');
  const [quote, setQuote] = useState(null);
  const [quotedFor, setQuotedFor] = useState('');
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteMessage, setQuoteMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [referralError, setReferralError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [finalQuote, setFinalQuote] = useState(null);
  const [dragging, setDragging] = useState(false);
  const blocked = useMemo(() => new Set(blockedDates), [blockedDates]);
  const maxGuests = Math.max(1, Number(backendProperty?.max_guests || 1));
  const occupants = form.adults + form.children + form.infants;

  const rangeClear = useCallback((start, end, unavailable = blocked) => {
    if (!start || !end) return false;
    for (let date = asDate(start); toLocalDateKey(date) < end; date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)) if (unavailable.has(toLocalDateKey(date))) return false;
    return true;
  }, [blocked]);

  const loadAvailability = useCallback(async (reset = false) => {
    setAvailabilityLoading(true); setAvailabilityError('');
    try {
      const propertyResponse = await fetch(`${API}/api/applications/properties`, { headers: JSON_HEADERS });
      const propertyData = await json(propertyResponse);
      const selected = propertyData.properties?.find(item => item.property_code === CODE);
      if (!propertyResponse.ok || !propertyData.success) throw Error(propertyData.message || 'We could not load this property. Please try again.');
      if (!selected) throw Error('TG-0002 is not currently available. Please contact Kezoi Stays.');
      setBackendProperty(selected);
      const availabilityResponse = await fetch(`${API}/api/applications/properties/${encodeURIComponent(selected.id)}/unavailable-dates`, { headers: JSON_HEADERS });
      const data = await json(availabilityResponse);
      if (!availabilityResponse.ok || !data.success || !Array.isArray(data.blocked_dates)) throw Error(data.message || 'Availability could not be loaded.');
      const unavailable = new Set(data.blocked_dates);
      setBlockedDates([...unavailable]);
      setForm(current => ({ ...current, ...(reset || (current.checkIn && current.checkOut && !rangeClear(current.checkIn, current.checkOut, unavailable)) ? { checkIn: '', checkOut: '' } : {}), ...(current.adults + current.children + current.infants > Number(selected.max_guests) ? { adults: 1, children: 0, infants: 0 } : {}) }));
      return selected;
    } catch (error) {
      setBackendProperty(null); setBlockedDates([]); setQuote(null); setQuotedFor(''); setAvailabilityError(error.message); throw error;
    } finally { setAvailabilityLoading(false); }
  }, [rangeClear]);

  const getQuote = useCallback(async (selected, values, signal) => {
    const params = new URLSearchParams({ check_in: values.checkIn, check_out: values.checkOut, adults: values.adults, children: values.children, infants: values.infants, pets: values.pets });
    const response = await fetch(`${API}/api/applications/properties/${encodeURIComponent(selected.id)}/quote?${params}`, { headers: JSON_HEADERS, signal });
    const data = await json(response);
    if (!response.ok || !data.success || !data.quote) throw Error(quoteError(response.status, data));
    return data.quote;
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;
    loadAvailability(true).catch(() => {});
    return () => quoteController.current?.abort();
  }, [isOpen]); // Reload each time the form opens; callback changes must not trigger a request loop.

  useEffect(() => {
    if (!isOpen) return undefined;
    const close = event => {
      if (event.key === 'Escape') {
        if (picker) setPicker(null);
        else onClose();
      }
      if (picker && pickerRef.current && !pickerRef.current.contains(event.target)) setPicker(null);
    };
    document.addEventListener('keydown', close); document.addEventListener('mousedown', close);
    return () => { document.removeEventListener('keydown', close); document.removeEventListener('mousedown', close); };
  }, [isOpen, onClose, picker]);

  useEffect(() => {
    quoteController.current?.abort(); setQuote(null); setQuotedFor(''); setQuoteMessage('');
    if (!form.checkIn || !form.checkOut || !backendProperty || occupants > maxGuests || !rangeClear(form.checkIn, form.checkOut)) return undefined;
    const controller = new AbortController(); quoteController.current = controller; const requestKey = keyFor(form);
    const timer = setTimeout(async () => {
      setQuoteLoading(true);
      try { const result = await getQuote(backendProperty, form, controller.signal); setQuote(result); setQuotedFor(requestKey); }
      catch (error) { if (error.name !== 'AbortError') setQuoteMessage(error.message); }
      finally { if (!controller.signal.aborted) setQuoteLoading(false); }
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [form.checkIn, form.checkOut, form.adults, form.children, form.infants, form.pets, backendProperty, occupants, maxGuests, rangeClear, getQuote]);

  if (!isOpen) return null;

  const openPicker = mode => { const next = picker === mode ? null : mode; setPicker(next); if (next) loadAvailability().catch(() => {}); };
  const selectDate = date => {
    const selected = toLocalDateKey(date); setFormError('');
    if (picker === 'checkin') { setForm(current => ({ ...current, checkIn: selected, checkOut: current.checkOut > selected && rangeClear(selected, current.checkOut) ? current.checkOut : '' })); setPicker('checkout'); return; }
    if (!form.checkIn || selected <= form.checkIn) return setFormError('Check-out must be later than check-in.');
    if (!rangeClear(form.checkIn, selected)) return setFormError('That stay overlaps an unavailable date.');
    setForm(current => ({ ...current, checkOut: selected })); setPicker(null);
  };
  const changeGuests = (field, value) => setForm(current => { const min = field === 'adults' ? 1 : 0; const others = current.adults + current.children + current.infants - (field === 'pets' ? 0 : current[field]); const max = field === 'pets' ? 20 : Math.max(min, maxGuests - others); return { ...current, [field]: Math.max(min, Math.min(Math.trunc(value), max)) }; });
  const acceptFile = file => { setFormError(''); if (!file) return; if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) return setFormError('Upload a JPG, PNG, or PDF identity document.'); if (file.size > 5 * 1024 * 1024) return setFormError('Identity document must be 5 MB or smaller.'); setForm(current => ({ ...current, idFile: file })); };

  const submit = async event => {
    event.preventDefault(); if (submitting) return; setFormError(''); setReferralError('');
    const referralName = form.referralName.trim(), referralMobile = form.referralMobile;
    if (!backendProperty || availabilityError) return setFormError('Availability must be loaded before submitting.');
    if (!form.checkIn || !form.checkOut || !rangeClear(form.checkIn, form.checkOut)) return setFormError('Please choose available stay dates.');
    if (occupants > maxGuests) return setFormError(`This property allows up to ${maxGuests} guests, including infants.`);
    if (!quote || quotedFor !== keyFor(form)) return setFormError('Please wait for the current live quote before submitting.');
    if (!form.email.trim() || !form.phone || !isValidPhoneNumber(form.phone)) return setFormError('Please enter a valid email and phone number.');
    if (!form.whatsapp || !isValidPhoneNumber(form.whatsapp)) return setFormError('Please enter a valid WhatsApp number.');
    if ((referralName && !referralMobile) || (referralMobile && !referralName)) return setReferralError('Please provide both the referral name and mobile number.');
    if (referralMobile && !isValidPhoneNumber(referralMobile)) return setReferralError('Please enter a valid referral mobile number.');
    if (!form.idFile) return setFormError('Please upload one identity document.');
    if (!form.accepted) return setFormError('Please accept the house rules before submitting.');
    setSubmitting(true); quoteController.current?.abort();
    try {
      const selected = await loadAvailability();
      const currentQuote = await getQuote(selected, form); setQuote(currentQuote); setQuotedFor(keyFor(form));
      const verificationResponse = await fetch(`${API}/api/applications/verification/request`, { method: 'POST', headers: { ...JSON_HEADERS, 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.email.trim(), phone: form.phone, whatsapp_number: form.whatsapp, country_code: 'IN' }) });
      const verification = await json(verificationResponse);
      if (!verificationResponse.ok || verification.success === false) throw Error(verification.message || 'We could not validate your contact details.');
      const payload = new FormData();
      Object.entries({ property_id: selected.id, application_source: CODE, full_name: form.fullName.trim(), email: form.email.trim(), phone: form.phone, whatsapp_number: form.whatsapp, phone_country_code: 'IN', whatsapp_country_code: 'IN', country_code: 'IN', check_in: form.checkIn, check_out: form.checkOut, adults: form.adults, children: form.children, infants: form.infants, pets: form.pets, document_type: form.idType, guest_message: form.message.trim() }).forEach(([name, value]) => payload.append(name, String(value)));
      payload.append('identity_document', form.idFile);
      if (referralName && referralMobile) { payload.append('referral_name', referralName); payload.append('referral_mobile', parsePhoneNumber(referralMobile)?.number || referralMobile); }
      const response = await fetch(`${API}/api/applications/submit`, { method: 'POST', headers: JSON_HEADERS, body: payload });
      const data = await json(response);
      if (!response.ok || data.success === false) throw Error(data.message || 'Unable to submit application');
      setFinalQuote(data.quote || data.application?.quote || currentQuote); setSuccess(true);
    } catch (error) { setFormError(error.message || 'Unable to submit application'); }
    finally { setSubmitting(false); }
  };

  const calendar = picker && <div className="calendar-popover" ref={pickerRef}><div className="calendar-nav"><button type="button" disabled={month.getFullYear() === new Date().getFullYear() && month.getMonth() === new Date().getMonth()} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft /></button><strong>{picker === 'checkin' ? 'Select check-in' : 'Select check-out'}</strong><button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight /></button></div><Month value={month} start={form.checkIn} end={form.checkOut} blocked={blocked} mode={picker} onSelect={selectDate} /><div className="calendar-legend"><span><i className="available" /> Available</span><span><i className="booked" /> Unavailable</span></div></div>;
  const heading = (icon, name, text) => <div className="section-title">{icon}<div><h3>{name}</h3><p>{text}</p></div></div>;
  const ready = quote && quotedFor === keyFor(form) && !quoteLoading;

  return <div className="booking-modal-overlay" onMouseDown={event => event.target === event.currentTarget && onClose()}><section className="booking-modal-card" role="dialog" aria-modal="true"><header className="booking-header"><div><span>Kezoi Stays · {CODE}</span><h2>{success ? 'Application received' : 'Apply for your stay'}</h2></div><button type="button" onClick={onClose}><X /></button></header>
    {success ? <div className="booking-success"><i><Check /></i><h3>Application submitted successfully</h3><p>Your request is pending identity-document verification and approval by Kezoi Stays. This is not a confirmed booking.</p>{finalQuote && <div><span>Final backend-calculated total</span><strong>{money(finalQuote.total_amount, finalQuote.currency)}</strong></div>}<button className="booking-primary" onClick={onClose}>Done</button></div> : <form onSubmit={submit}><main className="booking-body">
      <section className="form-section">{heading(<CalendarDays />, 'Stay dates and guest counts', 'Availability and capacity are checked live.')}{availabilityLoading && !backendProperty ? <div className="booking-status"><span className="spinner" /> Loading property and availability…</div> : availabilityError ? <div className="booking-error"><span>{availabilityError}</span><button type="button" onClick={() => loadAvailability().catch(() => {})}><RefreshCw size={14} /> Retry</button></div> : <><div className="date-picker-wrap"><div className="date-fields"><button type="button" className="date-field" onClick={() => openPicker('checkin')}><span>Check-in</span><strong>{labelDate(form.checkIn)}</strong></button><button type="button" className="date-field" disabled={!form.checkIn} onClick={() => openPicker('checkout')}><span>Check-out</span><strong>{labelDate(form.checkOut)}</strong></button></div>{calendar}</div><div className="guests-card"><Counter title="Adults" hint="Age 13+" value={form.adults} min={1} max={Math.max(1, maxGuests - form.children - form.infants)} onChange={v => changeGuests('adults', v)} /><Counter title="Children" hint="Age 2–12" value={form.children} min={0} max={Math.max(0, maxGuests - form.adults - form.infants)} onChange={v => changeGuests('children', v)} /><Counter title="Infants" hint="Under 2" value={form.infants} min={0} max={Math.max(0, maxGuests - form.adults - form.children)} onChange={v => changeGuests('infants', v)} /><Counter title="Pets" hint="Excluded from capacity" value={form.pets} min={0} max={20} onChange={v => changeGuests('pets', v)} /><small>Maximum {maxGuests} guests, including infants.</small></div></>}</section>
      <section className="form-section">{heading(null, 'Guest contact information', 'Phone and WhatsApp details are required')}<div className="booking-fields"><label>Full name <b>*</b><input required value={form.fullName} onChange={e => setForm(v => ({ ...v, fullName: e.target.value }))} /></label><label>Email <b>*</b><input required type="email" value={form.email} onChange={e => setForm(v => ({ ...v, email: e.target.value }))} /></label><label className="phone-field">Phone number <b>*</b><PhoneInput international defaultCountry="IN" countryCallingCodeEditable={false} value={form.phone} onChange={phone => setForm(v => ({ ...v, phone: phone || '' }))} /></label><label className="phone-field">WhatsApp number <b>*</b><PhoneInput international defaultCountry="IN" countryCallingCodeEditable={false} value={form.whatsapp} onChange={phone => setForm(v => ({ ...v, whatsapp: phone || '' }))} /></label></div></section>
      <section className="form-section referral-section">{heading(null, 'Referral details', 'Optional; both fields are required together')}<div className="booking-fields"><label>Referral name<input value={form.referralName} onChange={e => setForm(v => ({ ...v, referralName: e.target.value }))} /></label><label className="phone-field">Referral mobile<PhoneInput international defaultCountry="IN" value={form.referralMobile} onChange={phone => setForm(v => ({ ...v, referralMobile: phone || '' }))} /></label></div>{referralError && <div className="booking-error"><span>{referralError}</span></div>}</section>
      <section className="form-section">{heading(<FileCheck2 />, 'Identity-document upload', 'JPG, PNG or PDF; maximum 5 MB')}<div className="identity-grid"><label className="identity-type">Document type <b>*</b><select value={form.idType} onChange={e => setForm(v => ({ ...v, idType: e.target.value }))}><option value="AADHAAR_CARD">Aadhaar card</option><option value="PASSPORT">Passport</option><option value="DRIVING_LICENCE">Driving licence</option></select></label><label className={`identity-dropzone ${dragging ? 'is-dragging' : ''} ${form.idFile ? 'has-file' : ''}`} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); acceptFile(e.dataTransfer.files[0]); }}><input required type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={e => acceptFile(e.target.files[0])} />{form.idFile ? <><FileCheck2 /><strong>{form.idFile.name}</strong></> : <><UploadCloud /><strong>Upload identity document *</strong></>}</label></div></section>
      <section className="form-section">{heading(null, 'Price & GST breakdown', 'All values come from the live backend quote.')}{quoteLoading ? <div className="booking-status"><span className="spinner" /> Calculating live price…</div> : quoteMessage ? <div className="booking-error"><span>{quoteMessage}</span></div> : <Price quote={quote} />}</section>
      <section className="form-section">{heading(null, 'Message and submission', 'Review the house rules before applying.')}<label className="message-field">Message or special request <span>(optional)</span><textarea rows="3" value={form.message} onChange={e => setForm(v => ({ ...v, message: e.target.value }))} /></label><div className="rules-card"><h4>House rules</h4><ul>{property.rules.map(rule => <li key={rule}>{rule}</li>)}</ul><label><input required type="checkbox" checked={form.accepted} onChange={e => setForm(v => ({ ...v, accepted: e.target.checked }))} /> I agree to the house rules. *</label></div>{formError && <div className="booking-error"><span>{formError}</span></div>}<p className="payment-note">This submits an application pending verification and approval. It does not confirm a booking.</p><button type="submit" className="booking-primary submit-application" disabled={submitting || availabilityLoading || quoteLoading || !ready}>{submitting ? <><span className="spinner dark" /> Verifying and sending…</> : 'Submit application'}</button></section>
    </main></form>}
  </section></div>;
}
