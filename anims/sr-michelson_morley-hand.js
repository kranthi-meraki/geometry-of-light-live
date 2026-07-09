{
  duration: 8,
  setup: function(W, H) { return {}; },
  frame: function(ctx, t, W, H, state) {
    var BG = "#0a0d14", CYAN = "#5fd0e0", AMBER = "#e8b64c", INK = "#eef2f8", DIM = "#8b96a8";
    ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
    ctx.lineCap = "round"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    var F = Math.round(H * 0.028) + "px -apple-system, sans-serif";

    var S  = {x: W * 0.12, y: H * 0.54};   // source
    var BS = {x: W * 0.45, y: H * 0.54};   // beam splitter
    var MH = {x: W * 0.84, y: H * 0.54};   // horizontal-arm mirror
    var MV = {x: W * 0.45, y: H * 0.17};   // vertical-arm mirror
    var D  = {x: W * 0.45, y: H * 0.90};   // detector

    // bright beam with a direction arrowhead at 'end'
    function beam(a, b, col, off, arrow) {
      var dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
      var ax = a.x + nx * off, ay = a.y + ny * off, bx = b.x + nx * off, by = b.y + ny * off;
      ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.globalAlpha = 0.9;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); ctx.globalAlpha = 1;
      if (arrow) {
        var ux = dx / L, uy = dy / L, mx = ax + dx * 0.55, my = ay + dy * 0.55;
        ctx.fillStyle = col; ctx.beginPath();
        ctx.moveTo(mx + ux * 8, my + uy * 8);
        ctx.moveTo(mx - ux * 6 + nx * 5, my - uy * 6 + ny * 5);
        ctx.lineTo(mx + ux * 8, my + uy * 8);
        ctx.lineTo(mx - ux * 6 - nx * 5, my - uy * 6 - ny * 5);
        ctx.closePath(); ctx.fill();
      }
    }
    // full persistent light path: out (cyan) and back (lighter), then recombined to detector (amber)
    beam(S, BS, CYAN, 0, true);
    beam(BS, MH, CYAN, -4, true);  beam(MH, BS, "#9fe6f0", 4, true);   // out & back, horizontal arm
    beam(BS, MV, CYAN, -4, true);  beam(MV, BS, "#9fe6f0", 4, true);   // out & back, vertical arm
    beam(BS, D, AMBER, 0, true);                                        // recombined -> detector

    // a moving pulse for liveness
    function pulse(a, b, p, col) {
      if (p < 0 || p > 1) return;
      var x = a.x + (b.x - a.x) * p, y = a.y + (b.y - a.y) * p;
      ctx.fillStyle = "#fff"; ctx.shadowColor = col; ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    }
    if (t < 0.25) pulse(S, BS, t / 0.25, CYAN);
    else if (t < 0.55) { var p = (t - 0.25) / 0.30; pulse(BS, MH, p, CYAN); pulse(BS, MV, p, CYAN); }
    else if (t < 0.85) { var q = (t - 0.55) / 0.30; pulse(MH, BS, q, CYAN); pulse(MV, BS, q, CYAN); }
    else pulse(BS, D, (t - 0.85) / 0.15, AMBER);

    // components
    ctx.strokeStyle = AMBER; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(BS.x - 16, BS.y + 16); ctx.lineTo(BS.x + 16, BS.y - 16); ctx.stroke();
    ctx.strokeStyle = "#cfd7e4"; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(MH.x + 4, MH.y - 22); ctx.lineTo(MH.x + 4, MH.y + 22); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(MV.x - 22, MV.y - 4); ctx.lineTo(MV.x + 22, MV.y - 4); ctx.stroke();
    ctx.fillStyle = AMBER; ctx.beginPath(); ctx.arc(S.x, S.y, 7, 0, 7); ctx.fill();
    ctx.fillStyle = "#9fb0c4"; ctx.beginPath(); ctx.arc(D.x, D.y, 7, 0, 7); ctx.fill();

    ctx.fillStyle = INK; ctx.font = F;
    ctx.fillText("Source", S.x, S.y + H * 0.055);
    ctx.fillText("Beam splitter", BS.x - W * 0.02, BS.y + H * 0.065);
    ctx.fillText("Mirror", MH.x, MH.y - H * 0.055);
    ctx.fillText("Mirror", MV.x + W * 0.085, MV.y);
    ctx.fillStyle = AMBER; ctx.fillText("Detector → interference fringes", D.x, D.y + H * 0.05);
    ctx.fillStyle = DIM; ctx.font = Math.round(H * 0.025) + "px -apple-system, sans-serif";
    ctx.fillText("light splits → reflects off both mirrors → returns → recombines", W / 2, H * 0.045);
  }
}
