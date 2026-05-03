function drawPFD(canvas, aircraft, nav, ils) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  drawBackground(ctx, W, H);
  drawFMA(ctx, W);
  drawAttitude(ctx, W, H, aircraft);
  drawSpeed(ctx, aircraft);
  drawAltitude(ctx, W, aircraft);
  drawVerticalSpeed(ctx, W, H, aircraft);
  drawHeading(ctx, W, H, aircraft);
  drawILS(ctx, W, H, nav, ils);
  drawInfo(ctx, W, H, aircraft, nav, ils);
}

function drawBackground(ctx, W, H) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
}

function drawFMA(ctx, W) {
  ctx.font = "22px monospace";
  ctx.textAlign = "left";
  ctx.fillStyle = "#00ff48";
  ctx.fillText("SPEED", 35, 35);
  ctx.fillText("G/S", 165, 35);
  ctx.fillText("LOC", 300, 35);
  ctx.strokeStyle = "#777";
  [140, 270, 405, 535].forEach(x => {
    ctx.beginPath(); ctx.moveTo(x, 8); ctx.lineTo(x, 60); ctx.stroke();
  });
  ctx.fillStyle = "#ffffff";
  ctx.fillText("CAT3", 430, 35);
  ctx.fillText("AP1+2", 555, 35);
}

function drawAttitude(ctx, W, H, a) {
  const cx = W / 2;
  const cy = H / 2 + 10;
  const r = 172;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  ctx.translate(cx, cy);
  ctx.rotate(degToRad(-a.rollDeg));
  ctx.translate(0, a.pitchDeg * 7.5);

  ctx.fillStyle = "#1596e6";
  ctx.fillRect(-400, -500, 800, 500);
  ctx.fillStyle = "#8a4518";
  ctx.fillRect(-400, 0, 800, 500);

  ctx.strokeStyle = "#10ff20";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-400, 0);
  ctx.lineTo(400, 0);
  ctx.stroke();

  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.font = "22px monospace";
  ctx.textAlign = "center";

  for (let p = -30; p <= 30; p += 5) {
    if (p === 0) continue;
    const y = -p * 7.5;
    const len = p % 10 === 0 ? 90 : 45;
    ctx.beginPath();
    ctx.moveTo(-len / 2, y);
    ctx.lineTo(len / 2, y);
    ctx.stroke();

    if (p % 10 === 0) {
      ctx.fillText(String(Math.abs(p)), -78, y + 7);
      ctx.fillText(String(Math.abs(p)), 78, y + 7);
    }
  }

  ctx.restore();

  ctx.strokeStyle = "#111";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "#ffff00";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(cx - 125, cy);
  ctx.lineTo(cx - 38, cy);
  ctx.lineTo(cx - 38, cy + 26);
  ctx.moveTo(cx + 38, cy + 26);
  ctx.lineTo(cx + 38, cy);
  ctx.lineTo(cx + 125, cy);
  ctx.stroke();
  ctx.strokeRect(cx - 6, cy - 6, 12, 12);

  drawRollScale(ctx, cx, cy, r);
}

function drawRollScale(ctx, cx, cy, r) {
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  for (let d = -60; d <= 60; d += 10) {
    const rr = degToRad(d - 90);
    const len = d % 30 === 0 ? 18 : 10;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(rr) * (r + 10), cy + Math.sin(rr) * (r + 10));
    ctx.lineTo(cx + Math.cos(rr) * (r + 10 + len), cy + Math.sin(rr) * (r + 10 + len));
    ctx.stroke();
  }
  ctx.strokeStyle = "#ffff00";
  ctx.beginPath();
  ctx.moveTo(cx, cy - r - 18);
  ctx.lineTo(cx - 13, cy - r - 42);
  ctx.lineTo(cx + 13, cy - r - 42);
  ctx.closePath();
  ctx.stroke();
}

function drawSpeed(ctx, a) {
  const x = 20, y = 135, w = 90, h = 370, cy = y + h / 2;
  ctx.fillStyle = "#777";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "#fff";
  ctx.strokeRect(x, y, w, h);

  ctx.font = "23px monospace";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "left";
  const base = Math.floor(a.speedKt / 20) * 20;
  for (let s = base - 60; s <= base + 80; s += 20) {
    const yy = cy - (s - a.speedKt) * 2.4;
    if (yy < y + 10 || yy > y + h - 10) continue;
    ctx.fillText(String(s), x + 8, yy + 8);
    ctx.beginPath();
    ctx.moveTo(x + w - 25, yy);
    ctx.lineTo(x + w - 5, yy);
    ctx.stroke();
  }

  ctx.fillStyle = "#111";
  ctx.fillRect(x - 5, cy - 23, w + 25, 46);
  ctx.strokeStyle = "#00ffff";
  ctx.lineWidth = 3;
  ctx.strokeRect(x - 5, cy - 23, w + 25, 46);
  ctx.fillStyle = "#fff";
  ctx.fillText(String(Math.round(a.speedKt)), x + 25, cy + 9);
}

function drawAltitude(ctx, W, a) {
  const x = W - 145, y = 135, w = 90, h = 370, cy = y + h / 2;
  ctx.fillStyle = "#777";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);

  ctx.font = "22px monospace";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "left";
  const base = Math.floor(a.altitudeFt / 500) * 500;
  for (let alt = base - 1500; alt <= base + 1500; alt += 500) {
    const yy = cy - (alt - a.altitudeFt) / 6;
    if (yy < y + 10 || yy > y + h - 10) continue;
    ctx.fillText(String(alt).padStart(4, "0"), x + 8, yy + 7);
    ctx.beginPath();
    ctx.moveTo(x + w - 25, yy);
    ctx.lineTo(x + w - 5, yy);
    ctx.stroke();
  }

  ctx.fillStyle = "#111";
  ctx.fillRect(x - 16, cy - 23, w + 32, 46);
  ctx.strokeStyle = "#00ff40";
  ctx.lineWidth = 3;
  ctx.strokeRect(x - 16, cy - 23, w + 32, 46);
  ctx.fillStyle = "#00ff40";
  ctx.fillText(String(Math.round(a.altitudeFt)), x + 4, cy + 9);
}

function drawVerticalSpeed(ctx, W, H, a) {
  const x = W - 35;
  const cy = H / 2 + 10;
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x, 135);
  ctx.lineTo(x, 505);
  ctx.stroke();

  ctx.font = "18px monospace";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "left";
  ctx.fillText("6", x + 10, 148);
  ctx.fillText("2", x + 10, cy - 70);
  ctx.fillText("1", x + 10, cy - 35);
  ctx.fillText("1", x + 10, cy + 45);
  ctx.fillText("2", x + 10, cy + 80);
  ctx.fillText("6", x + 10, 505);

  const yy = cy - clamp(a.verticalSpeedFpm / 2000, -1, 1) * 145;
  ctx.strokeStyle = "#00ff40";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x - 8, cy);
  ctx.lineTo(x + 35, yy);
  ctx.stroke();
}

function drawHeading(ctx, W, H, a) {
  const cx = W / 2;
  const y = H - 88;
  ctx.fillStyle = "#555";
  ctx.fillRect(cx - 170, y, 340, 42);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.strokeRect(cx - 170, y, 340, 42);

  ctx.fillStyle = "#fff";
  ctx.font = "20px monospace";
  ctx.textAlign = "center";
  for (let d = -50; d <= 50; d += 10) {
    const hdg = wrap360(a.headingDeg + d);
    const x = cx + d * 3.1;
    ctx.fillText(String(Math.round(hdg / 10)).padStart(2, "0"), x, y + 28);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 9);
    ctx.stroke();
  }

  ctx.fillStyle = "#ff00ff";
  ctx.beginPath();
  ctx.moveTo(cx, y - 18);
  ctx.lineTo(cx - 12, y + 3);
  ctx.lineTo(cx + 12, y + 3);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#00ff40";
  ctx.font = "28px monospace";
  ctx.fillText(String(Math.round(a.headingDeg)).padStart(3, "0"), cx, y - 27);
}

function drawILS(ctx, W, H, nav, ils) {
  const cx = W / 2;
  const cy = H / 2 + 10;

  ctx.fillStyle = "#ff88ff";
  ctx.font = "22px monospace";
  ctx.textAlign = "left";
  ctx.fillText(ils.ident, 15, H - 150);
  ctx.fillText(ils.frequency, 15, H - 124);
  ctx.fillText(nav.distanceToThresholdNm.toFixed(1) + " NM", 15, H - 98);

  // LOC dots
  ctx.fillStyle = "#fff";
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.arc(cx + i * 52, cy + 190, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  const locX = cx - nav.localizer * 104;
  ctx.strokeStyle = "#ff00ff";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(locX, cy + 167);
  ctx.lineTo(locX + 14, cy + 190);
  ctx.lineTo(locX, cy + 213);
  ctx.lineTo(locX - 14, cy + 190);
  ctx.closePath();
  ctx.stroke();

  // GS dots
  const gx = W - 205;
  ctx.fillStyle = "#fff";
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.arc(gx, cy + i * 52, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  const gsY = cy + nav.glideslope * 104;
  ctx.strokeStyle = "#ff00ff";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(gx - 22, gsY);
  ctx.lineTo(gx, gsY - 14);
  ctx.lineTo(gx + 22, gsY);
  ctx.lineTo(gx, gsY + 14);
  ctx.closePath();
  ctx.stroke();
}

function drawInfo(ctx, W, H, a, nav, ils) {
  ctx.fillStyle = "#7fefff";
  ctx.font = "20px monospace";
  ctx.textAlign = "right";
  ctx.fillText("QNH 1013", W - 120, H - 140);

  ctx.fillStyle = "#00ff40";
  ctx.textAlign = "center";
  ctx.font = "26px monospace";
  ctx.fillText(Math.round(a.altitudeFt), W / 2, H / 2 + 132);
}
