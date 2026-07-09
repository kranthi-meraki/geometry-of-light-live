{
  duration: 6,
  setup: function(W, H) {
    return {};
  },
  frame: function(ctx, t, W, H, state) {
    // Background
    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, W, H);

    // Layout parameters
    const margin = W * 0.08;
    const panelWidth = (W - 3 * margin) / 2;
    const panelHeight = H - 2 * margin;

    const cx_A = margin + panelWidth / 2;
    const cy_A = H / 2;

    const cx_B = 2 * margin + panelWidth + panelWidth / 2;
    const cy_B = H / 2;

    const R_max = Math.min(panelWidth, panelHeight) / 2 * 0.85; // Max radius for wavefronts

    // Panel frames
    ctx.strokeStyle = "#9db0c8"; // Dim color
    ctx.lineWidth = 1;
    ctx.strokeRect(margin, margin, panelWidth, panelHeight);
    ctx.strokeRect(2 * margin + panelWidth, margin, panelWidth, panelHeight);

    // Colors
    const waveColor = "#5fd0e0"; // Primary cyan
    const observerColor = "#e8b64c"; // Warm amber
    const labelColor = "#e8eef7"; // Soft white

    // Wavefront offsets (to draw multiple concentric circles)
    const waveOffsets = [0, 0.2, 0.4];

    // --- Draw Left Panel (Observer A) ---
    // Observer A dot
    ctx.beginPath();
    ctx.arc(cx_A, cy_A, 5, 0, Math.PI * 2);
    ctx.fillStyle = observerColor;
    ctx.fill();

    // Wavefronts for Observer A
    ctx.strokeStyle = waveColor;
    ctx.lineWidth = 2;
    ctx.shadowColor = waveColor;
    ctx.shadowBlur = 10;

    for (let i = 0; i < waveOffsets.length; i++) {
      const offset = waveOffsets[i];
      if (t > offset) {
        const currentRadius = (t - offset) * R_max;
        if (currentRadius > 0) {
          ctx.beginPath();
          ctx.arc(cx_A, cy_A, currentRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }
    ctx.shadowBlur = 0; // Reset shadow

    // --- Draw Right Panel (Observer B) ---
    // Observer B dot
    ctx.beginPath();
    ctx.arc(cx_B, cy_B, 5, 0, Math.PI * 2);
    ctx.fillStyle = observerColor;
    ctx.fill();

    // Wavefronts for Observer B
    ctx.strokeStyle = waveColor;
    ctx.lineWidth = 2;
    ctx.shadowColor = waveColor;
    ctx.shadowBlur = 10;

    for (let i = 0; i < waveOffsets.length; i++) {
      const offset = waveOffsets[i];
      if (t > offset) {
        const currentRadius = (t - offset) * R_max;
        if (currentRadius > 0) {
          ctx.beginPath();
          ctx.arc(cx_B, cy_B, currentRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }
    ctx.shadowBlur = 0; // Reset shadow

    // Labels
    ctx.fillStyle = labelColor;
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    ctx.fillText("Observer A's Frame", cx_A, margin + panelHeight + 10);
    ctx.fillText("Observer B's Frame", cx_B, margin + panelHeight + 10);

    ctx.fillText("Observer A", cx_A, cy_A + R_max + 20);
    ctx.fillText("Observer B (moving)", cx_B, cy_B + R_max + 20);
  }
}