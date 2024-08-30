import * as d3 from "d3";
import { BasePlot } from "./baseplot";
import { HistogramPlot } from "./histogramplot";

export class RidgelinePlot extends BasePlot {
  histList;

  getXDomain(data, x_axes) {
    let domains = [];
    for (const x_axis of x_axes) {
      const newDomain = d3.extent(data, function (d) {
        return d[x_axis];
      });
      domains = domains.concat(newDomain);
    }

    return d3.extent(domains);
  }

  plot(data, x_axes, width, height, margin, noAxes) {
    d3.select(this.element).selectAll("*").remove();

    const numAxes = x_axes.length;
    const histHeight = height / numAxes;

    this.init(width, height, margin);

    const SVG = this.svg;
    const GG = this.gGrid;

    const xDomain = this.getXDomain(data, x_axes);
    const X = this.getXLinearScale(xDomain, width, margin);
    const Y = this.getYBandScale(x_axes, height, margin, [0.2]);

    if (!noAxes) this.plotAxes(GG, X, Y);

    this.histList = [];
    for (let i = 0; i < numAxes; i++) {
      const x_axis = x_axes[i];
      const histPlot = new HistogramPlot(this.element);
      this.histList.push(histPlot);
      const histMargin = structuredClone(margin);
      histMargin.bottom = margin.bottom + i * histHeight;
      histMargin.top = margin.top + (numAxes - i - 1) * histHeight;
      const newGG = GG.append("g").attr(
        "transform",
        "translate(0," + (histMargin.top - margin.top) + ")"
      );
      histPlot.plot(data, x_axis, width, height, histMargin, true, newGG, X);
    }
  }
}
