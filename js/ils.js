function calculateILS(aircraft, ils) {
  const pos = latLonToXY(ils.thresholdLat, ils.thresholdLon, aircraft.lat, aircraft.lon);

  const course = degToRad(ils.courseDeg);
  const courseEast = Math.sin(course);
  const courseNorth = Math.cos(course);

  const east = pos.x;
  const north = pos.y;

  const alongNm = east * courseEast + north * courseNorth;
  const crossTrackNm = east * courseNorth - north * courseEast;

  // ILS yaklaşmada uçak çoğu zaman threshold'un gerisindedir.
  const distanceToThresholdNm = Math.sqrt(east * east + north * north);

  // Açısal localizer sapması. Basitleştirilmiş ama davranış daha doğru.
  const angleErrorDeg = radToDeg(Math.atan2(crossTrackNm, Math.max(distanceToThresholdNm, 0.1)));
  const localizer = clamp(angleErrorDeg / 2.5, -1, 1);

  const targetAltFt =
    ils.runwayElevationFt +
    Math.tan(degToRad(ils.glideSlopeDeg)) * distanceToThresholdNm * 6076.12;

  const altitudeErrorFt = aircraft.altitudeFt - targetAltFt;

  // Yaklaşık 0.7 derece tam skala.
  const gsAngleErrorDeg =
    radToDeg(Math.atan2(altitudeErrorFt, Math.max(distanceToThresholdNm * 6076.12, 1)));

  const glideslope = clamp(gsAngleErrorDeg / 0.7, -1, 1);

  return {
    distanceToThresholdNm,
    crossTrackNm,
    alongNm,
    angleErrorDeg,
    localizer,
    targetAltFt,
    altitudeErrorFt,
    gsAngleErrorDeg,
    glideslope
  };
}
