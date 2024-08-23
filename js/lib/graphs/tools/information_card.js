export class InformationCard {
  constructor(parent) {
    this.card = document.createElement("div");
    this.card.style.display = "none";
    this.card.classList.add("information_card");
    this.cardBody = document.createElement("div");
    this.card.appendChild(this.cardBody);
    parent.appendChild(this.card);
  }

  showText(text, x, y) {
    this.cardBody.innerHTML = text;
    this.card.style.display = "block";
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.card.style.visibility = "visible";
      this.card.style.left = x + 5 - this.card.clientWidth / 2 + "px";
      this.card.style.top = y - 50 + "px";
    }, 10);
  }

  hide() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.cardBody.innerHTML = "";
      this.card.style.display = "none";
      this.card.style.visibility = "hidden";
    }, 10);
  }
}
