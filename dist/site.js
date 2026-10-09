const PROPERTY = {
  code:'TG-0002', name:'[ADD FARMHOUSE NAME]', type:'Premium Farmhouse',
  location:'[ADD FARMHOUSE LOCATION]', address:'[ADD FARMHOUSE ADDRESS]', mapLink:'[ADD GOOGLE MAPS LINK]',
  guests:'[ADD GUEST CAPACITY]', bedrooms:'[ADD BEDROOM COUNT]', beds:'[ADD BED COUNT]', bathrooms:'[ADD BATHROOM COUNT]', size:'[ADD FARMHOUSE SIZE]', checkIn:'[ADD CHECK-IN TIME]', checkOut:'[ADD CHECK-OUT TIME]',
  desktopHero:['Farmhouse exterior','Main living area','Bedroom','Pool or outdoor recreation area','Lawn or garden','Dining or kitchen space'].map(label=>({label,url:'[ADD DESKTOP HERO IMAGE]'})),
  mobileHero:['Farmhouse exterior','Living space','Bedroom','Pool','Lawn / garden','Kitchen','Outdoor seating','Decorative details'].map(label=>({label,url:'[ADD MOBILE PORTRAIT HERO IMAGE]'})),
  summary:['[ADD GUEST CAPACITY] Guests','[ADD BEDROOMS] Bedrooms','[ADD BEDS] Beds','[ADD BATHROOMS] Bathrooms','Private pool · confirm','Lawn / garden · confirm','Full kitchen · confirm','Wi-Fi · confirm','Parking · confirm','Air conditioning · confirm','Outdoor seating · confirm','Barbecue area · confirm','Caretaker / housekeeping · confirm','Security · confirm'],
  gallery:[
    ['The Farmhouse Exterior','A welcoming first impression, surrounded by open space and designed for time away from the everyday.',3],
    ['The Living Spaces','For movie nights, unhurried conversations, celebrations, and moments that turn into memories.',3],
    ['The Bedrooms','Quiet corners for slow mornings and restful nights. Add a configurable group for each confirmed bedroom.',4],
    ['The Dining Space','Where good food meets better conversations.',3],
    ['The Kitchen','For morning coffee, familiar flavours, and meals made your way. Everyday essentials are thoughtfully arranged to make cooking feel effortless.',3],
    ['The Pool','Show only after the private pool is confirmed.',3],
    ['The Lawn and Garden','Open space for morning walks, outdoor games, relaxed evenings, and time under the sky.',3],
    ['Outdoor Experiences','Add only confirmed barbecue, bonfire, outdoor dining, play, recreation, gazebo, farm or orchard experiences.',3],
    ['Bathrooms','Add bathroom photographs here when provided. These images never appear in the hero.',3],
    ['The Little Details','From carefully chosen artwork to the crockery and comforts around you, every detail has been considered to make your stay special. We hope you’ll enjoy them as much as we do.',3]
  ],
  amenities:['Essentials','Bedrooms and laundry','Kitchen and dining','Pool','Lawn and outdoor spaces','Entertainment','Family facilities','Parking','Safety','Services'].map(name=>({name,items:['[ADD CONFIRMED AMENITY]','[ADD CONFIRMED AMENITY]','[ADD CONFIRMED AMENITY]','[ADD CONFIRMED AMENITY]']})),
  experiences:['Poolside time','Lawn gatherings','Outdoor dining','Barbecue evenings','Bonfire nights','Games and recreation','Quiet mornings','Family celebrations','Farm or orchard experiences'].map(name=>({name,confirmed:false,description:'[ADD A BRIEF DESCRIPTION ONCE CONFIRMED]'})),
  nearby:['Nearest main road','Nearest town','Grocery store','Pharmacy','Hospital','Railway station','Airport','Tourist attractions','Restaurants'].map(name=>({name,time:'[ADD TRAVEL TIME]'})),
  policies:['Access method — [ADD SMART-LOCK, KEY HANDOVER OR CARETAKER DETAILS]','Government-issued ID — [ADD REQUIREMENT]','Early check-in — [ADD POLICY]','Late check-out — [ADD POLICY]','Farmhouse care — [ADD EXPECTATIONS]','Noise and music — [ADD POLICY]','Smoking — [ADD POLICY]','Pool safety — [ADD IF APPLICABLE]','Lawn and outdoor areas — [ADD CARE GUIDANCE]','Events and visitors — [ADD POLICY]','Pets — [ADD IF APPLICABLE]','Children’s supervision — [ADD IF APPLICABLE]'],
  pricing:{nightly:'[ADD NIGHTLY PRICE]',availability:'[CONNECT AVAILABILITY]'}, contacts:{phone:'[ADD TELEPHONE]',whatsapp:'[ADD WHATSAPP]',email:'[ADD SUPPORT EMAIL]'}
};

const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
const navItems=[['Overview','overview'],['About','about'],['Gallery','gallery'],['Amenities','amenities'],['Farmhouse Experience','experience'],['Location','location'],['Policies','policies']];
$('#menuNav').innerHTML=navItems.map(([n,id])=>`<a href="#${id}">${n}</a>`).join('');
const placeholder=(label,kind='IMAGE PLACEHOLDER')=>`<div class="placeholder"><div class="placeholder-label"><strong>${label}</strong>${kind}</div></div>`;

function renderHero(id,items){$(id).innerHTML=items.map((x,i)=>`<div class="hero-slide ${i===0?'active':''}">${placeholder(x.label,x.url)}</div>`).join('')}
renderHero('#desktopHero',PROPERTY.desktopHero); renderHero('#mobileHero',PROPERTY.mobileHero);
let heroIndex=0; const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduced)setInterval(()=>{const mobile=matchMedia('(max-width:760px)').matches,slides=$$(mobile?'#mobileHero .hero-slide':'#desktopHero .hero-slide');slides.forEach(x=>x.classList.remove('active'));heroIndex=(heroIndex+1)%slides.length;slides[heroIndex].classList.add('active');$('#heroCurrent').textContent=String(heroIndex+1).padStart(2,'0');$('#heroTotal').textContent=String(slides.length).padStart(2,'0')},4000);
const marquee=PROPERTY.summary.map(x=>`<span class="marquee-item">${x}</span>`).join('');$('#summaryMarquee').innerHTML=marquee+marquee;

const preview=['Farmhouse exterior','Living spaces','Bedroom','Lawn / garden','Dining / kitchen'];
$('#galleryPreview').innerHTML=preview.map(x=>`<article class="gallery-card">${placeholder(x)}</article>`).join('');

const galleryImages=[];
$('#galleryBody').innerHTML=PROPERTY.gallery.map((g,gi)=>{let imgs='';for(let i=0;i<g[2];i++){const item={label:`${g[0]} · ${i===0?'Hook image':'Supporting image '+i}`,category:g[0]};galleryImages.push(item);imgs+=`<button data-image="${galleryImages.length-1}" aria-label="Open ${item.label}">${placeholder(item.label,'[ADD GALLERY IMAGE]')}</button>`}return `<section class="gallery-category"><p class="eyebrow">${String(gi+1).padStart(2,'0')} · TG-0002</p><h3>${g[0]}</h3><p>${g[1]}</p>${g[0]==='The Little Details'?'<p><em>A little care keeps the beauty alive for the next guest, too.</em></p>':''}<div class="category-images">${imgs}</div></section>`}).join('');

let amenityIndex=0;
$('#amenityTabs').innerHTML=PROPERTY.amenities.map((a,i)=>`<button data-i="${i}">${a.name}</button>`).join('');
function renderAmenity(i){amenityIndex=(i+PROPERTY.amenities.length)%PROPERTY.amenities.length;const a=PROPERTY.amenities[amenityIndex];$$('#amenityTabs button').forEach((b,j)=>b.classList.toggle('active',j===amenityIndex));const active=$$('#amenityTabs button')[amenityIndex];active.scrollIntoView({behavior:reduced?'auto':'smooth',inline:'center',block:'nearest'});$('#amenityPanel').innerHTML=`<div><p class="eyebrow">CATEGORY ${String(amenityIndex+1).padStart(2,'0')}</p><h3>${a.name}</h3></div><div class="amenity-list">${a.items.map(x=>`<div class="amenity-item">◇ &nbsp;${x}</div>`).join('')}</div>`}
renderAmenity(0);$('#amenityPrev').onclick=()=>renderAmenity(amenityIndex-1);$('#amenityNext').onclick=()=>renderAmenity(amenityIndex+1);$$('#amenityTabs button').forEach(b=>b.onclick=()=>renderAmenity(+b.dataset.i));

const confirmed=PROPERTY.experiences.filter(x=>x.confirmed);
$('#experienceGrid').innerHTML=confirmed.length?confirmed.map((x,i)=>`<article class="experience-card"><span class="number">0${i+1}</span><h3>${x.name}</h3><p>${x.description}</p></article>`).join(''):`<div class="experience-empty"><p class="eyebrow">CONFIGURATION READY</p><h3>Farmhouse experiences will appear here once confirmed.</h3><p>Poolside time, lawn gatherings, outdoor dining, barbecues, bonfires, games and more are prepared in the property data.</p></div>`;
$('#nearby').innerHTML=PROPERTY.nearby.map(x=>`<div><small>${x.name}</small><strong>${x.time}</strong></div>`).join('');$('#policyList').innerHTML=PROPERTY.policies.map(x=>`<li>${x}</li>`).join('');

const lock=()=>{document.body.classList.add('locked','overlay-active')},unlock=()=>{document.body.classList.remove('locked','overlay-active')};
function openLayer(el,focus){el.classList.add('open');el.setAttribute('aria-hidden','false');lock();setTimeout(()=>$(focus,el)?.focus(),50)}
function closeLayer(el){el.classList.remove('open');el.setAttribute('aria-hidden','true');if(!$('.open'))unlock()}
const menu=$('#menu'),gallery=$('#galleryOverlay'),lightbox=$('#lightbox'),booking=$('#booking');
$('#menuOpen').onclick=()=>{menu.classList.add('open');menu.setAttribute('aria-hidden','false');$('#menuOpen').setAttribute('aria-expanded','true');lock()};
$('#menuClose').onclick=()=>{closeLayer(menu);$('#menuOpen').setAttribute('aria-expanded','false')};$$('#menuNav a').forEach(a=>a.onclick=()=>$('#menuClose').click());
$('#galleryOpen').onclick=()=>openLayer(gallery,'#galleryClose');$('#galleryClose').onclick=()=>closeLayer(gallery);

let lightIndex=0,touchX=0;
function showLight(i){lightIndex=(i+galleryImages.length)%galleryImages.length;const x=galleryImages[lightIndex];$('#lightboxFrame').innerHTML=placeholder(x.label,'[ADD FULL-RESOLUTION IMAGE]');$('#lightDots').innerHTML=galleryImages.map((_,j)=>`<button class="${j===lightIndex?'active':''}" data-dot="${j}" aria-label="View image ${j+1}"></button>`).join('');$$('[data-dot]').forEach(b=>b.onclick=()=>showLight(+b.dataset.dot))}
$$('[data-image]').forEach(b=>b.onclick=()=>{showLight(+b.dataset.image);openLayer(lightbox,'#lightboxClose')});$('#lightPrev').onclick=()=>showLight(lightIndex-1);$('#lightNext').onclick=()=>showLight(lightIndex+1);$('#lightboxClose').onclick=()=>closeLayer(lightbox);lightbox.addEventListener('touchstart',e=>touchX=e.changedTouches[0].screenX,{passive:true});lightbox.addEventListener('touchend',e=>{const d=e.changedTouches[0].screenX-touchX;if(Math.abs(d)>45)showLight(lightIndex+(d<0?1:-1))},{passive:true});

let bookingStage=0;
function showBookingStage(i){bookingStage=i;$$('.booking-stage').forEach((x,j)=>x.classList.toggle('active',j===i));$$('#bookingSteps span').forEach((x,j)=>x.classList.toggle('active',j===Math.min(i,2)));$('#bookingBack').style.visibility=i===0||i===3?'hidden':'visible';$('#bookingNext').textContent=i===2?'Request to Book':i===3?'Close':'Continue'}
$$('.js-book').forEach(b=>b.onclick=()=>{closeLayer(menu);openLayer(booking,'#bookingClose');showBookingStage(0)});$('#bookingClose').onclick=()=>closeLayer(booking);$('#bookingBack').onclick=()=>showBookingStage(Math.max(0,bookingStage-1));$('#bookingNext').onclick=()=>{if(bookingStage===3)return closeLayer(booking);if(bookingStage<2){const stage=$$('.booking-stage')[bookingStage],inputs=$$('input[required]',stage);if(inputs.some(x=>!x.reportValidity()))return}showBookingStage(bookingStage+1)};$$('.counter').forEach(c=>{const out=$('output',c);$$('button',c).forEach((b,i)=>b.onclick=()=>out.value=Math.max(i?+out.value+1:+out.value-1,0))});

document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(lightbox.classList.contains('open'))closeLayer(lightbox);else if(booking.classList.contains('open'))closeLayer(booking);else if(gallery.classList.contains('open'))closeLayer(gallery);else if(menu.classList.contains('open'))$('#menuClose').click()}if(lightbox.classList.contains('open')&&e.key==='ArrowRight')showLight(lightIndex+1);if(lightbox.classList.contains('open')&&e.key==='ArrowLeft')showLight(lightIndex-1)});
$('#copyAddress').onclick=async()=>{try{await navigator.clipboard.writeText(PROPERTY.address);$('#copyAddress').textContent='Copied'}catch{$('#copyAddress').textContent='Copy unavailable'}};$('#mapLink').onclick=e=>{if(PROPERTY.mapLink.startsWith('[')){e.preventDefault();alert('Add the confirmed Google Maps link in the PROPERTY data object.')}};
addEventListener('scroll',()=>$('#header').classList.toggle('scrolled',scrollY>40),{passive:true});const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});$$('.reveal').forEach(x=>io.observe(x));
window.PROPERTY=PROPERTY;
