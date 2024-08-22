import * as d3 from "d3";
import { BasePlot } from "./baseplot";
import { BoxSelectButton } from "./tools/button_box_select";
import { ClickSelectButton } from "./tools/button_click_select";
import { DeselectAllButton } from "./tools/button_deselect_all";
import { LassoSelectButton } from "./tools/button_lasso_select";
import { lasso } from "./tools/lasso";
import { SIDE_BAR_WIDTH, addSideBar } from "./tools/side_bar";

export class ScatterPlot extends BasePlot {
  plot(
    data,
    x_value,
    y_value,
    hue,
    setValue,
    setSelectedValues,
    width,
    height,
    margin,
    noAxes,
    noSideBar
  ) {
    if (!noSideBar) {
      width = width - SIDE_BAR_WIDTH;
      let clickSelectButton = new ClickSelectButton();
      let boxSelectButton = new BoxSelectButton();
      let lassoSelectButton = new LassoSelectButton();
      let deselectAllButton = new DeselectAllButton();
      addSideBar(
        this.element,
        clickSelectButton,
        boxSelectButton,
        lassoSelectButton,
        deselectAllButton
      );
    }

    for (let i = 0; i < data.length; i++) {
      data[i]["id"] = i;
    }

    const randomString = Math.floor(
      Math.random() * Date.now() * 10000
    ).toString(36);

    this.svg = this.getSvg(width, height, margin);

    const SVG = this.svg;

    const xDomain = d3.extent(data, function (d) {
      return d[x_value];
    });
    this.xScale = this.getXLinearScale(xDomain, width, margin);
    let X = this.xScale;
    const yDomain = d3.extent(data, function (d) {
      return d[y_value];
    });
    this.yScale = this.getYLinearScale(yDomain, height, margin);
    let Y = this.yScale;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

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

    SVG.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("id", function (d, i) {
        return "dot-" + randomString + d.id;
      })
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", function (d) {
        return X(d[x_value]);
      })
      .attr("cy", function (d) {
        return Y(d[y_value]);
      })
      .style("fill", function (d) {
        return color(d[hue]);
      })
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .on("click", mouseClick);

    if (!noAxes) this.plotAxes(SVG, X, Y, x_value, y_value);

    function resetColor() {
      SVG.selectAll(".dot")
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
      this,
      X,
      Y,
      x_value,
      y_value,
      margin.left,
      margin.top,
      resetColor,
      setLassoValues,
      randomString
    );

    if (hue) {
      const legend = SVG.selectAll(".legend")
        .data(color.domain())
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
          return "translate(0," + i * 20 + ")";
        });

      legend
        .append("rect")
        .attr("x", width - margin.left - margin.right - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

      legend
        .append("text")
        .attr("x", width - margin.left - margin.right - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) {
          return d;
        });
    }

    const focus = SVG.append("g")
      .append("rect")
      .style("fill", "none")
      .attr("width", 160)
      .attr("height", 40)
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 4)
      .style("opacity", 0);

    const focusText = SVG.append("g")
      .append("text")
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle");
  }

  replot(
    data,
    x_value,
    y_value,
    hue,
    setValue,
    setSelectedValues,
    width,
    height,
    margin,
    noAxes
  ) {
    this.clear();
    this.plot(
      data,
      x_value,
      y_value,
      hue,
      setValue,
      setSelectedValues,
      width,
      height,
      margin,
      noAxes
    );
  }

  plotLines(lines) {
    let X = this.xScale;
    let Y = this.yScale;

    this.svg
      .selectAll("path.reference_line")
      .data(Object.values(lines))
      .join("path")
      .attr("class", "reference_line")
      .attr("stroke", (d) => d.color)
      .attr("stroke-dasharray", (d) => {
        if (d.dashed) return "2,2";
      })
      .transition()
      .attr("d", function (d) {
        if (d.direction === "horizontal")
          return d3.line()([
            [X.range()[0], Y(d.position)],
            [X.range()[1], Y(d.position)],
          ]);

        return d3.line()([
          [X(d.position), Y.range()[0]],
          [X(d.position), Y.range()[1]],
        ]);
      });
  }
}
