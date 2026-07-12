const affirmations = require('./assets/affirmations.json');

function getAffirmation(date, seed) {
  const epoch = new Date('2026-01-01T00:00:00Z');
  const diffInMs = date.getTime() - epoch.getTime();
  const dayIndex = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const selectedIndex = (dayIndex + seed) % affirmations.length;
  return affirmations[selectedIndex].text;
}

const seed = 123456;
const date1 = new Date('2026-07-11T12:00:00Z');
const date2 = new Date('2026-07-14T12:00:00Z'); // 3 days later

const aff1 = getAffirmation(date1, seed);
const aff2 = getAffirmation(date2, seed);

console.log(`Date 1: ${aff1}`);
console.log(`Date 2: ${aff2}`);
console.log(`Same? ${aff1 === aff2}`);
