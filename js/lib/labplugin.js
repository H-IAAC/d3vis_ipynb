import {
  LinearHistPlotModel,
  LinearHistPlotView,
  ScatterPlotModel,
  ScatterPlotView,
  BarPlotModel,
  BarPlotView,
  HistogramPlotModel,
  HistogramPlotView,
  EmbeddingModel,
  EmbeddingView,
  version,
} from "./index";
import { IJupyterWidgetRegistry } from "@jupyter-widgets/base";

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
        BarPlotModel,
        BarPlotView,
        HistogramPlotModel,
        HistogramPlotView,
        EmbeddingModel,
        EmbeddingView,
      },
    });
  },
  autoStart: true,
};

export default helloWidgetPlugin;
