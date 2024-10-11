export class Video {
  constructor(element) {
    this.element = element;
  }

  play() {
    if (!this.video) return;
    this.video.play();
  }

  pause() {
    if (!this.video) return;
    this.video.pause();
  }

  seekTo(seekTo) {
    if (!this.video) return;
    this.video.currentTime = seekTo;
  }

  onTimeUpdated() {
    const currentTime = this.video.currentTime;
    this.setCurrentTime(currentTime);
  }

  onVideoLoaded() {
    if (!this.video) return;
    const duration = this.video.duration;
    this.setDuration(duration);
  }

  setControls(controls) {
    if (!this.video) return;
    if (controls) this.video.setAttribute("controls", "");
    else this.video.removeAttribute("controls");
  }

  setLoop(loop) {
    if (!this.video) return;
    this.video.loop = loop;
  }

  setMuted(muted) {
    if (!this.video) return;
    this.video.muted = muted;
  }

  setVolume(volume) {
    if (!this.video) return;
    this.video.volume = volume;
  }

  plot(
    value,
    format,
    width,
    height,
    controls,
    loop,
    muted,
    volume,
    setCurrentTime,
    setDuration
  ) {
    if (width) this.width = width;
    if (height) this.height = height;

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
    this.setLoop(loop);
    this.setMuted(muted);
    this.setVolume(volume);
    this.video.style.margin = "auto";
    this.video.style.display = "block";

    this.video.style.width = this.width + "px";
    this.video.style.height = this.height + "px";
    this.setCurrentTime = setCurrentTime;
    this.video.addEventListener("timeupdate", this.onTimeUpdated.bind(this));

    this.element.appendChild(this.video);
    this.setDuration = setDuration;
    setTimeout(() => {
      this.onVideoLoaded();
    }, 500);
  }

  replot(params) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.element.innerHTML = "";
      this.plot(...params);
    }, 100);
  }
}
