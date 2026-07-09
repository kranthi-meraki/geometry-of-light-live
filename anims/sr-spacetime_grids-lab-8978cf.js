{
  duration: 6,
  setup: function(W, H) {
    return {};
  },
  frame: function(ctx, t, W, H, state) {
    // Background
    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, W, H);

    // Setup coordinate system: origin at center, Y-axis up
    ctx.save();
    ctx.translate(W / 2, H / 2);
    const max_dim = Math.min(W, H);
    const scale = max_dim / 12; // Scale for a reasonable grid size with margins
    ctx.scale(scale, -scale); // Invert Y-axis for standard Cartesian coordinates

    const grid_extent = 5; // Grid lines from -5 to 5 units

    // Calculate velocity and Lorentz factor
    const max_beta = 0.8; // Max relative velocity as a fraction of c (0.8c)
    // Animate beta from 0 to max_beta and back to 0 over the loop
    const beta = max_beta * Math.sin(Math.PI * t);
    const gamma = 1 / Math.sqrt(1 - beta * beta);

    // Draw Light Cones (shared by both observers)
    ctx.strokeStyle = "#e8b64c"; // Warm amber
    ctx.lineWidth = 0.08;
    ctx.shadowColor = "#e8b64c";
    ctx.shadowBlur = 8 / scale; // Adjust blur based on scale

    ctx.beginPath();
    ctx.moveTo(-grid_extent, -grid_extent);
    ctx.lineTo(grid_extent, grid_extent);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-grid_extent, grid_extent);
    ctx.lineTo(grid_extent, -grid_extent);
    ctx.stroke();

    // Reset shadow for grids
    ctx.shadowBlur = 0;

    // Draw Stationary Observer's Grid (S frame, x and ct axes)
    ctx.strokeStyle = "#9db0c8"; // Dim white
    ctx.lineWidth = 0.05;

    for (let i = -grid_extent; i <= grid_extent; i += 1) {
      if (i === 0) continue; // Skip axis lines, draw them separately

      // Vertical lines (constant x)
      ctx.beginPath();
      ctx.moveTo(i, -grid_extent);
      ctx.lineTo(i, grid_extent);
      ctx.stroke();

      // Horizontal lines (constant ct)
      ctx.beginPath();
      ctx.moveTo(-grid_extent, i);
      ctx.lineTo(grid_extent, i);
      ctx.stroke();
    }

    // Draw Moving Observer's Grid (S' frame, x' and ct' axes)
    ctx.strokeStyle = "#5fd0e0"; // Primary cyan
    ctx.lineWidth = 0.05;

    for (let i = -grid_extent; i <= grid_extent; i += 1) {
      // Lines of constant ct' (parallel to x' axis, slope beta)
      // Equation: ct = beta * x + C, where C = i / gamma
      const C_ct_prime = i / gamma;
      ctx.beginPath();
      ctx.moveTo(-grid_extent, beta * (-grid_extent) + C_ct_prime);
      ctx.lineTo(grid_extent, beta * grid_extent + C_ct_prime);
      ctx.stroke();

      // Lines of constant x' (parallel to ct' axis, slope 1/beta)
      // Equation: x = beta * ct + C, where C = i / gamma
      // Rearranged for drawing: ct = (x - C) / beta
      const C_x_prime = i / gamma;
      if (Math.abs(beta) > 1e-6) { // Avoid division by zero when beta is near 0
        ctx.beginPath();
        ctx.moveTo(-grid_extent, (-grid_extent - C_x_prime) / beta);
        ctx.lineTo(grid_extent, (grid_extent - C_x_prime) / beta);
        ctx.stroke();
      } else { // When beta is 0, x' lines are vertical, ct' lines are horizontal
        // This case is handled by the stationary grid, but for consistency:
        // x = C_x_prime (vertical lines)
        ctx.beginPath();
        ctx.moveTo(C_x_prime, -grid_extent);
        ctx.lineTo(C_x_prime, grid_extent);
        ctx.stroke();
      }
    }

    // Draw Axes (thicker lines)
    ctx.lineWidth = 0.1;
    ctx.lineCap = "round";

    // Stationary axes (x and ct)
    ctx.strokeStyle = "#e8eef7"; // Soft white
    ctx.shadowColor = "#e8eef7";
    ctx.shadowBlur = 10 / scale;

    // x-axis
    ctx.beginPath();
    ctx.moveTo(-grid_extent, 0);
    ctx.lineTo(grid_extent, 0);
    ctx.stroke();

    // ct-axis
    ctx.beginPath();
    ctx.moveTo(0, -grid_extent);
    ctx.lineTo(0, grid_extent);
    ctx.stroke();

    // Moving axes (x' and ct')
    ctx.strokeStyle = "#5fd0e0"; // Primary cyan
    ctx.shadowColor = "#5fd0e0";
    ctx.shadowBlur = 10 / scale;

    // x' axis (ct' = 0 => ct = beta * x)
    ctx.beginPath();
    ctx.moveTo(-grid_extent, beta * (-grid_extent));
    ctx.lineTo(grid_extent, beta * grid_extent);
    ctx.stroke();

    // ct' axis (x' = 0 => x = beta * ct)
    // Rearranged for drawing: ct = x / beta
    if (Math.abs(beta) > 1e-6) {
      ctx.beginPath();
      ctx.moveTo(-grid_extent, -grid_extent / beta);
      ctx.lineTo(grid_extent, grid_extent / beta);
      ctx.stroke();
    } else { // When beta is 0, ct' axis is ct axis
      ctx.beginPath();
      ctx.moveTo(0, -grid_extent);
      ctx.lineTo(0, grid_extent);
      ctx.stroke();
    }

    ctx.shadowBlur = 0; // Reset shadow

    // Labels
    ctx.fillStyle = "#e8eef7";
    ctx.font = `${0.4 * scale}px sans-serif`; // Adjust font size based on scale
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.save();
    ctx.scale(1, -1); // Flip text back upright

    // Stationary labels
    ctx.fillText("x", grid_extent + 0.5, 0);
    ctx.fillText("ct", 0, grid_extent + 0.5);

    // Moving labels
    ctx.fillStyle = "#5fd0e0";
    const x_prime_label_x = grid_extent + 0.5;
    const x_prime_label_y = beta * grid_extent; // Approx position along x' axis
    ctx.fillText("x'", x_prime_label_x, x_prime_label_y);

    const ct_prime_label_x = beta * grid_extent; // Approx position along ct' axis
    const ct_prime_label_y = grid_extent + 0.5;
    ctx.fillText("ct'", ct_prime_label_x, ct_prime_label_y);

    ctx.restore(); // Restore text scale

    // Velocity label
    ctx.fillStyle = "#e8eef7";
    ctx.font = `${0.35 * scale}px sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`v = ${beta.toFixed(2)}c`, -W / (2 * scale) + 0.5, H / (2 * scale) - 0.7);


    ctx.restore(); // Restore canvas transform
  }
}