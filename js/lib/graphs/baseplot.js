import * as d3 from "d3";
import { WIDGET_MARGIN } from "../base";

export class BasePlot {
  element;

  constructor(element) {
    this.element = element;
    this.margin = WIDGET_MARGIN;
  }

  replot(params) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      d3.select(this.element).selectAll("*").remove();
      this.plot(...params);
    }, 100);
  }

  init(width, height) {
    this.svg = d3
      .select(this.element)
      .append("svg")
      .attr("width", width - 2)
      .attr("height", height)
      .attr("class", "graph");

    this.gGrid = this.svg
      .append("g")
      .attr(
        "transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")"
      );
  }

  getXLinearScale(domain, width, leftPadding = 0) {
    const innerWidth = width - this.margin.left - this.margin.right;
    const scale = d3.scaleLinear().range([leftPadding, innerWidth]);
    scale.domain(domain).nice();

    return scale;
  }

  getYLinearScale(domain, height, topPadding = 0) {
    const innerHeight = height - this.margin.top - this.margin.bottom;
    const scale = d3.scaleLinear().range([innerHeight, topPadding]);
    scale.domain(domain).nice();

    return scale;
  }

  getXBandScale(x_values, width, padding, leftPadding = 0) {
    const innerWidth = width - this.margin.left - this.margin.right;
    const scale = d3.scaleBand().range([leftPadding, innerWidth]);
    scale.domain(x_values).padding(padding);

    return scale;
  }

  getYBandScale(y_values, height, padding, topPadding = 0) {
    const innerHeight = height - this.margin.top - this.margin.bottom;
    const scale = d3.scaleBand().range([innerHeight, topPadding]);
    scale.domain(y_values).padding(padding);

    return scale;
  }

  plotAxes(svg, xScale, yScale, xLabel, yLabel, xAxisFormater, yAxisFormater) {
    const width = xScale.range()[1];
    const height = yScale.range()[0];

    const yAxisGenerator = d3.axisLeft(yScale);

    if (yAxisFormater) {
      yAxisFormater(yAxisGenerator);
    }

    const yAxis = svg.append("g").attr("class", "y axis").call(yAxisGenerator);

    const tickText = yAxis.selectAll(".tick text");

    let maxWidth = 0;

    tickText.each(function () {
      const bbox = this.getBBox();
      maxWidth = Math.max(maxWidth, bbox.width);
    });

    yAxis
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dx", -yScale.range()[1])
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .attr("fill", "black")
      .text(yLabel);

    const xRange = xScale.range();
    xRange[0] += maxWidth;
    xScale.range(xRange);

    yAxis.attr("transform", "translate(" + xScale.range()[0] + ",0)");

    const xAxisGenerator = d3.axisBottom(xScale);

    if (xAxisFormater) {
      xAxisFormater(xAxisGenerator);
    }

    const xAxis = svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxisGenerator);

    xAxis
      .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .attr("fill", "black")
      .text(xLabel);

    return [xAxis, yAxis];
  }
}
