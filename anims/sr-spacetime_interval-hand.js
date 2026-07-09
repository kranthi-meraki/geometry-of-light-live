{
  duration: 7,
  setup: function(W, H) {
    // one event P, boost beta; read its coords in S and S' by PARALLEL projection
    var beta = 0.4, g = 1 / Math.sqrt(1 - beta * beta);
    var ctP = 2.0, xP = 1.0;
    var ctp = g * (ctP - beta * xP), xp = g * (xP - beta * ctP);
    return { beta: beta, ctP: ctP, xP: xP, ctp: ctp, xp: xp,
             s2: ctP * ctP - xP * xP, s2p: ctp * ctp - xp * xp };
  },
  frame: function(ctx, t, W, H, S) {
    var BG = "#0a0d14", WHITE = "#eef2f8", CYAN = "#5fd0e0", AMBER = "#e8b64c", DIM = "#8b96a8";
    ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = "left"; ctx.textBaseline = "middle";
    var Ox = W * 0.40, Oy = H * 0.66, U = Math.min(W, H) * 0.20, b = S.beta;
    function sx(x, ct) { return Ox + x * U; }
    function sy(x, ct) { return Oy - ct * U; }
    function line(x1, c1, x2, c2, col, w, dash) {
      ctx.strokeStyle = col; ctx.lineWidth = w; ctx.setLineDash(dash || []);
      ctx.beginPath(); ctx.moveTo(sx(x1, c1), sy(x1, c1)); ctx.lineTo(sx(x2, c2), sy(x2, c2)); ctx.stroke();
      ctx.setLineDash([]);
    }
    // light line (45 deg) — same in both frames
    line(-2.4, -2.4, 2.4, 2.4, "rgba(232,182,76,0.35)", 1.5);
    // S axes (orthogonal)
    line(0, 0, 0, 2.7, WHITE, 2); line(0, 0, 2.7, 0, WHITE, 2);
    ctx.fillStyle = WHITE; ctx.font = "italic " + Math.round(H * 0.03) + "px Georgia, serif";
    ctx.fillText("ct", sx(0, 2.7) + 6, sy(0, 2.7)); ctx.fillText("x", sx(2.7, 0) + 6, sy(2.7, 0));
    // S' axes: ct' dir (b,1), x' dir (1,b) — symmetric about the 45 line
    line(0, 0, 2.7 * b, 2.7, CYAN, 2); line(0, 0, 2.7, 2.7 * b, CYAN, 2);
    ctx.fillStyle = CYAN;
    ctx.fillText("ct'", sx(2.7 * b, 2.7) + 6, sy(2.7 * b, 2.7)); ctx.fillText("x'", sx(2.7, 2.7 * b) + 6, sy(2.7, 2.7 * b));
    // the single event P
    var xP = S.xP, ctP = S.ctP;
    // PARALLEL projections: to read ct' project P parallel to x' (dir (1,b)); to read x' project parallel to ct' (dir (b,1))
    // foot on ct' axis {s(b,1)}: solve P + u(1,b) = s(b,1)
    var uu = (b * ctP - xP) / (1 - b * b);  // derived
    var s_ct = ctP - b * uu;                // param along ct' axis... use geometry directly:
    // simpler: intersection helpers
    function inter(px, pc, dx, dc, ax, ac) {
      // P + u*(dx,dc) = s*(ax,ac)  -> solve for s
      var det = dx * ac - dc * ax;
      var s = (px * dc - pc * dx) / (ax * dc - ac * dx);
      return s;
    }
    var sCt = inter(xP, ctP, 1, b, b, 1);   // parallel to x'(1,b), hit ct' axis (b,1)
    var sX  = inter(xP, ctP, b, 1, 1, b);   // parallel to ct'(b,1), hit x' axis (1,b)
    var footCt = [b * sCt, sCt], footX = [sX, b * sX];
    // draw parallel projection dashes
    line(xP, ctP, footCt[0], footCt[1], "rgba(95,208,224,0.7)", 1.4, [5, 5]);
    line(xP, ctP, footX[0], footX[1], "rgba(95,208,224,0.7)", 1.4, [5, 5]);
    // also the orthogonal S readings (light dashes)
    line(xP, ctP, 0, ctP, "rgba(238,242,248,0.35)", 1.2, [3, 4]);
    line(xP, ctP, xP, 0, "rgba(238,242,248,0.35)", 1.2, [3, 4]);
    // the two events of the interval: O at the origin and P
    ctx.fillStyle = WHITE; ctx.beginPath(); ctx.arc(sx(0, 0), sy(0, 0), 6, 0, 7); ctx.fill();
    ctx.fillStyle = WHITE; ctx.font = "600 " + Math.round(H * 0.03) + "px Georgia, serif";
    ctx.fillText("O", sx(0, 0) - 16, sy(0, 0) + 16);
    ctx.fillStyle = AMBER; ctx.beginPath(); ctx.arc(sx(xP, ctP), sy(xP, ctP), 7, 0, 7); ctx.fill();
    ctx.fillStyle = AMBER; ctx.font = "600 " + Math.round(H * 0.032) + "px Georgia, serif";
    ctx.fillText("P", sx(xP, ctP) + 12, sy(xP, ctP) - 4);
    // readouts
    ctx.font = Math.round(H * 0.026) + "px -apple-system, sans-serif";
    var L = W * 0.035, y0 = H * 0.10, dy = H * 0.05;
    ctx.fillStyle = WHITE; ctx.fillText("S :   ct = " + S.ctP.toFixed(2) + ",  x = " + S.xP.toFixed(2), L, y0);
    ctx.fillStyle = CYAN;  ctx.fillText("S':   ct' = " + S.ctp.toFixed(2) + ",  x' = " + S.xp.toFixed(2), L, y0 + dy);
    ctx.fillStyle = AMBER; ctx.fillText("interval O→P:  s² = c²Δt² − Δx² = " + S.s2.toFixed(2) + "  (same in S and S')", L, y0 + 2 * dy);
    ctx.fillStyle = DIM;   ctx.fillText("read S' by projecting P parallel to the axes — not perpendicular", L, H * 0.94);
  }
}
