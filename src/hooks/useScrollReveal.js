import { useState, useEffect, useRef } from 'react';

export function useScrollReveal(options = { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  const threshold = options.threshold ?? 0.18;
  const rootMargin = options.rootMargin ?? '0px 0px -8% 0px';

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect(); // Only animate once
      }
    }, { threshold, rootMargin });

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin]);

  return { ref, isVisible };
}
