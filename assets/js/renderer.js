"use strict";

const skipValue = "skipTheTest12481632641282565161032";
let arrayOfTypeTests = [];
let currentLine = "David is great.";
let currentArray = [];
let currentArrayIndex = 0;
let testIndex = -243;
// temp hold for array
let settingsArrayContainer = [];
// Create elements object
const el = new Elements();
// Pass elements to display
const display = new Display(el, $);
// Select audio
const warningSelectAudio = document.querySelector("#warningSelectAudio");
const addImageAudio = document.querySelector("#addImageAudio");
const addAudio = document.querySelector("#addAudio");
const btnAudio = document.querySelector("#btnAudio");
const cancelAudio = document.querySelector("#cancelAudio");
const correctAudio = document.querySelector("#correctAudio");
const tabAudio = document.querySelector("#tabAudio");
const deleteAudio = document.querySelector("#deleteAudio");
const wrongAudio = document.querySelector("#wrongAudio");
const addTestAudio = document.querySelector("#addTestAudio");
const clickAudio = document.querySelector("#clickAudio");
const restartAudio = document.querySelector("#restartAudio");

//This enables JQuery ToolTips
$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip();
});
//The start of program exicution.
window.onload = function () {
  startUp();
};

//Start Up
function startUp() {
  console.log("David E. Berkheimer");
  //get data from settings obect
  let settingsStorage = new SettingsStorage();
  let settings = settingsStorage.getSettingsFromFile();

  if (settings.type === "typeTest9112022") {
    // set the holding array
    settingsArrayContainer = settings.filePathArray;
    // loadsettings
    applySettings(settings);
    // update Form
    display.showAutoLoadList(settingsArrayContainer);

    if (el.autoLoadCheckBox.checked) {
      if (settings.filePathArray) {
        sendAutoLoadFilesToNode(settings.filePathArray);
      }
    }
  }
}

function sendAutoLoadFilesToNode(filePaths) {
  window.api.sendFilePathsForAutoload(filePaths);
}
// window api's #################################################################
const saveTest = (test) => {
  window.api.saveTest(test);
}; //End saveTest()

window.api.handleShowAlert((event, { message, msgType }) => {
  display.showAlert(message, msgType);
});

window.api.handleFontSizeChange((event, fontSize) => {
  switch (fontSize) {
    case "x-small":
      el.root.style.fontSize = "10px";
      break;
    case "small":
      el.root.style.fontSize = "12px";
      break;
    case "normal":
      el.root.style.fontSize = "16px";
      break;
    case "large":
      el.root.style.fontSize = "20px";
      break;
    case "x-large":
      el.root.style.fontSize = "24px";
      break;
    default:
      console.log("No valid font-size");
  }
});

window.api.handleNewTest((event, { name, path }) => {
  if (!name || !path) {
    wrongAudio.play();
    display.showAlert("Error creating test Typing test!", "error");
    return;
  }
  let pathIsTaken = false;

  for (const test of arrayOfTypeTests) {
    if (test.filePath === path) {
      pathIsTaken = true;
    }
  }

  if (pathIsTaken) {
    display.showAlert("That test file is already loaded", "error");
    return;
  }

  let nameIsTaken = false;

  for (const test of arrayOfTypeTests) {
    if (test.name === name) {
      nameIsTaken = true;
    }
  }
  if (nameIsTaken) {
    display.showAlert(`A test file called ${name} is already loaded`, "error");
    return;
  }
  const newTest = new TypeTest(name, path);
  newTest.arrayOfStrings.push(newTest.name);
  arrayOfTypeTests.push(newTest);
  // sort
  sortArrayByName(arrayOfTypeTests);
  // save
  saveTest(newTest);
  addTestAudio.play();
  display.showAlert("A new typing test was added", "success", 1500);
  renderTests();
}); //End

window.api.handleOpenFile((event, { name, filePath, arrayOfStrings }) => {
  if (!name || !filePath) {
    wrongAudio.play();
    display.showAlert("Error creating test Typing test!", "error");
    return;
  }
  let pathIsTaken = false;

  for (const test of arrayOfTypeTests) {
    if (test.filePath === filePath) {
      pathIsTaken = true;
    }
  }

  if (pathIsTaken) {
    display.showAlert("That test file is already loaded", "error");
    return;
  }

  let nameIsTaken = false;

  for (const test of arrayOfTypeTests) {
    if (test.name === name) {
      nameIsTaken = true;
    }
  }
  if (nameIsTaken) {
    display.showAlert(`A test file called ${name} is already loaded`, "error");
    return;
  }

  const newTest = new TypeTest(name, filePath, arrayOfStrings);
  arrayOfTypeTests.push(newTest);
  renderTests();
});

// autoLoad IPC code #######################################################
window.api.handleShowSettingsForm((event, noData) => {
  loadUpSettingsForm();
  display.showSettingsForm();
});
// addEventListeners #############################################################
document.addEventListener("keyup", (e) => {
  //skip the test if true
  if (el.lineInputElement.value === skipValue) {
    return;
  }
  const lineInputValue = el.lineInputElement.value.trim();
  const key = e.key;

  // Click the enter key when finished with the line
  if (key === "Enter") {
    if (currentLine === lineInputValue) {
      //You typed the whole line right!!!!
      correctAudio.play();
      getNewLine();
      return;
    } else {
      //Try again
      wrongAudio.play();
      return;
    }
  }
  // check if input is equal to sliced current line
  const length = lineInputValue.length;
  const editedText = currentLine.slice(0, length);
  if (lineInputValue !== editedText) {
    // You hit the wrong key
    el.lineInputElement.style.color = "red";
    cancelAudio.play();
    return;
  }
  el.lineInputElement.style.color = "black";
}); //End

el.typeTestList.addEventListener("click", (e) => {
  // get the index from the html
  let index = e.target.dataset.index;
  if (e.ctrlKey) {
    index = parseInt(index);
    if (isNaN(index)) {
      return;
    }
    testIndex = index;

    arrayOfTypeTests.splice(testIndex, 1);
    deleteAudio.play();
    display.showAlert("A test was closed", "success", 1500);

    renderTests();
    return;
  }

  // event delegation
  if (e.target.classList.contains("typeTest")) {
    const element = document.querySelector(".typeTest.active");
    if (element) {
      element.classList.remove("active");
    }

    // add active class
    e.target.classList.add("active");

    // get the index from the html
    let index = e.target.dataset.index;
    index = parseInt(index);
    if (isNaN(index)) {
      return;
    }
    testIndex = index;
    tabAudio.play();

    display.displayTestArea();
    loadTestData();
  }
}); //End

el.lineList.addEventListener("click", (e) => {
  if (!e.ctrlKey) {
    display.showAlert(
      "Hold down the control key and click the trash can to delete!",
      "error",
      2500
    );
    wrongAudio.play();
    return;
  }
  //check if control was down, if so delete
  if (e.ctrlKey) {
    // get the index from the html
    let index = e.target.dataset.index;
    index = parseInt(index);
    if (isNaN(index)) {
      return;
    }

    arrayOfTypeTests[testIndex].arrayOfStrings.splice(index, 1);
    deleteAudio.play();
    display.showAlert("A line was deleted", "success", 1500);

    if (arrayOfTypeTests[testIndex].arrayOfStrings.length === 0) {
      // typeTestStorage.clearFileFromLocalStorage();
      // startUp();
      arrayOfTypeTests[testIndex].arrayOfStrings.push(
        arrayOfTypeTests[testIndex].name
      );
    }
    currentArray = arrayOfTypeTests[testIndex].arrayOfStrings;
    display.paintEditList(currentArray);
    // arrayOfTypeTests[currentArrayIndex].arrayOfStrings =currentArray;
    saveTest(arrayOfTypeTests[testIndex]);
  }
}); //End

// When you click on the edit icon +
el.addShowFormLineEdit.addEventListener("click", (e) => {
  if (!arrayOfTypeTests[testIndex]) {
    return;
  }
  setSkipTestValue();
  clickAudio.play();
  display.paintEditList(currentArray);
  display.showEditSection();
  textNewLine.focus();
}); //End

el.addLineAddBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const newLine = el.textNewLine.value.trim();

  if (!newLine) {
    wrongAudio.play();
    display.showAlert(
      "Please enter a line of text for the Typing test!",
      "error"
    );
    return;
  }

  arrayOfTypeTests[testIndex].arrayOfStrings.push(newLine);

  addTestAudio.play();

  el.lineForm.reset();
  display.showAlert(
    "A new line was added to the typing test.",
    "success",
    1500
  );
  display.paintEditList(currentArray);

  saveTest(arrayOfTypeTests[testIndex]);
}); //End

el.exitEditBtn.addEventListener("click", (e) => {
  this.textNewLine.value = "";
  loadTestData();
  clickAudio.play();
  display.hideEditSection();
  renderTests();
  // display.displayHideTestArea();
}); //End

//Helper Functions ###########################################################

const loadTestData = () => {
  el.lineInputElement.value = "";
  currentArray = arrayOfTypeTests[testIndex].arrayOfStrings;
  currentArrayIndex = 0;
  currentLine = currentArray[currentArrayIndex];
  display.writeLine(currentLine);
  display.writeLineNumber(
    `Line ${currentArrayIndex + 1} of ${currentArray.length}`
  );
}; //End loadTestData()

// create a new array with only the items name
function mapNamesOut(array) {
  const mapedArray = array.map((item) => item.name);
  return mapedArray;
} // End mapNamesOut(array)

// Sort an array by it's name
function sortArrayByName(array) {
  array.sort(function (a, b) {
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names must be eimagePathual
    return 0;
  }); //End sort function
} // End sortArrayByName(array)

const getNewLine = () => {
  // Function to set new line and clear input
  if (currentArrayIndex === currentArray.length - 1) {
    currentArrayIndex = 0;
    currentLine = currentArray[currentArrayIndex];
    display.writeLine(currentLine);
    display.writeLineNumber(
      `Line ${currentArrayIndex + 1} of ${currentArray.length}`
    );
    el.lineInputElement.value = "";
    restartAudio.play();
    display.showAlert("Great Job! Restarting test.", "success", 2000);
  } else {
    currentArrayIndex++;
    currentLine = currentArray[currentArrayIndex];
    display.writeLine(currentLine);
    display.writeLineNumber(
      `Line ${currentArrayIndex + 1} of ${currentArray.length}`
    );
    el.lineInputElement.value = "";
  }
}; //End getNewLine()

// Paint tests
const renderTests = () => {
  display.paintTypeTests(mapNamesOut(arrayOfTypeTests));
};

const setSkipTestValue = () => {
  el.lineInputElement.value = skipValue;
};

// auto load code

// ***************************************************
// ***************************************************
// ***************************************************
// ***************************************************
function getRadioValue(form, name) {
  let val;
  // get list of radio buttons with specified name
  const radios = form.elements[name];
  // loop through list of radio buttons
  for (let i = 0, len = radios.length; i < len; i++) {
    if (radios[i].checked) {
      // radio checked?
      val = radios[i].value; // if so, hold its value in val
      break; // and break out of for loop
    }
  }
  return val; // return value of checked radio or undefined if none checked
}
// *******************************************************// **************************************************
function loadUpSettingsForm() {
  const settingsStorage = new SettingsStorage();
  const settings = settingsStorage.getSettingsFromFile();
  settingsArrayContainer = settings.filePathArray;

  if (settings.type === "typeTest9112022") {
    // set check box
    el.autoLoadCheckBox.checked = settings.autoLoad;

    // check the right font size
    switch (settings.fontSize) {
      case "x-small":
        el.xSmallRadio.checked = true;
        break;
      case "small":
        el.smallRadio.checked = true;
        break;
      case "normal":
        el.normalRadio.checked = true;
        break;
      case "large":
        el.largeRadio.checked = true;
        break;
      case "x-large":
        el.xLargeRadio.checked = true;
        break;
      default:
        console.log("No valid font size");
    }
  }
  // update autoload form ul
  display.showAutoLoadList(settingsArrayContainer);
} // End loadUpSettingsForm()
// ******************************************
function applySettings(settings) {
  el.autoLoadCheckBox.checked = settings.autoLoad;

  switch (settings.fontSize) {
    case "x-small":
      el.root.style.fontSize = "10px";
      break;
    case "small":
      el.root.style.fontSize = "12px";
      break;
    case "normal":
      el.root.style.fontSize = "16px";
      break;
    case "large":
      el.root.style.fontSize = "20px";
      break;
    case "x-large":
      el.root.style.fontSize = "24px";
      break;
    default:
      console.log("No valid font-size");
  }
} // End

// ***********************************************************
// Settings Form Code
// *************************************************************
// When You click on settings form add path to autoload Btn
el.settingsAddPathBtn.addEventListener("click", async (e) => {
  // addImageAudio.play();
  window.api.showOpenDialog();
});

// responding api
window.api.handleAuotLoadPaths((event, fileNames) => {
  if (!fileNames) {
    display.showAlert("Bad file names.", "error", 1500);
    return;
  }
  // push into array of paths
  for (const filePath of fileNames) {
    if (settingsArrayContainer.includes(filePath)) {
      continue;
    } else {
      settingsArrayContainer.push(filePath);
    }
  }
  addImageAudio.play();
  display.showAutoLoadList(settingsArrayContainer);
});

// when You click on save settings Btn
el.saveSettingsSubmitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addAudio.play();

  const fontSizeValue = getRadioValue(el.settingsForm, "fontSize");
  const settingsStorage = new SettingsStorage();
  const settingsObj = new SettingsObj();
  // set the object values
  settingsObj.fontSize = fontSizeValue;
  settingsObj.filePathArray = settingsArrayContainer;
  // set auto load true or false
  settingsObj.autoLoad = el.autoLoadCheckBox.checked;
  // save the object
  settingsStorage.saveSettings(settingsObj);
  addAudio.play();
  // reset form
  el.settingsForm.reset();
  if (settingsObj.autoLoad) {
    // setting the length to Zero emptys the arrays(zero both arrays)
    arrayOfTypeTests.length = 0;
    settingsArrayContainer.length = 0;
    display.hideSettingsForm();
    startUp();
  } else {
    // let settings = settingsStorage.getSettingsFromFile();
    applySettings(settingsObj);
    // hide form
    display.hideSettingsForm();
    renderTests();
    return;
  }
}); // End

// when You click on settings form cancel Btn
el.settingsCancelBtn.addEventListener("click", (e) => {
  cancelAudio.play();
  display.hideSettingsForm();
  renderTests();
});

// when You click on settings form factory reset btn
el.factoryResetBtn.addEventListener("click", (e) => {
  btnAudio.play();
  const settingsStorage = new SettingsStorage();
  settingsStorage.clearFileFromLocalStorage();
  loadUpSettingsForm();
});

// when You click on x to delete a file path
el.autoLoadList.addEventListener("click", (e) => {
  // event delegation
  if (e.target.classList.contains("deleteFile")) {
    if (!e.ctrlKey) {
      wrongAudio.play();
      display.showAlert(
        "You have to hold down ctrl key to make a deletion",
        "error"
      );
      return;
    }

    //check if control was down, if so delete
    if (e.ctrlKey) {
      // this gets the data I embedded into the html
      let dataIndex = e.target.parentElement.parentElement.dataset.index;
      let deleteIndex = parseInt(dataIndex);
      if (isNaN(deleteIndex)) {
        return;
      }
      // delete path
      settingsArrayContainer.splice(deleteIndex, 1);
      warningSelectAudio.play();
      // update Form
      display.showAutoLoadList(settingsArrayContainer);
    }
  }
});
// *************************************************************
//  End Settings Code
// *************************************************************
