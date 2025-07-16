import { transpile, grammarBlockRegex, grammarOneLineRegex, globalRegex } from "./transpile";
import { LivePrinter } from "liveprinter-core";
import { Logger } from "liveprinter-utils";

Logger.level = Logger.LOG_LEVEL.debug;

const codeTextArea = document.getElementById("code");

const outputText = document.getElementById("output");
const outputText2 = document.getElementById("output2");
const resultsTextArea = document.getElementById("results");

const eventHandler = {
  printEvent: async (event) => {
    Logger.debug(JSON.stringify(event));
    resultsTextArea.value += `${JSON.stringify(event)}\n`;
  },
};

// run basic grammar tests

const text1 = "something(); # draw 40";
const text2 = "const arr = ['a#4', 'b5', 'c#3'];"; // This will NOT match because '#' is not preceded by a non-word character
const text3 = "#ext e:10 speed:20"; // This should match because '#' is at the start of the line
const text4 = "another line with no hash";
const text5 = "with!#symbol hash";
const text6 = "with_#underscore hash"; // This will NOT match 
const text7 = "something();#turn 80"; // This will match 

console.log("Testing one line regex: ", grammarOneLineRegex);

console.log(`"${text1}" match:`, [...text1.matchAll(grammarOneLineRegex)]);
// Expected: [" # draw 40", " draw 40"] (the first element is the full match, second is the captured group)

console.log(`"${text2}" match:`, [...text2.matchAll(grammarOneLineRegex)]);
// Expected: null

console.log(`"${text3}" match:`, [...text3.matchAll(grammarOneLineRegex)]);
// Expected: ["#ext e:10 speed:20", "ext e:10 speed:20"]

console.log(`"${text4}" match:`, [...text4.matchAll(grammarOneLineRegex)]);
// Expected: null

console.log(`"${text5}" match:`, [...text5.matchAll(grammarOneLineRegex)]);
// Expected: null

console.log(`"${text6}" match:`, [...text6.matchAll(grammarOneLineRegex)]);
// Expected: ["#symbol hash", "symbol turn 80"]

console.log(`"${text7}" match:`, [...text7.matchAll(grammarOneLineRegex)]);
// Expected: ["#turn 80", "turn 80"]

const blockText1 = 
`## 
  start
  mov2 x:40  
## 
`;
const blockText2 = 
`
  const arr = ['a#4', 'b5', 'c#3']; 
  ## 
    mov2 x:40 y:60 speed:10  
  ## 
`;
console.log("Testing block regex: ", grammarBlockRegex);

console.log(`"${blockText1}" match:`, [...blockText1.matchAll(grammarBlockRegex)]);
// Expected: ["## \n  start\n  mov2 x:40  \n## \n", "## \n  start\n  mov2 x:40  \n## \n"]

console.log(`"${blockText2}" match:`, [...blockText2.matchAll(grammarBlockRegex)]);
// Expected: ["## \n    mov2 x:40 y:60 speed:10  \n## \n", "## \n    mov2 x:40 y:60 speed:10  \n## \n"]


const exampleCode = `

  // comment here

  const blah=['45', '47', '46'];

  const notes = ['C4', 'D4', 'E4'];

  let y = 0

    #ext e:10 speed:20
    #draw 40
    #turn 80

  ##
    start
    mov2 x:40 y:60 speed:10
    mov2 x:80 y:60 speed:10
    mov2 x:120 y:60 speed:10
  ##
  `;

  console.log(`Testing example code: "${exampleCode}"`);

  const blocksReplaced = exampleCode.replaceAll(grammarBlockRegex, (match, p1) => {
    Logger.debug("Grammar block match: " + p1);
    return `\n[[${p1}]]\n`;
  });

 console.log(`Grammar line start: ${blocksReplaced.replaceAll(grammarOneLineRegex, (match, p1) => {
    Logger.debug("Grammar line: " + p1);
    return `\n[${p1}]\n`;
  })}`);
  

const lp = new LivePrinter();

lp.addPrintListener(eventHandler);

//attach a click listener to a play button
document.getElementById("transpile").addEventListener("click", async () => {
  try {
    const transpiled = transpile(codeTextArea.value);
    outputText.textContent = transpiled;
  } catch (err) {
    Logger.debug(`Compilation error: ${JSON.stringify(err)}`);
  }

  try {
    const transpiled = transpile(codeTextArea.value, "obj");
    outputText2.textContent = transpiled;
  } catch (err) {
    Logger.debug(`Compilation error: ${JSON.stringify(err)}`);
  }

  let _code = ` 
    const lp = lib.lp;
    ${outputText.textContent} 
  `;

  const func = async () => {
    const lib = { log: Logger, lp };

    let innerFunc;

    // Call user's function with external bindings from lib (as 'this' which gets interally mapped to 'lib' var)
    try {
      //innerFunc = eval(`async(lib)=>{${_code}}`);
      const AsyncFunction = async function () {}.constructor;
      innerFunc = new AsyncFunction('lib', _code);
    } catch (e) {
      Logger.error(`Code compilation error(${_code}): ${e.message}`);

      return 0; // fail fast
    }

    Logger.info("running inner");
    return innerFunc(lib);
  };

  try {
    await func();
  } catch (err) {
    Logger.error(`ERROR: ${err}`);
  }
});
