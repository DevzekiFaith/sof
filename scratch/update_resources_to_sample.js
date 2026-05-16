const fs = require('fs');
const path = 'app/data/courses.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/url: "\/documents\/[^"]+\.pdf"/g, 'url: "/documents/sample.pdf"');

fs.writeFileSync(path, content);
console.log('Successfully updated all resource URLs to point to sample.pdf');
