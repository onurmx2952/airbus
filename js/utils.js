function degToRad(d) { return d * Math.PI / 180; }
function radToDeg(r) { return r * 180 / Math.PI; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function wrap360(d) { return ((d % 360) + 360) % 360; }

function bearingToXY(distanceNm, bearingDeg) {
  const r = degToRad(bearingDeg);
  return {
    x: Math.sin(r) * distanceNm,
    y: Math.cos(r) * distanceNm
  };
}

function xyToLatLon(refLat, refLon, xEastNm, yNorthNm) {
  return {
    lat: refLat + yNorthNm / 60,
    lon: refLon + xEastNm / (60 * Math.cos(degToRad(refLat)))
  };
}

function latLonToXY(refLat, refLon, lat, lon) {
  return {
    x: (lon - refLon) * 60 * Math.cos(degToRad(refLat)),
    y: (lat - refLat) * 60
  };
}
