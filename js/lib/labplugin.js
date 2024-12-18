import { IJupyterWidgetRegistry } from "@jupyter-widgets/base";
import {
  BeeswarmPlotModel,
  BeeswarmPlotView,
  BarPlotModel,
  BarPlotView,
  ButtonModel,
  ButtonView,
  CheckboxModel,
  CheckboxView,
  DecisionPlotModel,
  DecisionPlotView,
  DropdownModel,
  DropdownView,
  ForcePlotModel,
  ForcePlotView,
  HeatmapPlotModel,
  HeatmapPlotView,
  HistogramPlotModel,
  HistogramPlotView,
  ImageModel,
  ImageView,
  InputModel,
  InputView,
  LinearPlotModel,
  LinearPlotView,
  MapPlotModel,
  MapPlotView,
  MatrixLayoutModel,
  MatrixLayoutView,
  RangeSliderModel,
  RangeSliderView,
  RidgelinePlotModel,
  RidgelinePlotView,
  ScatterPlotModel,
  ScatterPlotView,
  TextAreaModel,
  TextAreaView,
  TextModel,
  TextView,
  VideoModel,
  VideoView,
  WaterfallPlotModel,
  WaterfallPlotView,
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
        BeeswarmPlotModel,
        BeeswarmPlotView,
        BarPlotModel,
        BarPlotView,
        ButtonModel,
        ButtonView,
        CheckboxModel,
        CheckboxView,
        DecisionPlotModel,
        DecisionPlotView,
        DropdownModel,
        DropdownView,
        ForcePlotModel,
        ForcePlotView,
        HeatmapPlotModel,
        HeatmapPlotView,
        HistogramPlotModel,
        HistogramPlotView,
        ImageModel,
        ImageView,
        InputModel,
        InputView,
        LinearPlotModel,
        LinearPlotView,
        MapPlotModel,
        MapPlotView,
        MatrixLayoutModel,
        MatrixLayoutView,
        RangeSliderModel,
        RangeSliderView,
        RidgelinePlotModel,
        RidgelinePlotView,
        ScatterPlotModel,
        ScatterPlotView,
        TextAreaModel,
        TextAreaView,
        TextModel,
        TextView,
        VideoModel,
        VideoView,
        WaterfallPlotModel,
        WaterfallPlotView,
      },
    });
  },
  autoStart: true,
};

export default helloWidgetPlugin;
