import { BaseModel, BaseView } from "./base";

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
  render() {
    this.value_changed();
  }

  value_changed() {
    const matrix = this.model.get("matrix");
    const grid_areas = this.model.get("grid_areas");
    const grid_template_areas = this.model.get("grid_template_areas");
    let style = this.model.get("style");

    if (!style) {
      style = "basic";
    }

    const node = document.createElement("div");

    node.classList.add(style);
    node.style.display = "grid";
    node.style.gridTemplateAreas = grid_template_areas;
    node.style.gridTemplateRows = "repeat(" + matrix.length + ", 180px)";
    node.style.gridTemplateColumns = "repeat(" + matrix[0].length + ", 1fr)";
    node.style.width = "100%";

    grid_areas.forEach((area) => {
      const grid_area = document.createElement("div");
      grid_area.setAttribute("id", area);
      grid_area.style.gridArea = area;
      grid_area.classList.add("dashboard-div");
      node.appendChild(grid_area);
    });

    this.el.appendChild(node);
  }
}
