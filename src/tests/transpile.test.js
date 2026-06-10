/**
 * @vitest-environment jsdom
 */

import { grammar } from "../lpgrammar.js";
import { default as nearley} from 'nearley';
import { describe, expect, test, vi } from 'vitest'

// nearley grammar line parser
let lineparser;
 
// fake liveprinter for testing 
const lp = {x:0, y:0, z:0,
    start: function() { this.x=this.y=this.z=0; return this; },
    move: function ({x,y,z}) {
        this.x+=x;
        this.y+=y;
        this.z+=z; 
        return this;
    }
};

describe('Nearley parser', () => {
    test('Grammar should compile without errors', () => {

        lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

        expect(lineparser).not.toBeNullable();
    });


    test('Grammar calls basic lp function (start)', () => {

        lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        const line = "start\n";
        const transpiled = lineparser.feed(line);
        expect(transpiled).not.toBeNullable();
        expect(transpiled.results.length).toBeGreaterThan(0);
        expect(transpiled.results[0]).toBe("await lp.start();");
    });

    
});
