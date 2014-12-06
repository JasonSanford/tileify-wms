var proj4 = require('proj4');
var tilebelt = require('tilebelt');

function TileifyWMS(url_param_config) {
  this.url_parameters = {
    'height': '256',
    'width': '256',
    'srs': 'EPSG:3857',
    'service': 'wms',
    'request': 'GetMap',
    'format': 'image/png'
  };

  if (url_param_config) {
    for (var key in url_param_config) {
      var value = url_param_config[key];
      this.url_parameters[key] = value;
    }
  }
}

TileifyWMS.prototype.getTileUrl = function (url, x, y, z) {
  var polygon = tilebelt.tileToGeoJSON([x, y, z]);
  var bbox = polygonToBbox(polygon);
  var min = projectPoint([bbox[0], bbox[1]]);
  var max = projectPoint([bbox[2], bbox[3]]);
  var projected_bbox = [min[0], min[1], max[0], max[1]];

  url += '?bbox=' + encodeURIComponent(projected_bbox.join(','));
  for (var key in this.url_parameters) {
    var value = encodeURIComponent(this.url_parameters[key]);
    url += '&' + key + '=' + value;
  }

  return url;
};

function polygonToBbox(polygon) {
  var ring = polygon.coordinates[0];
  var min_x = ring[0][0];
  var min_y = ring[0][1];
  var max_x = ring[2][0];
  var max_y = ring[2][1];

  return [min_x, min_y, max_x, max_y];
}

function projectPoint(point) {
  return proj4(proj4.defs('EPSG:3857'), point);
}

module.exports = TileifyWMS;
