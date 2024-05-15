import { IJupyterWidgetRegistry } from "@jupyter-widgets/base";
import {
  BarPlotModel,
  BarPlotView,
  EmbeddingModel,
  EmbeddingView,
  HistogramPlotModel,
  HistogramPlotView,
  LinearHistPlotModel,
  LinearHistPlotView,
  RangeSliderModel,
  RangeSliderView,
  ScatterPlotModel,
  ScatterPlotView,
  LinearPlotModel,
  LinearPlotView,
  version,
} from "./index";

export const helloWidgetPlugin = {
  id: "d3vis_ipynb:plugin",
  requires: [IJupyterWidgetRegistry],
  activate: function (app, widgets) {
    widgets.registerWidget({
      name: "d3vis_ipynb",
      version: version,
      exports: {
        LinearHistPlotModel,
        LinearHistPlotView,
        ScatterPlotModel,
        ScatterPlotView,
        LinearPlotModel,
        LinearPlotView,
        BarPlotModel,
        BarPlotView,
        HistogramPlotModel,
        HistogramPlotView,
        EmbeddingModel,
        EmbeddingView,
        RangeSliderModel,
        RangeSliderView,
      },
    });
  },
  autoStart: true,
};

export default helloWidgetPlugin;
