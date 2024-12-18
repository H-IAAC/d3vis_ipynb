import { DOMWidgetModel, DOMWidgetView } from "@jupyter-widgets/base";
import "../css/widget.css";

const packageData = require("../package.json");

export const WIDGET_HEIGHT = 500;
export const WIDGET_MARGIN = { top: 20, right: 20, bottom: 30, left: 20 };
export const RENDER_TIMEOUT = 20000;
export const RENDER_INTERVAL = 100;

export class BaseModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_module: BaseModel.model_module,
      _view_module: BaseModel.view_module,
      _model_module_version: BaseModel.model_module_version,
      _view_module_version: BaseModel.view_module_version,
    };
  }

  static model_module = packageData.name;
  static model_module_version = packageData.version;
  static view_module = packageData.name;
  static view_module_version = packageData.version;
}

export class BaseView extends DOMWidgetView {
  render() {
    let elapsedTime = 0;

    let intr = setInterval(() => {
      try {
        this.element = this.getElement();
        if (!this.element) return;
        this.setSizes();
        if (this.element && this.width && this.height) {
          this.plot(this.element);
          clearInterval(intr);
        }
        elapsedTime += RENDER_INTERVAL;
        if (elapsedTime > RENDER_TIMEOUT) {
          throw "Widget took too long to render";
        }
      } catch (err) {
        console.log(err.stack);
        clearInterval(intr);
      }
    }, RENDER_INTERVAL);
  }

  replot() {
    this.setSizes();
    this.widget.replot(this.params());
  }

  getElement() {
    this.elementId = this.model.get("elementId");

    let element = this.el;
    if (this.elementId) {
      element = document.getElementById(this.elementId);
    }

    return element;
  }

  setSizes() {
    const elementId = this.model.get("elementId");

    this.height = WIDGET_HEIGHT;
    let element = this.el;
    if (elementId) {
      element = document.getElementById(elementId);
      if (element.clientHeight) this.height = element.clientHeight;
      else this.height = null;
    }
    if (element.clientWidth) this.width = element.clientWidth;
    else this.width = null;
  }
}
