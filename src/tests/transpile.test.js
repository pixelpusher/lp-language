/**
 * @vitest-environment jsdom
 */

import { default as grammar } from "../lpgrammar.js";
import { default as nearley} from 'nearley';
import { describe, expect, test, vi } from 'vitest'
import { transpile } from "../transpile.js";

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
        expect(transpiled.results.length).toBeGreaterThan(0)
        const out = transpiled.results[0];
        expect(out).toBe('await lp.mov2({x:40,y:60,speed:10});');
    });

    test('Function with note speed and object args (mov2)', () => {
        lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        const line = "mov2 x:40 y:60 speed:'a#3'\n";
        const transpiled = lineparser.feed(line);
        expect(transpiled.results.length).toBeGreaterThan(0);
        const out = transpiled.results[0];
        expect(out).toBe('await lp.mov2({x:40,y:60,speed:\'a#3\'});');
    });

    test('Function with note speed auto-quoting and object args (mov2)', () => {
        lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        let line = "mov2 x:40 y:60 speed:a#3\n";
        let transpiled = lineparser.feed(line);
        expect(transpiled.results.length).toBeGreaterThan(0);
        let out = transpiled.results[0];
        expect(out).toBe('await lp.mov2({x:40,y:60,speed:\"a#3\"});');

        lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        line = "mov2 x:lp.cx y:lp.cy speed:c6 z:0.3\n";
        transpiled = lineparser.feed(line);
        expect(transpiled.results.length).toBeGreaterThan(0);
        out = transpiled.results[0];
        expect(out).toBe('await lp.mov2({x:lp.cx,y:lp.cy,speed:\"c6\",z:0.3});');

    });

    test('Function with note speed auto-quoting', () => {
        lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        const line = "speed a#3\n";
        const transpiled = lineparser.feed(line);
        expect(transpiled.results.length).toBeGreaterThan(0);
        const out = transpiled.results[0];
        expect(out).toBe('lp.speed(\"a#3\");');
    });

    test('Function with note speed auto-quoting and chaining', () => {
        lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        const line = "speed a3 | mov x:50 y:30\n";
        const transpiled = lineparser.feed(line);
        expect(transpiled.results.length).toBeGreaterThan(0);
        const out = transpiled.results[0];
        expect(out).toBe('lp.speed(\"a3\");await lp.mov({x:50,y:30});');
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
        const line = 'beep "hello world" | move -5\n';
        const transpiled = lineparser.feed(line);
        expect(transpiled.results.length).toBeGreaterThan(0);
        const out = transpiled.results[0];
        expect(out).toBe('lp.beep("hello world");await lp.move(-5);'); 
    });


    test('Multiple arguments parsing', () => {
        // NOTE: dangerous with numbers because operators might combine them!
        lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        const line = 'move 10 4 "blue"\n';
        const transpiled = lineparser.feed(line);
        expect(transpiled.results.length).toBeGreaterThan(0);
        const out = transpiled.results[0];
        expect(out).toBe('await lp.move(10,4,"blue");');
        
    });

    test('Multiple arguments parsing with maths precidence', () => {
        // NOTE: dangerous with numbers because operators might combine them!
        lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        const line = 'move 10 -4 2\n';
        const transpiled = lineparser.feed(line);
        expect(transpiled.results.length).toBeGreaterThan(0);
        const out = transpiled.results[0];
        expect(out).toBe('await lp.move(10-4,2);');
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
    });

    test('String addition with string literals and variables', () => {
        lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        let line = 'beep "hello " + "world"\n';
        let transpiled = lineparser.feed(line);
        expect(transpiled.results.length).toBe(1);
        expect(transpiled.results[0]).toBe('lp.beep("hello "+"world");');

        lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        line = 'beep "hello " + name\n';
        transpiled = lineparser.feed(line);
        expect(transpiled.results.length).toBe(1);
        expect(transpiled.results[0]).toBe('lp.beep("hello "+name);');

        lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        line = 'beep name + " world"\n';
        transpiled = lineparser.feed(line);
        expect(transpiled.results.length).toBe(1);
        expect(transpiled.results[0]).toBe('lp.beep(name+" world");');

        lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        line = 'beep "a" + "b" + "c"\n';
        transpiled = lineparser.feed(line);
        expect(transpiled.results.length).toBe(1);
        expect(transpiled.results[0]).toBe('lp.beep("a"+"b"+"c");');
    });

    test('String addition in named object args', () => {
        lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        const line = 'mov2 x:40 text:"hello " + name\n';
        const transpiled = lineparser.feed(line);
        expect(transpiled.results.length).toBe(1);
        expect(transpiled.results[0]).toBe('await lp.mov2({x:40,text:"hello "+name});');
    });

    test('JavaScript backtick template literals', () => {
        lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        let line = 'beep `hello world`\n';
        let transpiled = lineparser.feed(line);
        expect(transpiled.results.length).toBe(1);
        expect(transpiled.results[0]).toBe('lp.beep(`hello world`);');

        lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        line = 'beep `hello ${name}`\n';
        transpiled = lineparser.feed(line);
        expect(transpiled.results.length).toBe(1);
        expect(transpiled.results[0]).toBe('lp.beep(`hello ${name}`);');

        lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        line = 'beep `value: ${1 + 2}`\n';
        transpiled = lineparser.feed(line);
        expect(transpiled.results.length).toBe(1);
        expect(transpiled.results[0]).toBe('lp.beep(`value: ${1 + 2}`);');

        lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        line = 'mov2 x:40 label:`pos ${lp.x}`\n';
        transpiled = lineparser.feed(line);
        expect(transpiled.results.length).toBe(1);
        expect(transpiled.results[0]).toBe('await lp.mov2({x:40,label:`pos ${lp.x}`});');
    });

    test('JavaScript backticks with nested expressions and string addition', () => {
        lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        let line = 'beep `outer: ${`inner ${x}`}`\n';
        let transpiled = lineparser.feed(line);
        expect(transpiled.results.length).toBe(1);
        expect(transpiled.results[0]).toBe('lp.beep(`outer: ${`inner ${x}`}`);');

        lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        line = 'beep `hello ${name}` + "!"\n';
        transpiled = lineparser.feed(line);
        expect(transpiled.results.length).toBe(1);
        expect(transpiled.results[0]).toBe('lp.beep(`hello ${name}`+"!");');
    });

    test('Tagged template literals with backticks', () => {
        lineparser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        const line = 'mov2 x:40 html:tag`<div>${name}</div>`\n';
        const transpiled = lineparser.feed(line);
        expect(transpiled.results.length).toBe(1);
        expect(transpiled.results[0]).toBe('await lp.mov2({x:40,html:tag`<div>${name}</div>`});');
    });

    test('transpile function supports string addition and backticks in one-liners and blocks', () => {
        const inputOneLiner = `
            # beep "hello " + "world"
            # beep \`hello \${name}\`
        `;
        const resultOneLiner = transpile(inputOneLiner);
        expect(resultOneLiner).toContain('lp.beep("hello "+"world");');
        expect(resultOneLiner).toContain('lp.beep(`hello ${name}`);');

        const inputBlock = `
            ##
            beep "hello " + "world"
            beep \`hello \${name}\`
            ##
        `;
        const resultBlock = transpile(inputBlock);
        expect(resultBlock).toContain('lp.beep("hello "+"world");');
        expect(resultBlock).toContain('lp.beep(`hello ${name}`);');
    });

});
