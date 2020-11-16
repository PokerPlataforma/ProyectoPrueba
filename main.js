const { app ,BrowserWindow, screen, ipcMain } = require('electron');
const {spawn} = require('child_process');
let program;
let win;
let form;
function createWindow (w, h, px, py) {
  px += -90;
  h += -8

  win = new BrowserWindow({
  	titleBarStyle: 'hidden',
    width: 100,
    height: h,
    frame: false,
    transparent: true,
    modal: true,
    resizable: false,
    x: px,
    y: py,
    webPreferences: {
      nodeIntegration: true
    }
  }),
  win.loadURL(`file://${__dirname}/index.html`);
}
function createForm () {
  form = new BrowserWindow({
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true
    }
  }),
  form.loadURL(`file://${__dirname}/app.html`);
}
function extractInfo(info){
  program = program.split(' ');
  createWindow(parseInt(program[0]),parseInt(program[1]),parseInt(program[2]),parseInt(program[3]))
}

app.on('ready', () =>  { 
  createForm()
});

app.on('activate', () => {
  let mousePos = screen.getCursorScreenPoint()
  console.log(mousePos);
  });
  ipcMain.on('asynchronous-message', (event, arg) => {
    //console.log(screen.getCursorScreenPoint())
    const python = spawn('python', ['prueba', arg])
    python.stdin.write(arg);
    // End data write
    python.stdin.end();
    python.stdout.on('data', (data) => {
     program = data.toString();
     extractInfo(program);
     form.close();
  });
    python.stderr.on('data', (data) => {
     console.log(`error:${data}`);
  });
    python.stderr.on('close', () => {
     console.log("Closed");
  });
});
ipcMain.on('close', (event, arg) => {
  win.close();
});


