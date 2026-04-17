# LivePrinter Grammar Transpiler

A JavaScript transpiler that converts LivePrinter's minigrammar syntax into valid JavaScript code. This projet provides a shorthand notation for calling LivePrinter API functions, making 3D printing code more readable and concise.

**Author**: Evan Raskob 2025

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Functions](#core-functions)
- [Grammar Syntax](#grammar-syntax)
- [Examples](#examples)
- [API Reference](#api-reference)

## Installation

Install dependencies using npm:

```bash
npm install
```

## Quick Start

Start the development server to see the transpiler in action:

```bash
npm run dev
```

Build the project for production:

```bash
npm build
```

## Core Functions

### `transpile(code, objName)`

The main function that converts LivePrinter minigrammar code into executable JavaScript.

**Parameters:**
- `code` (String): The code string containing LivePrinter grammar to transpile
- `objName` (String, optional): Name of the LivePrinter object to call functions on. Defaults to `'lp'`

**Returns:**
- (String): Transpiled JavaScript code ready to be evaluated

**Description:**
Processes LivePrinter grammar in two forms:
1. **Block syntax**: Commands enclosed in `## ... ##`
2. **One-liner syntax**: Commands prefixed with `#`

The function handles:
- Comment removal (both `/* */` and `//` style)
- Grammar parsing using nearley parser
- Conversion of async functions to proper `await` statements
- Function chaining with `|` operator
- Parameterized function calls with named arguments

**Example:**

```javascript
import { transpile } from './src/transpile.js';

const liveprinterCode = `
  const speed = 20;
  
  #draw 40
  #turn 80
`;

const jsCode = transpile(liveprinterCode);
console.log(jsCode);
```

**Output:**
```javascript
const speed = 20;

await lp.draw(40);
await lp.turn(80);
```

### Regex Patterns (Exports)

#### `grammarBlockRegex`

Matches LivePrinter commands in block format (multi-line):

```regex
/(?:^|\s+|;)##\s*([\s\S]+?)(?:[\s\n]*)##/g
```

**Matches code blocks like:**
```
##
  mov2 x:40 y:60 speed:10
  mov2 x:80 y:60 speed:10
##
```

#### `grammarOneLineRegex`

Matches single-line LivePrinter commands:

```regex
/(?:^|\s+|;)#\s*(.+)(?:[^\n]*)/g
```

**Matches commands like:**
```
#draw 40
#turn 80
#ext e:10 speed:20
```

#### `lpRegex`

Matches LivePrinter object calls in transpiled code:

```regex
/([\n\s])*lp(\.)/g
```

#### `globalRegex`

Matches `global` keyword declarations:

```regex
/(?:^|\s|;)(global)(?:\s+)/g
```

## Grammar Syntax

LivePrinter grammar provides a concise syntax for calling LivePrinter API functions. The grammar supports:

### Function Calls

Basic function call:
```
#functionName arg1 arg2
```

### Named Arguments

Pass arguments using `key:value` syntax:
```
#mov2 x:40 y:60 speed:10
```

### Parentheses in Arguments

Include parentheses for nested expressions:
```
#draw (speed * 2)
```

### Function Chaining

Chain functions using the pipe operator `|`:
```
#start | mov2 x:40 y:60 | draw 40
```

### String Literals

Strings are enclosed in quotes, usually for fractional beats:
```
# to x:100 y:100 t:"1/2b" | draw
```

### Numbers

Supports both integers and floating-point numbers:
```
#draw 40
#turn 45.5
```

### Variables

Reference JavaScript variables directly:
```
const notes = ['C4', 'D4', 'E4'];
# speed notes[0]
```

### Comments

Comments are automatically removed during transpilation:
```
// This is a comment
/* This is a block comment */
# draw 40 // This line draws 40mm
```

## Examples

### Example 1: Basic Movement

**Input Code:**
```javascript
const liveprinterCode = `
  # start
  # mov2 x:40 y:60 speed:10
  # draw 40
  # turn 80
`;

const result = transpile(liveprinterCode);
```

**Transpiled Output:**
```javascript
await lp.start();
await lp.mov2({x:40,y:60,speed:10});
await lp.draw(40);
await lp.turn(80);
```

### Example 2: Block Syntax with Multiple Commands

**Input Code:**
```javascript
const liveprinterCode = `
  const speed = 10;
  
  ##
    start
    mov2 x:40 y:60 speed:speed
    draw 40
    turn 80
  ##
`;

const result = transpile(liveprinterCode);
```

**Transpiled Output:**
```javascript
const speed = 10;

await lp.start();
await lp.mov2({x:40,y:60,speed:speed});
await lp.draw(40);
await lp.turn(80);
```

### Example 3: Function Chaining with Pipes

**Input Code:**
```javascript
const liveprinterCode = `
  # start | to x:100 y:100 t:"1/2b" | draw
`;

const result = transpile(liveprinterCode);
```

**Transpiled Output:**
```javascript
await lp.start();
await lp.to({x:100,y:100, t:"1/2b"});
await lp.draw();
```

### Example 4: Complex Block with Comments

**Input Code:**
```javascript
const liveprinterCode = `
  // Initialize the printer
  # prime
  
  ##
    // Draw a pattern
    start
    mov2 x:40 y:60 speed:10  // Move to position
    draw 40                   // Draw 40 units
    turn 80                   // Turn 80 degrees
  ##
  
  # stop // retract and lift head
`;

const result = transpile(liveprinterCode);
```

**Transpiled Output:**
```javascript
await lp.prime();

await lp.start();
await lp.mov2({x:40,y:60,speed:10});
await lp.draw(40);
await lp.turn(80);

await lp.stop();
```

## Running Code from the Browser

When transpiled code is used in a browser environment with the LivePrinter library:

```javascript
import { transpile } from 'lp-language';
import { LivePrinter } from 'liveprinter-core';

// Initialize LivePrinter
const lp = new LivePrinter({
  /* configuration */
});

// Transpile user code
const userCode = `
  #start
  #mov2 x:40 y:60 speed:10
  #draw 40
`;

const jsCode = "const lp = lib.lp;" + transpile(userCode);

// create anonymous function to wrap async call with 
// appropriate object scope (libs) 
const func = async () => {
const lib = { lp };

let innerFunc;

// Call user's function with external bindings from lib (as 'this' which gets interally mapped to 'lib' var)
try {
    const AsyncFunction = async function () {}.constructor;
    innerFunc = new AsyncFunction('lib', _code);
} catch (e) {
    Logger.error(`Code compilation error(${_code}): ${e.message}`);

    return 0; // fail fast
}

// run lp code asynchronously
return innerFunc(lib);
};

// actually run function and catch errors
try {
await func();
} catch (err) {
console.error("ERROR: " + err);
}
```

## API Reference

### Async Functions

The following functions are automatically wrapped with `await` when transpiled (indicating they are asynchronous):

`stop`, `prime`, `mov2`, `ext`, `gcodeEvent`, `gcode`, `errorEvent`, `retractspeed`, `sendFirmwareRetractSettings`, `retract`, `unretract`, `start`, `temp`, `bed`, `fan`, `drawtime`, `draw`, `up`, `drawup`, `dup`, `upto`, `downto`, `down`, `drawdown`, `dd`, `travel`, `traveltime`, `fwretract`, `polygon`, `rect`, `extrudeto`, `sendExtrusionGCode`, `sendArcExtrusionGCode`, `extrude`, `move`, `moveto`, `drawfill`, `sync`, `fill`, `wait`, `pause`, `resume`, `printPaths`, `printPathsThick`, `_extrude`

### Synchronous Functions

Functions not in the async list are called without `await`:

```javascript
#getState         // Called as lp.getState()
#properties       // Called as lp.properties()
```

## Development

### Project Structure

```
├── src/
│   ├── main_lp.js          # Entry point and test suite
│   ├── transpile.js        # Main transpilation logic
│   ├── lpgrammar.js        # nearley grammar definition
│   ├── lpmode.js           # (old) CodeMirror mode for LivePrinter syntax
│   ├── strudel.js          # Strudel pattern language integration
│   └── AsyncFunctionsConstants.js  # Async function definitions
├── lang/
│   ├── liveprinter.html    # Example HTML interface
│   └── liveprinter.ne      # nearley grammar source
├── public/                 # Static assets
├── dist/                   # Built output
└── package.json            # Project configuration
```

### Testing

The main test file is [src/main_lp.js](src/main_lp.js), which includes tests for:
- Grammar block matching
- One-liner command matching
- Transpilation of various code patterns
- Regex pattern validation

Run tests with:
```bash
npm run dev
```

This will start a Vite development server and run test cases in the browser console.