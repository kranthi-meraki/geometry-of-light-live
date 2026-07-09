{
  duration: 6,
  setup: function(W, H) {
    return {};
  },
  frame: function(ctx, t, W, H, state) {
    // Background
    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, W, H);

    const margin = Math.min(W, H) * 0.15;
    const effectiveW = W - 2 * margin;
    const effectiveH = H - 2 * margin;

    // Center of the spacetime diagram (Event A)
    const eventX = W / 2;
    const eventY = H / 2;

    // Scale for light cones (determines how far they extend)
    // Max extent is limited by the smaller of effectiveW/2 or effectiveH/2
    const coneExtent = Math.min(effectiveW / 2, effectiveH / 2);

    // Light cone lines (45-degree angles, representing c=1)
    const futureTopLeftX = eventX - coneExtent;
    const futureTopLeftY = eventY - coneExtent;
    const futureTopRightX = eventX + coneExtent;
    const futureTopRightY = eventY - coneExtent;

    const pastBottomLeftX = eventX - coneExtent;
    const pastBottomLeftY = eventY + coneExtent;
    const pastBottomRightX = eventX + coneExtent;
    const pastBottomRightY = eventY + coneExtent;

    // Animation phases
    const phaseFuture = Math.max(0, Math.min(1, t / 0.4)); // 0 to 0.4
    const phasePast = Math.max(0, Math.min(1, (t - 0.3) / 0.4)); // 0.3 to 0.7
    const phaseElsewhere = Math.max(0, Math.min(1, (t - 0.6) / 0.4)); // 0.6 to 1.0

    // Draw regions
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.shadowBlur = 10;

    // 1. Future Light Cone
    if (phaseFuture > 0) {
      ctx.beginPath();
      ctx.moveTo(eventX, eventY);
      ctx.lineTo(eventX - coneExtent * phaseFuture, eventY - coneExtent * phaseFuture);
      ctx.lineTo(eventX + coneExtent * phaseFuture, eventY - coneExtent * phaseFuture);
      ctx.closePath();
      ctx.fillStyle = `rgba(95, 208, 224, ${0.15 * phaseFuture})`; // Primary cyan
      ctx.shadowColor = `rgba(95, 208, 224, ${0.5 * phaseFuture})`;
      ctx.fill();

      // Label "Future of A"
      if (phaseFuture > 0.5) {
        ctx.fillStyle = `rgba(232, 238, 247, ${Math.min(1, (phaseFuture - 0.5) * 2)})`; // Soft white
        ctx.shadowBlur = 0;
        ctx.font = `${Math.min(W, H) * 0.03}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText("Future of A", eventX, eventY - coneExtent * 0.7);
        ctx.shadowBlur = 10;
      }
    }

    // 2. Past Light Cone
    if (phasePast > 0) {
      ctx.beginPath();
      ctx.moveTo(eventX, eventY);
      ctx.lineTo(eventX - coneExtent * phasePast, eventY + coneExtent * phasePast);
      ctx.lineTo(eventX + coneExtent * phasePast, eventY + coneExtent * phasePast);
      ctx.closePath();
      ctx.fillStyle = `rgba(95, 208, 224, ${0.15 * phasePast})`; // Primary cyan
      ctx.shadowColor = `rgba(95, 208, 224, ${0.5 * phasePast})`;
      ctx.fill();

      // Label "Past of A"
      if (phasePast > 0.5) {
        ctx.fillStyle = `rgba(232, 238, 247, ${Math.min(1, (phasePast - 0.5) * 2)})`; // Soft white
        ctx.shadowBlur = 0;
        ctx.font = `${Math.min(W, H) * 0.03}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText("Past of A", eventX, eventY + coneExtent * 0.7);
        ctx.shadowBlur = 10;
      }
    }

    // 3. Elsewhere (Spacelike Separated)
    if (phaseElsewhere > 0) {
      ctx.fillStyle = `rgba(232, 182, 76, ${0.08 * phaseElsewhere})`; // Warm amber
      ctx.shadowColor = `rgba(232, 182, 76, ${0.3 * phaseElsewhere})`;

      // Top-left elsewhere region
      ctx.beginPath();
      ctx.moveTo(eventX - coneExtent, futureTopLeftY);
      ctx.lineTo(margin, futureTopLeftY);
      ctx.lineTo(margin, margin);
      ctx.lineTo(eventX, margin);
      ctx.lineTo(eventX - coneExtent, futureTopLeftY);
      ctx.closePath();
      ctx.fill();

      // Top-right elsewhere region
      ctx.beginPath();
      ctx.moveTo(eventX + coneExtent, futureTopRightY);
      ctx.lineTo(W - margin, futureTopRightY);
      ctx.lineTo(W - margin, margin);
      ctx.lineTo(eventX, margin);
      ctx.lineTo(eventX + coneExtent, futureTopRightY);
      ctx.closePath();
      ctx.fill();

      // Bottom-left elsewhere region
      ctx.beginPath();
      ctx.moveTo(eventX - coneExtent, pastBottomLeftY);
      ctx.lineTo(margin, pastBottomLeftY);
      ctx.lineTo(margin, H - margin);
      ctx.lineTo(eventX, H - margin);
      ctx.lineTo(eventX - coneExtent, pastBottomLeftY);
      ctx.closePath();
      ctx.fill();

      // Bottom-right elsewhere region
      ctx.beginPath();
      ctx.moveTo(eventX + coneExtent, pastBottomRightY);
      ctx.lineTo(W - margin, pastBottomRightY);
      ctx.lineTo(W - margin, H - margin);
      ctx.lineTo(eventX, H - margin);
      ctx.lineTo(eventX + coneExtent, pastBottomRightY);
      ctx.closePath();
      ctx.fill();

      // Label "Elsewhere"
      if (phaseElsewhere > 0.5) {
        ctx.fillStyle = `rgba(232, 238, 247, ${Math.min(1, (phaseElsewhere - 0.5) * 2)})`; // Soft white
        ctx.shadowBlur = 0;
        ctx.font = `${Math.min(W, H) * 0.03}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Elsewhere", eventX - coneExtent * 0.7, eventY);
        ctx.fillText("Elsewhere", eventX + coneExtent * 0.7, eventY);
        ctx.shadowBlur = 10;
      }
    }

    ctx.shadowBlur = 0; // Reset shadow for lines/labels

    // Draw Light Cone outlines (always visible after initial phase)
    ctx.strokeStyle = "#5fd0e0"; // Primary cyan
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(eventX, eventY);
    ctx.lineTo(futureTopLeftX, futureTopLeftY);
    ctx.moveTo(eventX, eventY);
    ctx.lineTo(futureTopRightX, futureTopRightY);
    ctx.moveTo(eventX, eventY);
    ctx.lineTo(pastBottomLeftX, pastBottomLeftY);
    ctx.moveTo(eventX, eventY);
    ctx.lineTo(pastBottomRightX, pastBottomRightY);
    ctx.stroke();

    // Draw Event A
    ctx.fillStyle = "#5fd0e0"; // Primary cyan
    ctx.beginPath();
    ctx.arc(eventX, eventY, Math.min(W, H) * 0.01, 0, Math.PI * 2);
    ctx.fill();

    // Draw Spacetime Axes
    ctx.strokeStyle = "#9db0c8"; // Dim color
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(eventX, margin); // Time axis
    ctx.lineTo(eventX, H - margin);
    ctx.moveTo(margin, eventY); // Space axis
    ctx.lineTo(W - margin, eventY);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = "#9db0c8"; // Dim color
    ctx.font = `${Math.min(W, H) * 0.025}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("Time", eventX, margin + Math.min(W, H) * 0.02);
    ctx.textBaseline = "top";
    ctx.fillText("t", eventX, H - margin - Math.min(W, H) * 0.02);
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText("Space", W - margin - Math.min(W, H) * 0.02, eventY);
    ctx.textAlign = "left";
    ctx.fillText("x", margin + Math.min(W, H) * 0.02, eventY);

    // Label Event A
    ctx.fillStyle = "#e8eef7"; // Soft white
    ctx.font = `${Math.min(W, H) * 0.025}px sans-serif`;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText("Event A", eventX - Math.min(W, H) * 0.015, eventY - Math.min(W, H) * 0.015);
  }
}