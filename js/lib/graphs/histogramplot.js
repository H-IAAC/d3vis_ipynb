import * as d3 from "d3";

export function histogramplot(data, x_axis, xStart, xEnd, element, that) {
  var customHeight = 375;
  var customWidth = 720;
  if (element) {
    element = document.getElementById(element)
    customWidth = element.clientWidth;
    customHeight = element.clientHeight;
  } else {
    element = that.el;
  }
  d3.select(element).selectAll("*").remove();

  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = customWidth - margin.left - margin.right;
  const height = customHeight - margin.top - margin.bottom;

  let xMin = xStart;
  if (!xStart) {
    xMin = d3.min(data, (d) => d[x_axis]);
  }
  let xMax = xEnd;
  if (!xEnd) {
    xMax = d3.max(data, (d) => d[x_axis]);
  }

  const x = d3.scaleLinear().range([0, width]);

  const y = d3.scaleLinear().range([height, 0]);

  const xAxis = d3.axisBottom(x);

  const yAxis = d3.axisLeft(y);

  const bins = d3
    .bin()
    .thresholds(40)
    .value((d) => Math.round(d[x_axis] * 10) / 10)(data);

  const svg = d3
    .select(element)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain([xMin, xMax]);
  y.domain([0, d3.max(bins, (d) => d.length)]);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end");

  svg
    .append("g")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end");

  svg
    .append("g")
    .attr("fill", "steelblue")
    .selectAll()
    .data(bins)
    .join("rect")
    .attr("x", (d) => x(d.x0) + 1)
    .attr("width", (d) => x(d.x1) - x(d.x0) - 1)
    .attr("y", (d) => y(d.length))
    .attr("height", (d) => y(0) - y(d.length));
}
