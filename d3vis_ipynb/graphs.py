import copy

import ipywidgets as widgets
import numpy as np
import pandas as pd
import shap
from traitlets import Dict, Float, List, Unicode

from d3vis_ipynb.base_widget import BaseWidget


@widgets.register
class BarPlot(BaseWidget):
    _view_name = Unicode("BarPlotView").tag(sync=True)
    _model_name = Unicode("BarPlotModel").tag(sync=True)

    dataRecords = List([]).tag(sync=True)
    direction = Unicode().tag(sync=True)
    x = Unicode().tag(sync=True)
    y = Unicode().tag(sync=True)
    hue = Unicode().tag(sync=True)

    def __init__(self, data, direction="vertical", **kwargs):
        self.data = data
        self.direction = direction
        super().__init__(**kwargs)

    @property
    def data(self):
        return pd.DataFrame.from_records(self.dataRecords)

    @data.setter
    def data(self, val):
        self.dataRecords = val.to_dict(orient="records")


@widgets.register
class BeeswarmPlot(BaseWidget):
    _view_name = Unicode("BeeswarmPlotView").tag(sync=True)
    _model_name = Unicode("BeeswarmPlotModel").tag(sync=True)

    dataRecords = List([]).tag(sync=True)
    baseValue = Float().tag(sync=True)
    selectedValuesRecords = List([]).tag(sync=True)

    def __init__(
        self,
        explanation,
        **kwargs,
    ):
        self.explanation = explanation
        super().__init__(**kwargs)

    @property
    def explanation(self):
        return self.__explanation

    @explanation.setter
    def explanation(self, val):
        self.__explanation = val
        valuesArray = np.transpose(val.values).tolist()
        dataArray = np.transpose(val.data).tolist()
        records = []
        for i in range(len(val.feature_names)):
            records.append(
                {
                    "feature_names": val.feature_names[i],
                    "values": valuesArray[i],
                    "data": dataArray[i],
                }
            )
        self.baseValue = val.base_values[0]
        self.dataRecords = records

    @property
    def selectedValues(self):
        if not self.selectedValuesRecords:
            return None
        df = pd.DataFrame.from_records(self.selectedValuesRecords)
        exp = shap.Explanation(
            values=np.transpose(np.stack(df['values'].values)),
            data=np.transpose(np.stack(df['data'].values)),
            feature_names=np.transpose(np.stack(df['feature_names'].values)),
            base_values=np.full(len(df['values'][0]), df['base_values'][0]),
        )
        return exp

    def on_select_values(self, callback):
        self.observe(callback, names=["selectedValuesRecords"])

@widgets.register
class DecisionPlot(BaseWidget):
    _view_name = Unicode("DecisionPlotView").tag(sync=True)
    _model_name = Unicode("DecisionPlotModel").tag(sync=True)

    dataRecords = List([]).tag(sync=True)
    baseValue = Float().tag(sync=True)
    selectedValuesRecords = List([]).tag(sync=True)

    def __init__(
        self,
        explanation,
        **kwargs,
    ):
        self.explanation = explanation
        super().__init__(**kwargs)

    @property
    def explanation(self):
        return self.__explanation

    @explanation.setter
    def explanation(self, val):
        self.__explanation = val
        valuesArray = np.transpose(val.values).tolist()
        dataArray = np.transpose(val.data).tolist()
        records = []
        for i in range(len(val.feature_names)):
            records.append(
                {
                    "feature_names": val.feature_names[i],
                    "values": valuesArray[i],
                    "data": dataArray[i],
                }
            )
        self.baseValue = val.base_values[0]
        self.dataRecords = records

    @property
    def selectedValues(self):
        if not self.selectedValuesRecords:
            return None
        df = pd.DataFrame.from_records(self.selectedValuesRecords)
        exp = shap.Explanation(
            values=np.transpose(np.stack(df['values'].values)),
            data=np.transpose(np.stack(df['data'].values)),
            feature_names=np.transpose(np.stack(df['feature_names'].values)),
            base_values=np.full(len(df['values'][0]), df['base_values'][0]),
        )
        return exp

    def on_select_values(self, callback):
        self.observe(callback, names=["selectedValuesRecords"])


@widgets.register
class ForcePlot(BaseWidget):
    _view_name = Unicode("ForcePlotView").tag(sync=True)
    _model_name = Unicode("ForcePlotModel").tag(sync=True)

    dataRecords = List([]).tag(sync=True)
    baseValue = Float().tag(sync=True)
    selectedValuesRecords = List([]).tag(sync=True)

    def __init__(
        self,
        explanation,
        **kwargs,
    ):
        self.explanation = explanation
        self.selectedValues = pd.DataFrame()
        super().__init__(**kwargs)

    @property
    def explanation(self):
        return self.__explanation

    @explanation.setter
    def explanation(self, val):
        self.__explanation = val
        df = pd.DataFrame()
        df.insert(0, "values", val.values)
        df.insert(0, "feature_names", val.feature_names)
        df.insert(0, "data", val.data)
        self.baseValue = val.base_values
        self.dataRecords = df.to_dict(orient="records")

    @property
    def selectedValues(self):
        return pd.DataFrame.from_records(self.selectedValuesRecords)

    @selectedValues.setter
    def selectedValues(self, val):
        self.selectedValuesRecords = val.to_dict(orient="records")


@widgets.register
class HeatmapPlot(BaseWidget):
    _view_name = Unicode("HeatmapPlotView").tag(sync=True)
    _model_name = Unicode("HeatmapPlotModel").tag(sync=True)

    dataRecords = List([]).tag(sync=True)
    x_value = Unicode().tag(sync=True)
    y_value = Unicode().tag(sync=True)
    xValues = List([]).tag(sync=True)
    yValues = List([]).tag(sync=True)

    def __init__(self, data, **kwargs):
        self.data = data
        super().__init__(**kwargs)

    @property
    def data(self):
        return pd.DataFrame.from_records(self.dataRecords)

    @data.setter
    def data(self, val):
        self.x_value = val.columns.name
        self.y_value = val.index.name
        self.xValues = val.columns.tolist()
        self.yValues = val.index.tolist()

        data_reset = val.reset_index()
        self.dataRecords = data_reset.melt(
            id_vars=self.y_value, var_name=self.x_value, value_name="hueValue"
        ).to_dict(orient="records")


@widgets.register
class HistogramPlot(BaseWidget):
    _view_name = Unicode("HistogramPlotView").tag(sync=True)
    _model_name = Unicode("HistogramPlotModel").tag(sync=True)

    dataRecords = List([]).tag(sync=True)
    x = Unicode().tag(sync=True)

    def __init__(self, data, **kwargs):
        self.data = data
        super().__init__(**kwargs)

    @property
    def data(self):
        return pd.DataFrame.from_records(self.dataRecords)

    @data.setter
    def data(self, val):
        self.dataRecords = val.to_dict(orient="records")


@widgets.register
class LinearPlot(BaseWidget):
    _view_name = Unicode("LinearPlotView").tag(sync=True)
    _model_name = Unicode("LinearPlotModel").tag(sync=True)

    dataRecords = List([]).tag(sync=True)
    x = Unicode().tag(sync=True)
    y = Unicode().tag(sync=True)
    hue = Unicode().tag(sync=True)
    selectedValuesRecords = List([]).tag(sync=True)

    def __init__(self, data, **kwargs):
        self.data = data
        self.selectedValues = pd.DataFrame()
        super().__init__(**kwargs)

    @property
    def data(self):
        return pd.DataFrame.from_records(self.dataRecords)

    @data.setter
    def data(self, val):
        self.dataRecords = val.to_dict(orient="records")

    @property
    def selectedValues(self):
        return pd.DataFrame.from_records(self.selectedValuesRecords)

    @selectedValues.setter
    def selectedValues(self, val):
        self.selectedValuesRecords = val.to_dict(orient="records")

    def on_select_values(self, callback):
        self.observe(callback, names=["selectedValuesRecords"])

@widgets.register
class MapPlot(BaseWidget):
    _view_name = Unicode("MapPlotView").tag(sync=True)
    _model_name = Unicode("MapPlotModel").tag(sync=True)
    dataRecords = List([]).tag(sync=True)
    selectionRecords = List([]).tag(sync=True)

    def __init__(self, data, **kwargs):
        self.data = data
        self.selection = pd.DataFrame()
        super().__init__(**kwargs)

    @property
    def data(self):
        return pd.DataFrame.from_records(self.dataRecords)

    @data.setter
    def data(self, val):
        self.dataRecords = val.to_dict(orient="records")

    @property
    def selection(self):
        return pd.DataFrame.from_records(self.selectionRecords)

    @selection.setter
    def selection(self, val):
        self.selectionRecords = val.to_dict(orient="records")

@widgets.register
class RidgelinePlot(BaseWidget):
    _view_name = Unicode("RidgelinePlotView").tag(sync=True)
    _model_name = Unicode("RidgelinePlotModel").tag(sync=True)

    dataRecords = List([]).tag(sync=True)
    xAxes = List([]).tag(sync=True)

    def __init__(self, data, **kwargs):
        self.data = data
        super().__init__(**kwargs)

    @property
    def data(self):
        return pd.DataFrame.from_records(self.dataRecords)

    @data.setter
    def data(self, val):
        self.dataRecords = val.to_dict(orient="records")


@widgets.register
class ScatterPlot(BaseWidget):
    _view_name = Unicode("ScatterPlotView").tag(sync=True)
    _model_name = Unicode("ScatterPlotModel").tag(sync=True)

    dataRecords = List([]).tag(sync=True)
    x = Unicode().tag(sync=True)
    y = Unicode().tag(sync=True)
    hue = Unicode().tag(sync=True)
    selectedValuesRecords = List([]).tag(sync=True)
    lines = Dict([]).tag(sync=True)

    def __init__(self, data, **kwargs):
        self.data = data
        self.selectedValues = pd.DataFrame()
        super().__init__(**kwargs)

    @property
    def data(self):
        return pd.DataFrame.from_records(self.dataRecords)

    @data.setter
    def data(self, val):
        self.dataRecords = val.to_dict(orient="records")

    @property
    def selectedValues(self):
        return pd.DataFrame.from_records(self.selectedValuesRecords)

    @selectedValues.setter
    def selectedValues(self, val):
        self.selectedValuesRecords = val.to_dict(orient="records")

    def on_select_values(self, callback):
        self.observe(callback, names=["selectedValuesRecords"])

    def createLine(
        self, id, position=0, color="blue", dashed=True, direction="vertical"
    ):
        if direction != "horizontal" and direction != "vertical":
            raise Exception('Type must be "horizontal" or "vertical".')

        newLine = {
            "position": position,
            "color": color,
            "dashed": dashed,
            "direction": direction,
        }
        lines = copy.deepcopy(self.lines)
        lines[id] = newLine
        self.lines = lines

    def updateLine(self, id, position=None, color=None, dashed=None, direction=None):
        if direction and direction != "horizontal" and direction != "vertical":
            raise Exception('Type must be "horizontal" or "vertical".')

        oldLine = self.lines[id]
        newLine = {
            "position": position if position else oldLine["position"],
            "color": color if color else oldLine["color"],
            "dashed": dashed if dashed else oldLine["dashed"],
            "direction": direction if direction else oldLine["direction"],
        }
        lines = copy.deepcopy(self.lines)
        lines[id] = newLine
        self.lines = lines

    def removeLine(self, id):
        lines = copy.deepcopy(self.lines)
        lines.pop(id)
        self.lines = lines

    def removeAllLines(self):
        self.lines = {}


@widgets.register
class WaterfallPlot(BaseWidget):
    _view_name = Unicode("WaterfallPlotView").tag(sync=True)
    _model_name = Unicode("WaterfallPlotModel").tag(sync=True)

    dataRecords = List([]).tag(sync=True)
    baseValue = Float().tag(sync=True)
    selectedValuesRecords = List([]).tag(sync=True)

    def __init__(
        self,
        explanation,
        **kwargs,
    ):
        self.explanation = explanation
        self.selectedValues = pd.DataFrame()
        super().__init__(**kwargs)

    @property
    def explanation(self):
        return self.__explanation

    @explanation.setter
    def explanation(self, val):
        self.__explanation = val
        df = pd.DataFrame()
        df.insert(0, "values", val.values)
        df.insert(0, "feature_names", val.feature_names)
        df.insert(0, "data", val.data)
        self.baseValue = val.base_values
        self.dataRecords = df.to_dict(orient="records")

    @property
    def selectedValues(self):
        return pd.DataFrame.from_records(self.selectedValuesRecords)

    @selectedValues.setter
    def selectedValues(self, val):
        self.selectedValuesRecords = val.to_dict(orient="records")

