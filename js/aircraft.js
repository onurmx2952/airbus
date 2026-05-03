class Aircraft {
  constructor() {
    this.reset();
  }

  reset() {
    this.lat = 40.0600;
    this.lon = 32.1100;
    this.altitudeFt = 4200;
    this.speedKt = 145;
    this.headingDeg = 252;
    this.pitchDeg = -2;
    this.rollDeg = 0;
    this.verticalSpeedFpm = -700;
  }

  placeOnILS(ils, distanceNm = 8, lateralNm = 0.15, altitudeOffsetFt = 120) {
    // Uçağı pist eşiğinin gerisine, localizer hattı yakınına koy.
    const inbound = wrap360(ils.courseDeg + 180);
    const base = bearingToXY(distanceNm, inbound);
    const rightOfCourse = bearingToXY(lateralNm, wrap360(ils.courseDeg + 90));

    const p = xyToLatLon(
      ils.thresholdLat,
      ils.thresholdLon,
      base.x + rightOfCourse.x,
      base.y + rightOfCourse.y
    );

    this.lat = p.lat;
    this.lon = p.lon;
    this.headingDeg = ils.courseDeg;
    this.speedKt = 145;
    this.verticalSpeedFpm = -700;
    this.pitchDeg = -2;
    this.rollDeg = 0;

    const targetAlt = ils.runwayElevationFt + Math.tan(degToRad(ils.glideSlopeDeg)) * distanceNm * 6076.12;
    this.altitudeFt = targetAlt + altitudeOffsetFt;
  }

  update(dt) {
    const nm = this.speedKt * dt / 3600;
    const move = bearingToXY(nm, this.headingDeg);
    const p = xyToLatLon(this.lat, this.lon, move.x, move.y);
    this.lat = p.lat;
    this.lon = p.lon;
    this.altitudeFt += this.verticalSpeedFpm * dt / 60;
  }
}
