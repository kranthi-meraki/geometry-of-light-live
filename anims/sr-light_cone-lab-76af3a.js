{
  duration: 6,
  setup: function(W, H) {
    return {};
  },
  frame: function(ctx, t, W, H, state) {
    // Background
    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, W, H);

    // Constants
    const centerX = W / 2;
    const centerY = H / 2;
    // Max 'radius' for the cones, scaled to fit with margins
    const maxExtent = Math.min(W, H) * 0.35; 

    // Current extent based on animation time t (0 to 1)
    // This controls how 'far' the light has traveled from the event
    const currentExtent = maxExtent * t; 

    // Colors
    const primaryCyan = "#5fd0e0";
    const warmAmber = "#e8b64c";
    const dimColor = "#9db0c8";
    const softWhite = "#e8eef7";

    // Drawing setup
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Axes for spacetime diagram
    ctx.strokeStyle = dimColor;
    ctx.setLineDash([5, 5]); // Dashed lines
    ctx.beginPath();
    // Time axis (vertical)
    ctx.moveTo(centerX, centerY - maxExtent * 1.1); 
    ctx.lineTo(centerX, centerY + maxExtent * 1.1);
    // Space axis (horizontal)
    ctx.moveTo(centerX - maxExtent * 1.1, centerY); 
    ctx.lineTo(centerX + maxExtent * 1.1, centerY);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

    // Draw Future Light Cone (outline)
    ctx.strokeStyle = primaryCyan;
    ctx.shadowColor = primaryCyan;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX - currentExtent, centerY - currentExtent);
    ctx.lineTo(centerX + currentExtent, centerY - currentExtent);
    ctx.closePath(); 
    ctx.stroke();

    // Draw Past Light Cone (outline)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX - currentExtent, centerY + currentExtent);
    ctx.lineTo(centerX + currentExtent, centerY + currentExtent);
    ctx.closePath(); 
    ctx.stroke();
    ctx.shadowBlur = 0; // Reset shadow

    // Draw the central event
    ctx.fillStyle = warmAmber;
    ctx.shadowColor = warmAmber;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw expanding light pulses along the cone edges
    // These pulses travel from the event outwards along the light path
    if (t > 0) {
      const pulseRadius = 4;
      ctx.fillStyle = warmAmber;
      ctx.shadowColor = warmAmber;
      ctx.shadowBlur = 10;

      // Future cone pulses
      ctx.beginPath();
      ctx.arc(centerX - currentExtent, centerY - currentExtent, pulseRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX + currentExtent, centerY - currentExtent, pulseRadius, 0, Math.PI * 2);
      ctx.fill();

      // Past cone pulses
      ctx.beginPath();
      ctx.arc(centerX - currentExtent, centerY + currentExtent, pulseRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX + currentExtent, centerY + currentExtent, pulseRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Labels
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = softWhite;

    // Event label
    ctx.fillText("Event", centerX, centerY + 20);

    // Time axis label
    ctx.textAlign = "left";
    ctx.fillText("Time (ct)", centerX + 10, centerY - maxExtent * 1.1);
    
    // Space axis label
    ctx.textAlign = "center";
    ctx.fillText("Space (x)", centerX + maxExtent * 1.1, centerY + 20);

    // Cone labels (only when cones have grown sufficiently)
    if (t > 0.2) {
      ctx.textAlign = "left";
      ctx.fillStyle = primaryCyan;
      ctx.fillText("Future Light Cone", centerX + currentExtent / 2 + 10, centerY - currentExtent / 2 - 10);
      ctx.fillText("Past Light Cone", centerX + currentExtent / 2 + 10, centerY + currentExtent / 2 + 10);
      
      // Regions (Spacelike Elsewhere)
      ctx.fillStyle = dimColor;
      ctx.textAlign = "right";
      ctx.fillText("Spacelike Elsewhere", centerX - maxExtent * 0.6, centerY - maxExtent * 0.6);
      ctx.fillText("Spacelike Elsewhere", centerX - maxExtent * 0.6, centerY + maxExtent * 0.6);
    }
  }
}