const fs = require('fs');
const path = require('path');

const directory = 'app';

const replacements = [
    // Globals
    { from: /#3B82F6/g, to: '#F97316' },
    { from: /#8B5CF6/g, to: '#EA580C' },
    { from: /rgba\(59,\s*130,\s*246/g, to: 'rgba(249, 115, 22' },
    { from: /rgba\(139,\s*92,\s*246/g, to: 'rgba(234, 88, 12' },

    // Tailwind Text Colors
    { from: /text-blue-900/g, to: 'text-orange-900' },
    { from: /text-blue-800/g, to: 'text-orange-800' },
    { from: /text-blue-700/g, to: 'text-orange-700' },
    { from: /text-blue-600/g, to: 'text-orange-600' },
    { from: /text-blue-500/g, to: 'text-orange-500' },
    { from: /text-blue-400/g, to: 'text-orange-400' },
    { from: /text-violet-600/g, to: 'text-orange-600' },
    { from: /text-indigo-600/g, to: 'text-amber-600' },

    // Tailwind Backgrounds
    { from: /bg-blue-900/g, to: 'bg-orange-900' },
    { from: /bg-blue-800/g, to: 'bg-orange-800' },
    { from: /bg-blue-600/g, to: 'bg-orange-600' },
    { from: /bg-blue-500/g, to: 'bg-orange-500' },
    { from: /bg-blue-400/g, to: 'bg-orange-400' },
    { from: /bg-blue-300/g, to: 'bg-orange-300' },
    { from: /bg-blue-200/g, to: 'bg-orange-200' },
    { from: /bg-blue-100/g, to: 'bg-orange-100' },
    { from: /bg-blue-50/g, to: 'bg-orange-50' },
    { from: /bg-violet-600/g, to: 'bg-orange-600' },
    { from: /bg-violet-50/g, to: 'bg-orange-50' },
    { from: /bg-purple-400/g, to: 'bg-orange-400' },
    { from: /bg-purple-300/g, to: 'bg-orange-300' },
    { from: /bg-purple-50/g, to: 'bg-orange-50' },
    { from: /bg-pink-50/g, to: 'bg-yellow-50' },

    // Gradients
    { from: /from-blue-600/g, to: 'from-orange-500' },
    { from: /from-blue-500/g, to: 'from-orange-500' },
    { from: /from-blue-400/g, to: 'from-orange-400' },
    { from: /from-blue-100/g, to: 'from-orange-100' },
    { from: /from-blue-50/g, to: 'from-orange-50' },

    { from: /via-violet-600/g, to: 'via-orange-600' },
    { from: /via-violet-50/g, to: 'via-orange-50' },
    { from: /via-purple-50/g, to: 'via-amber-50' },
    { from: /via-white/g, to: 'via-white' },

    { from: /to-violet-600/g, to: 'to-orange-600' },
    { from: /to-indigo-600/g, to: 'to-amber-600' },
    { from: /to-purple-700/g, to: 'to-orange-700' },
    { from: /to-purple-600/g, to: 'to-orange-600' },
    { from: /to-purple-500/g, to: 'to-amber-500' },
    { from: /to-purple-50/g, to: 'to-orange-50' },
    { from: /to-pink-50/g, to: 'to-yellow-50' },

    // Borders
    { from: /border-blue-500/g, to: 'border-orange-500' },
    { from: /border-blue-400/g, to: 'border-orange-400' },
    { from: /border-blue-200/g, to: 'border-orange-200' },
    { from: /border-blue-100/g, to: 'border-orange-100' },

    // Rings & Shadows
    { from: /ring-blue-500/g, to: 'ring-orange-500' },
    { from: /shadow-blue-900/g, to: 'shadow-orange-900' },
    { from: /shadow-blue-500/g, to: 'shadow-orange-500' },
];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.css') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            replacements.forEach(({ from, to }) => {
                content = content.replace(from, to);
            });
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log(`Processed: ${fullPath}`);
        }
    }
}

processDirectory(directory);
console.log('Done!');
