class Display {
  constructor(elements, $) {
    this.elements = elements;
    //JQuery
    this.$ = $;
    this.tabColorIndex = 0;
    this.tabColors = [
      "#2de11d",
      "#4848e8",
      "#e84d4d",
      "Orange",
      "Violet",
      "#820ee8",
      "#8e7fc7",
      "#ff008b",
      "#4dc6e8",
      "#17abf5",
      "#4c69bd",
      "#e251dc",
      "#bbb70e",
    ];
  } // End constructor

  //Method
  displayNone(element) {
    this.$(element).slideUp("slow");
  } // End displayNone(element)

  //Method
  displayBlock(element) {
    this.$(element).slideDown("slow");
  } // End displayBlock(element)

  //Method
  clearTypeTestDisplay() {
    this.elements.typeTestList.innerHTML = "";
  } // End

  clearEditList() {
    this.elements.lineList.innerHTML = "";
  }

  writeLine(text) {
    this.elements.lineOutputElement.textContent = text;
  }

  writeLineNumber(text) {
    this.elements.lineNumberElement.textContent = text;
  }

  displayTestArea() {
    this.displayNone(this.elements.typeTestForm);
    this.displayNone(this.elements.testArea);
    this.displayBlock(this.elements.testArea);
  }

  paintTypeTests(mappedArray) {
    this.clearTypeTestDisplay();
    this.hideEditSection();
    this.displayNone(this.elements.testArea);
    this.hideSettingsForm();
    // make variable for html
    let html = "";

    mappedArray.forEach((element, index) => {
      html += `<li data-index="${index}" class="typeTest">${element}</li>`;
    });
    this.elements.typeTestList.innerHTML = html;

    this.displayBlock(this.elements.catList);
    // color tabs
    let tabList = document.getElementsByClassName("typeTest");
    this.colorSetOfTabs(tabList);
  }

  paintEditList(array) {
    this.clearEditList();

    this.displayNone(this.elements.lineList);

    let html = "";

    array.forEach((element, index) => {
      html += `<li  class="liLine"><span title='Delete'><i class="fas fa-trash-alt deleteLine" data-index="${index}"></i></span>${element}</li>`;
    });
    this.elements.lineList.innerHTML = html;

    this.displayBlock(this.elements.lineList);
  }

  //Method
  showEditSection() {
    this.displayNone(this.elements.headArea);
    this.displayNone(this.elements.testArea);
    this.displayBlock(this.elements.editArea);
  } // End showEditSection

  //Method
  hideEditSection() {
    this.displayNone(this.elements.editArea);
    this.displayBlock(this.elements.headArea);
    // this.displayBlock(this.elements.testArea);
  } // End hideEditSection

  // autoload ############################
  //Method
  showSettingsForm() {
    this.displayNone(this.elements.headArea);
    this.displayNone(this.elements.testArea);
    this.displayNone(this.elements.editArea);
    this.displayBlock(this.elements.settingsForm);
  } // End showEditSection

  //Method
  hideSettingsForm() {
    this.displayNone(this.elements.settingsForm);
    this.displayBlock(this.elements.headArea);
    // this.displayBlock(this.elements.testArea);
  } // End hideEditSection

  //Method
  clearAutoLoadUL() {
    // clear the ul
    this.elements.autoLoadList.innerHTML = "";
  } // End clearAutoLoadUL()

  //Method
  showAutoLoadList(autoLoadArray) {
    // clear the ul
    this.clearAutoLoadUL();
    // make variable for html
    let html = "";
    autoLoadArray.forEach((element, index) => {
      html += `<li data-index="${index}" class="autoLoad"><span title='Delete'><i class="fas fa-trash-alt deleteFile"></i></span>${element}</li>`;
    });
    this.elements.autoLoadList.innerHTML = html;
  }

  //Method
  colorSetOfTabs(htmlCollection) {
    for (const item of htmlCollection) {
      item.style.backgroundColor = this.tabColors[this.tabColorIndex];
      if (this.tabColorIndex === this.tabColors.length - 1) {
        this.tabColorIndex = 0;
      } else {
        this.tabColorIndex++;
      }
    }
  } // End colorSetOfTabs(htmlCollection)

  // Method
  showAlert(message, className, displayTime = 4000) {
    if (className === "success") {
      // remove error
      this.elements.messageDisplay.classList.remove("error");
      // add success
      this.elements.messageDisplay.classList.add("success");
      // remove red border
      this.elements.messageBorder.classList.remove("redBorder");
      // add green border
      this.elements.messageBorder.classList.add("greenBorder");
    } else {
      // remove success
      this.elements.messageDisplay.classList.remove("success");
      // add error
      this.elements.messageDisplay.classList.add("error");
      // remove green border
      this.elements.messageBorder.classList.remove("greenBorder");
      // add red border
      this.elements.messageBorder.classList.add("redBorder");
    }
    this.elements.messageDisplay.textContent = message;
    $("#myMessageModal").modal("hide");
    $("#myMessageModal").modal("show");
    setTimeout(() => {
      $("#myMessageModal").modal("hide");
    }, displayTime);
  } // End showAlert()
}
