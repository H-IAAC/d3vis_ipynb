import { DOMWidgetModel, DOMWidgetView } from "@jupyter-widgets/base";
import "../css/widget.css";

const packageData = require("../package.json");

export const WIDGET_HEIGHT = 400;
export const WIDGET_MARGIN = { top: 20, right: 20, bottom: 30, left: 40 };
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
  plotAfterInterval() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.plot();
    }, RENDER_INTERVAL);
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
      this.height = element.clientHeight;
    }
    this.width = element.clientWidth;
    this.margin = WIDGET_MARGIN;
  }
}
