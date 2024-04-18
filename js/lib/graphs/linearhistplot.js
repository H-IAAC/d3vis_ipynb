import * as d3 from "d3";

export function linearhistplot(
  linearData_x,
  linearData_y,
  histogramData,
  element,
  setValue,
  width,
  height,
  margin
) {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const heightHist = innerHeight / 4;

  d3.select(element).selectAll("*").remove();

  const xMin = Math.min(d3.min(linearData_x), d3.min(histogramData));
  const xMax = Math.max(d3.max(linearData_x), d3.max(histogramData));

  const x = d3.scaleLinear().range([0, innerWidth]);

  const y = d3.scaleLinear().range([innerHeight, 0]);
  const yHist = d3.scaleLinear().range([heightHist, 0]);

  const xAxis = d3.axisBottom(x);

  const yAxis = d3.axisLeft(y);

  function mouseover(event, d) {
    focus.style("opacity", 1);
    focusText.style("opacity", 1);
    focus.attr("x", event.offsetX - 30).attr("y", event.offsetY - 40);
    focusText
      .html(
        "x:" +
          Math.round(d["x"] * 10) / 10 +
          "  -  " +
          "y:" +
          Math.round(d["y"] * 10) / 10
      )
      .attr("x", event.offsetX - 15)
      .attr("y", event.offsetY - 20);
  }

  function mouseout() {
    focus.style("opacity", 0);
    focusText.style("opacity", 0);
  }

  function mouseClick(event, d) {
    const text =
      "x:" +
      Math.round(d["x"] * 10) / 10 +
      "  -  " +
      "y:" +
      Math.round(d["y"] * 10) / 10;
    if (setValue !== undefined) {
      setValue(text);
    }
  }

  const bins = d3
    .bin()
    .thresholds(20)
    .value((d) => Math.round(d * 10) / 10)(histogramData);

  const svg = d3
    .select(element)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain([xMin, xMax]);
  y.domain(d3.extent(linearData_y));
  yHist.domain([0, d3.max(bins, (d) => d.length)]);

  const focus = svg
    .append("g")
    .append("rect")
    .style("fill", "none")
    .attr("width", 160)
    .attr("height", 40)
    .attr("stroke", "#69b3a2")
    .attr("stroke-width", 4)
    .style("opacity", 0);

  const focusText = svg
    .append("g")
    .append("text")
    .style("opacity", 0)
    .attr("text-anchor", "left")
    .attr("alignment-baseline", "middle");

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

    const firstPathPoint = []
    firstPathPoint['x0'] = bins[0]['x0'] - 2.5
    firstPathPoint['x1'] = bins[0]['x1'] - 2.5
    bins.unshift(firstPathPoint)
    const lastPathPoint = []
    lastPathPoint['x0'] = bins[bins.length - 1]['x0'] + 2.5
    lastPathPoint['x1'] = bins[bins.length - 1]['x1'] + 2.5

  svg
    .append("path")
    .datum(bins)
    .attr("fill", "paleturquoise")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1)
    .attr(
      "d",
      d3
        .line()
        .x((d) => x((d.x1 + d.x0) / 2))
        .y((d) => yHist(d.length) + innerHeight - heightHist)
        .curve(d3.curveCatmullRom)
    );

  const coords = linearData_x
    .map((v, i) => [v, linearData_y[i]])
    .map(([x, y]) => ({ x, y }));

  svg
    .append("path")
    .datum(coords)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x((d) => x(d["x"]))
        .y((d) => y(d["y"]))
    );

  svg
    .selectAll("myCircles")
    .data(coords)
    .enter()
    .append("circle")
    .attr("fill", "red")
    .attr("stroke", "none")
    .attr("cx", (d) => x(d["x"]))
    .attr("cy", (d) => y(d["y"]))
    .attr("r", 3)
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
    .on("click", mouseClick);
}
