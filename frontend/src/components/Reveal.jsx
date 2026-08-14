<<<<<<< Updated upstream
import React, { useEffect, useRef, useState } from 'react';

/**
 * Reveal immediately (no animation) when motion is unwanted or the observer API
 * is unavailable, so content visibility never depends on the animation running.
 */
const shouldSkipAnimation = () =>
  typeof window === 'undefined' ||
  typeof IntersectionObserver === 'undefined' ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const hiddenOffsets = {
  up: 'translate-y-6',
  down: '-translate-y-6',
  left: 'translate-x-6',
  right: '-translate-x-6',
  none: 'scale-[0.98]'
};

/**
 * Scroll-reveal wrapper. Fades + slides its children into view once, using only
 * opacity/transform so the animation stays on the compositor.
 *
 * The reveal is a progressive enhancement: a safety timer shows the content even
 * if the observer never reports (hidden tab, throttled rendering), so text can
 * never get stuck invisible.
 */
const Reveal = ({ children, className = '', delay = 0, direction = 'up' }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(shouldSkipAnimation);

  useEffect(() => {
    if (isVisible) return;

    const node = ref.current;
    if (!node) return;

    // The observer always reports an initial state; if that never arrives the
    // mechanism is not running (frozen/prerendered page) and we reveal anyway.
    let observerResponded = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        observerResponded = true;
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(node);

    // Fail-safe: never leave content hidden if the observer stays silent.
    const fallback = setTimeout(() => {
      if (!observerResponded) setIsVisible(true);
    }, 2000);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [isVisible]);

  const hidden = hiddenOffsets[direction] || hiddenOffsets.up;

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
        isVisible ? 'opacity-100 translate-x-0 translate-y-0 scale-100' : `opacity-0 ${hidden}`
      } ${className}`}
    >
      {children}
    </div>
  );
};
=======
import React from 'react';
import { motion as Motion } from 'framer-motion';
import { revealVariants, VIEWPORT } from '../lib/motion';

/**
 * Scroll reveal for general product UI, driven by Motion.
 *
 * Motion respects `prefers-reduced-motion` natively (it drops the transform and
 * keeps the element visible), so no manual guard is needed here.
 */
const Reveal = ({ children, className = '', delay = 0, direction = 'up' }) => (
  <Motion.div
    className={className}
    custom={direction}
    variants={revealVariants}
    initial="hidden"
    whileInView="visible"
    viewport={VIEWPORT}
    transition={{ delay: delay / 1000 }}
  >
    {children}
  </Motion.div>
);
>>>>>>> Stashed changes

export default Reveal;
