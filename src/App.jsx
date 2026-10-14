import { useEffect, useState } from 'react';
import MicrositeHeader from './components/MicrositeHeader'; import PropertyHero from './components/PropertyHero'; import PropertySummary from './components/PropertySummary'; import AboutProperty from './components/AboutProperty'; import PropertyGallery from './components/PropertyGallery'; import AmenitiesSection from './components/AmenitiesSection'; import LocationSection from './components/LocationSection'; import CheckInInfo from './components/CheckInInfo'; import MicrositeFooter from './components/MicrositeFooter'; import BookingModal from './components/BookingModal';
import { PhoneIcon, WhatsAppIcon } from './components/BrandIcons'; import { useScrollReveal } from './hooks/useScrollReveal';
const slots=n=>Array.from({length:n},()=> '');
const publicAsset=path=>`${import.meta.env.BASE_URL}${path}`;
const bedroomImages=[
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/bedroom/C2442.00_00_00_00.Still014.webp',
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/bedroom/A6707580.webp',
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/bedroom/A6707633.webp',
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/bedroom/C2442.00_00_08_36.Still016.webp',
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/bedroom/A6707638.webp',
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/bedroom/A6707604.webp',
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/bedroom/A6707591.webp',
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/bedroom/A6707614.webp',
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/bedroom/A6707577.webp',
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/bedroom/A6707582.webp',
];
const diningImages=[
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/dining/A6707767.webp',
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/dining/A6707769.webp',
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/dining/A6707776.webp',
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/dining/A6707780.webp',
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/dining/A6707796.webp',
];
const livingRoomImages=[
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/living+area/A6707684.webp',
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/living+area/A6707687.webp',
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/living+area/A6707694.webp',
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/living+area/A6707698+(1).webp',
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/living+area/A6707698.webp',
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/living+area/A6707700.webp',
];
const poolImages=[
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/pool+area/A6707814.webp',
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/pool+area/A6707817.webp',
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/pool+area/A6707819.webp',
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/pool+area/A6707826.webp',
];
const bathroomImages=[
 publicAsset('images/bathroom-hook.png'),
 publicAsset('images/bathroom-vanity.png'),
 publicAsset('images/bathroom-guest.png'),
 publicAsset('images/bathroom-shower.png'),
];
const kitchenImages=[
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/kitchen/WhatsApp+Image+2026-10-14+at+4..jpeg',
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/kitchen/WhatsApp+Image+2026-10-14+at+4.31.46+PM.jpeg',
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/kitchen/WhatsApp+Image+2026-10-14+at+4.31.46.jpeg',
 'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/kitchen/WhatsApp+Image+2026-10-14+at+4.31.47+P.jpeg',
];
// GARDEN & LAWN: replace or remove these image URLs when the garden photos are ready.
const gardenLawnImages=slots(5);
// OUTDOOR EXPERIENCES: replace or remove these image URLs when the outdoor photos are ready.
const outdoorExperienceImages=slots(5);
export const property={
 code:'TG-0002',name:'Kezoi Stays Farm House',propertyType:'Premium Farmhouse',location:'Thirumalapur, Vikarabad',address:'Thirumalapur, Pudur mandal, Vikarabad district, Telangana 501501, India',mapsLink:'https://maps.app.goo.gl/xWZfDqy4GokYswWDA',embedMapUrl:'https://www.google.com/maps?q=17.2445011,77.9460297&z=15&output=embed',coordinates:'17.2445011, 77.9460297',guests:15,minGuests:7,maxGuests:15,guestLabel:'7–15 guests',bedrooms:3,beds:'[ADD BEDS]',bathrooms:4,size:'Five acres',checkIn:'2:00 PM',checkOut:'11:00 AM',pricing:'[ADD PRICING]',availability:'[CONNECT AVAILABILITY]',
 heroExterior:'https://vioraelite.s3.eu-north-1.amazonaws.com/kezoi/kezoi+property-2/farmhouse+exterior/C2442.00_00_02_35.Still002.webp',
 desktopHero:['Farmhouse exterior','Main living area','Bedroom','Pool or outdoor recreation area','Lawn or garden','Dining or kitchen space'],mobileHero:['Farmhouse exterior','Living space','Bedroom','Pool','Lawn / garden','Kitchen','Outdoor seating','Decorative details'],
 summaryItems:[{label:'7–15 guests',icon:'Users'},{label:'Duplex villa',icon:'House'},{label:'3 bedrooms',icon:'BedDouble'},{label:'4 bathrooms',icon:'Waves'},{label:'Private pool',icon:'Waves'},{label:'Five-acre mango orchard',icon:'Trees'},{label:'Fully equipped kitchen',icon:'ChefHat'},{label:'High-speed Wi-Fi',icon:'Wifi'},{label:'Private parking',icon:'Car'},{label:'Air conditioning',icon:'AirVent'},{label:'Open sit-out',icon:'Armchair'},{label:'Barbecue setup',icon:'CookingPot'},{label:'Bonfire area',icon:'Flame'},{label:'Snooker table',icon:'Dices'},{label:'Carrom & indoor games',icon:'Gamepad2'},{label:'Cricket & badminton',icon:'Gamepad2'},{label:'Cycling',icon:'Bike'},{label:"Children's play area",icon:'Gamepad2'},{label:'Music system',icon:'Music'},{label:'Housekeeping & caretaker',icon:'Sparkles'},{label:'CCTV & safety equipment',icon:'ShieldCheck'}],
 description:['Five acres to explore. A duplex villa to call your own. Spaces to play, places to pause, and evenings that deserve to last a little longer.','Whether it\u2019s a family escape, a celebration with friends, or simply a weekend away from the city\u2019s pace, The Mango Estate gives you the freedom to make the stay your own.','Bring your favourite people. Leave the city behind.','Luxury is an amenity. Feeling at home is the experience.'],
 amenities:[
  {title:'Essentials',items:[{name:'High-speed Wi-Fi',icon:'Wifi'},{name:'Air conditioning',icon:'Snowflake'},{name:'Power backup / inverter',icon:'Zap'},{name:'Housekeeping',icon:'Sparkles'},{name:'Hot water',icon:'Droplet'},{name:'Drinking water',icon:'Droplet'},{name:'Ceiling fans',icon:'Fan'}]},
  {title:'Bedrooms & bathrooms',items:[{name:'Comfortable furnished bedrooms',icon:'Bed'},{name:'Fresh bed linen',icon:'Bed'},{name:'Wardrobes and hangers',icon:'Shirt'},{name:'Extra pillows and blankets',icon:'PackageOpen'},{name:'Attached bathrooms',icon:'Droplet'},{name:'Fresh towels',icon:'PackageOpen'},{name:'Basic toiletries',icon:'Soap'},{name:'Iron and ironing board',icon:'Shirt'}]},
  {title:'Kitchen & dining',items:[{name:'Fully equipped kitchen',icon:'CookingPot'},{name:'Gas stove',icon:'CookingPot'},{name:'Refrigerator',icon:'Refrigerator'},{name:'Microwave',icon:'Microwave'},{name:'Water purifier',icon:'Droplet'},{name:'Cookware and serving utensils',icon:'Utensils'},{name:'Crockery and cutlery',icon:'Utensils'},{name:'Dining table',icon:'Wine'},{name:'Tea and coffee setup',icon:'Coffee'},{name:'Barbecue setup',icon:'CookingPot'},{name:'Outdoor dining space',icon:'Utensils'}]},
  {title:'Pool & outdoors',items:[{name:'Private swimming pool',icon:'Droplet'},{name:'Poolside seating',icon:'Armchair'},{name:'Five-acre mango orchard',icon:'Fence'},{name:'Open sit-out',icon:'Armchair'},{name:'Landscaped lawn',icon:'Fence'},{name:'Outdoor furniture',icon:'Armchair'},{name:'Cycling area and cycles',icon:'Recycle'},{name:'Bonfire area',icon:'Sparkles'},{name:'Walking space',icon:'Fence'}]},
  {title:'Games & entertainment',items:[{name:'Upstairs snooker table',icon:'Dices'},{name:'Carrom board',icon:'Dices'},{name:'Cricket equipment',icon:'Dices'},{name:'Badminton equipment',icon:'Dices'},{name:'Music system',icon:'Tv'},{name:'Television',icon:'Tv'},{name:'Indoor games',icon:'Dices'}]},
  {title:'Family facilities',items:[{name:"Children's play area",icon:'Fence'},{name:'Swings and seesaws',icon:'Fence'},{name:'Spacious living room',icon:'Armchair'},{name:'Family dining space',icon:'Utensils'},{name:'Large group seating',icon:'Armchair'},{name:'Family gathering spaces',icon:'Sparkles'}]},
  {title:'Parking, safety & service',items:[{name:'Private on-site parking',icon:'Car'},{name:'CCTV surveillance',icon:'Cctv'},{name:'Fire extinguisher',icon:'FireExtinguisher'},{name:'First-aid kit',icon:'BriefcaseMedical'},{name:'Smoke alarm',icon:'AlarmSmoke'},{name:'Property caretaker',icon:'Shield'},{name:'On-call guest support',icon:'Briefcase'},{name:'Regular housekeeping',icon:'Sparkles'}]},
 ],
 rooms:[
  ['Living Room','For movie nights, unhurried conversations, and moments that turn into memories. A space to sit back, relax, and enjoy time together.',livingRoomImages,'Shared living space'],
  ['Bedrooms — Total: 3','Three cosy bedrooms to rest after a long day, recharge, and wake up feeling refreshed.',bedroomImages,'Total: 3 bedrooms'],
  // Bathrooms gallery is intentionally hidden until the final property photos are ready.
  ['Kitchen','For easy meals, morning coffee, and late-night snacks, with everything you need to feel at home.',kitchenImages,'Fully equipped kitchen'],
  ['Dining Area','For home-cooked meals, long chats around the table, and those little moments that make eating together special.',diningImages,'Indoor dining'],
  ['Pool Area','For refreshing dips, sunny afternoons, and fun-filled moments with family and friends. The perfect spot to cool off and unwind.',poolImages,'Private swimming pool'],
  // GARDEN & LAWN gallery section — remove this entry to remove the section.
  ['Garden & Lawn','A lovely outdoor space for little ones to play, leisurely walks, and time spent among the mango orchards. Enjoy the fresh air, unwind in nature, and make memories together.',gardenLawnImages,'Five-acre mango orchard'],
  // OUTDOOR EXPERIENCES gallery section — remove this entry to remove the section.
  ['Outdoor Experiences','Enjoy outdoor barbecues, cosy bonfire evenings, and quality time under the open sky. From music and games to late-night conversations, make the most of being together in the outdoors.',outdoorExperienceImages,'Barbecue · bonfire · games'],
 ].map(([title,description,images,includes])=>({title,description,images:Array.isArray(images)?images:slots(images),includes})),
 experiences:['Poolside time','Lawn gatherings','Outdoor dining','Barbecue evenings','Bonfire nights','Games and recreation','Quiet mornings','Family celebrations','Farm or orchard experiences'].map(title=>({title,confirmed:false,description:'[ADD DESCRIPTION]'})),
 nearbyPlaces:[{name:'Vikarabad town & railway junction',time:'≈ 11 km'},{name:'Ananthagiri Hills',time:'≈ 13 km'},{name:'Anantha Padmanabha Swamy Temple',time:'≈ 13 km'},{name:'Chilkur Balaji Temple',time:'≈ 40 km'},{name:'Osman Sagar (Gandipet Lake)',time:'≈ 41 km'}],
 policies:['Our property caretaker will coordinate your arrival and key handover.','Please keep a valid government-issued ID ready for the lead guest.','Planning to arrive early or leave a little later? Let us know in advance—requests are subject to availability.','Help us keep the estate beautiful by treating the farmhouse, furnishings, orchard, and outdoor spaces with care.','For everyone’s comfort, smoking is allowed only in the designated outdoor areas.','Children must remain under adult supervision around the pool and across the outdoor spaces.','The property is reserved for registered guests. Please arrange approval with us before inviting additional visitors.'],rules:['Minimum booking: 7 guests. Maximum occupancy: 15 guests, excluding infants.','A valid government-issued identity document is required for the lead guest.','Only registered guests may enter the property unless approved in advance.','Children must be supervised around the pool and outdoor areas.','Please respect the property, orchard, furnishings, and neighbourhood quiet hours.','Smoking is permitted only in designated outdoor areas.'],contacts:{phone:'[ADD TELEPHONE]',whatsapp:'[ADD WHATSAPP]',email:'[ADD SUPPORT EMAIL]'}
};
export default function App(){const[isScrolled,setIsScrolled]=useState(false),[isBookingOpen,setIsBookingOpen]=useState(false);const{ref,isVisible}=useScrollReveal();useEffect(()=>{const f=()=>setIsScrolled(scrollY>50);addEventListener('scroll',f);return()=>removeEventListener('scroll',f)},[]);const book=()=>setIsBookingOpen(true);return <div className="app-container"><MicrositeHeader propertyCode={property.code} isScrolled={isScrolled} onOpenBooking={book}/><div id="overview"><PropertyHero property={property} onOpenBooking={book}/><PropertySummary property={property}/></div><div id="about"><AboutProperty property={property}/></div><div id="gallery"><PropertyGallery rooms={property.rooms} propertyCode={property.code} onOpenBooking={book}/></div><div id="amenities"><AmenitiesSection amenities={property.amenities} onOpenBooking={book}/></div><div id="location"><LocationSection location={property.location} address={property.address} coordinates={property.coordinates} nearbyPlaces={property.nearbyPlaces} mapsLink={property.mapsLink} embedMapUrl={property.embedMapUrl} onOpenBooking={book}/></div><section id="policies" className={`policies-section ${isVisible?'animate-fade-up':'pre-animate'}`} ref={ref}><div className="container policies-grid policies-grid-single"><CheckInInfo property={property}/></div></section><MicrositeFooter/><BookingModal isOpen={isBookingOpen} onClose={()=>setIsBookingOpen(false)} property={property}/><a href="#footer" className="floating-whatsapp" aria-label="WhatsApp Support"><WhatsAppIcon size={30}/></a><a href="#footer" className="floating-call" aria-label="Call Kezoi Stays"><PhoneIcon size={28}/></a><button type="button" className="sticky-mobile-bar mobile-only" onClick={book}>BOOK NOW</button></div>}
