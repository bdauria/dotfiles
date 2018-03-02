'use babel';

//*********************** Not Used *********************************************

export default class Angular2ComponentGeneratorView {

  constructor(serializedState) {
    // // Create root element
    // var self = this;
    // this.element = document.createElement('div');
    // this.element.classList.add('angular2-component-generator');
    //
    // // Create message element
    // const message = document.createElement('div');
    // message.textContent = 'The Angular2ComponentGenerator package is Alive! It\'s ALIVE!';
    // message.classList.add('message');
    // this.element.appendChild(message);
    // message2 = document.createElement('input');
    //
    // message2.classList.add('.find-and-replace');
    // message2.classList.add('input-block');
    // message2.classList.add('native-key-bindings');
    //
    // message2.addEventListener("keyup", (event) => {
    //     event.preventDefault();
    //     if (event.keyCode == 13) {
    //         // document.getElementById("id_of_button").click();
    //         console.log('enter');
    //         self.element.onClose(event.target.value);
    //     }
    //   });
    //
    // this.element.appendChild(message2);

  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  // onClose() {
  //
  // }

}
