import * as d3 from "d3";
import { BasePlot } from "./baseplot";
import { BoxSelectButton } from "./tools/button_box_select";
import { ClickSelectButton } from "./tools/button_click_select";
import { DeselectAllButton } from "./tools/button_deselect_all";
import { LassoSelectButton } from "./tools/button_lasso_select";
import { InformationCard } from "./tools/information_card";
import { SideBar } from "./tools/side_bar";

export class ScatterPlot extends BasePlot {
  plot(
    data,
    x_value,
    y_value,
    hue,
    setSelectedValues,
    width,
    height,
    margin,
    noAxes,
    noSideBar
  ) {
    const informationCard = new InformationCard(this.element);

    if (!noSideBar) width = width - SideBar.SIDE_BAR_WIDTH;

    for (let i = 0; i < data.length; i++) {
      data[i]["id"] = i;
    }

    const randomString = Math.floor(
      Math.random() * Date.now() * 10000
    ).toString(36);

    var zoom = d3
      .zoom()
      .scaleExtent([1, 50])
      .extent([
        [0, 0],
        [width, height],
      ])
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", onZoom);

    this.init(width, height, margin);

    const SVG = this.svg;
    const GG = this.gGrid;

    this.svg.call(zoom);

    const xDomain = d3.extent(data, function (d) {
      return d[x_value];
    });
    const X = this.getXLinearScale(xDomain, width, margin);
    const yDomain = d3.extent(data, function (d) {
      return d[y_value];
    });
    const Y = this.getYLinearScale(yDomain, height, margin);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    function mouseover(event, d) {
      d3.select(this).style("opacity", 1);
      const text =
        "x: " +
        Math.round(d[x_value] * 100) / 100 +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
        "y: " +
        Math.round(d[y_value] * 100) / 100;

      informationCard.showText(text, event.offsetX, event.offsetY);
    }

    function mouseout() {
      d3.select(this).style("opacity", 0.5);
      informationCard.hide();
    }

    let clickSelectButton;
    function mouseClick(event, d) {
      const text =
        "x:" +
        Math.round(d[x_value] * 10) / 10 +
        "    " +
        "y:" +
        Math.round(d[y_value] * 10) / 10;
      if (clickSelectButton) {
        clickSelectButton.selectionClickEffect(d3.select(this));
        callUpdateSelected();
      }
    }

    const dots = GG.selectAll(".dot").data(data).enter().append("circle");
    dots
      .attr("id", function (d, i) {
        return "dot-" + randomString + d.id;
      })
      .attr("class", "dot")
      .attr("r", 5)
      .attr("cx", function (d) {
        return X(d[x_value]);
      })
      .attr("cy", function (d) {
        return Y(d[y_value]);
      })
      .style("fill", function (d) {
        return color(d[hue]);
      })
      .style("opacity", 0.5)
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .on("click", mouseClick);

    let xAxis, yAxis;
    if (!noAxes) {
      [xAxis, yAxis] = this.plotAxes(GG, X, Y, x_value, y_value);
    }

    function callUpdateSelected() {
      if (setSelectedValues) {
        setSelectedValues(GG.selectAll(".dot.selected").data());
      }
    }

    if (hue) {
      const legend = GG.selectAll(".legend")
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

    function activateZoom() {
      SVG.call(zoom);
    }

    function deactivatePan() {
      SVG.on("mousedown.zoom", null);
    }

    let lassoSelectButton;
    if (!noSideBar) {
      clickSelectButton = new ClickSelectButton(true);
      clickSelectButton.addWhenSelectedCallback(activateZoom);
      let boxSelectButton = new BoxSelectButton(
        X,
        Y,
        x_value,
        y_value,
        margin.left,
        margin.top,
        dots,
        callUpdateSelected,
        SVG
      );
      boxSelectButton.addWhenSelectedCallback(deactivatePan);
      lassoSelectButton = new LassoSelectButton(
        X,
        Y,
        x_value,
        y_value,
        margin.left,
        margin.top,
        dots,
        callUpdateSelected,
        SVG
      );
      lassoSelectButton.addWhenSelectedCallback(deactivatePan);
      let deselectAllButton = new DeselectAllButton(dots, callUpdateSelected);
      const sideBar = new SideBar(
        this.element,
        clickSelectButton,
        boxSelectButton,
        lassoSelectButton,
        deselectAllButton
      );
    }

    function onZoom(event) {
      var newX = event.transform.rescaleX(X);
      var newY = event.transform.rescaleY(Y);

      if (!noAxes) {
        xAxis.call(d3.axisBottom(newX));
        yAxis.call(d3.axisLeft(newY));
      }

      if (!noSideBar) {
        lassoSelectButton.updateScales(newX, newY);
      }

      GG.selectAll(".dot")
        .attr("cx", function (d) {
          return newX(d[x_value]);
        })
        .attr("cy", function (d) {
          return newY(d[y_value]);
        });
    }
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

    this.gGrid
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
