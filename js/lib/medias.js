import { BaseModel, BaseView } from "./base";

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

  render() {
    this.plotAfterInterval();

    this.model.on("change:value", () => this.plotAfterInterval(), this);
    this.model.on("change:width", () => this.plotAfterInterval(), this);
    this.model.on("change:height", () => this.plotAfterInterval(), this);
    window.addEventListener("resize", () => this.plotAfterInterval());
  }

  plot() {
    this.el.innerHTML = "";
    let value = this.model.get("value");
    let format = this.model.get("format");
    let modelWidth = this.model.get("width");
    let modelHeight = this.model.get("height");

    this.setSizes();
    if (modelWidth) this.width = modelWidth;
    if (modelHeight) this.height = modelHeight;

    const node = document.createElement("div");
    const image = document.createElement("img");

    const type = `image/${format}`;
    const blob = new Blob([value], {
      type: type,
    });
    const url = URL.createObjectURL(blob);

    const oldurl = this.src;
    this.src = url;
    if (oldurl) {
      URL.revokeObjectURL(oldurl);
    }

    image.setAttribute("src", this.src);
    image.setAttribute("type", type);
    image.style.maxWidth = "100%";
    image.style.maxHeight = "100%";
    image.style.margin = "auto";
    image.style.display = "block";

    node.style.width = this.width + "px";
    node.style.height = this.height + "px";
    node.appendChild(image);

    this.getElement().appendChild(node);
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
    if (!this.video) return;
    this.video.play();
  }

  pause() {
    if (!this.video) return;
    this.video.pause();
  }

  seekTo() {
    if (!this.video) return;
    const seekTo = this.model.get("_seekTo");
    this.video.currentTime = seekTo;
  }

  setCurrentTime() {
    const currentTime = this.video.currentTime;
    this.model.set({ _currentTime: currentTime });
    this.model.save_changes();
  }

  setControls() {
    if (!this.video) return;
    let controls = this.model.get("controls");
    if (controls) this.video.setAttribute("controls", "");
    else this.video.removeAttribute("controls");
  }

  setLoop() {
    if (!this.video) return;
    let loop = this.model.get("loop");
    this.video.loop = loop;
  }

  setMuted() {
    if (!this.video) return;
    let muted = this.model.get("muted");
    this.video.muted = muted;
  }

  setVolume() {
    if (!this.video) return;
    let volume = this.model.get("volume");
    this.video.volume = volume;
  }

  render() {
    this.plotAfterInterval();

    this.model.on("change:value", () => this.plotAfterInterval(), this);
    this.model.on("change:width", () => this.plotAfterInterval(), this);
    this.model.on("change:height", () => this.plotAfterInterval(), this);
    this.model.on("change:_seeked", () => this.seekTo(), this);
    this.model.on("change:controls", () => this.setControls(), this);
    this.model.on("change:loop", () => this.setLoop(), this);
    this.model.on("change:muted", () => this.setMuted(), this);
    this.model.on("change:volume", () => this.setVolume(), this);
    this.model.on("change:_play", () => this.play(), this);
    this.model.on("change:_pause", () => this.pause(), this);
    window.addEventListener("resize", () => this.plotAfterInterval());
  }

  plot() {
    this.el.innerHTML = "";
    let value = this.model.get("value");
    let format = this.model.get("format");
    let modelWidth = this.model.get("width");
    let modelHeight = this.model.get("height");
    let controls = this.model.get("controls");

    this.setSizes();

    if (modelWidth) this.width = modelWidth;
    if (modelHeight) this.height = modelHeight;

    this.video = document.createElement("video");
    const source = document.createElement("source");

    const type = `video/${format}`;
    const blob = new Blob([value], {
      type: type,
    });
    const url = URL.createObjectURL(blob);

    const oldurl = this.src;
    this.src = url;
    if (oldurl) {
      URL.revokeObjectURL(oldurl);
    }

    source.setAttribute("src", this.src);
    source.setAttribute("type", type);

    this.video.appendChild(source);
    if (controls) this.video.setAttribute("controls", "");
    this.setLoop();
    this.setMuted();
    this.setVolume();
    this.video.style.margin = "auto";
    this.video.style.display = "block";

    this.video.style.width = this.width + "px";
    this.video.style.height = this.height + "px";
    this.video.addEventListener("timeupdate", this.setCurrentTime.bind(this));

    this.getElement().appendChild(this.video);
    setTimeout(() => {
      this.model.set({ _duration: this.video.duration });
      this.model.save_changes();
    }, 50);
  }
}
