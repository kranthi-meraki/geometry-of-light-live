{
  duration: 6,
  setup: function(W, H) {
    return {};
  },
  frame: function(ctx, t, W, H, state) {
    // Background
    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;
    const unit = Math.min(W, H) / 2.5; // Spacetime unit length

    // Animate velocity beta (v/c) from 0 to 0.8 and back to 0
    // Using a sine wave ensures smooth start/stop and completes one full cycle.
    const maxBeta = 0.8;
    const beta = maxBeta * Math.sin(Math.PI * t);

    // Angle of tilt for worldline (from ct-axis) and simultaneity lines (from x-axis)
    const alpha = Math.atan(beta);

    // --- Drawing Setup ---
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.font = "16px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // --- Stationary (Rest Frame) Axes ---
    ctx.strokeStyle = "#9db0c8"; // Dim color for stationary frame
    ctx.shadowColor = "#9db0c8";
    ctx.shadowBlur = 0; // No glow for stationary axes

    // X-axis
    ctx.beginPath();
    ctx.moveTo(cx - unit, cy);
    ctx.lineTo(cx + unit, cy);
    ctx.stroke();
    ctx.fillText("x", cx + unit + 20, cy);

    // CT-axis
    ctx.beginPath();
    ctx.moveTo(cx, cy - unit);
    ctx.lineTo(cx, cy + unit);
    ctx.stroke();
    ctx.fillText("ct", cx, cy - unit - 20);

    // Light cone lines (45 degrees)
    ctx.strokeStyle = "#9db0c8";
    ctx.setLineDash([5, 5]); // Dashed lines
    ctx.beginPath();
    ctx.moveTo(cx - unit, cy - unit);
    ctx.lineTo(cx + unit, cy + unit);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - unit, cy + unit);
    ctx.lineTo(cx + unit, cy - unit);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // --- Moving Observer's Spacetime ---
    ctx.strokeStyle = "#5fd0e0"; // Primary cyan
    ctx.shadowColor = "#5fd0e0";
    ctx.shadowBlur = 10;

    // Observer's Worldline (ct' axis)
    // This line makes an angle 'alpha' with the ct-axis (vertical)
    // Or, (PI/2 - alpha) with the x-axis (horizontal)
    const worldlineX = unit * Math.sin(alpha);
    const worldlineY = unit * Math.cos(alpha);
    ctx.beginPath();
    ctx.moveTo(cx - worldlineX, cy + worldlineY);
    ctx.lineTo(cx + worldlineX, cy - worldlineY);
    ctx.stroke();

    // Label for Worldline
    ctx.save();
    ctx.translate(cx + worldlineX * 0.7, cy - worldlineY * 0.7);
    ctx.rotate(-alpha); // Rotate text to align with the line
    ctx.fillStyle = "#5fd0e0";
    ctx.fillText("Observer's Worldline", 0, -15);
    ctx.restore();

    // Lines of Simultaneity (x' axis parallels)
    // These lines make an angle 'alpha' with the x-axis (horizontal)
    const numLines = 5;
    const lineSpacing = unit / (numLines / 1.5); // Adjust for visual density

    ctx.strokeStyle = "#e8b64c"; // Warm amber
    ctx.shadowColor = "#e8b64c";
    ctx.shadowBlur = 10;

    for (let i = -Math.floor(numLines / 2); i <= Math.floor(numLines / 2); i++) {
      const offset = i * lineSpacing;
      // The equation for a line of simultaneity is ct = beta * x + C
      // C is the intercept on the ct-axis when x=0.
      // We want to draw lines through (x,ct) points that satisfy this,
      // where the 'ct' value is offset from the origin.
      // So, for a given offset 'C', the line passes through (0, C) in (x,ct) coords.
      // In canvas coords, this is (cx, cy - C).
      // The line extends from x_start to x_end.
      const x1 = -unit;
      const y1 = beta * x1 + offset;
      const x2 = unit;
      const y2 = beta * x2 + offset;

      ctx.beginPath();
      ctx.moveTo(cx + x1, cy - y1);
      ctx.lineTo(cx + x2, cy - y2);
      ctx.stroke();
    }

    // Label for Simultaneity Lines
    ctx.save();
    ctx.translate(cx + unit * 0.7 * Math.cos(alpha), cy - unit * 0.7 * Math.sin(alpha));
    ctx.rotate(-alpha); // Rotate text to align with the line
    ctx.fillStyle = "#e8b64c";
    ctx.fillText("Lines of Simultaneity", 0, -15);
    ctx.restore();

    // --- Current Velocity Label ---
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#e8eef7"; // Soft white
    ctx.textAlign = "left";
    ctx.fillText(`v = ${beta.toFixed(2)} c`, cx - unit, cy + unit + 30);
  }
}