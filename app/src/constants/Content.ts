export const CONTENT = {
  today: {
    reflectionPrompt: "Has there been a moment recently that reminds you this might already be true?",
  },
  onboarding: {
    prompt: "What's one thing you've done, even once, that you're quietly proud of?",
  },
  strengths: {
    defaultStrengths: [
      { id: '1', name: 'Patience', count: 3 },
      { id: '2', name: 'Courage', count: 5 },
    ],
    emptyStateText: "A quiet place for moments that remind you you were patient. When one arrives, it'll feel right at home.",
  },
  settings: {
    version: 'v0.1',
    subscription: {
      label: 'Current Plan',
      supportButton: 'Support Lighthouse',
      supportNote: 'Lighthouse Plus unlocks deeper practice tools and supports the mission. The core experience is always free.',
    },
  },
  // Lite Explore Lighthouses — a curated entry point into the same
  // Strength/Entry mechanic that already exists elsewhere in the app.
  // Not a new data model, not a new object type — just a themed doorway
  // into it. See docs/13-explore-lighthouses-vision.md for the fuller
  // vision this was deliberately scoped down from.
  lighthouses: [
    {
      name: 'Hope',
      reminder: 'There is still light ahead.',
      reflection: "What's kept you moving forward, even a little?",
    },
    {
      name: 'Rest',
      reminder: "You don't have to earn stillness.",
      reflection: 'What would it feel like to stop, just for a moment?',
    },
    {
      name: 'Beginning Again',
      reminder: 'Every day is a new beginning.',
      reflection: 'When have you started over before?',
    },
    {
      name: 'Self Worth',
      reminder: "Your worth isn't something you earn.",
      reflection: "What's something about you that doesn't depend on what you do?",
    },
    {
      name: 'Quiet Courage',
      reminder: "Courage isn't always loud.",
      reflection: 'When did you quietly keep going, even when no one noticed?',
    },
    {
      name: 'Peace',
      reminder: 'Nothing needs solving right now.',
      reflection: 'What would it feel like to set this down for a moment?',
    },
    {
      name: 'Love',
      reminder: 'Start with love, again and again.',
      reflection: 'Who or what have you loved well, even imperfectly?',
    },
    {
      name: 'Growth',
      reminder: 'Little by little, you grow.',
      reflection: "What's different about you now than a year ago?",
    },
    {
      name: 'Let Go',
      reminder: 'Release what no longer serves you.',
      reflection: 'Is there something you\'ve been carrying that you could set down?',
    },
    {
      name: 'Gratitude',
      reminder: "Notice the good that's already here.",
      reflection: "What's something ordinary today that you're glad happened?",
    },
  ],
};
