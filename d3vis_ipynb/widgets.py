import ipywidgets as widgets
import pandas as pd
from traitlets import Float, List, Unicode

from d3vis_ipynb.base_widget import BaseWidget


@widgets.register
class RangeSlider(BaseWidget):
    _view_name = Unicode("RangeSliderView").tag(sync=True)
    _model_name = Unicode("RangeSliderModel").tag(sync=True)

    dataRecords = List([]).tag(sync=True)
    variable = Unicode().tag(sync=True)
    step = Float().tag(sync=True)
    description = Unicode().tag(sync=True)
    minValue = Float().tag(sync=True)
    maxValue = Float().tag(sync=True)

    def __init__(self, data, **kwargs):
        self.data = data
        super().__init__(**kwargs)

    @property
    def data(self):
        return pd.DataFrame.from_records(self.dataRecords)

    @data.setter
    def data(self, val):
        self.dataRecords = val.to_dict(orient="records")

    def on_drag(self, callback):
        self.observe(callback, names=["minValue", "maxValue"])
