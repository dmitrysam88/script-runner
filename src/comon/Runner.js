const { spawn } = require('child_process');
const config = require('../config');

// let child = spawn('npm', ['--prefix','/home/dima/proj/js/test-server/','start']);
// 'node', ['/home/dima/proj/js/test-server/index.js']

class Runner {
  constructor (terminal) {
    this.terminal = terminal;
  }

  setPath(path) {
    this.path = path;
  }

  setScript(code) {
    this.code = code;
  }

  splitCode() {
    const code = this.code;
    const codeParts = code.split(' ');
    return { code: codeParts[0], args: codeParts.splice(1) }
  }

  start() {
    const { code, args } = this.splitCode();
    this.process = spawn(code, args, {
      cwd: this.path
    });

    this.terminal.clear();
    this.terminal.writeln(`${config.username}@${config.hostname}:${this.path ?? config.homedir}$ `);

    this.process.stdout.on('data', (data) => {
      // console.log(data.toString('utf8'));
      this.terminal.writeln(data);
    });

    this.process.on('close', (code) => {
      this.terminal.writeln(`Stop with code: ${code}`);
    });
  }

  stop() {
    if (this.process) {
      this.process.stdout.destroy();
      this.process.kill('SIGKILL');
    }
  }
}

module.exports = Runner