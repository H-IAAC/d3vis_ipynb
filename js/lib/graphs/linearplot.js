import * as d3 from "d3";
import { BasePlot } from "./baseplot";
import { BoxSelectButton } from "./tools/button_box_select";
import { ClickSelectButton } from "./tools/button_click_select";
import { DeselectAllButton } from "./tools/button_deselect_all";
import { LassoSelectButton } from "./tools/button_lasso_select";
import { getDataMeans, groupArrayBy } from "./tools/group_data";
import { InformationCard } from "./tools/information_card";
import { SideBar } from "./tools/side_bar";

export class LinearPlot extends BasePlot {
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
    data = getDataMeans(data, x_value, [y_value], hue);
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
      d3.select(this).style("opacity", 1).attr("r", 5);
      const text =
        "x: " +
        Math.round(d[x_value] * 100) / 100 +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
        "y: " +
        Math.round(d[y_value] * 100) / 100;

      informationCard.showText(text, event.offsetX, event.offsetY);
    }

    function mouseout() {
      d3.select(this).style("opacity", 0.2).attr("r", 3);
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

    function addPath(datum, colorSelector) {
      GG.append("path")
        .attr("class", "line-path")
        .datum(datum)
        .attr("fill", "none")
        .attr("stroke", color(colorSelector))
        .attr("stroke-width", 2)
        .attr(
          "d",
          d3
            .line()
            .x((d) => X(d[x_value]))
            .y((d) => Y(d[y_value]))
        );
    }

    if (!hue) {
      addPath(data);
    } else {
      const groupedByHue = groupArrayBy(data, hue);
      Object.keys(groupedByHue).forEach(function (key, index) {
        addPath(groupedByHue[key], key);
      });
    }

    const dots = GG.selectAll(".line-dot").data(data).enter().append("circle");
    dots
      .attr("class", "line-dot")
      .attr("r", 3)
      .attr("cx", function (d) {
        return X(d[x_value]);
      })
      .attr("cy", function (d) {
        return Y(d[y_value]);
      })
      .style("fill", function (d) {
        return color(d[hue]);
      })
      .style("opacity", 0.2)
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .on("click", mouseClick);

    let xAxis, yAxis;
    if (!noAxes) {
      [xAxis, yAxis] = this.plotAxes(GG, X, Y, x_value, y_value);
    }

    function callUpdateSelected() {
      if (setSelectedValues) {
        setSelectedValues(GG.selectAll(".line-dot.selected").data());
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

      GG.selectAll(".line-path").attr(
        "d",
        d3
          .line()
          .x((d) => newX(d[x_value]))
          .y((d) => newY(d[y_value]))
      );

      GG.selectAll(".line-dot")
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
}
