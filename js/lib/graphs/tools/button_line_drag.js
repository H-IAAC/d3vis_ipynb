import * as d3 from "d3";
import { MoveHorizontal } from "lucide";
import { BaseButton } from "./button_base";

export class LineDragButton extends BaseButton {
  constructor(
    x_translate,
    y_translate,
    referenceLines,
    paths,
    callUpdateSelected,
    base,
    selected
  ) {
    super(selected);
    this.x_translate = x_translate;
    this.y_translate = y_translate;
    this.referenceLines = referenceLines;
    this.paths = paths;
    this.callUpdateSelected = callUpdateSelected;
    this.interationRect = base;

    this.numPaths = this.paths.data().length;
    this.pathsData = {};
    this.markLines = {};
    this.referenceLines.data().forEach((line) => {
      this.markLines[line.feature_names] = {
        x: [],
      };
      this.pathsData[line.feature_names] = {};
      this.paths.data().forEach((path) => {
        let index;
        for (let position of path) {
          if (position.index !== undefined) {
            index = position.index;
            continue;
          }
          if (line.feature_names === position.feature_names) {
            this.pathsData[line.feature_names][index] = position.x;
            this.markLines[line.feature_names]["y"] = position.y;
            break;
          }
        }
      });
    });
  }

  createButton() {
    return super.createButton(MoveHorizontal);
  }

  select() {
    super.select();
    this.referenceLines
      .attr("visibility", "")
      .on("click", this.on_reference_click.bind(this))
      .call(this.drag);
  }

  unselect() {
    super.unselect();
    this.referenceLines
      .attr("visibility", "hidden")
      .on("click", null)
      .on(".drag", null);
    this.clearAllLines();
  }

  clearAllLines() {
    for (let value of Object.values(this.markLines)) {
      value.x = [];
    }
    this.interationRect.selectAll(".mark_line").remove();
  }

  clearLines(reference) {
    this.interationRect.selectAll(".mark_line." + reference).remove();
  }

  insideRange(value, range) {
    return value >= range[0] && value <= range[1];
  }

  calculateIncludedIndexes() {
    let indexes = [];
    for (let i = 0; i < this.numPaths; i++) indexes.push(i);

    for (let feature_name of Object.keys(this.markLines)) {
      let featureIndexes = [];
      const positions = this.pathsData[feature_name];

      const ranges = this.markLines[feature_name].x;
      if (ranges.length) {
        ranges.forEach((range) => {
          for (let index of Object.keys(positions)) {
            if (this.insideRange(positions[index], range)) {
              featureIndexes.push(parseInt(index));
            }
          }
        });
      }

      if (feature_name === this.currentReference && this.coords) {
        const currentMark = [this.coords[0][0], this.coords[1][0]].sort(
          (a, b) => a - b
        );
        for (let index of Object.keys(positions)) {
          if (this.insideRange(positions[index], currentMark)) {
            featureIndexes.push(parseInt(index));
          }
        }
      }

      if (
        ranges.length ||
        (feature_name === this.currentReference && this.coords)
      ) {
        indexes = indexes.filter((value) => featureIndexes.includes(value));
      }
    }

    this.callUpdateSelected(indexes);
  }

  on_reference_click(event, d) {
    this.markLines[d.feature_names].x = [];
    this.clearLines(d.feature_names.replace(/\s+/g, ""));
    this.coords = null;
    this.calculateIncludedIndexes();
  }

  dragStart(event, d) {
    let mouseX = event.sourceEvent.offsetX;
    this.coords = [
      [mouseX - this.x_translate, this.markLines[d.feature_names].y],
      [mouseX - this.x_translate, this.markLines[d.feature_names].y],
    ];
    this.currentReference = d.feature_names;
    this.newMark = this.interationRect
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 3)
      .attr("class", "mark_line " + d.feature_names.replace(/\s+/g, ""));
  }

  dragMove(event) {
    let mouseX = event.sourceEvent.offsetX;
    this.coords[1][0] = mouseX - this.x_translate;
    this.newMark.attr("d", d3.line()(this.coords));
    this.calculateIncludedIndexes();
  }

  dragEnd(event, d) {
    const line = [this.coords[0][0], this.coords[1][0]].sort((a, b) => a - b);
    this.markLines[d.feature_names].x.push(line);
  }

  drag = d3
    .drag()
    .on("start", this.dragStart.bind(this))
    .on("drag", this.dragMove.bind(this))
    .on("end", this.dragEnd.bind(this));
}
