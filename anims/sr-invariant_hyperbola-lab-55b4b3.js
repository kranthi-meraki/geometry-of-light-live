{
  duration: 6,
  setup: function(W, H) {
    return {
      scale: Math.min(W, H) * 0.25, // Pixels per unit in spacetime
      v_max: 0.8 // Maximum boost velocity (fraction of c)
    };
  },
  frame: function(ctx, t, W, H, state) {
    const { scale, v_max } = state;

    // Background
    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, W, H);

    // Center the coordinate system
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.scale(scale, -scale); // Flip y-axis for mathematical coordinates

    // --- Fixed elements: Light Cone, Spacetime Axes, and Invariant Hyperbolae ---

    // Light cone (t = ±x) - Dim color
    ctx.strokeStyle = "#9db0c8";
    ctx.lineWidth = 1 / scale; // Make line width independent of scale
    ctx.beginPath();
    ctx.moveTo(-W / (2 * scale), -W / (2 * scale));
    ctx.lineTo(W / (2 * scale), W / (2 * scale));
    ctx.moveTo(-W / (2 * scale), W / (2 * scale));
    ctx.lineTo(W / (2 * scale), -W / (2 * scale));
    ctx.stroke();

    // Spacetime axes (x and t) - Dim color
    ctx.beginPath();
    ctx.moveTo(-W / (2 * scale), 0);
    ctx.lineTo(W / (2 * scale), 0); // x-axis
    ctx.moveTo(0, -H / (2 * scale));
    ctx.lineTo(0, H / (2 * scale)); // t-axis
    ctx.stroke();

    // Labels for fixed axes
    ctx.fillStyle = "#9db0c8";
    ctx.font = `${14 / scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.save();
    ctx.scale(1, -1); // Unflip text for correct orientation
    ctx.fillText("x", W / (2 * scale) - 0.5, -0.2);
    ctx.fillText("t", 0.2, H / (2 * scale) - 0.5);
    ctx.restore();

    // Invariant Hyperbolae (timelike: t^2 - x^2 = s^2, spacelike: x^2 - t^2 = s^2)
    ctx.strokeStyle = "#5fd0e0"; // Primary cyan
    ctx.shadowColor = "#5fd0e0";
    ctx.shadowBlur = 5 / scale;
    ctx.lineWidth = 1.5 / scale;

    const s_values = [0.5, 1, 1.5, 2]; // Different invariant interval magnitudes
    const max_coord = Math.max(W, H) / (2 * scale); // Max extent for drawing

    for (const s of s_values) {
      // Timelike hyperbolae (t^2 - x^2 = s^2)
      // Upper branch: t = sqrt(s^2 + x^2)
      ctx.beginPath();
      for (let x = -max_coord; x <= max_coord; x += 0.01) {
        const t_val = Math.sqrt(s * s + x * x);
        if (!isNaN(t_val)) {
          if (x === -max_coord) ctx.moveTo(x, t_val);
          else ctx.lineTo(x, t_val);
        }
      }
      ctx.stroke();

      // Lower branch: t = -sqrt(s^2 + x^2)
      ctx.beginPath();
      for (let x = -max_coord; x <= max_coord; x += 0.01) {
        const t_val = -Math.sqrt(s * s + x * x);
        if (!isNaN(t_val)) {
          if (x === -max_coord) ctx.moveTo(x, t_val);
          else ctx.lineTo(x, t_val);
        }
      }
      ctx.stroke();

      // Spacelike hyperbolae (x^2 - t^2 = s^2)
      // Right branch: x = sqrt(s^2 + t^2)
      ctx.beginPath();
      for (let t_val = -max_coord; t_val <= max_coord; t_val += 0.01) {
        const x_val = Math.sqrt(s * s + t_val * t_val);
        if (!isNaN(x_val)) {
          if (t_val === -max_coord) ctx.moveTo(x_val, t_val);
          else ctx.lineTo(x_val, t_val);
        }
      }
      ctx.stroke();

      // Left branch: x = -sqrt(s^2 + t^2)
      ctx.beginPath();
      for (let t_val = -max_coord; t_val <= max_coord; t_val += 0.01) {
        const x_val = -Math.sqrt(s * s + t_val * t_val);
        if (!isNaN(x_val)) {
          if (t_val === -max_coord) ctx.moveTo(x_val, t_val);
          else ctx.lineTo(x_val, t_val);
        }
      }
      ctx.stroke();
    }
    ctx.shadowBlur = 0; // Turn off shadow for subsequent drawings

    // --- Animated element: Boosted Observer's Axes ---

    // Animate velocity v from 0 to v_max and back to 0
    // t goes from 0 to 1. Math.sin(Math.PI * t) goes from 0 to 1 (at t=0.5) and back to 0 (at t=1).
    const v = v_max * Math.sin(Math.PI * t);

    // Boosted axes (x' and t') - Amber color
    ctx.strokeStyle = "#e8b64c"; // Warm amber
    ctx.shadowColor = "#e8b64c";
    ctx.shadowBlur = 7 / scale;
    ctx.lineWidth = 1.5 / scale;

    // t'-axis: x = v*t (slope 1/v in (x,t) plane)
    // x'-axis: t = v*x (slope v in (x,t) plane)
    // Both lines pass through the origin.
    // The angle of the t' axis with the t axis is atanh(v).
    // The angle of the x' axis with the x axis is atanh(v).

    // Draw t'-axis (line with slope 1/v)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    // Use a large coordinate value to ensure lines extend across the canvas
    const axis_length = Math.max(W, H) / (2 * scale) * 1.5;
    ctx.lineTo(v * axis_length, axis_length);
    ctx.moveTo(0, 0);
    ctx.lineTo(v * -axis_length, -axis_length);
    ctx.stroke();

    // Draw x'-axis (line with slope v)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(axis_length, v * axis_length);
    ctx.moveTo(0, 0);
    ctx.lineTo(-axis_length, v * -axis_length);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Labels for boosted axes
    ctx.fillStyle = "#e8b64c";
    ctx.font = `${14 / scale}px sans-serif`;
    ctx.save();
    ctx.scale(1, -1); // Unflip text

    // Position labels slightly offset from the end of the axes
    const label_offset = 0.3;
    const current_v_display = v.toFixed(2);

    // t' label
    const t_prime_x_label = v * (axis_length - label_offset);
    const t_prime_y_label = (axis_length - label_offset);
    ctx.fillText("t'", t_prime_x_label, -t_prime_y_label);

    // x' label
    const x_prime_x_label = (axis_length - label_offset);
    const x_prime_y_label = v * (axis_length - label_offset);
    ctx.fillText("x'", x_prime_x_label, -x_prime_y_label);

    // Label for velocity
    ctx.textAlign = "left";
    ctx.fillText(`v = ${current_v_display}c`, -W / (2 * scale) + 0.5, H / (2 * scale) - 0.5);

    ctx.restore();
    ctx.restore(); // Restore main context transform
  }
}