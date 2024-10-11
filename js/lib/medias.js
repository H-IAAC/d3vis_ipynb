import { BaseModel, BaseView } from "./base";
import { Image } from "./medias/image";
import { Video } from "./medias/video";

export class ImageModel extends BaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: ImageModel.model_name,
      _view_name: ImageModel.view_name,

      value: String,
      format: "jpg",
      width: Number,
      height: Number,
    };
  }

  static model_name = "ImageModel";
  static view_name = "ImageView";
}

export class ImageView extends BaseView {
  remove() {
    if (this.src) {
      URL.revokeObjectURL(this.src);
    }
    super.remove();
  }

  params() {
    let value = this.model.get("value");
    let format = this.model.get("format");
    let width = this.model.get("width");
    let height = this.model.get("height");

    return [value, format, width, height];
  }

  plot(element) {
    this.widget = new Image(element);

    this.model.on("change:value", () => this.replot(), this);
    this.model.on("change:width", () => this.replot(), this);
    this.model.on("change:height", () => this.replot(), this);

    this.widget.plot(...this.params());
  }
}

export class VideoModel extends BaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: VideoModel.model_name,
      _view_name: VideoModel.view_name,

      value: new DataView(new ArrayBuffer()),
      format: "mp4",
      width: Number,
      height: Number,
      currentTime: Number,
      controls: true,
      loop: true,
      _play: Boolean,
      _pause: Boolean,
      _duration: Number,
      _seekTo: Number,
    };
  }

  static serializers = {
    ...BaseModel.serializers,
    value: {
      serialize: (value) => {
        return new DataView(value.buffer.slice(0));
      },
    },
  };

  static model_name = "VideoModel";
  static view_name = "VideoView";
}

export class VideoView extends BaseView {
  remove() {
    if (this.src) {
      URL.revokeObjectURL(this.src);
    }
    super.remove();
  }

  play() {
    this.widget.play();
  }

  pause() {
    this.widget.pause();
  }

  seekTo() {
    const seekTo = this.model.get("_seekTo");
    this.widget.seekTo(seekTo);
  }

  setCurrentTime(currentTime) {
    this.model.set({ _currentTime: currentTime });
    this.model.save_changes();
  }

  setDuration(duration) {
    if (!duration) duration = 0;
    this.model.set({ _duration: duration });
    this.model.save_changes();
  }

  setControls() {
    let controls = this.model.get("controls");
    this.widget.setControls(controls);
  }

  setLoop() {
    let loop = this.model.get("loop");
    this.widget.setLoop(loop);
  }

  setMuted() {
    let muted = this.model.get("muted");
    this.widget.setMuted(muted);
  }

  setVolume() {
    let volume = this.model.get("volume");
    this.widget.setVolume(volume);
  }

  params() {
    const value = this.model.get("value");
    const format = this.model.get("format");
    const width = this.model.get("width");
    const height = this.model.get("height");
    const controls = this.model.get("controls");
    const loop = this.model.get("loop");
    const muted = this.model.get("muted");
    const volume = this.model.get("volume");

    return [
      value,
      format,
      width,
      height,
      controls,
      loop,
      muted,
      volume,
      this.setCurrentTime.bind(this),
      this.setDuration.bind(this),
    ];
  }

  plot(element) {
    this.widget = new Video(element);

    this.model.on("change:value", () => this.replot(), this);
    this.model.on("change:width", () => this.replot(), this);
    this.model.on("change:height", () => this.replot(), this);
    this.model.on("change:_seeked", () => this.seekTo(), this);
    this.model.on("change:controls", () => this.setControls(), this);
    this.model.on("change:loop", () => this.setLoop(), this);
    this.model.on("change:muted", () => this.setMuted(), this);
    this.model.on("change:volume", () => this.setVolume(), this);
    this.model.on("change:_play", () => this.play(), this);
    this.model.on("change:_pause", () => this.pause(), this);

    this.widget.plot(...this.params());
  }
}
