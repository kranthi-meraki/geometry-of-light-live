{
  duration: 6,
  setup: function(W, H) {
    const c = 3e8; // Speed of light in m/s
    const v_muon = 0.995 * c; // Muon velocity
    const tau_rest = 2.2e-6; // Muon rest lifetime in seconds (2.2 microseconds)
    const H_atmosphere = 15000; // Atmospheric height in meters (15 km)

    // Calculate Lorentz factor (gamma)
    const gamma = 1 / Math.sqrt(1 - (v_muon * v_muon) / (c * c));

    // Calculate dilated lifetime in lab frame
    const tau_dilated_lab = gamma * tau_rest;

    // Calculate time for muon to travel H_atmosphere in lab frame
    const t_travel_lab = H_atmosphere / v_muon;

    // Calculate distance muon would travel in its rest lifetime (in lab frame)
    const dist_would_decay_lab = v_muon * tau_rest;

    // Calculate distance muon actually travels in its dilated lifetime (in lab frame)
    const dist_actually_travels_lab = v_muon * tau_dilated_lab;

    return {
      c, v_muon, tau_rest, H_atmosphere,
      gamma, tau_dilated_lab, t_travel_lab,
      dist_would_decay_lab, dist_actually_travels_lab
    };
  },
  frame: function(ctx, t, W, H, state) {
    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, W, H);

    const {
      v_muon, H_atmosphere, gamma,
      t_travel_lab, dist_would_decay_lab
    } = state;

    // --- Scaling and Layout ---
    const margin = H * 0.15;
    const displayHeight = H - 2 * margin;
    const canvasCenterX = W / 2;

    // Map real-world height to canvas Y-coordinates
    // Atmosphere top is at `margin`, ground is at `H - margin`
    const scaleY = displayHeight / H_atmosphere;
    const groundY = H - margin;
    const atmTopY = margin;

    // --- Calculate Muon State ---
    // t (0 to 1) represents the fraction of the total travel time to ground
    const currentLabTime = t * t_travel_lab;
    const currentMuonProperTime = currentLabTime / gamma;

    // Muon's current real-world Y position (0 at ground, H_atmosphere at top)
    const muonRealY = H_atmosphere - (v_muon * currentLabTime);

    // Muon's current canvas Y position
    const muonCanvasY = atmTopY + (H_atmosphere - muonRealY) * scaleY;

    // Decay limit without dilation (fixed Y position)
    const decayLimitCanvasY = atmTopY + dist_would_decay_lab * scaleY;

    // --- Drawing ---

    // Ground
    ctx.strokeStyle = "#9db0c8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvasCenterX - W * 0.25, groundY);
    ctx.lineTo(canvasCenterX + W * 0.25, groundY);
    ctx.stroke();
    ctx.fillStyle = "#9db0c8";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Ground", canvasCenterX, groundY + 25);

    // Atmosphere Top
    ctx.strokeStyle = "#9db0c8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvasCenterX - W * 0.25, atmTopY);
    ctx.lineTo(canvasCenterX + W * 0.25, atmTopY);
    ctx.stroke();
    ctx.fillStyle = "#9db0c8";
    ctx.fillText("Atmosphere Top", canvasCenterX, atmTopY - 15);

    // Decay limit line (if no time dilation)
    ctx.strokeStyle = "#e8b64c";
    ctx.setLineDash([5, 5]); // Dashed line
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(canvasCenterX - W * 0.2, decayLimitCanvasY);
    ctx.lineTo(canvasCenterX + W * 0.2, decayLimitCanvasY);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash
    ctx.fillStyle = "#e8b64c";
    ctx.textAlign = "left";
    ctx.fillText("Decay limit (no dilation)", canvasCenterX + W * 0.2 + 10, decayLimitCanvasY + 5);

    // Muon path (behind the muon)
    ctx.strokeStyle = "#5fd0e0";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(canvasCenterX, atmTopY);
    ctx.lineTo(canvasCenterX, muonCanvasY);
    ctx.stroke();

    // Muon dot
    const muonRadius = 8;
    ctx.fillStyle = "#5fd0e0";
    ctx.shadowColor = "#5fd0e0";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(canvasCenterX, muonCanvasY, muonRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0; // Reset shadow

    // Muon label
    ctx.fillStyle = "#e8eef7";
    ctx.textAlign = "center";
    ctx.fillText("Muon", canvasCenterX, muonCanvasY - muonRadius - 10);

    // Time information
    ctx.textAlign = "left";
    ctx.fillStyle = "#e8eef7";
    ctx.fillText(`Lab Time: ${currentLabTime.toExponential(2)} s`, W * 0.05, H * 0.05);
    ctx.fillText(`Proper Time: ${currentMuonProperTime.toExponential(2)} s`, W * 0.05, H * 0.05 + 20);

    // Survival text
    if (muonCanvasY > decayLimitCanvasY) {
      ctx.fillStyle = "#e8eef7";
      ctx.textAlign = "right";
      ctx.fillText("Survives due to time dilation!", W * 0.95, H * 0.05);
      ctx.fillText(`(γ ≈ ${gamma.toFixed(1)})`, W * 0.95, H * 0.05 + 20);
    }
  }
}