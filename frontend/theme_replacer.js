import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    content = content.replace(/bg-slate-950/g, 'bg-slate-100');
    content = content.replace(/bg-slate-900\/80/g, 'bg-white/80');
    content = content.replace(/bg-slate-900\/50/g, 'bg-white/50');
    content = content.replace(/bg-slate-900/g, 'bg-white');
    content = content.replace(/bg-slate-800\/60/g, 'bg-slate-50/80');
    content = content.replace(/bg-slate-800\/40/g, 'bg-slate-50/60');
    content = content.replace(/bg-slate-800/g, 'bg-slate-100');
    content = content.replace(/bg-slate-700/g, 'bg-slate-200');
    
    content = content.replace(/text-slate-100/g, 'text-slate-900');
    content = content.replace(/text-slate-200/g, 'text-slate-800');
    content = content.replace(/text-slate-300/g, 'text-slate-700');
    content = content.replace(/text-slate-400/g, 'text-slate-500');
    
    content = content.replace(/border-slate-800/g, 'border-slate-200');
    content = content.replace(/border-slate-700/g, 'border-slate-300');
    content = content.replace(/border-slate-600/g, 'border-slate-300');
    
    // Replace text-white if it's NOT inside a button/gradient. We'll do a simple heuristic:
    // If the class string contains 'bg-gradient' or 'bg-blue' or 'btn', keep text-white.
    // Otherwise replace text-white with text-slate-900.
    content = content.replace(/className="([^"]*)"/g, (match, classes) => {
        if (!classes.includes('bg-gradient') && !classes.includes('bg-blue') && !classes.includes('from-blue')) {
            classes = classes.replace(/\btext-white\b/g, 'text-slate-900');
        }
        return `className="${classes}"`;
    });

    // Also replace border-t border-slate-700/50 -> border-slate-200
    content = content.replace(/border-slate-700\/50/g, 'border-slate-200/80');
    content = content.replace(/bg-blue-600\/10/g, 'bg-blue-200/50');
    content = content.replace(/bg-violet-600\/10/g, 'bg-violet-200/50');
    
    fs.writeFileSync(file, content, 'utf8');
});

console.log('Theme replaced in', files.length, 'files');
