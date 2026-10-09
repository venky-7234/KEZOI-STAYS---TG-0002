import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function HouseRules({ rules }) {
  return (
    <div className="policy-block">
      <h2 className="policy-block-title">House Rules</h2>
      <div className="rules-list">
        {rules.map((rule, idx) => (
          <div key={idx} className="rule-item">
            <CheckCircle2 className="rule-icon" size={20} strokeWidth={2} />
            <span className="rule-text">{rule}</span>
          </div>
        ))}
      </div>
    </div>
  );
}