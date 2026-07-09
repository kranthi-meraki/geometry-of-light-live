{
  duration: 6,
  setup: function(W, H) {
    return {};
  },
  frame: function(ctx, t, W, H, state) {
    // Background
    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, W, H);

    // --- Configuration ---
    const margin = Math.min(W, H) * 0.15;
    const diagramHeight = Math.min(W, H) - 2 * margin; // Height of the "time" axis
    const diagramWidth = diagramHeight * 1.5; // Make it wider for x-axis

    const centerX = W / 2;
    const centerY = H / 2 + diagramHeight / 2; // Origin at bottom center of diagram area

    const max_ct = 5; // Max time units to display
    const max_x = 5;  // Max space units to display (should match max_ct for light cone slope)

    // Scale: pixels per unit of x or ct. Adjusted to fit diagramHeight for ct, and diagramWidth for x.
    const scale_ct = diagramHeight / (max_ct * 1.1); // Slightly more than max_ct to fit labels
    const scale_x = diagramWidth / (max_x * 2.2); // Twice max_x for full range, plus buffer

    const scale = Math.min(scale_ct, scale_x); // Use the smaller scale to fit everything

    // Colors
    const color_cyan = "#5fd0e0"; // Primary cyan
    const color_amber = "#e8b64c"; // Warm amber
    const color_dim = "#9db0c8";   // Dim
    const color_white = "#e8eef7"; // Soft white

    // Current time to draw up to, driven by t
    const current_ct_display = max_ct * t;

    // --- Helper function for drawing worldlines ---
    function drawWorldlineSegment(pathFunc, color, shadowColor, lineWidth) {
      ctx.beginPath();
      pathFunc();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow
    }

    // --- Spacetime Diagram Elements ---

    // 1. Axes
    ctx.strokeStyle = color_dim;
    ctx.lineWidth = 1;
    ctx.fillStyle = color_white;
    ctx.font = `${Math.round(scale * 0.3)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // CT-axis (vertical)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, centerY - max_ct * scale * 1.1); // Extend slightly for arrowhead
    ctx.stroke();
    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - max_ct * scale * 1.1);
    ctx.lineTo(centerX - 5, centerY - max_ct * scale * 1.1 + 10);
    ctx.lineTo(centerX + 5, centerY - max_ct * scale * 1.1 + 10);
    ctx.closePath();
    ctx.fill();
    ctx.fillText("ct", centerX + 20, centerY - max_ct * scale * 1.1 + 15);

    // X-axis (horizontal)
    ctx.beginPath();
    ctx.moveTo(centerX - max_x * scale * 1.1, centerY);
    ctx.lineTo(centerX + max_x * scale * 1.1, centerY);
    ctx.stroke();
    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(centerX + max_x * scale * 1.1, centerY);
    ctx.lineTo(centerX + max_x * scale * 1.1 - 10, centerY - 5);
    ctx.lineTo(centerX + max_x * scale * 1.1 - 10, centerY + 5);
    ctx.closePath();
    ctx.fill();
    ctx.fillText("x", centerX + max_x * scale * 1.1 - 15, centerY + 20);

    // 2. Light Cone (fixed, dashed)
    ctx.strokeStyle = color_dim;
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1;

    // ct = x (upper right)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + max_x * scale, centerY - max_x * scale);
    ctx.stroke();

    // ct = -x (upper left)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX - max_x * scale, centerY - max_x * scale);
    ctx.stroke();

    ctx.setLineDash([]); // Reset line dash

    // --- Worldlines (animated) ---
    const lineWidth_worldline = 3;

    // 3. Stationary Object Worldline
    // x = -2 (fixed position)
    const x_stationary = -2;
    drawWorldlineSegment(() => {
      ctx.moveTo(centerX + x_stationary * scale, centerY);
      ctx.lineTo(centerX + x_stationary * scale, centerY - Math.min(current_ct_display, max_ct) * scale);
    }, color_white, color_white, lineWidth_worldline);
    if (t > 0.5) { // Show label after some progress
        ctx.fillText("Stationary", centerX + x_stationary * scale, centerY - Math.min(current_ct_display, max_ct) * scale * 0.5 - 20);
    }

    // 4. Uniform Motion Worldline
    // x = 0.4 * ct (velocity v = 0.4c)
    const v_uniform = 0.4;
    const x_uniform_at_current_ct = v_uniform * Math.min(current_ct_display, max_ct);
    drawWorldlineSegment(() => {
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + x_uniform_at_current_ct * scale, centerY - Math.min(current_ct_display, max_ct) * scale);
    }, color_cyan, color_cyan, lineWidth_worldline);
    if (t > 0.5) {
        ctx.fillText("Uniform velocity", centerX + x_uniform_at_current_ct * scale * 0.5, centerY - Math.min(current_ct_display, max_ct) * scale * 0.5 - 20);
    }

    // 5. Accelerating Object Worldline
    // x = 0.1 * (ct)^2 (acceleration such that dx/d(ct) = 0.2*ct, max slope 1 at ct=5)
    const k_accel = 0.1;
    drawWorldlineSegment(() => {
      ctx.moveTo(centerX, centerY);
      const steps = 50; // Number of segments for the curve
      for (let i = 0; i <= steps; i++) {
        const ct_step = Math.min(current_ct_display, max_ct) * (i / steps);
        const x_step = k_accel * ct_step * ct_step;
        ctx.lineTo(centerX + x_step * scale, centerY - ct_step * scale);
      }
    }, color_amber, color_amber, lineWidth_worldline);
    if (t > 0.5) {
        const label_ct = Math.min(current_ct_display, max_ct) * 0.7;
        const label_x = k_accel * label_ct * label_ct;
        ctx.fillText("Acceleration", centerX + label_x * scale, centerY - label_ct * scale - 20);
    }
  }
}