'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * Scroll-reveal wrapper: the child fades/slides in the first time it enters the viewport.
 * `delay` (ms) staggers items in a list; `from` picks the entry direction.
 * Honors prefers-reduced-motion (the global CSS rule disables the transition).
 */
const OFFSETS = {
  up: 'translate-y-10',
  down: '-translate-y-10',
  right: 'translate-x-10',
  left: '-translate-x-10',
  zoom: 'scale-90',
};

export default function Reveal({ as: Tag = 'div', from = 'up', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      const t = setTimeout(() => setShown(true), 0);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Once the entrance has played, drop the delay/long duration so hover effects stay snappy.
  const onTransitionEnd = (e) => {
    if (e.target === ref.current && shown) setDone(true);
  };

  return (
    <Tag
      ref={ref}
      onTransitionEnd={onTransitionEnd}
      style={done ? undefined : { transitionDelay: shown ? `${delay}ms` : '0ms' }}
      className={`dw-reveal transition-all ${done ? 'duration-300' : 'duration-700 ease-out'} ${shown ? 'opacity-100 translate-x-0 translate-y-0 scale-100' : `opacity-0 ${OFFSETS[from] || OFFSETS.up}`} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
