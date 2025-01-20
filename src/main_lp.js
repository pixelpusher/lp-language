import { transpile } from "./transpile";
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
    await innerFunc(lib);
    return 1;
  };

  try {
    await func();
  } catch (err) {
    Logger.error(`ERROR: ${err}`);
  }
});
