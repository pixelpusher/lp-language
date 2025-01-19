import { transpile } from "../lib/transpile";
import { LivePrinter } from "liveprinter-core";
import { Logger } from 'liveprinter-utils';

Logger.level = Logger.LOG_LEVEL.debug;

const codeTextArea = document.getElementById('code');

const outputText = document.getElementById('output');
const outputText2 = document.getElementById('output2');



  //attach a click listener to a play button
  document.getElementById("transpile").addEventListener("click", () => {
    const transpiled = transpile(codeTextArea.value);
    outputText.textContent = transpiled;
    outputText2.textContent = transpile(codeTextArea.value, 'obj');
    Logger.debug(`transpiled: ${transpiled}`);
  });


