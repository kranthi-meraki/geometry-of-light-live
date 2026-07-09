{
  duration: 6,
  setup: function(W, H) {
    return {};
  },
  frame: function(ctx, t, W, H, state) {
    // Background
    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, W, H);

    // Constants and parameters
    const c = 1; // Speed of light (normalized to 1 for calculations)
    const v_max_fraction_c = 0.95; // Maximum speed as a fraction of c (e.g., 0.95c)
    const margin = W * 0.1;
    const usableWidth = W - 2 * margin;

    const shipHeight = H * 0.08;
    const shipWidthProper = usableWidth * 0.4;

    // Time-dependent velocity and contraction
    // Speed magnitude 'v' goes from 0 to v_max_fraction_c at t=0.5, then back to 0 at t=1.
    const v = v_max_fraction_c * Math.sin(Math.PI * t);
    const v_display = v.toFixed(2); // For displaying velocity

    // Lorentz factor (gamma)
    const gamma = 1 / Math.sqrt(1 - (v * v) / (c * c));

    // Contracted length
    const shipWidthContracted = shipWidthProper / gamma;

    // Position of the moving ship
    // The ship starts near the left, moves right, and ends near the right.
    // The displacement is based on the integral of the velocity function.
    // The term (1 - Math.cos(Math.PI * t)) goes from 0 to 2 over t:0->1.
    const max_x_travel_factor = 0.6; // Ship travels across 60% of the usable width
    const x_offset = (max_x_travel_factor * usableWidth / 2) * (1 - Math.cos(Math.PI * t));

    const x_initial_center = margin + usableWidth * 0.2; // Center X for the ship at t=0
    const x_ship_center = x_initial_center + x_offset; // Current center X of the moving ship

    const y_ref_ship_center = H * 0.35; // Y position for the stationary reference ship
    const y_moving_ship_center = H * 0.65; // Y position for the moving ship

    // --- Draw Stationary Reference Ship ---
    ctx.fillStyle = "#e8b64c"; // Warm amber
    ctx.shadowColor = "#e8b64c";
    ctx.shadowBlur = 10;
    ctx.fillRect(x_initial_center - shipWidthProper / 2, y_ref_ship_center - shipHeight / 2, shipWidthProper, shipHeight);
    ctx.shadowBlur = 0; // Reset shadow

    // Label for proper length
    ctx.fillStyle = "#e8eef7"; // Soft white
    ctx.font = "16px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Proper Length (v=0)", x_initial_center - shipWidthProper / 2, y_ref_ship_center - shipHeight / 2 - 15);

    // Reference lines for proper length
    ctx.strokeStyle = "#9db0c8"; // Dim
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x_initial_center - shipWidthProper / 2, y_ref_ship_center - shipHeight / 2 - 5);
    ctx.lineTo(x_initial_center - shipWidthProper / 2, y_ref_ship_center - shipHeight / 2 - 25);
    ctx.moveTo(x_initial_center + shipWidthProper / 2, y_ref_ship_center - shipHeight / 2 - 5);
    ctx.lineTo(x_initial_center + shipWidthProper / 2, y_ref_ship_center - shipHeight / 2 - 25);
    ctx.stroke();

    // --- Draw Moving Ship ---
    ctx.fillStyle = "#5fd0e0"; // Primary cyan
    ctx.shadowColor = "#5fd0e0";
    ctx.shadowBlur = 15;
    ctx.fillRect(x_ship_center - shipWidthContracted / 2, y_moving_ship_center - shipHeight / 2, shipWidthContracted, shipHeight);
    ctx.shadowBlur = 0; // Reset shadow

    // Label for moving ship
    ctx.fillStyle = "#e8eef7"; // Soft white
    ctx.textAlign = "left";
    ctx.fillText("Moving Object", x_ship_center - shipWidthContracted / 2, y_moving_ship_center - shipHeight / 2 - 15);

    // Display current velocity
    ctx.textAlign = "center";
    ctx.fillText(`v = ${v_display}c`, W / 2, y_moving_ship_center + shipHeight / 2 + 30);

    // Reference lines for current contracted length
    ctx.strokeStyle = "#9db0c8"; // Dim
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x_ship_center - shipWidthContracted / 2, y_moving_ship_center + shipHeight / 2 + 5);
    ctx.lineTo(x_ship_center - shipWidthContracted / 2, y_moving_ship_center + shipHeight / 2 + 25);
    ctx.moveTo(x_ship_center + shipWidthContracted / 2, y_moving_ship_center + shipHeight / 2 + 5);
    ctx.lineTo(x_ship_center + shipWidthContracted / 2, y_moving_ship_center + shipHeight / 2 + 25);
    ctx.stroke();

    // Small arrow to indicate direction of motion
    if (v > 0.01) { // Only show arrow when moving significantly
        ctx.strokeStyle = "#e8b64c"; // Amber for motion indicator
        ctx.lineWidth = 2;
        ctx.beginPath();
        const arrowLength = 30;
        const arrowHeight = 10;
        const arrowX = x_ship_center + shipWidthContracted / 2 + 10;
        const arrowY = y_moving_ship_center;
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX + arrowLength, arrowY);
        ctx.lineTo(arrowX + arrowLength - arrowHeight, arrowY - arrowHeight / 2);
        ctx.moveTo(arrowX + arrowLength, arrowY);
        ctx.lineTo(arrowX + arrowLength - arrowHeight, arrowY + arrowHeight / 2);
        ctx.stroke();
    }
  }
}