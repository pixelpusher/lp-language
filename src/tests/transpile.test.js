/**
 * @vitest-environment jsdom
 */

import { default as grammar } from "../lpgrammar.js";
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

        expect(lineparser).not.toBeNull();
    });


    test('Grammar calls basic lp function (start)', () => {

        lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        const line = "start\n";
        const transpiled = lineparser.feed(line);
        expect(transpiled).not.toBeNull();
        expect(transpiled.results.length).toBe(1);
        expect(transpiled.results[0]).toBe("await lp.start();");
    });

    test('Function with object args (mov2)', () => {
        lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        const line = "mov2 x:40 y:60 speed:10\n";
        const transpiled = lineparser.feed(line);
        expect(transpiled.results.length).toBe(1);
        const out = transpiled.results[0];
        expect(out).toBe('await lp.mov2({x:40,y:60,speed:10});');
    });

    test('Function with nested parentheses', () => {
        lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        const line = "move (10)\n";
        const transpiled = lineparser.feed(line);
        
        const out = transpiled.results;
        expect(out.length).toBeGreaterThan(0);
        expect(out[0]).toBe('await lp.move((10));');
    });

    test('Pipe chaining of functions', () => {
        lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        const line = "start | mov2 x:40 | start\n";
        const transpiled = lineparser.feed(line);
        expect(transpiled.results.length).toBeGreaterThan(0);
        const out = transpiled.results[0];
        // should contain three function calls separated by semicolons
        expect(out).toBe('await lp.start();await lp.mov2({x:40});await lp.start();');
    });

    test('String literal and negative number parsing', () => {
        lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        const line = 'draw "hello world" | move -5 0 1\n';
        const transpiled = lineparser.feed(line);
        expect(transpiled.results.length).toBeGreaterThan(0);
        const out = transpiled.results[0];
        expect(out).toContain('"hello world"');
        expect(out).toContain('-5');
    });

    test('Math operations in args', () => {
        lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        const line = 'move x:1+2-0*3\n';
        const transpiled = lineparser.feed(line);
        expect(transpiled.results.length).toBeGreaterThan(0);
        const out = transpiled.results[0];
        expect(out).toBe('await lp.move({x:1+2-0*3});');
    });

    test('complex array and parathesis nesting', ()=> {
        lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        const line = 'help me:first[3](yes[3])';
        const transpiled = lineparser.feed(line);
        expect(transpiled.results.length).toBeGreaterThan(0);
        const out = transpiled.results[0];
        expect(out).toBe('lp.help({me:first[3](yes[3])});');
        
    })

});
