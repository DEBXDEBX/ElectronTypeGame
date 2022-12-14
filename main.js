const { app, BrowserWindow, ipcMain, dialog, Menu } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;
let addWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("main.html");
  mainWindow.maximize();
  // Open the DevTools on start up for developement
  // mainWindow.webContents.openDevTools();
}
//When you click on new test
function createNewTest() {
  addWindow = new BrowserWindow({
    width: 400,
    height: 300,
    title: "Create New Test",
    parent: mainWindow,
    modal: true,
    show: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "addPreload.js"),
    },
  });

  addWindow.loadFile("add.html");
}
// my functions ##############################################
async function myShowSaveDialogCall(name) {
  let myOptions = {
    defaultPath: name,
    filters: [{ name: "Custom File Type", extensions: ["debx"] }],
  };
  let path = dialog.showSaveDialogSync(mainWindow, myOptions);
  return { name, path };
}
// api #######################################################
function setFontSize(fontSize) {
  mainWindow.webContents.send("FontSize:Change", fontSize);
} // End setFontSize(fontSize)

ipcMain.on("autoloadFiles:open", (event, filePaths) => {
  if (!filePaths) {
    let message = "No file selected!";
    let msgType = "error";
    mainWindow.webContents.send("Display:showAlert", { message, msgType });
    return;
  }
  filePaths.forEach((file) => readFileContents(file));
}); //end

ipcMain.on("addForm:cancel", (_event, value) => {
  addWindow.close();
}); //end

ipcMain.on("addForm:submit", async (event, name) => {
  myShowSaveDialogCall(name)
    .then((data) => {
      mainWindow.webContents.send("typeTest:add", data);
    })
    .catch((e) => {
      console.log(e);
      let message = "Error submitting test";
      let msgType = "error";
      mainWindow.webContents.send("Display:showAlert", {
        message,
        msgType,
      });
    });
  addWindow.close();
}); //end

ipcMain.on("test:save", (_event, test) => {
  try {
    const content = JSON.stringify(test);
    fs.writeFileSync(test.filePath, content);
  } catch (e) {
    console.log(e);
    let message = "error writing file";
    let msgType = "error";
    mainWindow.webContents.send("Display:showAlert", { message, msgType });
  }
}); //end

// Top Menu
const menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Create New Test",
        accelerator: process.platform === "darwin" ? "Command+N" : "Ctrl+N",
        click() {
          createNewTest();
        },
      },
      {
        label: "Load Test",
        accelerator: process.platform === "darwin" ? "Command+O" : "Ctrl+O",
        click() {
          loadTest();
        },
      },

      {
        label: "Quit",
        accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        },
      },
    ],
  },

  {
    label: "Settings",
    submenu: [
      {
        label: "Font-size: x-small",
        accelerator: process.platform === "darwin" ? "Command+1" : "Ctrl+1",
        click() {
          setFontSize("x-small");
        },
      },
      {
        label: "Font-size: small",
        accelerator: process.platform === "darwin" ? "Command+2" : "Ctrl+2",
        click() {
          setFontSize("small");
        },
      },
      {
        label: "Font-size: normal",
        accelerator: process.platform === "darwin" ? "Command+3" : "Ctrl+3",
        click() {
          setFontSize("normal");
        },
      },
      {
        label: "Font-size: large",
        accelerator: process.platform === "darwin" ? "Command+4" : "Ctrl+4",
        click() {
          setFontSize("large");
        },
      },
      {
        label: "Font-size: x-large",
        accelerator: process.platform === "darwin" ? "Command+5" : "Ctrl+5",
        click() {
          setFontSize("x-large");
        },
      },
      {
        label: "Start Up Settings Form",
        accelerator: process.platform === "darwin" ? "Command+L" : "Ctrl+S",
        click() {
          showSettingsForm();
        },
      },
    ],
  },
  {
    label: "Help",
    submenu: [
      {
        label: "Help",
        accelerator: process.platform === "darwin" ? "Command+D" : "Ctrl+h",
        click() {
          loadHelp();
        },
      },
    ],
  },
]; // End menuTemplate

//###################################################################
//###################################################################
//###################################################################

//check for NODE_ENV => prodution, development, staging, test
//This does not work comment it out before you build
// DEVELOPER TOOLS
// if (process.env.NODE_ENV !== "production") {
//   // add object to end of array menu
//   menuTemplate.push({
//     label: "View",
//     submenu: [
//       //predefined role
//       { role: "reload" },
//       {
//         label: "Toggle Developer Tools",
//         accelerator:
//           process.platform === "darwin" ? "Command+Alt+I" : "Ctrl+Shift+I",
//         click(item, focusedWindow) {
//           focusedWindow.toggleDevTools();
//         },
//       },
//     ],
//   });
// }

//###################################################################
//###################################################################
//###################################################################

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

app.whenReady().then(() => {
  createWindow();
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// load test
//When You click on load test
function loadTest() {
  const fileNames = myDialogLoad();
  if (!fileNames) {
    let message = "No file selected!";
    let msgType = "error";
    mainWindow.webContents.send("Display:showAlert", { message, msgType });
    return;
  }

  fileNames.forEach((file) => readFileContents(file));
} // End

// autoload code ###################################################
function showSettingsForm() {
  mainWindow.webContents.send("Display:showSettingsForm");
}

ipcMain.on("autoload:getFiles", (event, arg) => {
  let fileNames = myDialogLoad();

  if (!fileNames) {
    let message = "No file selected!";
    let msgType = "error";
    mainWindow.webContents.send("Display:showAlert", { message, msgType });
    return;
  }

  mainWindow.webContents.send("autoLoadPaths:sendTolocalStorage", fileNames);
});

function myDialogLoad() {
  let myOptions = {
    filters: [
      {
        name: "Custom File Type",
        extensions: ["debx"],
      },
    ],
    properties: ["openFile", "multiSelections"],
  };

  let fileNames = dialog.showOpenDialogSync(null, myOptions);

  return fileNames;
}

function readFileContents(filepath) {
  if (!filepath) {
    let message = "No file selected!";
    let msgType = "error";
    mainWindow.webContents.send("Display:showAlert", { message, msgType });
    return;
  }

  fs.readFile(filepath, "utf-8", (err, data) => {
    if (err) {
      let message = "An error occured reading the file!";
      let msgType = "error";
      mainWindow.webContents.send("Display:showAlert", { message, msgType });
      return;
    } else {
      try {
        data = JSON.parse(data);
      } catch {
        let message = "Can not parse data!";
        let msgType = "error";
        mainWindow.webContents.send("Display:showAlert", {
          message,
          msgType,
        });
        return;
      }

      if (data) {
        if (data.fileType === "ElectronTypeTestSept2022") {
          // set filepath: This is in case you moved your file
          data.filePath = filepath;
          // laod file cab
          // data is an object to be converted to an file cab object
          mainWindow.webContents.send("test:load", data);
        } else {
          let message = "This is not a valid ElectronFileCab2020November file!";
          let msgType = "error";
          mainWindow.webContents.send("Display:showAlert", {
            message,
            msgType,
          });
        }
      }
    }
  });
}

//When you click on help
function loadHelp() {
  helpWindow = new BrowserWindow({
    width: 800,
    height: 800,
    title: "Help",
  });
  helpWindow.setMenu(null);
  helpWindow.loadURL(`file://${__dirname}/help.html`);
  helpWindow.maximize();
  // the following is for garbage collection
  helpWindow.on("closed", () => {
    helpWindow = null;
  });
}
