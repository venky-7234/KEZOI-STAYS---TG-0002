import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function StaggeredText({ text, baseDelay = 0 }) {
  const { ref, isVisible } = useScrollReveal();
  const words = text.split(' ');

  return (
    <p ref={ref} className="staggered-text-container">
      {words.map((word, index) => (
        <span
          key={index}
          className={`word-animate ${isVisible ? 'visible' : ''}`}
          style={{ animationDelay: `${baseDelay + index * 0.05}s` }}
        >
          {word}&nbsp;
        </span>
      ))}
    </p>
  );
}
