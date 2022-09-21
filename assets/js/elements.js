class Elements {
  constructor() {
    // Interactive elements
    this.lineOutputElement = document.querySelector("#lineOutput");
    this.lineInputElement = document.querySelector("#lineInput");
    this.lineNumberElement = document.querySelector("#lineNumber");
    // select message display
    this.messageDisplay = document.querySelector("#displayMessage");
    // select message border
    this.messageBorder = document.querySelector("#modalBorder");
    // select the lists
    this.typeTestList = document.querySelector("#typeTestList");
    this.lineList = document.querySelector("#lineList");
    // select heading
    this.editHeading = document.querySelector("#editHeading");
    //select Areas
    this.headArea = document.querySelector("#headArea");
    this.testArea = document.querySelector("#testArea");
    this.editArea = document.querySelector("#editArea");
    // select add show forms + / icon
    this.addShowFormLineEdit = document.querySelector("#lineEdit");
    // Buttons
    this.addLineAddBtn = document.querySelector("#addLineAddBtn");
    this.exitEditBtn = document.querySelector("#exitEditBtn");
    //Form
    this.lineForm = document.querySelector("#lineForm");
    // Text Inputs
    this.textNewLine = document.querySelector("#textNewLine");
    // root for font size
    this.root = document.querySelector(":root");
    // auto load elements
    this.xSmallRadio = document.querySelector("#xSmallRadio");
    this.smallRadio = document.querySelector("#smallRadio");
    this.normalRadio = document.querySelector("#normalRadio");
    this.largeRadio = document.querySelector("#largeRadio");
    this.xLargeRadio = document.querySelector("#xLargeRadio");
    // settings
    this.saveSettingsSubmitBtn = document.querySelector(
      "#saveSettingsSubmitBtn"
    );
    this.settingsCancelBtn = document.querySelector("#settingsCancelBtn");
    this.factoryResetBtn = document.querySelector("#factoryResetBtn");
    this.settingsAddPathBtn = document.querySelector("#settingsAddPathBtn");
    this.autoLoadCheckBox = document.querySelector("#autoLoadCheckBox");
    this.settingsForm = document.querySelector("#settingsForm");
    this.autoLoadList = document.querySelector("#autoLoadList");
    // modal
    this.saveEditedNoteBtn = document.querySelector("#saveEditedNoteBtn");
    this.editNoteCloseBtn = document.querySelector("#editNoteCloseBtn");
    this.noteModalTextArea = document.querySelector("#noteModalTextArea");
  }
}
