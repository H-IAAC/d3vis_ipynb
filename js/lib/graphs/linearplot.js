import * as d3 from "d3";
import { lasso } from "../tools/lasso";
import { getDataMeans, groupArrayBy } from "../tools/group_data";

export function linearplot(
  data,
  x_value,
  y_value,
  hue,
  element,
  setValue,
  setSelectedValues,
  width,
  height,
  margin
) {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  data = getDataMeans(data, x_value, [y_value], hue);

  for (let i = 0; i < data.length; i++) {
    data[i]["id"] = i;
  }

  const randomString = Math.floor(Math.random() * Date.now() * 10000).toString(
    36
  );

  d3.select(element).selectAll("*").remove();

  const x = d3.scaleLinear().range([0, innerWidth]);

  const y = d3.scaleLinear().range([innerHeight, 0]);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const xAxis = d3.axisBottom(x);

  const yAxis = d3.axisLeft(y);

  function mouseover(event, d) {
    focus.style("opacity", 1);
    focusText.style("opacity", 1);
    focus.attr("x", event.offsetX - 30).attr("y", event.offsetY - 40);
    focusText
      .html(
        "x: " +
          Math.round(d[x_value] * 10) / 10 +
          "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
          "y: " +
          Math.round(d[y_value] * 10) / 10
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
      Math.round(d[x_value] * 10) / 10 +
      "    " +
      "y:" +
      Math.round(d[y_value] * 10) / 10;
    if (setValue !== undefined) {
      setValue(text);
    }
  }

  const svg = d3
    .select(element)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(
    d3.extent(data, function (d) {
      return d[x_value];
    })
  ).nice();
  y.domain(
    d3.extent(data, function (d) {
      return d[y_value];
    })
  ).nice();

  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + innerHeight + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", innerWidth)
    .attr("y", -6)
    .style("text-anchor", "end");

  svg
    .append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end");

  function addPath(datum, colorSelector) {
    svg
    .append("path")
    .datum(datum)
    .attr("fill", "none")
    .attr("stroke", color(colorSelector))
    .attr("stroke-width", 2)
    .attr(
      "d",
      d3
        .line()
        .x((d) => x(d[x_value]))
        .y((d) => y(d[y_value]))
    );
  }

  if(!hue){
    addPath(data)
  }else {
    const groupedByHue = groupArrayBy(data, hue)
    Object.keys(groupedByHue).forEach(function(key, index) {
      addPath(groupedByHue[key], key)
    })
  }

  svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("id", function (d, i) {
      return "dot-" + randomString + d.id;
    })
    .attr("class", "dot")
    .attr("r", 3.5)
    .attr("cx", function (d) {
      return x(d[x_value]);
    })
    .attr("cy", function (d) {
      return y(d[y_value]);
    })
    .style("fill", function (d) {
      return color(d[hue]);
    })
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
    .on("click", mouseClick);

  function resetColor() {
    svg
      .selectAll(".dot")
      .data(data)
      .attr("r", 3.5)
      .style("fill", function (d) {
        return color(d[hue]);
      });
  }

  function setLassoValues(values) {
    if (setSelectedValues !== undefined) {
      setSelectedValues(values);
    }
  }

  lasso(
    element,
    x,
    y,
    x_value,
    y_value,
    margin.left,
    margin.top,
    resetColor,
    setLassoValues,
    randomString
  );

  if (hue) {
    const legend = svg
      .selectAll(".legend")
      .data(color.domain())
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", function (d, i) {
        return "translate(0," + i * 20 + ")";
      });

    legend
      .append("rect")
      .attr("x", innerWidth - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

    legend
      .append("text")
      .attr("x", innerWidth - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function (d) {
        return d;
      });
  }

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
}
