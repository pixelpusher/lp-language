/**
 * Defines new LivePrinter editor linting mode
 */

import { asyncFunctionsInAPICMRegex } from './AsyncFunctionsConstants';

export function addCMMode(CodeMirror) {

    CodeMirror.defineMode("lp", function (config, parserConfig) {
        const liveprinterOverlay = {
            token: function (stream, state) {
                let ch = "";
    
                if (!stream.eol()) {
                    let matches = stream.match(asyncFunctionsInAPICMRegex, false);
                    if (matches) {
                        //Logger.log("MATCH::**" + matches[1] + "**");
                        let i = matches[1].length;
                        while (i--) stream.eat(() => true);
                        return "lp";
                    }
                }
                stream.eatSpace();
                if (stream.match(asyncFunctionsInAPICMRegex, false)) return null;
                while (ch = stream.eat(/[^\s]/)) {
                    if (ch === ".") break;
                };
                return null;
            }
        };
        return CodeMirror.overlayMode(CodeMirror.getMode(config, parserConfig.backdrop || "javascript"), liveprinterOverlay);
    });
}
