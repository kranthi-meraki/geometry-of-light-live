{
  duration: 6,
  setup: function(W, H) {
    const margin = 0.15; // 15% margin for composition
    const maxR = Math.min(W, H) / 2 * (1 - margin);
    return { maxR: maxR };
  },
  frame: function(ctx, t, W, H, state) {
    // HARD RULE: Paint the background
    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, W, H);

    // Center the drawing area
    ctx.save();
    ctx.translate(W / 2, H / 2);

    // Calculate current radius based on loop phase t
    // Radius expands linearly from 0 to maxR over the loop
    const currentR = state.maxR * t;

    // Draw the expanding spherical light front (as a circle in 2D)
    ctx.beginPath();
    ctx.arc(0, 0, currentR, 0, 2 * Math.PI);
    ctx.strokeStyle = "#5fd0e0"; // Primary cyan
    ctx.lineWidth = 3;
    ctx.shadowColor = "#5fd0e0";
    ctx.shadowBlur = 15; // Gentle glow
    ctx.stroke();

    // Reset shadow for subsequent elements to prevent unintended glow
    ctx.shadowBlur = 0;

    // Draw the point source of the flash at the origin
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, 2 * Math.PI); // Small circle for the point
    ctx.fillStyle = "#e8b64c"; // Warm amber
    ctx.shadowColor = "#e8b64c";
    ctx.shadowBlur = 10; // Gentle glow for the source
    ctx.fill();
    ctx.shadowBlur = 0; // Reset shadow

    // Add labels for clarity
    ctx.fillStyle = "#e8eef7"; // Soft white for text
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Label for the Flash Origin
    ctx.fillText("Flash Origin", 0, 20);

    // Label for the Light Front, including 'ct' to indicate linear expansion
    // Only show the label when the circle is large enough to avoid clutter
    if (currentR > 20) {
      const labelY = -currentR - 20; // Position 20px above the top of the circle
      ctx.fillText("Light Front (ct)", 0, labelY);
    }
    
    ctx.restore(); // Restore canvas to its original state
  }
}