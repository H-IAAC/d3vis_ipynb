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
  VideoModel,
  VideoView,
  ImageModel,
  ImageView,
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
        VideoModel,
        VideoView,
        ImageModel,
        ImageView,
      },
    });
  },
  autoStart: true,
};

export default helloWidgetPlugin;
