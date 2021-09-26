const fs = require('fs');
const os = require('os');
const { ipcRenderer } = require('electron');

const createElement = require('./comon/createElement');
const createTerminal = require('./comon/createTerminal');
const Runner = require('./comon/Runner');

window.onload = function () {

  function runScript(index) {
    const { runner, statusCircle } = runnerLinkList[index];
    runner.start();
    statusCircle.setAttribute('class', 'circle green');
  }

  function stopScript(index) {
    const { runner, statusCircle } = runnerLinkList[index];
    runner.stop();
    statusCircle.setAttribute('class', 'circle red');
  }

  function showHideTerminal(index) {
    const { terminalElement } = runnerLinkList[index];
    const terminalClass = terminalElement.getAttribute('class');
    if (terminalClass.split(' ').length === 1) {
      terminalElement.setAttribute('class', 'terminal unvisible');
    } else {
      terminalElement.setAttribute('class', 'terminal');
    }
  }

  function openPathDialog(index) {
    const { runner, inputPath } = runnerLinkList[index];
    const res = ipcRenderer.sendSync('open-folder-dialog');
    if (res) {
      inputPath.setAttribute('value', res);
      runner.setPath(res);
    }
  }

  function changePath(e, index) {
    const { runner } = runnerLinkList[index];
    runner.setPath(e.target.value);
  }

  function changeScript(e, index) {
    const { runner } = runnerLinkList[index];
    runner.setScript(e.target.value);
  }

  function addRunner() {
    console.log('add');
    runnerLinkList.push(getRunner(runnerList, runnerLinkList.length));
  }

  function saveData() {
    try {
      const res = ipcRenderer.sendSync('save-file-dialog');
      if (!res) return;
      const data = JSON.stringify(runnerLinkList.map((link) => ({
        path: link.inputPath.value,
        code: link.textareaCode.value,
      })));

      fs.writeFileSync(res, data, 'utf8');
    } catch (err) {
      console.log(err);
    }
  }

  function clearRunnerList() {
    runnerLinkList.forEach((domEl) => {
      domEl.runnerDiv.remove();
    });
    runnerLinkList.length = 0;
  }

  function loadData() {
    try {
      const res = ipcRenderer.sendSync('open-file-dialog');
      if (!res) return;
      const data = JSON.parse(fs.readFileSync(res, 'utf8'));
      clearRunnerList();
      data.forEach((el) => {
        const id = runnerLinkList.push(getRunner(runnerList, runnerLinkList.length)) - 1;
        runnerLinkList[id].inputPath.value = el.path;
        runnerLinkList[id].textareaCode.innerText = el.code;
        runnerLinkList[id].runner.setPath(el.path);
        runnerLinkList[id].runner.setScript(el.code);
      });
    } catch (err) {
      console.log(err);
    }
  }

  function getRunner(parentElement, id) {
    const runnerDiv = createElement('div', {
      parent: parentElement,
      class: "runner" 
    });
  
    // runner-header
    const ruunnerHeader = createElement('div', {
      parent: runnerDiv,
      class: "runner-header"
    });
    const buttonStart = createElement('button', {
      parent: ruunnerHeader,
      class: "button first sign",
      onClick: () => runScript(id)
    }, '&#9654;');
    const buttonStop = createElement('button', {
      parent: ruunnerHeader,
      class: "button sign",
      onClick: () => stopScript(id)
    }, '&#9632;');
    const inputPath = createElement('input', {
      parent: ruunnerHeader,
      type: "text",
      class: "script-dir",
      value: 'path',
      onChange: (e) => changePath(e, id)
    });
    const buttonPath = createElement('button', {
      parent: ruunnerHeader,
      class: "button last sign",
      onClick: () => openPathDialog(id)
    }, '&#9167;');
    const buttonOption = createElement('button', {
      parent: ruunnerHeader,
      class: "button last sign",
      onClick: () => showHideTerminal(id)
    }, '&#9881;');
    // runner-input
    const runnerInput = createElement('div', {
      parent: runnerDiv,
      class: "runner-input"
    });
    const textareaCode = createElement('textarea', {
      parent: runnerInput,
      class: "code-input",
      rows: "3",
      onChange: (e) => changeScript(e, id)
    });
    const statusDiv = createElement('div', {
      parent: runnerInput,
      class: "container"
    });
    const statusCircle = createElement('div', {
      parent: statusDiv,
      class: "circle red"
    });
    // runner-output
    const runnerOutput = createElement('div', {
      parent: runnerDiv,
      class: "runner-output"
    });
    const terminalElement = createElement('div', {
      parent: runnerOutput,
      class: "terminal unvisible"
    });
    const terminal = createTerminal(terminalElement);
  
    const runner = new Runner(terminal);
    return {
      runnerDiv,
      ruunnerHeader,
      buttonStart,
      buttonStop,
      inputPath,
      buttonPath,
      buttonOption,
      runnerInput,
      textareaCode,
      statusDiv,
      statusCircle,
      runnerOutput,
      terminalElement,
      terminal,
      runner
    }
  }

  const runnerLinkList = [];

  const rootElement = document.getElementById('app');

  // const ruunerTemplate = fs.readFileSync(__dirname + '/runner.html', 'utf8');
  // rootElement.innerHTML =ruunerTemplate;

  const runnerList = createElement('div', { parent: rootElement, class: "runner-list" });

  const mainHeader = createElement('div', { parent: runnerList, class: "main-header" });
  const divRigth = createElement('div', { parent: mainHeader, class: "header-pert" });
  const buttonAdd = createElement('button', { parent: divRigth, class: "button btn-main", onClick: addRunner }, '&#43;');
  
  const divleft = createElement('div', { parent: mainHeader, class: "header-pert" });
  const buttonSave = createElement('button', { parent: divleft, class: "button btn-main", onClick: saveData }, 'Save');
  const buttonLoad = createElement('button', { parent: divleft, class: "button btn-main", onClick: loadData }, 'Load');

  runnerLinkList.push(getRunner(runnerList, 0));
}