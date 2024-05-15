export function getDataMeans(data, x_value, y_value, hue) {
  function getMeans(array) {
    const reduced = array.reduce(function (acc, item) {
      if (!acc[item[x_value]]) {
        const obj = {};
        obj[x_value] = item[x_value];
        obj[y_value] = item[y_value];
        if (hue) obj[hue] = item[hue];
        obj["count"] = 1;
        acc[item[x_value]] = obj;
        return acc;
      }
      acc[item[x_value]][y_value] += item[y_value];
      acc[item[x_value]].count += 1;
      return acc;
    }, {});

    const mapedArray = Object.keys(reduced).map(function (k) {
      const item = reduced[k];
      const itemAverage = {};
      itemAverage[y_value] = item[y_value] / item.count;

      return {
        ...item,
        ...itemAverage,
      };
    });
    mapedArray.sort(dynamicSort(x_value));
    return mapedArray;
  }

  if (!hue) return getMeans(data);

  let groupedHue = groupArrayBy(data, hue);

  let dataMeans = [];
  Object.values(groupedHue).forEach(function (item, index) {
    const means = getMeans(item);
    dataMeans = dataMeans.concat(means);
  });

  return dataMeans;
}

function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

export function groupArrayBy(array, item) {
  return array.reduce(function (acc, i) {
    return {
      ...acc,
      [i[item]]: [...(acc[i[item]] ?? []), i],
    };
  }, {});
}
