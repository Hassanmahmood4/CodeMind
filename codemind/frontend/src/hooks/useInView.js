import { useState, useEffect, useRef } from 'react';

/**
 * Returns true when the ref element enters the viewport (with optional threshold).
 * @param {Object} options - { threshold?: number, rootMargin?: string }
 * @returns {[React.RefObject, boolean]}
 */
export function useInView(options = {}) {
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px' } = options;
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, inView];
}
