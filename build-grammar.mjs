import fs from 'fs';
import { execSync } from 'child_process';
import { pathToFileURL } from 'url';
import path from 'path';
import { LivePrinter } from 'liveprinter-core';


try {
    // Automatically detect which class methods are Async functions!
    const asyncFunctions = Object.getOwnPropertyNames(LivePrinter.prototype)
        .filter(name => {
            const descriptor = Object.getOwnPropertyDescriptor(LivePrinter.prototype, name);
            // Check if it's a regular method (not a getter) and is an AsyncFunction
            if (descriptor && typeof descriptor.value === 'function') {
                return descriptor.value.constructor.name === 'AsyncFunction';
            }
            return false;
        });

    if (!asyncFunctions || !Array.isArray(asyncFunctions)) {
        console.error('❌ Could not find any async functions in LivePrinter.prototype');
        process.exit(1);
    }

    // Add any async aliases that are defined inside the constructor rather than the prototype.
    // Note: only include aliases here if their target function is actually async!
    const constructorAliases = ['ext', 'ext2', 'mov', 'mov2', 'tur', 'tur2', 'ret', 'unret'];
    const allAsyncFunctions = Array.from(new Set([...asyncFunctions, ...constructorAliases]));

    // 2. Read the liveprinter.ne grammar file
    const grammarPath = './lang/liveprinter.ne';
    let grammar = fs.readFileSync(grammarPath, 'utf8');

    // 3. Build the regex string matching the async functions
    const regexString = `/^(${allAsyncFunctions.join('|')})$/`;

    // 4. Inject the new regex into the grammar file using regex replace
    grammar = grammar.replace(
        /const asyncFunctionsInAPIRegex = \/\^\(.*\)\$\/;/g,
        `const asyncFunctionsInAPIRegex = ${regexString};`
    );

    // 5. Save the updated grammar back to the file
    fs.writeFileSync(grammarPath, grammar);
    console.log(`✔️ Updated liveprinter.ne with ${allAsyncFunctions.length} async functions.`);

    // 6. Automatically trigger Nearley compilation
    console.log('⚙️ Compiling grammar using nearleyc...');
    execSync('npx nearleyc lang/liveprinter.ne -o ./src/lpgrammar.js', { stdio: 'inherit' });
    console.log('✔️ Grammar successfully compiled to src/lpgrammar.js!');
    
} catch (err) {
    console.error('❌ Build failed:', err);
    process.exit(1);
}