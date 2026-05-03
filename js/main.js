const pfdCanvas = document.getElementById("pfd");
const mapCanvas = document.getElementById("map");
const debug = document.getElementById("debug");
const ilsSelect = document.getElementById("ilsSelect");

const aircraft = new Aircraft();
let running = true;
let selectedILS = NAVDATA[2];

const controls = {
  speed: document.getElementById("speed"),
  alt: document.getElementById("alt"),
  hdg: document.getElementById("hdg"),
  pitch: document.getElementById("pitch"),
  roll: document.getElementById("roll"),
  vs: document.getElementById("vs")
};

const vals = {
  speed: document.getElementById("speedVal"),
  alt: document.getElementById("altVal"),
  hdg: document.getElementById("hdgVal"),
  pitch: document.getElementById("pitchVal"),
  roll: document.getElementById("rollVal"),
  vs: document.getElementById("vsVal")
};

NAVDATA.forEach((ils, idx) => {
  const opt = document.createElement("option");
  opt.value = idx;
  opt.textContent = `${ils.airport} RWY ${ils.runway} - ${ils.ident} ${ils.frequency}`;
  ilsSelect.appendChild(opt);
});
ilsSelect.value = "2";

ilsSelect.addEventListener("change", () => {
  selectedILS = NAVDATA[Number(ilsSelect.value)];
});

document.getElementById("startBtn").onclick = () => running = !running;
document.getElementById("resetBtn").onclick = () => {
  aircraft.reset();
  syncControls();
};
document.getElementById("approachBtn").onclick = () => {
  aircraft.placeOnILS(selectedILS);
  syncControls();
};

function readControls() {
  aircraft.speedKt = Number(controls.speed.value);
  aircraft.altitudeFt = Number(controls.alt.value);
  aircraft.headingDeg = Number(controls.hdg.value);
  aircraft.pitchDeg = Number(controls.pitch.value);
  aircraft.rollDeg = Number(controls.roll.value);
  aircraft.verticalSpeedFpm = Number(controls.vs.value);

  vals.speed.textContent = `${Math.round(aircraft.speedKt)} kt`;
  vals.alt.textContent = `${Math.round(aircraft.altitudeFt)} ft`;
  vals.hdg.textContent = `${Math.round(aircraft.headingDeg)}°`;
  vals.pitch.textContent = `${aircraft.pitchDeg.toFixed(1)}°`;
  vals.roll.textContent = `${aircraft.rollDeg.toFixed(1)}°`;
  vals.vs.textContent = `${Math.round(aircraft.verticalSpeedFpm)} fpm`;
}

function syncControls() {
  controls.speed.value = aircraft.speedKt;
  controls.alt.value = clamp(aircraft.altitudeFt, 500, 7000);
  controls.hdg.value = aircraft.headingDeg;
  controls.pitch.value = aircraft.pitchDeg;
  controls.roll.value = aircraft.rollDeg;
  controls.vs.value = aircraft.verticalSpeedFpm;
}

let last = performance.now();

function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;

  readControls();

  if (running) {
    aircraft.update(dt);
    controls.alt.value = clamp(aircraft.altitudeFt, 500, 7000);
  }

  const nav = calculateILS(aircraft, selectedILS);

  drawPFD(pfdCanvas, aircraft, nav, selectedILS);
  drawMiniMap(mapCanvas, aircraft, nav, selectedILS);

  debug.textContent = JSON.stringify({
    aircraft: {
      lat: aircraft.lat.toFixed(6),
      lon: aircraft.lon.toFixed(6),
      altitudeFt: Math.round(aircraft.altitudeFt),
      speedKt: Math.round(aircraft.speedKt),
      headingDeg: Math.round(aircraft.headingDeg),
      pitchDeg: aircraft.pitchDeg,
      rollDeg: aircraft.rollDeg,
      verticalSpeedFpm: Math.round(aircraft.verticalSpeedFpm)
    },
    ils: {
      airport: selectedILS.airport,
      runway: selectedILS.runway,
      ident: selectedILS.ident,
      frequency: selectedILS.frequency,
      courseDeg: selectedILS.courseDeg
    },
    nav: {
      localizer: nav.localizer.toFixed(3),
      glideslope: nav.glideslope.toFixed(3),
      distanceNm: nav.distanceToThresholdNm.toFixed(2),
      crossTrackNm: nav.crossTrackNm.toFixed(2),
      altitudeErrorFt: Math.round(nav.altitudeErrorFt),
      targetAltFt: Math.round(nav.targetAltFt)
    }
  }, null, 2);

  requestAnimationFrame(loop);
}

syncControls();
requestAnimationFrame(loop);
