{
  duration: 6,
  setup: function(W, H) {
    return {};
  },
  frame: function(ctx, t, W, H, state) {
    // Background
    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, W, H);

    ctx.save();

    // Translate origin to center of canvas
    ctx.translate(W / 2, H / 2);

    // Determine the size of the light cone diagram
    const marginRatio = 0.15;
    const minDim = Math.min(W, H);
    const drawingAreaSize = minDim * (1 - 2 * marginRatio);
    const maxExtent = drawingAreaSize / 2; // Max absolute x or y coordinate from center

    // --- Draw Axes (for reference) ---
    ctx.strokeStyle = "#9db0c8";
    ctx.lineWidth = 1;

    // x-axis (space)
    ctx.beginPath();
    ctx.moveTo(-maxExtent, 0);
    ctx.lineTo(maxExtent, 0);
    ctx.stroke();

    // ct-axis (time, canvas y-axis is inverted to make positive ct go up)
    ctx.beginPath();
    ctx.moveTo(0, -maxExtent);
    ctx.lineTo(0, maxExtent);
    ctx.stroke();

    // --- Draw Static Light Cone Lines ---
    ctx.strokeStyle = "#9db0c8";
    ctx.lineWidth = 2;

    ctx.beginPath();
    // Line for ct = x (future light cone, goes from top-left to bottom-right in canvas coords)
    ctx.moveTo(-maxExtent, maxExtent);
    ctx.lineTo(maxExtent, -maxExtent);
    // Line for ct = -x (future light cone, goes from top-right to bottom-left in canvas coords)
    ctx.moveTo(-maxExtent, -maxExtent);
    ctx.lineTo(maxExtent, maxExtent);
    ctx.stroke();

    // --- Draw Labels for Wedges ---
    ctx.fillStyle = "#e8eef7";
    ctx.font = `bold ${Math.max(16, minDim * 0.035)}px sans-serif`; // Responsive font size
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const labelOffset = maxExtent * 0.4; // Position labels well inside wedges

    // FUTURE (top wedge: ct > |x|)
    ctx.fillText("FUTURE", 0, -labelOffset);
    // PAST (bottom wedge: ct < -|x|)
    ctx.fillText("PAST", 0, labelOffset);
    // ELSEWHERE (left wedge: x < -|ct|)
    ctx.fillText("ELSEWHERE", -labelOffset, 0);
    // ELSEWHERE (right wedge: x > |ct|)
    ctx.fillText("ELSEWHERE", labelOffset, 0);

    // --- Draw Event Dot at Origin ---
    ctx.fillStyle = "#e8b64c";
    ctx.beginPath();
    ctx.arc(0, 0, maxExtent * 0.02, 0, 2 * Math.PI);
    ctx.fill();

    // --- Animate Expanding Light Rays ---
    const rayLength = t * maxExtent * 0.9; // Rays expand from 0 to 90% of maxExtent
    ctx.strokeStyle = "#5fd0e0";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#5fd0e0";
    ctx.shadowBlur = 15;

    ctx.beginPath();
    // Ray expanding into future-right cone (x > 0, ct > 0)
    ctx.moveTo(0, 0);
    ctx.lineTo(rayLength, -rayLength);
    // Ray expanding into future-left cone (x < 0, ct > 0)
    ctx.moveTo(0, 0);
    ctx.lineTo(-rayLength, -rayLength);
    ctx.stroke();

    ctx.shadowBlur = 0; // Reset shadow

    ctx.restore();
  }
}