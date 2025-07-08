import { Logger } from 'liveprinter-utils';
import { grammar } from './lpgrammar';

import {default as nearley}  from 'nearley'; // grammar parser

// in code, find blocks inside ## ## and feed to grammar
const grammarBlockRegex = /(?:\n|\t|\s)*\#{2}\s*((?:.|\n|\t|\s)*)\#{2}/g;

// one line grammar with # at start
const grammarOneLineRegex = /(?:\n|\t|\s)*\#\s*((?:[^\n])*)/g;

// lp object call from transpilation
const lpRegex = /([\n\s])*lp(\.)/g;

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

    const blockparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar)); // parser for entire block

    // filter out comments
    const commentRegex = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm; // https://stackoverflow.com/questions/5989315/regex-for-match-replacing-javascript-comments-both-multiline-and-inline/15123777#15123777

    code = code.replace(commentRegex, (match, p1) => {
        return p1;
    });

    // replace global keywords with Window
    code = code.replace(/^[ ]*global[ ]+/gm, "window.");

    Logger.debug("code before pre-processing-------------------------------");
    Logger.debug(code);
    Logger.debug("========================= -------------------------------");

    code = code.replace(grammarBlockRegex, (match, p1) => {
        Logger.debug("Match: " + p1);

        let result = "";
        let lines = p1.split(/[\r\n]/);

        lines.map((line) => {
            // get ride of remaining line breaks and leading spaces
            line = line.replace(/([\r\n]+)/gm, "").replace(/(^[\s]+)/, "");
            if (line.length === 0) {
                return;
            } else {
                // errors bubble up to calling function
                blockparser.feed(line + '\n'); // EOL terminates command
            }
        }); // end compiling line by line

        result += blockparser.results[0];

        return ' ' + result + "\n"; // need leading space
    });

    Logger.info("code AFTER block-grammar processing -------------------------------");
    Logger.info(code);
    Logger.info("========================= -------------------------------");


    //
    // try one liner grammar replacement
    //
    let grammarFound = false; // if this line contains the lp grammar
    // note: p3 is the optional trailing # that can be ignored
    code = code.replace(grammarOneLineRegex, (match, p1, p2) => {
        const lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

        Logger.debug("!!!"+match+"!!!");
        Logger.debug("!!!"+p1+"!!!");
        grammarFound = true; // found!
        let result = "";
        let fail = false; // if not successful
        // .replace(/(^[\s]+)/, "")
        let line = p1.replace(/([\r\n]+)/gm, "").replace(/([\s]+)$/, "");

        //Logger.debug("LINE::" + line + "::LINE");
        if (line) {
                lineparser.feed(line + '\n');
                //result += "/*ERROR IN PARSE: [" + fail + "] + offending code: [" + line + "]" + "*/\n";
            
                result = lineparser.results[0];
                //Logger.debug(result);
        }
        return ' ' + result;
    });

    // change lp object name if passed in
    if (objName) {
        code = code.replace(lpRegex, `$1${objName}$2`);
    }

    Logger.debug("code AFTER one-line-grammar processing -------------------------------");
    Logger.debug(code);
    Logger.debug("========================= -------------------------------");


    return code;
}