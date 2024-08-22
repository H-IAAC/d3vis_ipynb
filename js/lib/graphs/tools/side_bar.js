import { createElement, Menu } from "lucide";
export const SIDE_BAR_WIDTH = 32;

export function addSideBar(element, ...buttons) {
  const sideBar = document.createElement("div");
  sideBar.style.width = SIDE_BAR_WIDTH + "px"
  sideBar.className = "side_bar";
  sideBar.setAttribute("display", "flex");
  sideBar.setAttribute("flex-direction", "column");
  sideBar.setAttribute("justify-content", "flex-start");
  element.appendChild(sideBar);
  for (let b of buttons) {
    const button = b.createButton();
    sideBar.appendChild(button);
  }
}
