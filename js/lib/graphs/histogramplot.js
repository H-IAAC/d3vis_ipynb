import * as d3 from "d3";

export function histogramplot(
  data,
  x_axis,
  xStart,
  xEnd,
  element,
  width,
  height,
  margin
) {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  d3.select(element).selectAll("*").remove();

  let xMin = xStart;
  if (!xStart) {
    xMin = d3.min(data, (d) => d[x_axis]);
  }
  let xMax = xEnd;
  if (!xEnd) {
    xMax = d3.max(data, (d) => d[x_axis]);
  }

  const x = d3.scaleLinear().range([0, innerWidth]);

  const y = d3.scaleLinear().range([innerHeight, 0]);

  const xAxis = d3.axisBottom(x);

  const yAxis = d3.axisLeft(y);

  const bins = d3
    .bin()
    .thresholds(40)
    .value((d) => Math.round(d[x_axis] * 10) / 10)(data);

  const svg = d3
    .select(element)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain([xMin, xMax]);
  y.domain([0, d3.max(bins, (d) => d.length)]);

  svg
    .append("g")
    .attr("transform", "translate(0," + innerHeight + ")")
    .call(xAxis)
    .append("text")
    .attr("x", innerWidth)
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
