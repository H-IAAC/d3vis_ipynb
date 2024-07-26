import ipywidgets as widgets
import pandas as pd
from traitlets import Float, List, Unicode, Bool

from d3vis_ipynb.base_widget import BaseWidget


class TextBaseWidget(BaseWidget):
    value = Unicode().tag(sync=True)
    placeholder = Unicode().tag(sync=True)
    description = Unicode().tag(sync=True)
    disabled = Bool().tag(sync=True)


@widgets.register
class Button(BaseWidget):
    _view_name = Unicode("ButtonView").tag(sync=True)
    _model_name = Unicode("ButtonModel").tag(sync=True)

    description = Unicode().tag(sync=True)
    disabled = Bool().tag(sync=True)
    _clicked = Bool().tag(sync=True)

    def on_click(self, callback):
        self.observe(callback, names=["_clicked"])


@widgets.register
class Dropdown(BaseWidget):
    _view_name = Unicode("DropdownView").tag(sync=True)
    _model_name = Unicode("DropdownModel").tag(sync=True)

    dataRecords = List([]).tag(sync=True)
    variable = Unicode().tag(sync=True)
    description = Unicode().tag(sync=True)
    options = List().tag(sync=True)
    value = Unicode().tag(sync=True)
    disabled = Bool().tag(sync=True)
    _clicked = Bool().tag(sync=True)

    def __init__(self, data=pd.DataFrame(), **kwargs):
        self.data = data
        super().__init__(**kwargs)

    @property
    def data(self):
        return pd.DataFrame.from_records(self.dataRecords)

    @data.setter
    def data(self, val):
        self.dataRecords = val.to_dict(orient="records")

    def on_select(self, callback):
        self.observe(callback, names=["value"])


@widgets.register
class Input(TextBaseWidget):
    _view_name = Unicode("InputView").tag(sync=True)
    _model_name = Unicode("InputModel").tag(sync=True)

    def on_text_changed(self, callback):
        self.observe(callback, names=["value"])


@widgets.register
class RangeSlider(BaseWidget):
    _view_name = Unicode("RangeSliderView").tag(sync=True)
    _model_name = Unicode("RangeSliderModel").tag(sync=True)

    dataRecords = List([]).tag(sync=True)
    variable = Unicode().tag(sync=True)
    step = Float().tag(sync=True)
    description = Unicode().tag(sync=True)
    fromValue = Float().tag(sync=True)
    toValue = Float().tag(sync=True)
    minValue = Float().tag(sync=True)
    maxValue = Float().tag(sync=True)

    def __init__(self, data=pd.DataFrame(), **kwargs):
        self.data = data
        super().__init__(**kwargs)

    @property
    def data(self):
        return pd.DataFrame.from_records(self.dataRecords)

    @data.setter
    def data(self, val):
        self.dataRecords = val.to_dict(orient="records")

    def on_drag(self, callback):
        self.observe(callback, names=["fromValue", "toValue"])


@widgets.register
class TextArea(TextBaseWidget):
    _view_name = Unicode("TextAreaView").tag(sync=True)
    _model_name = Unicode("TextAreaModel").tag(sync=True)

    def on_text_changed(self, callback):
        self.observe(callback, names=["value"])


@widgets.register
class Text(TextBaseWidget):
    _view_name = Unicode("TextView").tag(sync=True)
    _model_name = Unicode("TextModel").tag(sync=True)
