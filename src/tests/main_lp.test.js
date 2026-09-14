/**
 * @vitest-environment jsdom
 */

import { grammarOneLineRegex, grammarBlockRegex, transpile } from "../transpile.js";
import { describe, test, expect } from 'vitest'

describe('main_lp regex tests', () => {
  test('grammarOneLineRegex matches lines with #', () => {
    const text1 = "something(); # draw 40";
    const matches1 = [...text1.matchAll(grammarOneLineRegex)];
    expect(matches1.length).toBe(1);
    expect(matches1[0][0]).toBe(" # draw 40");
    expect(matches1[0][1]).toBe("draw 40");

    const text2 = "const arr = ['a#4', 'b5', 'c#3'];";
    const matches2 = [...text2.matchAll(grammarOneLineRegex)];
    expect(matches2.length).toBe(0);

    const text3 = "#ext e:10 speed:20";
    const matches3 = [...text3.matchAll(grammarOneLineRegex)];
    expect(matches3.length).toBe(1);
    expect(matches3[0][1]).toBe("ext e:10 speed:20");

    const text7 = "something();#turn 80";
    const matches7 = [...text7.matchAll(grammarOneLineRegex)];
    expect(matches7.length).toBe(1);
    expect(matches7[0][1]).toBe("turn 80");
  });

  test('grammarBlockRegex matches block delimited by ##', () => {
    const blockText1 = `
    ##
    start
    mov2 x:40
    ##
    `;
    const matches = [...blockText1.matchAll(grammarBlockRegex)];
    expect(matches.length).toBe(1);
    expect(matches[0][2]).toContain("start");
  });

  test('grammarBlockRegex matches multiple blocks delimited by ##', () => {
    const blockText2 = `
    ##
    start
    ##
    some other text
    ##
    stop
    ##
    `;
    const matches = [...blockText2.matchAll(grammarBlockRegex)];
    expect(matches.length).toBe(2);
    expect(matches[0][2]).toContain("start");
    expect(matches[1][2]).toContain("stop");
  });

  test('grammarBlockRegex matches multiple blocks delimited by ##', () => {
    
  const multBlockText = `
  const arr = ['a#4', 'b5', 'c#3']; 
  ## 
    mov2 x:40 y:60 speed:10  
  ## 

  // blah

  let i=0;

  ##
  turn 40
  speed 60
  draw 5
  ##
`;
    const matches = [...multBlockText.matchAll(grammarBlockRegex)];
    expect(matches.length).toBe(2);
    expect(matches[0][2]).toContain("mov2 x:40 y:60 speed:10");
    expect(matches[1][2]).toContain("turn 40");
    expect(matches[1][2]).toContain("speed 60");
    expect(matches[1][2]).toContain("draw 5");
  });

  test('transpile handles multiple blocks without duplicating previous blocks', () => {
    const multBlockText = `
      const arr = ['a#4', 'b5', 'c#3']; 
      ## 
        mov2 x:40 y:60 speed:10  
      ## 

      let i=0;

      ##
        turn 40
        speed 60
      ##
    `;
    const result = transpile(multBlockText);
    const mov2Matches = (result.match(/lp\.mov2/g) || []).length;
    expect(mov2Matches).toBe(1);
    expect(result).toContain('await lp.mov2({x:40,y:60,speed:10});');
    expect(result).toContain('lp.turn(40);');
    expect(result).toContain('lp.speed(60);');
  });

  test('grammarOneLineRegex does not match ## block delimiters', () => {
    const blockText = `
      ##
      turnto pi/2
      turn (2*pi - ang1) true
      ##
    `;
    const matches = [...blockText.matchAll(grammarOneLineRegex)];
    expect(matches.length).toBe(0);
  });

  test('transpile preserves code with comments and inline comments', () => {
    const code = `
      # drawtime dur //10
      # drawtime dur//10
      foo();//comment
    `;
    const result = transpile(code);
    expect(result).toContain('await lp.drawtime(dur);');
    expect(result).not.toContain('drawtime(du);');
    expect(result).toContain('foo();');
  });

  test('transpile preserves newlines and delimiters between global statements', () => {
    const code = `
      global a = 1;
      global b = 2;
      let c = 3;global d = 4;
    `;
    const res = transpile(code);
    expect(res).toContain('globalThis.a = 1;');
    expect(res).toContain('globalThis.b = 2;');
    expect(res).toContain('let c = 3;globalThis.d = 4;');
  });

  test('transpile converts lp object name without corrupting words or whitespace', () => {
    const code = `
      help.me();
      # turn 40
      # mov2 x:lp.cx y:lp.cy
    `;
    const res = transpile(code, 'obj');
    expect(res).toContain('help.me();');
    expect(res).not.toContain('heobj.me();');
    expect(res).toContain('obj.turn(40);');
    expect(res).toContain('await obj.mov2({x:obj.cx,y:obj.cy});');
  });

  test('nearley math parse test', async () => {
    const nearley = (await import('nearley')).default;
    const grammar = (await import('../lpgrammar.js')).default;
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed('turn (3*pi/2 - ang1) true|\n');
    console.log(parser.results[0]);
  });

  test('nearley hashtag test', async () => {
    const nearley = (await import('nearley')).default;
    const grammar = (await import('../lpgrammar.js')).default;
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    try {
      parser.feed('# turn 10|\n');
      console.log('SUCCESS:', parser.results[0]);
    } catch(e) {
      console.log('ERROR:', e.message);
    }
  });

  test('global async function test', () => {
    const code = `
global test1 = async function() {
  ##
  turn 40
  ##
};
global test2 = async function() {
  ##
  turn 80
  ##
};`;
    const res = transpile(code);
    console.log("=== GLOBAL ASYNC ===");
    console.log(JSON.stringify(res));
    console.log("=== END ===");
  });

  test('breaking test', () => {
    const code = `
async function test1() {
  ##
  turnto pi/2
  ##
}
async function col1() {
  ##
  turn 80
  ##
}`;
    const res = transpile(code);
    console.log("=== BREAKING TEST ===");
    console.log(res);
    console.log("=== END ===");
  });

  test('consecutive ## blocks', () => {
    const code = `
##
turn 40
##
##
turn 80
##
    `;
    const res = transpile(code);
    console.log("=== CONSECUTIVE BLOCKS ===");
    console.log(JSON.stringify(res));
    console.log("=== END ===");
    expect(res).toContain('lp.turn(40);');
    expect(res).toContain('lp.turn(80);');
  });

  test('async function with one line regex', () => {
    const code = `
async function test1() {
  # turn 40
}
async function test2() {
  # turn 80
}`;
    const res = transpile(code);
    console.log("=== ONE LINER RESULT ===");
    console.log(JSON.stringify(res));
    console.log("=== END ===");
  });

  test('multiple async functions with ## blocks', () => {
    const code = `
      async function test1() {
        ##
        turn 40
        ##
      }

      async function col1() {
        ##
        turn 80
        ##
      }
    `;
    const result = transpile(code);
    console.log("=== ASYNC FUNC RESULT ===");
    console.log(result);
    console.log("=== END ===");
    expect(result).toContain('lp.turn(40);');
    expect(result).toContain('lp.turn(80);');
  });

  test('test mixed', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const code = fs.readFileSync(path.join(__dirname, '../../mixed2.js'), 'utf8');
    const res = transpile(code);
    console.log("=== MIXED RESULT ===");
    console.log(res);
    console.log("=== END ===");
  });

  test('test user eval', () => {
    const code = `
async function test1() {
  ##
  start
  ##
  # turn 40
}
async function col1() {
  ##
  turn 80
  ##
}
`;
    const res = transpile(code);
    console.log("=== USER EVAL ===");
    console.log(res);
    console.log("=== END ===");
  });

  test('transpile badcode.js successfully with mixed one-line and block grammars', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const code = fs.readFileSync(path.join(__dirname, 'badcode.js'), 'utf8');
    const res1 = transpile(code);
    expect(res1).toBeDefined();
    
    // Ensure no unparsed # or ## remain
    expect(res1).not.toMatch(/(?:^|\s|;)#[^#]/);
    expect(res1).not.toContain('##');

    const res2 = transpile(code, 'obj');
    expect(res2).toBeDefined();
    expect(res2).not.toMatch(/(?:^|\s|;)#[^#]/);
    expect(res2).not.toContain('##');
  });

  test('test error parsing', () => {
    const code = `
##
turn 10
# turn 20
##
turn 30
##
`;
    try {
      const res = transpile(code);
      console.log("=== ERROR RESULT ===");
      console.log(res);
      console.log("=== END ===");
    } catch(e) {
      console.log("CAUGHT ERROR:", e.message);
    }
  });

  test('test multi-line block', () => {
    const code = `
##
turn 10
turn 20
turn 30
##
`;
    const res = transpile(code);
    console.log("=== MULTI-LINE RESULT ===");
    console.log(res);
    console.log("=== END ===");
  });

  test('test mixed inside async', () => {
    const code = `
async function f() {
  ##
  start
  ##
  # turn 20
  ##
  turn 30
  ##
}
`;
    const res = transpile(code);
    console.log("=== MIXED ASYNC RESULT ===");
    console.log(res);
    console.log("=== END ===");
  });


});
