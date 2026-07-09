{
  duration: 6,
  setup: function(W, H) {
    // No specific state needed, all derived from t, W, H
    return {};
  },
  frame: function(ctx, t, W, H, state) {
    // --- Configuration ---
    const scale = Math.min(W, H) / 2; // A scaling factor for drawing units
    const centerX = W / 2;
    const centerY = H / 2;

    // Time elapsed in conceptual seconds (0 to duration)
    const T = t * this.duration;

    // Speed of light (scaled for animation, e.g., light travels 0.8 * scale in `duration` seconds)
    const c_scaled = 0.8 * scale / this.duration;

    // Speed of Observer B (scaled, must be < c_scaled)
    const v_B_scaled = 0.3 * scale / this.duration; // Observer B moves at 0.3c

    // --- Drawing ---

    // 1. Background
    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, W, H);

    // Translate to center for easier drawing
    ctx.save();
    ctx.translate(centerX, centerY);

    // 2. Light Emission Point (Origin)
    ctx.fillStyle = "#e8b64c"; // Warm amber
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    // 3. Expanding Light Front
    const lightRadius = c_scaled * T;
    ctx.strokeStyle = "#5fd0e0"; // Primary cyan
    ctx.lineWidth = 3;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#5fd0e0";
    ctx.beginPath();
    ctx.arc(0, 0, lightRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0; // Reset shadow

    // Ensure light pulse is visible only after a small initial time
    if (lightRadius > 0) {
      // 4. Observer A (Stationary at origin)
      ctx.fillStyle = "#e8eef7"; // Soft white
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText("Observer A", 0, 12);

      // 5. Observer B (Moving horizontally)
      const observerB_x = v_B_scaled * T;
      ctx.fillStyle = "#e8eef7"; // Soft white
      ctx.beginPath();
      ctx.arc(observerB_x, 0, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText("Observer B", observerB_x, 12);

      // --- Visualizing the agreement ---

      // Line from Observer A to light front (along x-axis for simplicity)
      ctx.strokeStyle = "#9db0c8"; // Dim color
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(lightRadius - 5, 0); // Draw up to just before the light front
      ctx.stroke();

      // Label for Observer A's measurement
      ctx.fillStyle = "#9db0c8";
      ctx.textAlign = "left";
      ctx.textBaseline = "bottom";
      ctx.fillText("c × T", (lightRadius / 2) + 5, -5);


      // Line from Observer B's *current position* to the *emission point*
      ctx.strokeStyle = "#e8b64c"; // Warm amber
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(observerB_x - 8, 0); // From B's edge
      ctx.lineTo(8, 0); // To origin's edge
      ctx.stroke();

      // Label indicating Observer B's position relative to origin
      ctx.fillStyle = "#e8b64c";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      if (observerB_x > 0) {
        ctx.fillText("v × T", observerB_x / 2, -5);
      } else if (observerB_x < 0) {
        ctx.fillText("v × T", observerB_x / 2, -5);
      }


      // Line from the emission point to the light front (for Observer B's perspective)
      // This emphasizes that the light expands from the origin for both.
      ctx.strokeStyle = "#5fd0e0"; // Cyan
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(8, 20); // Offset slightly to avoid overlap
      ctx.lineTo(lightRadius - 5, 20);
      ctx.stroke();

      ctx.fillStyle = "#5fd0e0";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText("c × T", (lightRadius / 2) + 5, 25);

      // Label for the emission point itself
      ctx.fillStyle = "#e8b64c";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText("Emission Point", 0, -15);
    }

    ctx.restore();
  }
}