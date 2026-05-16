const fs = require('fs');
const path = 'app/data/courses.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/resources:\s*\[([\s\S]*?)\]/g, (match, p1) => {
  const trimmedP1 = p1.trim();
  if (trimmedP1.includes('{ name:') || !trimmedP1 || trimmedP1 === '[]') return match;
  
  const newResources = p1.split(',').map(s => {
    const trimmed = s.trim();
    if (!trimmed) return '';
    const name = trimmed.replace(/^["']|["']$/g, '');
    if (!name) return '';
    return `\n          { name: "${name}", url: "/documents/${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf" }`;
  }).filter(Boolean).join(',');
  
  return `resources: [${newResources}\n        ]`;
});

fs.writeFileSync(path, content);
console.log('Successfully updated resources in ' + path);
