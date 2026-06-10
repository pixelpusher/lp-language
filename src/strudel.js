
/**
 * Parses a basic Strudel/TidalCycles mini-notation string into a 2D array. 
 * @param {String} pattern 
 * @param {Number} totalBeats 
 * @returns {Array} 2D array in liveprinter notation
 */
export function parseStrudel(pattern, totalBeats = 4) {
    const expandedPattern = pattern.replace(/([^\s\[\]]+)!(\d+)/g, (match, note, count) => {
        return Array(parseInt(count, 10)).fill(note).join(' ');
    });
    
    const tokens = expandedPattern.match(/\[|\]|[^\s\[\]]+/g);
    if (!tokens) return [];
    
    const root = [];
    const stack = [root];
    
    for (const token of tokens) {
        if (token === '[') {
            const newList = [];
            stack[stack.length - 1].push(newList);
            stack.push(newList);
        } else if (token === ']') {
            if (stack.length > 1) stack.pop();
        } else {
            stack[stack.length - 1].push(token);
        }
    }
    
    function toFractionStr(decimal) {
        if (Number.isInteger(decimal)) return decimal + 'b';
        for (let d = 2; d <= 64; d *= 2) {
            let n = Math.round(decimal * d);
            if (Math.abs(decimal - n / d) < 0.001) return n === 1 ? `1/${d}b` : `${n}/${d}b`;
        }
        return decimal.toFixed(3).replace(/\.?0+$/, '') + 'b'; 
    }
    
    const result = [];
    
    function traverse(node, allocatedDuration) {
        if (Array.isArray(node)) {
            let totalWeight = 0;
            const parsedChildren = node.map(child => {
                let weight = 1; 
                if (typeof child === 'string') {
                    if (child.includes('@')) {
                        weight = parseFloat(child.split('@')[1]) || 1;
                    } else if (child.includes('/')) {
                        weight = parseFloat(child.split('/')[1]) || 1; 
                    }
                }
                totalWeight += weight;
                return { child, weight };
            });
            
            for (const { child, weight } of parsedChildren) {
                const childDuration = allocatedDuration * (weight / totalWeight);
                traverse(child, childDuration);
            }
        } else {
            let noteName = node;
            let duration = allocatedDuration;
            
            if (noteName.includes('@')) noteName = noteName.split('@')[0];
            if (noteName.includes('/')) noteName = noteName.split('/')[0];
            
            if (noteName.includes('*')) {
                const [rawNote, multStr] = noteName.split('*');
                const cleanNote = rawNote === '~' ? '-' : rawNote;
                const multiplier = parseInt(multStr, 10);
                
                if (!isNaN(multiplier) && multiplier > 0) {
                    const stepDuration = duration / multiplier;
                    const durationStr = toFractionStr(stepDuration);
                    for (let i = 0; i < multiplier; i++) {
                        result.push([cleanNote, durationStr]);
                    }
                    return;
                }
            }
            
            const finalNote = noteName === '~' ? '-' : noteName;
            result.push([finalNote, toFractionStr(duration)]);
        }
    }
    
    traverse(root, totalBeats);
    return result;
}


