{
  duration: 9,
  setup: function(W, H) { return {}; },
  frame: function(ctx, t, W, H, state) {
    // ---- palette ----
    var BG = "#0a0d14", AMBER = "#e8b64c", CYAN = "#5fd0e0",
        INK = "#eef2f8", DIM = "#8b96a8", GRID = "rgba(120,150,200,0.10)";
    ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);

    // ---- three phases: 0 "From Train A", 1 "From Train B", 2 "From the platform" ----
    var phase = t < 1/3 ? 0 : (t < 2/3 ? 1 : 2);
    var p = (t - phase/3) * 3;              // 0..1 within the phase
    var slide = (p - 0.5) * W * 0.62;       // an object passes through centre mid-phase

    // per-phase displacement of each object (px). Positive = rightward.
    var ax, bx, px, headline;               // train A, train B, platform x-offset from centre
    if (phase === 0) { headline = "From Train A"; ax = 0;      bx = -slide; px = -slide; }
    else if (phase === 1) { headline = "From Train B"; bx = 0;  ax = slide;  px = slide; }
    else { headline = "From the platform"; px = 0; ax = slide;  bx = -slide; }

    var cx = W / 2;
    var yA = H * 0.34, yB = H * 0.66, yP = H * 0.50;
    var tw = W * 0.30, th = H * 0.11;       // train size

    // ---- scrolling grid: moves with whatever is the moving background (the platform) ----
    ctx.strokeStyle = GRID; ctx.lineWidth = 1;
    var step = W * 0.08, gshift = ((px % step) + step) % step;
    for (var gx = -step + gshift; gx < W; gx += step) {
      ctx.beginPath(); ctx.moveTo(gx, H * 0.12); ctx.lineTo(gx, H * 0.88); ctx.stroke();
    }

    // ---- headline ----
    ctx.fillStyle = AMBER;
    ctx.font = "600 " + Math.round(H * 0.045) + "px Georgia, serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(headline, cx, H * 0.10);
    ctx.fillStyle = DIM;
    ctx.font = Math.round(H * 0.026) + "px -apple-system, sans-serif";
    ctx.fillText("motion is relative — only relative velocity is measurable", cx, H * 0.90);

    // ---- helpers ----
    function streaks(x, y, moving, dir, color) {
      if (!moving) return;
      ctx.strokeStyle = color; ctx.globalAlpha = 0.5; ctx.lineWidth = 2;
      for (var i = 0; i < 5; i++) {
        var yy = y - th * 0.35 + (i / 4) * th * 0.7;
        var x0 = x - dir * (tw * 0.55 + 8);
        ctx.beginPath(); ctx.moveTo(x0, yy); ctx.lineTo(x0 - dir * (tw * 0.45), yy); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    function train(x, y, color, label, moving, dir) {
      streaks(x, y, moving, dir, color);
      ctx.strokeStyle = color; ctx.fillStyle = "rgba(95,208,224,0.06)"; ctx.lineWidth = 2.5;
      var w = tw, h = th, nose = w * 0.16;
      // body (nose points in travel direction dir; default right)
      ctx.beginPath();
      ctx.moveTo(x - dir * w / 2, y - h / 2);
      ctx.lineTo(x + dir * (w / 2 - nose), y - h / 2);
      ctx.lineTo(x + dir * w / 2, y);
      ctx.lineTo(x + dir * (w / 2 - nose), y + h / 2);
      ctx.lineTo(x - dir * w / 2, y + h / 2);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // windows
      ctx.fillStyle = color; ctx.globalAlpha = 0.85;
      for (var i = 0; i < 4; i++) {
        var wx = x - w * 0.32 + i * w * 0.18;
        ctx.fillRect(wx - w * 0.04, y - h * 0.16, w * 0.08, h * 0.32);
      }
      ctx.globalAlpha = 1;
      // label
      ctx.fillStyle = INK; ctx.font = "600 " + Math.round(H * 0.03) + "px -apple-system, sans-serif";
      ctx.fillText(label, x, y + h * 0.95);
    }
    function velArrow(x, y, moving, dir, name, color) {
      var len = moving ? tw * 0.5 : tw * 0.14;   // a resting object gets a stub / zero arrow
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dir * len, y); ctx.stroke();
      if (moving) {
        ctx.beginPath();
        ctx.moveTo(x + dir * len, y);
        ctx.lineTo(x + dir * (len - 12), y - 6);
        ctx.lineTo(x + dir * (len - 12), y + 6);
        ctx.closePath(); ctx.fill();
      }
      ctx.fillStyle = color; ctx.font = "italic " + Math.round(H * 0.032) + "px Georgia, serif";
      ctx.fillText(name + (moving ? "" : " = 0"), x + dir * len / 2, y - H * 0.028);
    }
    function observer(x, y) {
      ctx.strokeStyle = AMBER; ctx.fillStyle = AMBER; ctx.lineWidth = 2.5;
      var r = H * 0.018;
      ctx.beginPath(); ctx.arc(x, y - r * 2.4, r, 0, 7); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x, y - r * 1.2); ctx.lineTo(x, y + r * 1.6);
      ctx.moveTo(x, y - r * 0.4); ctx.lineTo(x - r, y + r * 0.4);
      ctx.moveTo(x, y - r * 0.4); ctx.lineTo(x + r, y + r * 0.4);
      ctx.moveTo(x, y + r * 1.6); ctx.lineTo(x - r, y + r * 3);
      ctx.moveTo(x, y + r * 1.6); ctx.lineTo(x + r, y + r * 3);
      ctx.stroke();
      ctx.fillStyle = DIM; ctx.font = Math.round(H * 0.026) + "px -apple-system, sans-serif";
      ctx.fillText("Platform observer", x, y + r * 4.6);
    }

    // ---- moving flags & directions per phase ----
    var aMoving = phase !== 0, bMoving = phase !== 1, pMoving = phase === 2 ? false : (px !== 0);
    // In phase 2 the platform is the fixed frame; both trains move (A right, B left).
    var aDir = (phase === 2) ? 1 : 1;       // A nominally travels right
    var bDir = (phase === 2) ? -1 : -1;     // B nominally travels left
    // draw platform line
    ctx.strokeStyle = "rgba(232,182,76,0.5)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(W * 0.12, yP + th * 0.05); ctx.lineTo(W * 0.88, yP + th * 0.05); ctx.stroke();

    observer(cx + px, yP);
    velArrow(cx + ax - tw * 0.25, yA - th * 0.78, aMoving, aDir, "v₁", AMBER);
    train(cx + ax, yA, CYAN, "Train A", aMoving, aDir);
    velArrow(cx + bx - tw * 0.25, yB - th * 0.78, bMoving, bDir, "v₂", AMBER);
    train(cx + bx, yB, CYAN, "Train B", bMoving, bDir);
  }
}
