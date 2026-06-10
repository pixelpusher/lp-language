/**
 * @vitest-environment jsdom
 */

import { parseStrudel } from "../strudel.js";
import { describe, test, expect } from 'vitest'

describe('Strudel parser', () => {
  test('Basic Subdivisions and Rests', () => {
    const out = parseStrudel('[bd ~] [sd bd]', 4);
    expect(out).toEqual([
      ['bd', '1b'], ['-', '1b'],
      ['sd', '1b'], ['bd', '1b']
    ]);
  });

  test('Multipliers (*)', () => {
    const out = parseStrudel('[hh*4]', 1);
    expect(out).toEqual([
      ['hh', '1/4b'], ['hh', '1/4b'], ['hh', '1/4b'], ['hh', '1/4b']
    ]);
  });

  test('Replication (!)', () => {
    const out = parseStrudel('bd!3', 3);
    expect(out).toEqual([
      ['bd', '1b'], ['bd', '1b'], ['bd', '1b']
    ]);
  });

  test('Elongation (@)', () => {
    const out = parseStrudel('[bd@3 sn]', 4);
    expect(out).toEqual([
      ['bd', '3b'], ['sn', '1b']
    ]);
  });

  test('Division (/)', () => {
    const out = parseStrudel('[bd/2 sn]', 3);
    expect(out).toEqual([
      ['bd', '2b'], ['sn', '1b']
    ]);
  });

  test('Complex Nesting and Operations', () => {
    const out = parseStrudel('[[bd sn] hh*2] ~', 2);
    expect(out).toEqual([
      ['bd', '1/4b'], ['sn', '1/4b'],
      ['hh', '1/4b'], ['hh', '1/4b'],
      ['-', '1b']
    ]);
  });
});
