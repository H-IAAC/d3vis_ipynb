import { IJupyterWidgetRegistry } from "@jupyter-widgets/base";
import {
  BarPlotModel,
  BarPlotView,
  HistogramPlotModel,
  HistogramPlotView,
  ImageModel,
  ImageView,
  LinearPlotModel,
  LinearPlotView,
  MatrixLayoutModel,
  MatrixLayoutView,
  RangeSliderModel,
  RangeSliderView,
  RidgelinePlotModel,
  RidgelinePlotView,
  ScatterPlotModel,
  ScatterPlotView,
  VideoModel,
  VideoView,
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
        RidgelinePlotModel,
        RidgelinePlotView,
        MatrixLayoutModel,
        MatrixLayoutView,
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
