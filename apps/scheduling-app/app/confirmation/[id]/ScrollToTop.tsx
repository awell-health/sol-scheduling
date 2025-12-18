'use client';

import { useEffect } from 'react';

/**
 * Scrolls to the top of the page when the confirmation page loads.
 * This ensures the header is fully visible and prevents any scroll
 * position issues from Next.js navigation.
 */
export function ScrollToTop() {
  useEffect(() => {
    // Scroll to top immediately when component mounts
    window.scrollTo(0, 0);
  }, []);

  return null;
}

