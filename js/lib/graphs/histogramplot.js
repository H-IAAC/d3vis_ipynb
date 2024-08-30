import * as d3 from "d3";
import { BasePlot } from "./baseplot";

export class HistogramPlot extends BasePlot {
  plot(data, x_axis, width, height, margin, noAxes, gGrid, xScale) {
    const bins = d3
      .bin()
      .thresholds(40)
      .value((d) => Math.round(d[x_axis] * 10) / 10)(data);

    let GG;
    if (gGrid) GG = gGrid;
    else {
      this.init(width, height, margin);
    GG = this.gGrid;}

    let X;
    if (xScale) X = xScale;
    else {
      const xDomain = d3.extent(data, function (d) {
        return d[x_axis];
      });
      X = this.getXLinearScale(xDomain, width, margin);
    }

    const yDomain = [0, d3.max(bins, (d) => d.length)];
    const Y = this.getYLinearScale(yDomain, height, margin);

    GG.append("g")
      .attr("fill", "steelblue")
      .selectAll()
      .data(bins)
      .join("rect")
      .attr("x", (d) => X(d.x0) + 1)
      .attr("width", (d) => X(d.x1) - X(d.x0) - 1)
      .attr("y", (d) => Y(d.length))
      .attr("height", (d) => Y(0) - Y(d.length));

    if (!noAxes) this.plotAxes(GG, X, Y, x_axis);
  }

  replot(data, x_axis, width, height, margin, noAxes, gGrid, xScale) {
    this.clear();
    this.plot(data, x_axis, width, height, margin, noAxes, gGrid, xScale);
  }
}
