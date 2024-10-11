import { BaseModel, BaseView } from "./base";
import { MatrixLayout } from "./layouts/matrix";

export class MatrixLayoutModel extends BaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: MatrixLayoutModel.model_name,
      _view_name: MatrixLayoutModel.view_name,

      matrix: [],
      grid_areas: [],
      grid_template_areas: String,
      style: String,
    };
  }

  static model_name = "MatrixLayoutModel";
  static view_name = "MatrixLayoutView";
}

export class MatrixLayoutView extends BaseView {
  params() {
    const matrix = this.model.get("matrix");
    const grid_areas = this.model.get("grid_areas");
    const grid_template_areas = this.model.get("grid_template_areas");
    const style = this.model.get("style");

    return [matrix, grid_areas, grid_template_areas, style];
  }

  plot(element) {
    this.widget = new MatrixLayout(element);
    this.widget.plot(...this.params());
  }
}
