{
  duration: 7,
  setup: function(W, H) { return {}; },
  frame: function(ctx, t, W, H, S) {
    var BG = "#0a0d14", WHITE = "#eef2f8", AMBER = "#e8b64c", CYAN = "#5fd0e0", DIM = "#8b96a8";
    ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
    var Ox = W * 0.5, Oy = H * 0.52, R = Math.min(W, H) * 0.42;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";

    // shaded wedges (future up, past down, elsewhere left/right)
    function wedge(a0, a1, col) {
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(Ox, Oy);
      ctx.arc(Ox, Oy, R, a0, a1, false); ctx.closePath(); ctx.fill();
    }
    // angles: up is -90deg; light lines at 45deg
    var d = Math.PI / 180;
    wedge(-135 * d, -45 * d, "rgba(95,208,224,0.10)");   // future (top)
    wedge(45 * d, 135 * d, "rgba(232,182,76,0.08)");     // past (bottom)
    wedge(-45 * d, 45 * d, "rgba(150,150,170,0.06)");    // right elsewhere
    wedge(135 * d, 225 * d, "rgba(150,150,170,0.06)");   // left elsewhere

    // axes
    ctx.strokeStyle = "rgba(238,242,248,0.5)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(Ox, Oy - R); ctx.lineTo(Ox, Oy + R); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(Ox - R, Oy); ctx.lineTo(Ox + R, Oy); ctx.stroke();
    // light lines (45 deg) — the cone
    ctx.strokeStyle = AMBER; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(Ox - R, Oy - R); ctx.lineTo(Ox + R, Oy + R); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(Ox - R, Oy + R); ctx.lineTo(Ox + R, Oy - R); ctx.stroke();

    // labels
    ctx.font = "600 " + Math.round(H * 0.033) + "px Georgia, serif";
    ctx.fillStyle = CYAN; ctx.fillText("FUTURE", Ox, Oy - R * 0.62);
    ctx.font = Math.round(H * 0.022) + "px -apple-system, sans-serif";
    ctx.fillStyle = DIM; ctx.fillText("events E can cause", Ox, Oy - R * 0.62 + H * 0.035);
    ctx.font = "600 " + Math.round(H * 0.033) + "px Georgia, serif";
    ctx.fillStyle = AMBER; ctx.fillText("PAST", Ox, Oy + R * 0.62);
    ctx.font = Math.round(H * 0.022) + "px -apple-system, sans-serif";
    ctx.fillStyle = DIM; ctx.fillText("events that can cause E", Ox, Oy + R * 0.62 + H * 0.035);
    ctx.font = "600 " + Math.round(H * 0.03) + "px Georgia, serif";
    ctx.fillStyle = "#c7cede";
    ctx.fillText("ELSEWHERE", Ox + R * 0.66, Oy - H * 0.012);
    ctx.fillText("ELSEWHERE", Ox - R * 0.66, Oy - H * 0.012);
    ctx.font = Math.round(H * 0.021) + "px -apple-system, sans-serif";
    ctx.fillStyle = DIM;
    ctx.fillText("no causal link", Ox + R * 0.66, Oy + H * 0.022);
    ctx.fillText("no causal link", Ox - R * 0.66, Oy + H * 0.022);
    ctx.fillStyle = WHITE; ctx.fillText("ct", Ox + H * 0.02, Oy - R + H * 0.02);
    ctx.fillStyle = WHITE; ctx.fillText("x", Ox + R - H * 0.02, Oy + H * 0.025);

    // event E and a sample reachable / unreachable event
    function ev(x, y, col, lab) {
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 6, 0, 7); ctx.fill();
      ctx.fillStyle = col; ctx.font = Math.round(H * 0.022) + "px -apple-system, sans-serif";
      ctx.fillText(lab, x, y - H * 0.03);
    }
    ev(Ox, Oy, AMBER, "E");
    ev(Ox + R * 0.14, Oy - R * 0.55, CYAN, "reachable");         // inside future cone
    ev(Ox + R * 0.72, Oy - R * 0.12, "#b9c2d0", "unreachable");  // in elsewhere
  }
}
