/**
 * @vitest-environment jsdom
 */

import { grammarOneLineRegex, grammarBlockRegex } from "../transpile.js";
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
    const blockText1 = `## 
  start
  mov2 x:40  
## 
`;
    const matches = [...blockText1.matchAll(grammarBlockRegex)];
    expect(matches.length).toBe(1);
    expect(matches[0][1]).toContain("start");
    expect(matches[0][1]).toContain("mov2 x:40");

    const blockText2 = `
  const arr = ['a#4', 'b5', 'c#3']; 
  ## 
    mov2 x:40 y:60 speed:10  
  ## 
`;
    const matches2 = [...blockText2.matchAll(grammarBlockRegex)];
    expect(matches2.length).toBe(1);
    expect(matches2[0][1]).toContain("mov2 x:40 y:60 speed:10");
  });

});
