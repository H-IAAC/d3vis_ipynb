export class SideBar {
  static SIDE_BAR_WIDTH = 32;

  constructor(element, ...buttons) {
    this.buttons = buttons
    this.sideBar = document.createElement("div");
    this.sideBar.style.width = SideBar.SIDE_BAR_WIDTH + "px";
    this.sideBar.className = "side_bar";
    this.sideBar.setAttribute("display", "flex");
    this.sideBar.setAttribute("flex-direction", "column");
    this.sideBar.setAttribute("justify-content", "flex-start");
    element.appendChild(this.sideBar);
    for (let b of buttons) {
      const button = b.createButton();
      b.addClickNotification(this.notifyOtherButtons.bind(this));
      this.sideBar.appendChild(button);
    }
  }

  notifyOtherButtons(button) {
    for (let b of this.buttons) {
      if (b != button) b.notified();
    }
  }
}
