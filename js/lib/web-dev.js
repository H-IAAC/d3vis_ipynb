import "../css/widget.css";
import { BarPlot } from "./graphs/barplot";
import { BeeswarmPlot } from "./graphs/beeswarm";
import { DecisionPlot } from "./graphs/decision";
import { ForcePlot } from "./graphs/force";
import { HeatmapPlot } from "./graphs/heatmap";
import { HistogramPlot } from "./graphs/histogramplot";
import { LinearPlot } from "./graphs/linearplot";
import { ScatterPlot } from "./graphs/scatterplot";
import { WaterfallPlot } from "./graphs/waterfall";
import { heatmapData } from "./web-dev-data";

function addBarplot() {
  const data = [
    { x_axis: 5.2, y_axis: 4, hue: "one" },
    { x_axis: 6, y_axis: 4, hue: "one" },
    { x_axis: 5.2, y_axis: 3, hue: "one" },
    { x_axis: 5.2, y_axis: 2, hue: "one" },
    { x_axis: 4, y_axis: 6, hue: "one" },
    { x_axis: 4, y_axis: 8, hue: "one" },
    { x_axis: 4, y_axis: 5, hue: "one" },
    { x_axis: 2, y_axis: 3.1, hue: "two" },
    { x_axis: 2, y_axis: 3.8, hue: "two" },
    { x_axis: 4, y_axis: 4, hue: "two" },
    { x_axis: 2, y_axis: 4, hue: "two" },
    { x_axis: 3, y_axis: 4, hue: "two" },
    { x_axis: 6, y_axis: 7, hue: "two" },
    { x_axis: 5, y_axis: 7, hue: "two" },
    { x_axis: 5, y_axis: 7, hue: "two" },
    { x_axis: 5, y_axis: 7, hue: "two" },
    { x_axis: 4.5, y_axis: 2.5, hue: "three" },
    { x_axis: 4.5, y_axis: 4, hue: "three" },
    { x_axis: 4.5, y_axis: 5, hue: "three" },
    { x_axis: 4, y_axis: 5, hue: "three" },
    { x_axis: 4, y_axis: 6, hue: "three" },
    { x_axis: 4, y_axis: 7, hue: "three" },
    { x_axis: 2, y_axis: 3, hue: "three" },
    { x_axis: 2, y_axis: 3.5, hue: "three" },
    { x_axis: 6, y_axis: 4, hue: "three" },
  ];
  const element = document.createElement("div");
  element.id = "component";
  element.style.width = "1000px";
  element.style.height = "1000px";
  document.body.appendChild(element);

  const that = this;
  let direction = "horizontal";
  let x = "x_axis";
  let y = "y_axis";
  if (direction === "horizontal") {
    x = "y_axis";
    y = "x_axis";
  }

  const hue = "hue";

  const start = false;
  const end = false;

  const barplot = new BarPlot(element);
  barplot.plot(
    data,
    x,
    y,
    hue,
    direction,
    800,
    600,
    {
      top: 40,
      right: 20,
      bottom: 30,
      left: 80,
    },
    false
  );
}

function addForce() {
  const data = [
    { feature_names: "Age", values: 0.56290748, data: 39 },
    { feature_names: "Workclass", values: -0.37707573, data: 7 },
    { feature_names: "Education-Num", values: 0.36556202, data: 13 },
    { feature_names: "Marital Status", values: -0.46884385, data: 4 },
    { feature_names: "Occupation", values: -0.35107816, data: 1 },
    { feature_names: "Relationship", values: -0.64769396, data: 0 },
    { feature_names: "Race", values: 0.01916319, data: 4 },
    { feature_names: "Sex", values: 0.32815658, data: 1 },
    { feature_names: "Capital Gain", values: -3.65317098, data: 2174 },
    { feature_names: "Capital Loss", values: -0.08319319, data: 0 },
    { feature_names: "Hours per week", values: -0.27460556, data: 40 },
    { feature_names: "Country", values: 0.03407126, data: 39 },
  ];

  const element = document.createElement("div");
  element.id = "component";
  element.style.width = "1000px";
  element.style.height = "1000px";
  document.body.appendChild(element);

  const force = new ForcePlot(element);
  force.plot(
    data,
    "values",
    "feature_names",
    "data",
    -2.5312646028291264,
    () => {},
    800,
    200,
    {
      top: 20,
      right: 20,
      bottom: 30,
      left: 20,
    }
  );
}

function addHeatmapPlot() {
  const data = heatmapData;
  const element = document.createElement("div");
  element.id = "component";
  element.style.width = "800px";
  element.style.height = "600px";
  document.body.appendChild(element);

  let x = "group";
  let y = "variable";
  const hue = "value";

  const heatmapPlot = new HeatmapPlot(element);
  heatmapPlot.plot(
    data,
    x,
    y,
    hue,
    null,
    null,
    null,
    0,
    1000,
    600,
    {
      top: 40,
      right: 20,
      bottom: 30,
      left: 80,
    },
    false
  );
}

function addHistogram() {
  const data = [
    { x_axis: 2, y_axis: 3 },
    { x_axis: 2.32, y_axis: 3.5 },
    { x_axis: 2.34, y_axis: 3.1 },
    { x_axis: 2.555, y_axis: 3.8 },
    { x_axis: 2.56, y_axis: 4 },
    { x_axis: 2.57, y_axis: 4 },
    { x_axis: 3, y_axis: 4 },
    { x_axis: 4, y_axis: 5 },
    { x_axis: 4, y_axis: 5 },
    { x_axis: 4, y_axis: 5 },
    { x_axis: 4, y_axis: 5 },
    { x_axis: 4, y_axis: 5 },
    { x_axis: 4, y_axis: 5 },
    { x_axis: 5, y_axis: 7 },
    { x_axis: 5, y_axis: 7 },
    { x_axis: 5, y_axis: 7 },
    { x_axis: 5, y_axis: 7 },
    { x_axis: 6, y_axis: 4 },
  ];
  const element = document.createElement("div");
  element.id = "component";
  element.style.width = "600px";
  element.style.height = "300px";
  document.body.appendChild(element);

  const that = this;
  const x = "x_axis";
  const start = false;
  const end = false;

  const histogramplot = HistogramPlot(element);
  histogramplot.plot(data, x, start, end, "component", that);
}

function addLinearplot() {
  const data = [
    { x_axis: 5.2, y_axis: 4, hue: "one" },
    { x_axis: 6, y_axis: 4, hue: "one" },
    { x_axis: 5.2, y_axis: 3, hue: "one" },
    { x_axis: 5.2, y_axis: 2, hue: "one" },
    { x_axis: 4.1, y_axis: 6, hue: "one" },
    { x_axis: 4.13, y_axis: 6.02, hue: "one" },
    { x_axis: 4.14, y_axis: 6, hue: "two" },
    { x_axis: 4.17, y_axis: 5.98, hue: "three" },
    { x_axis: 4.2, y_axis: 6, hue: "one" },
    { x_axis: 4.3, y_axis: 8, hue: "one" },
    { x_axis: 4.4, y_axis: 5, hue: "one" },
    { x_axis: 2.2, y_axis: 3.1, hue: "two" },
    { x_axis: 2.5, y_axis: 3.8, hue: "two" },
    { x_axis: 4, y_axis: 4.1, hue: "two" },
    { x_axis: 2, y_axis: 4.4, hue: "two" },
    { x_axis: 3, y_axis: 4, hue: "two" },
    { x_axis: 6, y_axis: 7, hue: "two" },
    { x_axis: 5.2, y_axis: 7, hue: "two" },
    { x_axis: 5, y_axis: 7.05, hue: "two" },
    { x_axis: 5, y_axis: 7, hue: "two" },
    { x_axis: 4.4, y_axis: 2.5, hue: "three" },
    { x_axis: 4.5, y_axis: 4, hue: "three" },
    { x_axis: 4.5, y_axis: 5, hue: "three" },
    { x_axis: 4, y_axis: 5, hue: "three" },
    { x_axis: 4, y_axis: 6, hue: "three" },
    { x_axis: 4, y_axis: 7, hue: "three" },
    { x_axis: 2.8, y_axis: 3, hue: "three" },
    { x_axis: 2, y_axis: 3.5, hue: "three" },
    { x_axis: 6, y_axis: 4, hue: "three" },
  ];
  const element = document.createElement("div");
  element.id = "component";
  element.style.width = "800px";
  element.style.height = "600px";
  document.body.appendChild(element);

  let x = "x_axis";
  let y = "y_axis";
  const hue = "hue";

  const linearplot = new LinearPlot(element);
  linearplot.plot(
    data,
    x,
    y,
    hue,
    () => {},
    800,
    600,
    {
      top: 40,
      right: 20,
      bottom: 30,
      left: 80,
    },
    false,
    false
  );
}

function addScatterplot() {
  const data = [
    { x_axis: 3.13, y_axis: 7.02, hue: "one" },
    { x_axis: 3.14, y_axis: 5, hue: "two" },
    { x_axis: 3.17, y_axis: 4.98, hue: "three" },
    { x_axis: 3.43, y_axis: 6.02, hue: "one" },
    { x_axis: 3.54, y_axis: 6, hue: "two" },
    { x_axis: 3.67, y_axis: 5.98, hue: "three" },
    { x_axis: 5.2, y_axis: 4, hue: "one" },
    { x_axis: 6, y_axis: 4, hue: "one" },
    { x_axis: 5.2, y_axis: 3, hue: "one" },
    { x_axis: 5.2, y_axis: 2, hue: "one" },
    { x_axis: 4.1, y_axis: 6, hue: "one" },
    { x_axis: 4.13, y_axis: 6.02, hue: "one" },
    { x_axis: 4.14, y_axis: 6, hue: "two" },
    { x_axis: 4.17, y_axis: 5.98, hue: "three" },
    { x_axis: 4.2, y_axis: 6, hue: "one" },
    { x_axis: 4.3, y_axis: 8, hue: "one" },
    { x_axis: 4.4, y_axis: 5, hue: "one" },
    { x_axis: 2.2, y_axis: 3.1, hue: "two" },
    { x_axis: 2.5, y_axis: 3.8, hue: "two" },
    { x_axis: 4, y_axis: 4.1, hue: "two" },
    { x_axis: 2, y_axis: 4.4, hue: "two" },
    { x_axis: 3, y_axis: 4, hue: "two" },
    { x_axis: 6, y_axis: 7, hue: "two" },
    { x_axis: 5.2, y_axis: 7, hue: "two" },
    { x_axis: 5, y_axis: 7.05, hue: "two" },
    { x_axis: 5, y_axis: 7, hue: "two" },
    { x_axis: 4.4, y_axis: 2.5, hue: "three" },
    { x_axis: 4.5, y_axis: 4, hue: "three" },
    { x_axis: 4.5, y_axis: 5, hue: "three" },
    { x_axis: 4, y_axis: 5, hue: "three" },
    { x_axis: 4, y_axis: 6, hue: "three" },
    { x_axis: 4, y_axis: 7, hue: "three" },
    { x_axis: 2.8, y_axis: 3, hue: "three" },
    { x_axis: 2, y_axis: 3.5, hue: "three" },
    { x_axis: 6, y_axis: 4, hue: "three" },
  ];
  const element = document.createElement("div");
  element.id = "component";
  element.style.width = "800px";
  element.style.height = "600px";
  document.body.appendChild(element);

  let x = "x_axis";
  let y = "y_axis";
  const hue = "hue";

  const scatterplot = new ScatterPlot(element);
  scatterplot.plot(
    data,
    x,
    y,
    hue,
    () => {},
    800,
    600,
    {
      top: 40,
      right: 20,
      bottom: 30,
      left: 80,
    },
    false,
    false
  );
}

function addWaterfall() {
  const data = [
    { feature_names: "Age", values: 0.56290748, data: 39 },
    { feature_names: "Workclass", values: -0.37707573, data: 7 },
    { feature_names: "Education-Num", values: 0.36556202, data: 13 },
    { feature_names: "Marital Status", values: -0.46884385, data: 4 },
    { feature_names: "Occupation", values: -0.35107816, data: 1 },
    { feature_names: "Relationship", values: -0.64769396, data: 0 },
    { feature_names: "Race", values: 0.01916319, data: 4 },
    { feature_names: "Sex", values: 0.32815658, data: 1 },
    { feature_names: "Capital Gain", values: -3.65317098, data: 2174 },
    { feature_names: "Capital Loss", values: -0.08319319, data: 0 },
    { feature_names: "Hours per week", values: -0.27460556, data: 40 },
    { feature_names: "Country", values: 0.03407126, data: 39 },
  ];

  const element = document.createElement("div");
  element.id = "component";
  element.style.width = "1000px";
  element.style.height = "1000px";
  document.body.appendChild(element);

  const waterfall = new WaterfallPlot(element);
  waterfall.plot(
    data,
    "values",
    "feature_names",
    "data",
    -2.5312646028291264,
    () => {},
    800,
    600,
    { top: 20, right: 20, bottom: 30, left: 80 },
    false
  );
}

function addDecision() {
  const data = [
    {
      feature: "Country",
      values: [
        0.009160912912338972, 0.012105833273380995, 0.01483024114742875,
        0.01483024114742875, 0.06328608289361, 0.01483024114742875,
        -0.06328608289361, 0.012105833273380995, -0.0006468505226075649,
        -0.0006468505226075649, 0.01483024114742875, 0.035739291831851004,
        0.011885320786386728, 0.01483024114742875, -0.12144826002418994,
        -0.15297974660992622, 0.012105833273380995, 0.01483024114742875,
        0.01483024114742875, 0.012105833273380995,
      ],
    },
    {
      feature: "Race",
      values: [
        0.016187038794159888, 0.0227512164413929, 0.0227512164413929,
        -0.11719971466809512, -0.11719971466809512, 0.0227512164413929,
        -0.11719971466809512, 0.0227512164413929, 0.011745196580886842,
        0.0227512164413929, -0.06617284063249826, -0.12376389231532813,
        0.018584292717278003, -0.06617284063249826, -0.11719971466809512,
        -0.40516083512455225, 0.018584292717278003, 0.0227512164413929,
        0.01644452415406704, 0.0227512164413929,
      ],
    },
    {
      feature: "Workclass",
      values: [
        -0.30206946324557066, -0.2404763938114047, 0.006194217838346958,
        0.0005233810469508171, 0.0019471291825175286, 0.006194217838346958,
        -0.00671726543456316, -0.30863364052027464, 0.006194217838346958,
        0.007831824235618115, 0.006194217838346958, -0.24795869950205088,
        0.004459096156060696, 0.206194217838346958, 0.006015552096068859,
        -0.025322444401681424, -0.1767377681657672, 0.006194217838346958,
        -0.0011142253503203393, -0.30863364052027464,
      ],
    },
    {
      feature: "Capital Loss",
      values: [
        -0.09052798758260906, -0.0897493899310939, -0.08609519980149344,
        0.08115831431699917, -0.0823290776158683, -0.084823572083842,
        -0.09102101764874533, 0.0862487791175954, 0.07994986849837005,
        -0.084823572083842, -0.0862487791175954, -0.0823290776158683,
        0.09676439688075333, 0.09312395791523159, -0.084823572083842,
        0.08271826934767887, -0.08214558639097959, -0.09055992402601987,
        -0.0837542846496217, -0.09854811657918618,
      ],
    },
    {
      feature: "Marital Status",
      values: [
        -0.18949115819530563, 0.079646573017817, 0.053418121885042635,
        0.09248899425147102, 0.11185772459721192, 0.09051552857970818,
        0.0015952938399277628, 0.09275759374722839, -0.13566315124742687,
        0.4348219012725167, 0.09275759374722839, 0.10098876903532072,
        0.3038969667837955, -0.20490799970924856, 0.0946545963990502,
        0.11089922511950136, -0.3097128506680019, 0.3097128506680019,
        0.08955702910199762, 0.08571394837461412,
      ],
    },
  ];
  const base_value = 0;

  const element = document.createElement("div");
  element.id = "component";
  element.style.width = "1000px";
  element.style.height = "1000px";
  document.body.appendChild(element);

  const decision = new DecisionPlot(element);
  decision.plot(
    data,
    "values",
    "feature",
    base_value,
    800,
    600,
    { top: 40, right: 20, bottom: 30, left: 80 },
    false
  );
}

function addBeeswarm() {
  const data = [
    {
      feature_names: "Age",
      values: [
        0.5612365765310824, 0.7736899340897798, 0.5039759484119714,
        0.6735724989883601, -0.18749006299301982, 0.581067082118243,
        0.6833054710179567, 0.7723906867019832, 0.1784379816055298,
        0.5314433995448052, 0.5459452487155795, 0.11976240353658796,
        -1.5634729432314634, 0.06876725446432828, 0.583674995843321,
        0.18875098360702394, -0.6001663536764681, 0.0032191195525228975,
        0.39932189777493476, 0.528190595600754,
      ],
      data: [
        39, 50, 38, 53, 28, 37, 49, 52, 31, 42, 37, 30, 23, 32, 40, 34, 25, 32,
        38, 43,
      ],
    },
    {
      feature_names: "Workclass",
      values: [
        -0.30206946324557066, -0.2404763938114047, 0.006194217838346958,
        0.0005233810469508171, 0.0019471291825175286, 0.006194217838346958,
        -0.00671726543456316, -0.30863364052027464, 0.006194217838346958,
        0.007831824235618115, 0.006194217838346958, -0.24795869950205088,
        -0.004459096156060696, 0.006194217838346958, 0.006015552096068859,
        -0.025322444401681424, -0.1767377681657672, 0.006194217838346958,
        -0.0011142253503203393, -0.30863364052027464,
      ],
      data: [7, 6, 4, 4, 4, 4, 4, 6, 4, 4, 4, 7, 4, 4, 4, 4, 6, 4, 4, 6],
    },
    {
      feature_names: "Education-Num",
      values: [
        0.5964158558379858, 0.7839476752560586, -0.3154687482491136,
        -1.1360041230171918, 0.7951355868205429, 1.020727649629116,
        -1.1571780559420586, -0.3994775074068457, 0.8153322625905275,
        0.5706935033202172, -0.03130499344319105, 0.7669399516191333,
        0.45381808388978245, 0.09568010218441486, 0.17609723705798389,
        -1.2825571494782344, -0.26806021449156103, -0.34557146720588205,
        -1.1426063145697116, 0.8850671807210893,
      ],
      data: [
        13, 13, 9, 7, 13, 14, 5, 9, 14, 13, 10, 13, 13, 12, 11, 4, 9, 9, 7, 14,
      ],
    },
    {
      feature_names: "Marital Status",
      values: [
        -0.18949115819530563, 0.079646573017817, 0.053418121885042635,
        0.09248899425147102, 0.11185772459721192, 0.09051552857970818,
        0.0015952938399277628, 0.09275759374722839, -0.13566315124742687,
        0.1348219012725167, 0.09275759374722839, 0.10098876903532072,
        -0.3038969667837955, -0.20490799970924856, 0.0946545963990502,
        0.11089922511950136, -0.3097128506680019, -0.3097128506680019,
        0.08955702910199762, 0.08571394837461412,
      ],
      data: [4, 2, 0, 2, 2, 2, 3, 2, 4, 2, 2, 2, 4, 4, 2, 2, 4, 4, 2, 0],
    },
    {
      feature_names: "Occupation",
      values: [
        -0.12236976615153253, 0.553356990525499, -0.4411466224025935,
        -0.46231745425611737, 0.361603181976825, 0.5394176323059946,
        -0.5446952656283974, 0.5966964576486498, 0.3504636916425079,
        0.5616433288250119, 0.6037791801337152, 0.3838288776762784,
        -0.12236976615153253, 0.3536642563249916, 0.012631879397667944,
        -0.07775063438341022, -0.4286399359162897, -0.4286399359162897,
        0.31171229960396885, 0.6332244508061557,
      ],
      data: [1, 4, 6, 6, 10, 4, 8, 4, 10, 4, 4, 10, 1, 12, 3, 14, 5, 7, 12, 4],
    },
    {
      feature_names: "Relationship",
      values: [
        -0.7377435022220016, 1.2036764518916607, -0.7452711698971689,
        1.0043287429586052, 1.8823289382830262, 1.832289764471352,
        -0.7234975075349211, 0.9107830222323536, -0.47692186657339336,
        1.3548874785378575, 0.9875278851576149, 1.2048832443729043,
        -1.0692374949157237, -0.5854159695655108, 1.1638913534022868,
        0.8585906059294939, -0.9179101148247719, -0.7807792189717293,
        0.8585906059294939, -0.8161414371803403,
      ],
      data: [0, 4, 0, 4, 5, 5, 0, 4, 0, 4, 4, 4, 3, 0, 4, 4, 3, 1, 4, 1],
    },
    {
      feature_names: "Race",
      values: [
        0.016187038794159888, 0.0227512164413929, 0.0227512164413929,
        -0.11719971466809512, -0.11719971466809512, 0.0227512164413929,
        -0.11719971466809512, 0.0227512164413929, 0.011745196580886842,
        0.0227512164413929, -0.06617284063249826, -0.12376389231532813,
        0.018584292717278003, -0.06617284063249826, -0.11719971466809512,
        -0.40516083512455225, 0.018584292717278003, 0.0227512164413929,
        0.01644452415406704, 0.0227512164413929,
      ],
      data: [4, 4, 4, 2, 2, 4, 2, 4, 4, 4, 2, 1, 4, 2, 1, 0, 4, 4, 4, 4],
    },
    {
      feature_names: "Sex",
      values: [
        0.1958309858292341, 0.15554548584856093, 0.1958309858292341,
        0.16876798720099032, -0.1313614589255303, -0.1313614589255303,
        -0.3087967583909631, 0.16876798720099032, -0.3344639668986201,
        0.16876798720099032, 0.16876798720099032, 0.16876798720099032,
        -0.25626270528882744, 0.1958309858292341, 0.16876798720099032,
        0.16876798720099032, 0.16876798720099032, 0.1958309858292341,
        0.16876798720099032, -0.3344639668986201,
      ],
      data: [1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0],
    },
    {
      feature_names: "Capital Gain",
      values: [
        -0.9400465438514948, -0.14624650817364454, -0.16018004279583692,
        -0.1624992137774825, -0.15664466496556997, -0.14725591506808997,
        -0.17540603794157505, -0.15508610751479865, 6.184943790100515,
        2.204333906164393, -0.15636774208396673, -0.15369658019393684,
        -0.1693569314852357, -0.16052840121090411, -0.15369658019393684,
        -0.1644245932623744, -0.17006185803562401, -0.16707695908844472,
        -0.16121757920831442, -0.15234985034912824,
      ],
      data: [
        2174, 0, 0, 0, 0, 0, 0, 0, 14084, 5178, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
    },
    {
      feature_names: "Capital Loss",
      values: [
        -0.09052798758260906, -0.0897493899310939, -0.08609519980149344,
        -0.08115831431699917, -0.0823290776158683, -0.084823572083842,
        -0.09102101764874533, -0.0862487791175954, -0.07994986849837005,
        -0.084823572083842, -0.0862487791175954, -0.0823290776158683,
        -0.09676439688075333, -0.09312395791523159, -0.084823572083842,
        -0.08271826934767887, -0.08214558639097959, -0.09055992402601987,
        -0.0837542846496217, -0.09854811657918618,
      ],
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      feature_names: "Hours per week",
      values: [
        -0.13411428320687263, -0.978675934751518, -0.11088123499881476,
        -0.025149265411309896, -0.0580534809269011, -0.07006171792279929,
        -1.1793849172024056, 0.3938494235696271, 0.622768996860832,
        -0.04408896475564689, 0.7635980108566582, -0.036749661061912776,
        -1.016718063163571, 0.6474484957568347, -0.05727568499278277,
        0.26890871649608017, -0.34439739904832095, -0.10905449855607002,
        0.4353792882524431, 0.5574752460094169,
      ],
      data: [
        40, 13, 40, 40, 40, 40, 16, 45, 50, 40, 80, 40, 30, 50, 40, 45, 35, 40,
        50, 45,
      ],
    },
    {
      feature_names: "Country",
      values: [
        0.009160912912338972, 0.012105833273380995, 0.01483024114742875,
        0.01483024114742875, -0.06328608289361, 0.01483024114742875,
        -0.06328608289361, 0.012105833273380995, -0.0006468505226075649,
        -0.0006468505226075649, 0.01483024114742875, -0.035739291831851004,
        0.011885320786386728, 0.01483024114742875, -0.12144826002418994,
        -0.15297974660992622, 0.012105833273380995, 0.01483024114742875,
        0.01483024114742875, 0.012105833273380995,
      ],
      data: [
        39, 39, 39, 39, 5, 39, 23, 39, 39, 39, 39, 19, 39, 39, 0, 26, 39, 39,
        39, 39,
      ],
    },
  ];

  const element = document.createElement("div");
  element.id = "component";
  element.style.width = "1000px";
  element.style.height = "1000px";
  document.body.appendChild(element);

  const decision = new BeeswarmPlot(element);
  decision.plot(
    data,
    "values",
    "feature_names",
    "data",
    800,
    600,
    { top: 40, right: 20, bottom: 30, left: 80 },
    false
  );
}

addForce();
