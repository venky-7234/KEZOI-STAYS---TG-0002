import React from 'react';

export default function BookingCTA({ onOpenBooking }) {
  return (
    <section className="cta-section">
      <div className="container cta-content animate-fade-up">
        <h2 className="cta-title">Make OUR RESIDENCE yours for a while</h2>
        <p className="cta-desc">Choose your dates and send our team a reservation request. You won’t be charged today.</p>
        <div className="cta-actions">
          <button className="btn btn-primary" onClick={onOpenBooking}>Check availability</button>
        </div>
      </div>
    </section>
  );
}
