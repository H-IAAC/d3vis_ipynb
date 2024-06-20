import * as d3 from "d3";
import { Base } from "./base";

export class HistogramPlot extends Base {
  xScale;
  yScale;

  createScales(data, x_axis, xStart, xEnd, width, height, bins) {
    this.xScale = d3.scaleLinear().range([0, width]);
    this.yScale = d3.scaleLinear().range([height, 0]);

    let xMin = xStart;
    if (!xStart) {
      xMin = d3.min(data, (d) => d[x_axis]);
    }
    let xMax = xEnd;
    if (!xEnd) {
      xMax = d3.max(data, (d) => d[x_axis]);
    }

    this.xScale.domain([xMin, xMax]);
    this.yScale.domain([0, d3.max(bins, (d) => d.length)]);
  }

  plot(data, x_axis, xStart, xEnd, width, height, margin, hasAxes) {
    d3.select(this.element).selectAll("*").remove();

    const bins = d3
      .bin()
      .thresholds(40)
      .value((d) => Math.round(d[x_axis] * 10) / 10)(data);

    this.createSvg(width, height, margin);
    this.createScales(
      data,
      x_axis,
      xStart,
      xEnd,
      this.innerWidth,
      this.innerHeight,
      bins
    );

    const SVG = this.svg;
    const X = this.xScale;
    const Y = this.yScale;

    if (hasAxes) this.plotAxes(SVG, this.innerWidth, this.innerHeight, X, Y);

    SVG.append("g")
      .attr("fill", "steelblue")
      .selectAll()
      .data(bins)
      .join("rect")
      .attr("x", (d) => X(d.x0) + 1)
      .attr("width", (d) => X(d.x1) - X(d.x0) - 1)
      .attr("y", (d) => Y(d.length))
      .attr("height", (d) => Y(0) - Y(d.length));
  }
}
