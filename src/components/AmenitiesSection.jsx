import React, { useRef, useState } from 'react';
import { 
  Wifi, Wind, Tv, Droplet, 
  Refrigerator, Coffee, Microwave, Utensils, 
  Bed, BookOpen, Briefcase, Sparkles, 
  ArrowUpToLine, Car, Shield, Zap,
  Shirt, Gift, SprayCan, SoapDispenserDroplet, WashingMachine, PackageOpen,
  PanelTop, Warehouse, Dices, Snowflake, Fan, Cctv, AlarmSmoke,
  FireExtinguisher, BriefcaseMedical, CookingPot, Wine, Blender,
  Armchair, Recycle, CalendarDays, Triangle, LampDesk, Fence, ChevronLeft, ChevronRight
} from 'lucide-react';

const iconMap = {
  'Wifi': Wifi, 'Wind': Wind, 'Tv': Tv, 'Droplet': Droplet,
  'Refrigerator': Refrigerator, 'Coffee': Coffee, 'Microwave': Microwave, 'Utensils': Utensils,
  'Bed': Bed, 'BookOpen': BookOpen, 'Briefcase': Briefcase, 'Sparkles': Sparkles,
  'ArrowUpToLine': ArrowUpToLine, 'Car': Car, 'Shield': Shield, 'Zap': Zap,
  'Shirt': Shirt, 'Gift': Gift, 'SprayCan': SprayCan, 'Soap': SoapDispenserDroplet,
  'WashingMachine': WashingMachine, 'PackageOpen': PackageOpen, 'PanelTop': PanelTop,
  'Warehouse': Warehouse, 'Dices': Dices, 'Snowflake': Snowflake, 'Fan': Fan,
  'Cctv': Cctv, 'AlarmSmoke': AlarmSmoke, 'FireExtinguisher': FireExtinguisher,
  'BriefcaseMedical': BriefcaseMedical, 'CookingPot': CookingPot, 'Wine': Wine,
  'Blender': Blender, 'Armchair': Armchair, 'Recycle': Recycle, 'CalendarDays': CalendarDays,
  'Triangle': Triangle, 'LampDesk': LampDesk, 'Fence': Fence
};

import { useScrollReveal } from '../hooks/useScrollReveal';

export default function AmenitiesSection({ amenities, onOpenBooking }) {
  const [activeTab, setActiveTab] = useState(0);
  const tabsRef = useRef(null);
  const { ref, isVisible } = useScrollReveal({ threshold: 0.01, rootMargin: '0px 0px -6% 0px' });

  if (!amenities || amenities.length === 0) return null;

  const selectTab = index => {
    const nextIndex = (index + amenities.length) % amenities.length;
    setActiveTab(nextIndex);
    window.requestAnimationFrame(() => {
      const wrapper = tabsRef.current;
      const button = wrapper?.querySelector(`[data-tab-index="${nextIndex}"]`);
      if (!wrapper || !button) return;
      wrapper.scrollTo({
        left: button.offsetLeft - (wrapper.clientWidth - button.offsetWidth) / 2,
        behavior: 'smooth',
      });
    });
  };

  return (
    <section ref={ref} className={`amenities-section ${isVisible ? 'animate-fade-up' : 'pre-animate'}`}>
      <div className="container">
        <h2 className="section-title">Amenities</h2>
        
        <div className="amenities-tabs-shell">
          <button className="amenities-scroll-btn previous" type="button" aria-label="Show previous amenity category" onClick={() => selectTab(activeTab - 1)}><ChevronLeft /></button>
          <div className="amenities-tabs-wrapper" ref={tabsRef}>
            <div className="amenities-tabs">
              {amenities.map((category, idx) => (
                <button
                  key={idx}
                  data-tab-index={idx}
                  className={`amenity-tab-btn ${activeTab === idx ? 'active' : ''}`}
                  onClick={() => selectTab(idx)}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>
          <button className="amenities-scroll-btn next" type="button" aria-label="Show next amenity category" onClick={() => selectTab(activeTab + 1)}><ChevronRight /></button>
        </div>

        <div className="amenities-content animate-fade-in" key={activeTab}>
          <div className="amenity-list-grid">
            {amenities[activeTab].items.map((item, i) => {
              const Icon = iconMap[item.icon] || Wifi;
              return (
                <div key={i} className="amenity-item-card">
                  <Icon className="amenity-icon-large" size={32} strokeWidth={1.5} /> 
                  <span className="amenity-name">{item.name}</span>
                  {item.detail && <small className="amenity-detail">{item.detail}</small>}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
