// Paper-and-ink palette for the Lighthouse app. Started as a Today-only
// redesign, now shared by Today, Strengths, and Settings. Kept separate
// from Colors.ts (rather than replacing it) so any screen not yet
// migrated to this palette keeps behaving exactly as before.
export const LighthousePaper = {
  light: {
    background: '#F8F5F1',
    card: '#FFFFFF',
    text: '#2E2E2E',
    secondaryText: '#7D7D7D',
    oceanAccent: '#46667A',
    sandAccent: '#DCC9AA',
    dangerAccent: '#A8553A',
    border: 'rgba(46,46,46,0.08)',
    shadow: 'rgba(46,46,46,0.12)',
  },
  dark: {
    background: '#211F1C',
    card: '#2B2925',
    text: '#EDE7DD',
    secondaryText: '#A79C8C',
    oceanAccent: '#8FB2C6',
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

// Turns an ISO timestamp into the same kind of soft, human phrasing the
// design calls for ("three weeks ago") rather than a raw date.
export function formatRelativeTime(dateString: string): string {
  const then = new Date(dateString).getTime();
  const now = Date.now();
  const days = Math.max(0, Math.floor((now - then) / (1000 * 60 * 60 * 24)));

  if (days === 0) return 'earlier today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
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
