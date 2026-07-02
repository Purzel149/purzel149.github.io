const { performance } = require('perf_hooks');

const tzs = ['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney', 'America/Los_Angeles'];

function runWithoutCache() {
  const start = performance.now();
  for (let i = 0; i < 1000; i++) {
    for (const tz of tzs) {
      const timeParts = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).formatToParts(new Date());
      const date = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(new Date());
    }
  }
  const end = performance.now();
  return end - start;
}

const timeFormatterCache = new Map();
const dateFormatterCache = new Map();

function runWithCache() {
  const start = performance.now();
  for (let i = 0; i < 1000; i++) {
    for (const tz of tzs) {
      let timeFmt = timeFormatterCache.get(tz);
      if (!timeFmt) {
        timeFmt = new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        timeFormatterCache.set(tz, timeFmt);
      }
      const timeParts = timeFmt.formatToParts(new Date());

      let dateFmt = dateFormatterCache.get(tz);
      if (!dateFmt) {
        dateFmt = new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        dateFormatterCache.set(tz, dateFmt);
      }
      const date = dateFmt.format(new Date());
    }
  }
  const end = performance.now();
  return end - start;
}

console.log('Without cache:', runWithoutCache().toFixed(2), 'ms');
console.log('With cache:', runWithCache().toFixed(2), 'ms');
