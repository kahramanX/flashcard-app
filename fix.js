const fs = require('fs');
let c = fs.readFileSync('meanings.json', 'utf-8');
c = c.replace(/\n\s*"/g, '\n  "'); // fix indentation
let lines = c.split('\n');
let fixed = [];
for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  if (line.trim() === '""' || line.trim() === '": "') continue;
  if (line.trim().startsWith('"') && line.trim().endsWith('",')) {
    // Looks okay
  } else if (line.trim().startsWith('"') && line.trim().endsWith('"}')) {
    // Looks like last line
  } else if (line.trim() === '{' || line.trim() === '}') {
    // Braces
  } else {
     // Strip bad control characters or weird newlines within keys
     if (line.includes('": "')) {
        let parts = line.split('": "');
        parts[0] = parts[0].replace(/[^a-zA-Z0-9\s"_-]/g, '');
        line = parts.join('": "');
     } else {
        continue;
     }
  }
  fixed.push(line);
}
let res = fixed.join('\n');
// Last check to ensure JSON validity
try {
  let obj = JSON.parse(res);
  fs.writeFileSync('meanings.json', JSON.stringify(obj, null, 2));
  console.log('Fixed successfully');
} catch (e) {
  console.log('Still error:', e);
  // Try more aggressive fix
  let obj = {};
  for (let l of fixed) {
     if (l.includes('": "')) {
        let parts = l.split('": "');
        let key = parts[0].replace(/"/g, '').trim();
        let val = parts[1].replace(/",?/g, '').trim();
        if (key && val) obj[key] = val;
     }
  }
  fs.writeFileSync('meanings.json', JSON.stringify(obj, null, 2));
  console.log('Fixed aggressively');
}
