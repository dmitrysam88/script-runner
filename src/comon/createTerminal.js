const { Terminal } = require('xterm');
const { FitAddon } = require('xterm-addon-fit');

const config = require('../config');

module.exports = function (termElement) {
  const terminalCols = Math.floor(window.innerWidth / 10);

  const terminal = new Terminal({ 
    cursorBlink: true,
    cols: terminalCols,
    rows: 20,
    rendererType: 'canvas',
  });
  const fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);
  terminal.open(termElement);
  // terminal.write(`${config.username}@${config.hostname}:${config.homedir}$ `);

  // terminal.onKey((e) => {
  //   // console.log(e);
  //   if (e.key === '') {
  //     terminal.write('\b \b');
  //     // terminal.write('\x1b[D');
  //   } else {
  //     terminal.write(e.key);
  //     if (e.key === '\r') terminal.write('\n');
  //   }
  // });

  return terminal;
}