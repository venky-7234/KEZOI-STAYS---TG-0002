import { AirVent, Armchair, BedDouble, Bike, Car, ChefHat, CookingPot, Dices, Flame, Gamepad2, House, Music, ShieldCheck, Sparkles, Trees, Users, Waves, Wifi } from 'lucide-react';

const icons = { AirVent, Armchair, BedDouble, Bike, Car, ChefHat, CookingPot, Dices, Flame, Gamepad2, House, Music, ShieldCheck, Sparkles, Trees, Users, Waves, Wifi };

export default function PropertySummary({ property }) {
  const items = [...property.summaryItems, ...property.summaryItems];
  return <section className="property-summary-section"><div className="container" style={{ overflow: 'hidden' }}><div className="summary-strip marquee-strip">{items.map((item, i) => { const Icon = icons[item.icon] || Sparkles; return <div className="summary-item" key={`${item.label}-${i}`}><Icon className="summary-icon" size={22} strokeWidth={1.7} aria-hidden="true" /><span className="summary-label">{item.label}</span></div>; })}</div></div></section>;
}
