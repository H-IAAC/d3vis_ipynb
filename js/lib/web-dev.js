import { histogramplot } from "./graphs/histogramplot";

function addComponent() {
  const data = [
    { x_axis: 2, y_axis: 3 },
    { x_axis: 2.32, y_axis: 3.5 },
    { x_axis: 2.34, y_axis: 3.1 },
    { x_axis: 2.555, y_axis: 3.8 },
    { x_axis: 2.56, y_axis: 4 },
    { x_axis: 2.57, y_axis: 4 },
    { x_axis: 3, y_axis: 4 },
    { x_axis: 4, y_axis: 5 },
    { x_axis: 4, y_axis: 5 },
    { x_axis: 4, y_axis: 5 },
    { x_axis: 4, y_axis: 5 },
    { x_axis: 4, y_axis: 5 },
    { x_axis: 4, y_axis: 5 },
    { x_axis: 5, y_axis: 7 },
    { x_axis: 5, y_axis: 7 },
    { x_axis: 5, y_axis: 7 },
    { x_axis: 5, y_axis: 7 },
    { x_axis: 6, y_axis: 4 },
  ];
  const element = document.createElement("div");
  element.id = "component";
  element.style.width = "600px";
  element.style.height = "300px";
  document.body.appendChild(element);

  const that = this;
  const x = "x_axis";
  const start = false;
  const end = false;

  histogramplot(data, x, start, end, "component", that);
}

addComponent();
