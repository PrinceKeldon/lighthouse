// LighthouseTheme.ts
//
// "Morning light entering a room" visual system for Lighthouse.
//
// This file intentionally preserves the original public API so existing
// screens continue working while the visual language evolves.
//
// Design principles:
//
// - Calm, never dull.
// - Warm, never loud.
// - Optimistic, never clinical.
//
// Contrast rules:
//
// 1. Text on sage/amber/skyBlue backgrounds MUST use `text` (Deep Slate).
//    Never white.
// 2. oceanAccent remains the only accent intended for standalone text on
//    the warm ivory background.

export const LighthousePaper = {
  light: {
    // Foundation
    background: '#FAF8F4', // Warm Ivory
    card: '#FFFFFF',

    // Typography
    text: '#2F3A45', // Deep Slate
    secondaryText: '#7D7D7D',

    // Legacy accent (kept for compatibility + link text)
    oceanAccent: '#46667A',

    // New palette
    sage: '#A8C3B0',      // Primary buttons & selected states
    amber: '#E9C46A',     // Remember moments
    skyBlue: '#A9C8E8',   // Secondary / informational

    // Existing colors kept for compatibility
    sandAccent: '#DCC9AA',
    dangerAccent: '#A8553A',

    // Surfaces
    border: 'rgba(47,58,69,0.08)',
    shadow: 'rgba(47,58,69,0.12)',
  },

  dark: {
    // Existing dark theme intentionally unchanged.
    // Dark mode deserves its own design pass later.

    background: '#211F1C',
    card: '#2B2925',

    text: '#EDE7DD',
    secondaryText: '#A79C8C',

    oceanAccent: '#8FB2C6',

    sage: '#8FB2C6',
    amber: '#C9A96E',
    skyBlue: '#8FB2C6',

    sandAccent: '#C9A96E',
    dangerAccent: '#D08165',

    border: 'rgba(255,255,255,0.08)',
    shadow: 'rgba(0,0,0,0.4)',
  },
};

export const LighthouseRadii = {
  card: 24,
  pill: 20,
};

export const LighthouseFonts = {
  heading: 'Newsreader_600SemiBold',
  headingMedium: 'Newsreader_500Medium',
  quote: 'Newsreader_400Regular_Italic',
  body: 'System',
};

/**
 * Formats an ISO timestamp into human-friendly relative time.
 *
 * Examples:
 * - earlier today
 * - yesterday
 * - 3 days ago
 * - 2 weeks ago
 * - 4 months ago
 * - 1 year ago
 */
export function formatRelativeTime(dateString: string): string {
  const then = new Date(dateString).getTime();
  const now = Date.now();

  const days = Math.max(
    0,
    Math.floor((now - then) / (1000 * 60 * 60 * 24))
  );

  if (days === 0) return 'earlier today';

  if (days === 1) return 'yesterday';

  if (days < 7) {
    return `${days} days ago`;
  }

  if (days < 30) {
    const weeks = Math.round(days / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  }

  if (days < 365) {
    const months = Math.round(days / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }

  const years = Math.round(days / 365);

  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}