import mimetypes

import ipywidgets as widgets
from traitlets import Bool, Float, Int, TraitType, Unicode

from d3vis_ipynb.base_widget import BaseWidget


class _Media(BaseWidget):
    value = TraitType().tag(sync=True)
    format = Unicode().tag(sync=True)
    width = Int().tag(sync=True)
    height = Int().tag(sync=True)

    def __init__(self, file, type, **kwargs):
        filename = ""
        read_file = None

        if getattr(file, "read", None) is not None:
            read_file = file.read()
            filename = file.name
        else:
            with open(file, "rb") as f:
                read_file = f.read()
                filename = file
        self.format = self._guess_format(type, filename)
        self.value = read_file
        super().__init__(**kwargs)

    def _guess_format(self, tag, file):
        name = getattr(file, "name", None)
        name = name or file

        try:
            mtype, _ = mimetypes.guess_type(name)
            if not mtype.startswith("{}/".format(tag)):
                return ""

            return mtype[len("{}/".format(tag)) :]
        except Exception:
            return ""


@widgets.register
class Video(_Media):
    _view_name = Unicode("VideoView").tag(sync=True)
    _model_name = Unicode("VideoModel").tag(sync=True)

    _play = Bool().tag(sync=True)
    _pause = Bool().tag(sync=True)
    _duration = Float().tag(sync=True)
    _seekTo = Float().tag(sync=True)
    _seeked = Bool().tag(sync=True)

    _currentTime = Float().tag(sync=True)
    controls = Bool().tag(sync=True)
    loop = Bool().tag(sync=True)
    muted = Bool().tag(sync=True)
    volume = Float().tag(sync=True)

    def __init__(self, file, controls=True, loop=True, muted=False, volume=1, **kwargs):
        self.controls = controls
        self.loop = loop
        self.muted = muted
        self.volume = volume
        super().__init__(file, "video", **kwargs)

    def play(self):
        self._play = not self._play

    def pause(self):
        self._pause = not self._pause

    @property
    def duration(self):
        return self._duration

    def on_duration_set(self, callback):
        self.observe(callback, names=["_duration"])

    def on_current_time_change(self, callback):
        self.observe(callback, names=["_currentTime"])

    def seekTo(self, time):
        self._seekTo = time
        self._seeked = not self._seeked

    @property
    def currentTime(self):
        return self._currentTime


@widgets.register
class Image(_Media):
    _view_name = Unicode("ImageView").tag(sync=True)
    _model_name = Unicode("ImageModel").tag(sync=True)

    def __init__(self, file, **kwargs):
        super().__init__(file, "image", **kwargs)
