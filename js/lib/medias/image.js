export class Image {
  constructor(element) {
    this.element = element;
  }

  plot(value, format, wildth, height) {
    if (wildth) this.width = wildth;
    if (height) this.height = height;

    const node = document.createElement("div");
    const image = document.createElement("img");

    const type = `image/${format}`;
    const blob = new Blob([value], {
      type: type,
    });
    const url = URL.createObjectURL(blob);

    const oldurl = this.src;
    this.src = url;
    if (oldurl) {
      URL.revokeObjectURL(oldurl);
    }

    image.setAttribute("src", this.src);
    image.setAttribute("type", type);
    image.style.maxWidth = "100%";
    image.style.maxHeight = "100%";
    image.style.margin = "auto";
    image.style.display = "block";

    node.style.width = this.width + "px";
    node.style.height = this.height + "px";
    node.appendChild(image);

    this.element.appendChild(node);
  }

  replot(params) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.element.innerHTML = "";
      this.plot(...params);
    }, 100);
  }
}
