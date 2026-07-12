const affirmations = require('./assets/affirmations.json');

function getAffirmation(date, seed) {
  const epoch = new Date('2026-01-01T00:00:00Z');
  const diffInMs = date.getTime() - epoch.getTime();
  const dayIndex = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const selectedIndex = (dayIndex + seed) % affirmations.length;
  return affirmations[selectedIndex].text;
}

const seed = 123456;
const results = [];
const startDate = new Date('2026-07-11T12:00:00Z');

for (let i = 0; i < affirmations.length; i++) {
  const date = new Date(startDate);
  date.setDate(startDate.getDate() + i);
  results.push(getAffirmation(date, seed));
}

const uniqueResults = new Set(results);
console.log(`Total affirmations: ${affirmations.length}`);
console.log(`Unique affirmations in one cycle: ${uniqueResults.size}`);
console.log(`Repeat found? ${uniqueResults.size !== affirmations.length}`);
