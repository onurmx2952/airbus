function drawMiniMap(canvas, aircraft, nav, ils) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = "#061015";
  ctx.fillRect(0, 0, W, H);

  const scale = 18; // px per NM
  const originX = W / 2;
  const originY = H / 2;

  const p = latLonToXY(ils.thresholdLat, ils.thresholdLon, aircraft.lat, aircraft.lon);

  // runway and localizer centerline
  const course = ils.courseDeg;
  drawLineBearing(ctx, originX, originY, course, 2, "#ffffff", 5, scale);
  drawLineBearing(ctx, originX, originY, wrap360(course + 180), 14, "#00ff40", 2, scale);

  // threshold
  ctx.fillStyle = "#fff";
  ctx.fillRect(originX - 6, originY - 6, 12, 12);

  // aircraft
  const ax = originX + p.x * scale;
  const ay = originY - p.y * scale;

  ctx.save();
  ctx.translate(ax, ay);
  ctx.rotate(degToRad(aircraft.headingDeg));
  ctx.strokeStyle = "#ffff00";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -14);
  ctx.lineTo(9, 12);
  ctx.lineTo(0, 7);
  ctx.lineTo(-9, 12);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "#d0d0d0";
  ctx.font = "16px monospace";
  ctx.fillText(`${ils.airport} RWY ${ils.runway} / ${ils.ident} ${ils.frequency}`, 14, 25);
  ctx.fillText(`XTK ${nav.crossTrackNm.toFixed(2)} NM | DME ${nav.distanceToThresholdNm.toFixed(1)} NM`, 14, 50);
}

function drawLineBearing(ctx, x, y, bearingDeg, lengthNm, color, width, scale) {
  const end = bearingToXY(lengthNm, bearingDeg);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + end.x * scale, y - end.y * scale);
  ctx.stroke();
}
