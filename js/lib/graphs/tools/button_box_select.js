import * as d3 from "d3";
import { BoxSelect } from "lucide";
import { BaseButton } from "./button_base";

const PATH_COLOR = "lightgrey";
const PATH_BACKGROUND_COLOR = "#F0F0F054";

function pointInPolygon(point, vs) {
  var x = point[0],
    y = point[1];

  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i][0],
      yi = vs[i][1];
    var xj = vs[j][0],
      yj = vs[j][1];

    var intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}
export class BoxSelectButton extends BaseButton {
  coords = [];
  randomString = Math.floor(Math.random() * Date.now() * 10000).toString(36);

  constructor(
    xScale,
    yScale,
    x_value,
    y_value,
    x_translate,
    y_translate,
    selectables,
    callUpdateSelected,
    base,
    selected
  ) {
    super(selected);
    this.xScale = xScale;
    this.yScale = yScale;
    this.x_value = x_value;
    this.y_value = y_value;
    this.x_translate = x_translate;
    this.y_translate = y_translate;
    this.selectables = selectables;
    this.callUpdateSelected = callUpdateSelected;
    this.interationRect = base;

    base.call(this.drag);
  }

  createButton() {
    return super.createButton(BoxSelect);
  }

  updateScales(xScale, yScale) {
    this.xScale = xScale;
    this.yScale = yScale;
  }

  select() {
    super.select();
    this.mode = true;
    this.button.classList.add("mode_positive");
    this.button.classList.remove("mode_negative");
    this.interationRect.call(this.drag);
  }

  unselect() {
    super.unselect();
    this.interationRect.on(".drag", null);
  }

  on_click() {
    if (this.isSelected) this.changeMode();
    super.on_click();
  }

  changeMode() {
    this.mode = !this.mode;
    if (this.mode) {
      this.button.classList.add("mode_positive");
      this.button.classList.remove("mode_negative");
    } else {
      this.button.classList.add("mode_negative");
      this.button.classList.remove("mode_positive");
    }
  }

  drawPath() {
    d3.select("#lasso" + this.randomString)
      .classed("selection_line", this.mode)
      .classed("negative_selection_line", !this.mode)
      .attr("d", d3.line()(this.coords));
  }

  dragStart(event) {
    let mouseX = event.sourceEvent.offsetX;
    let mouseY = event.sourceEvent.offsetY;
    this.startPoint = [mouseX, mouseY];
    this.interationRect.append("path").attr("id", "lasso" + this.randomString);
  }

  dragMove(event) {
    let mouseX = event.sourceEvent.offsetX;
    let mouseY = event.sourceEvent.offsetY;
    const point = [mouseX, mouseY];
    this.coords = [
      this.startPoint,
      [this.startPoint[0], point[1]],
      point,
      [point[0], this.startPoint[1]],
      this.startPoint,
    ];
    this.drawPath();
  }

  dragEnd() {
    let selectedDots = [];

    const X = this.xScale;
    const Y = this.yScale;
    const xV = this.x_value;
    const yV = this.y_value;
    const xT = this.x_translate;
    const yT = this.y_translate;
    const Coords = this.coords;

    d3.selectAll(".selected").each((d) => {
      selectedDots.push(d);
    });

    this.selectables.classed("selected", (d) => {
      let point = [X(d[xV]) + xT, Y(d[yV]) + yT];
      if (this.mode) {
        if (
          pointInPolygon(point, Coords) ||
          selectedDots.find((e) => e === d)
        ) {
          return true;
        }
      } else {
        if (
          !pointInPolygon(point, Coords) &&
          selectedDots.find((e) => e === d)
        ) {
          return true;
        }
      }
    });

    d3.select("#lasso" + this.randomString).remove();
    this.callUpdateSelected();
  }

  drag = d3
    .drag()
    .on("start", this.dragStart.bind(this))
    .on("drag", this.dragMove.bind(this))
    .on("end", this.dragEnd.bind(this));
}
