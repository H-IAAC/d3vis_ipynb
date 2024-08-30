import * as d3 from "d3";

export class BasePlot {
  element;

  constructor(element) {
    this.element = element;
  }

  clear() {
    d3.select(this.element).selectAll("*").remove();
  }

  init(width, height, margin) {
    this.svg = d3
      .select(this.element)
      .append("svg")
      .attr("width", width - 2)
      .attr("height", height)
      .attr("class", "graph");

    this.gGrid = this.svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }

  getXLinearScale(domain, width, margin) {
    const innerWidth = width - margin.left - margin.right;
    const scale = d3.scaleLinear().range([0, innerWidth]);
    scale.domain(domain).nice();

    return scale;
  }

  getYLinearScale(domain, height, margin) {
    const innerHeight = height - margin.top - margin.bottom;
    const scale = d3.scaleLinear().range([innerHeight, 0]);
    scale.domain(domain).nice();

    return scale;
  }

  getXBandScale(x_values, width, margin, padding) {
    const innerWidth = width - margin.left - margin.right;
    const scale = d3.scaleBand().range([0, innerWidth]);
    scale.domain(x_values).padding(padding);

    return scale;
  }

  getYBandScale(y_values, height, margin, padding) {
    const innerHeight = height - margin.top - margin.bottom;
    const scale = d3.scaleBand().range([innerHeight, 0]);
    scale.domain(y_values).padding(padding);

    return scale;
  }

  plotAxes(svg, xScale, yScale, xLabel, yLabel) {
    const width = xScale.range()[1];
    const height = yScale.range()[0];

    const xAxis = svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

    xAxis
      .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .attr("fill", "black")
      .text(xLabel);

    const yAxis = svg
      .append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale));

    yAxis
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .attr("fill", "black")
      .text(yLabel);

    return [xAxis, yAxis];
  }
}
