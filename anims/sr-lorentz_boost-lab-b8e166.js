{
  duration: 6,
  setup: function(W, H) {
    return {
      // No specific state needed, all driven by t
    };
  },
  frame: function(ctx, t, W, H, state) {
    // Background
    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, W, H);

    // Canvas center as the origin of the spacetime diagram
    const cx = W / 2;
    const cy = H / 2;

    // Scaling factor for the axes
    const scale = Math.min(W, H) * 0.4;

    // --- Calculate animation parameters ---
    // t goes from 0 to 1
    // Beta (v/c) cycles from 0 to beta_max and back to 0
    const beta_max = 0.8; // Maximum relative velocity (0.8c)
    // Use a sine wave for smooth acceleration/deceleration.
    // Math.sin(t * Math.PI) goes 0 -> 1 -> 0 over t in [0,1)
    const beta = beta_max * Math.sin(t * Math.PI);

    // The angle of rotation for the boosted axes is related to beta.
    // The rapidity 'phi' is atanh(beta).
    // The x' axis is rotated by -phi from the x-axis.
    // The t' axis is rotated by phi from the t-axis.
    // In Canvas coordinates (y-down):
    // x-axis: 0 radians (horizontal right)
    // t-axis: PI/2 radians (vertical down)
    // Light lines: PI/4 and 3*PI/4
    // The axes scissor towards the light line at PI/4.
    // This means the x' axis rotates from 0 towards PI/4.
    // And the t' axis rotates from PI/2 towards PI/4.
    // The angle 'alpha' (from the x-axis for x', and from the t-axis for t') is atan(beta).
    const alpha = Math.atan(beta); // This is the angle of the x' axis from the x-axis, and t' axis from the t-axis.

    // Angles for drawing the axes in Canvas coordinates
    const angle_x_prime = alpha;
    const angle_t_prime = Math.PI / 2 - alpha;

    // --- Drawing functions ---
    function drawLine(angle, length, color, label = null, labelOffsetAngle = 0) {
      ctx.beginPath();
      ctx.moveTo(cx - length * Math.cos(angle), cy - length * Math.sin(angle));
      ctx.lineTo(cx + length * Math.cos(angle), cy + length * Math.sin(angle));
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      if (label) {
        ctx.fillStyle = "#e8eef7"; // Soft white for labels
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Position label slightly away from the end of the positive axis
        const labelDist = length + 20;
        const labelX = cx + labelDist * Math.cos(angle + labelOffsetAngle);
        const labelY = cy + labelDist * Math.sin(angle + labelOffsetAngle);
        ctx.fillText(label, labelX, labelY);
      }
    }

    // --- Draw invariant elements ---
    // Stationary observer's axes (dim)
    ctx.strokeStyle = "#9db0c8"; // Dim color
    ctx.lineWidth = 2;
    drawLine(0, scale, "#9db0c8", "x"); // x-axis
    drawLine(Math.PI / 2, scale, "#9db0c8", "t"); // t-axis (downwards)

    // Light cone lines (dim, dashed)
    ctx.setLineDash([5, 5]); // Dashed lines
    drawLine(Math.PI / 4, scale, "#9db0c8"); // Light line 1 (y=x)
    drawLine(3 * Math.PI / 4, scale, "#9db0c8"); // Light line 2 (y=-x)
    ctx.setLineDash([]); // Reset line dash

    // --- Draw moving observer's axes ---
    ctx.strokeStyle = "#5fd0e0"; // Primary cyan
    ctx.shadowColor = "#5fd0e0";
    ctx.shadowBlur = 15;
    ctx.lineWidth = 3;

    // x' axis
    drawLine(angle_x_prime, scale, "#5fd0e0", "x'", 0);
    // t' axis
    drawLine(angle_t_prime, scale, "#5fd0e0", "t'", 0);

    // Reset shadow
    ctx.shadowBlur = 0;

    // --- Draw origin ---
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#e8b64c"; // Warm amber for origin
    ctx.fill();

    // --- Display current beta ---
    ctx.fillStyle = "#e8eef7"; // Soft white
    ctx.font = "18px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`β = v/c: ${(beta).toFixed(2)}`, cx - scale, cy + scale + 30);
  }
}