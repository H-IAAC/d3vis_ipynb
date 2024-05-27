import { IJupyterWidgetRegistry } from "@jupyter-widgets/base";
import {
  BarPlotModel,
  BarPlotView,
  EmbeddingModel,
  EmbeddingView,
  HistogramPlotModel,
  HistogramPlotView,
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
