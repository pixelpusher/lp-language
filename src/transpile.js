import { Logger } from 'liveprinter-utils';
import { default as grammar } from "./lpgrammar.js";

import {default as nearley}  from 'nearley'; // grammar parser

// in code, find blocks inside ## ## and feed to grammar
export const grammarBlockRegex = /(^|[^#])##\s*([\s\S]+?)(?:[\s\n]*)##/g;

// one line grammar with # at start
export const grammarOneLineRegex = /(?:^|\s|;)#(?!#)\s*(.+)/g;

// lp object call from transpilation
export const lpRegex = /\blp(\.)/g;

export const globalRegex = /(?:^|\s|;)(global)(?:\s+)/g;

/**
 * 
 * @param {String} code Code string to transpile into javascript from LivePrinter grammar
 * @param {String} objName Name of the liveprinter object to call functions on, default 'lp'
 * @returns {String} String of transpiled code, ready to be evaulated
 */
export function transpile(code, objName) {

    // Create a Parser object from our grammar.
    // global var grammar created by /static/lib/nearley/lpgrammar.js
    // global var nearley created by /static/lib/nearley/nearley.js
    //
    // try block element grammar replacement FIRST because one-liner matches part
    //
    //code = code.replace(/([\r\n]+)/gm, "|").substring(^\s*(\|), "").replace(grammarFinderRegex, (match, p1) => {
    // TODO: fix multiline (split?)

    // filter out comments
    const commentRegex = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm; // https://stackoverflow.com/questions/5989315/regex-for-match-replacing-javascript-comments-both-multiline-and-inline/15123777#15123777

    code = code.replaceAll(commentRegex, '$1'); // destructively remove comments before parsing while preserving preceding code

    // replace global keywords
    code = code.replaceAll(globalRegex, (match) => {
        const prefix = match.startsWith("global") ? "" : match[0];
        return prefix + "globalThis.";
    });

    Logger.debug("code before pre-processing-------------------------------");
    Logger.debug(code);
    Logger.debug("========================= -------------------------------");

    code = code.replaceAll(grammarBlockRegex, (match, prefix, p1) => {
        Logger.debug("Match: " + p1);

        const blockparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar)); // parser for entire block
        let result = "";
        let lines = p1.split(/[\r\n]/);

        lines.map((line) => {
            // strip comments, line breaks, and whitespace before Nearley
            line = line.replace(commentRegex, '$1').replace(/([\r\n]+)/gm, "").trim();
            if (line.length === 0) {
                return;
            } else {
                // errors bubble up to calling function
                blockparser.feed(line + "|\n"); // EOL terminates command
                Logger.debug(`block parser state ${blockparser.results[0]}`);
            }
            Logger.debug(`BLOCK Line: !!!${line}!!!`);
        }); // end compiling line by line

        result += blockparser.results[0];
        
        // Add newlines after semicolons to prevent flattening multi-line blocks into a single line
        result = result.replaceAll(';', ';\n');

        return prefix + "\n" + result + "\n"; // need leading return for block
    });

    Logger.info("code AFTER block-grammar processing -------------------------------");
    Logger.info(code);
    Logger.info("========================= -------------------------------");


    //
    // try one liner grammar replacement
    //
    let grammarFound = false; // if this line contains the lp grammar
    // note: p3 is the optional trailing # that can be ignored
    code = code.replaceAll(grammarOneLineRegex, (match, p1) => {
        const lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

        Logger.debug("!!!"+match+"!!!");
        Logger.debug("!!!"+p1+"!!!");
        grammarFound = true; // found!
        let result = "";
        let badComments = '';

        if ((badComments = p1.match(commentRegex)) !== null) {
            throw SyntaxError(`Transpiler: uncaught comments in code: //${badComments}`);
        }
        // alternatively, strip them...
        // let line = p1 ? p1.replace(commentRegex, '$1').trim() : "";

        let line = p1;

        if (line) {
                lineparser.feed(line + '\n');
                result = lineparser.results[0];
        }
        const prefix = match.startsWith('#') ? '' : (match[0] === ';' ? ';' : '');
        return prefix + '\n' + result;
    });

    // change lp object name if passed in
    if (objName) {
        code = code.replaceAll(lpRegex, `${objName}$1`);
    }

    Logger.debug("code AFTER one-line-grammar processing -------------------------------");
    Logger.debug(code);
    Logger.debug("========================= -------------------------------");


    return code;
}