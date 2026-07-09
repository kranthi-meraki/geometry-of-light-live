{
  duration: 6,
  setup: function(W, H) {
    return {
      // Fixed event B coordinates in the 'rest' S frame (ct, x)
      x_B_S: 1.0,  // Spatial separation
      ct_B_S: 2.0, // Temporal separation (c*t)
      
      V_max: 0.8, // Maximum relative velocity (fraction of c)
      
      // Scaling factor for physics units to pixels
      scale: Math.min(W, H) / 6 
    };
  },
  frame: function(ctx, t, W, H, state) {
    // Background
    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, W, H);

    const { x_B_S, ct_B_S, V_max, scale } = state;

    // Current relative velocity 'v' (varies from 0 to V_max and back to 0)
    // using sin(t*PI) ensures a smooth cycle over t in [0,1)
    const v = V_max * Math.sin(t * Math.PI); 

    // Lorentz factor (c=1 implicitly)
    const gamma = 1 / Math.sqrt(1 - v * v);

    // Lorentz transformations for Event B's coordinates in S' frame
    const ct_B_S_prime = gamma * (ct_B_S - v * x_B_S);
    const x_B_S_prime = gamma * (x_B_S - v * ct_B_S);

    // Calculate invariant interval in both frames
    // Δs² = (cΔt)² - (Δx)²
    const ds2_S = ct_B_S * ct_B_S - x_B_S * x_B_S;
    const ds2_S_prime = ct_B_S_prime * ct_B_S_prime - x_B_S_prime * x_B_S_prime;

    // --- Canvas Transformations ---
    ctx.save();
    ctx.translate(W / 2, H / 2); // Move origin to center of canvas
    ctx.scale(scale, -scale);    // Scale and flip Y-axis (positive ct is up)

    const lineWidth = 1.5 / scale; // Line width independent of zoom
    const dashLength = 0.1 / scale;

    // --- Light Cone (x = ±ct) ---
    ctx.beginPath();
    ctx.moveTo(-3, -3); ctx.lineTo(3, 3);
    ctx.moveTo(-3, 3); ctx.lineTo(3, -3);
    ctx.strokeStyle = "#9db0c8";
    ctx.lineWidth = lineWidth * 0.7;
    ctx.stroke();

    // --- S Frame (ct, x) Axes ---
    ctx.beginPath();
    ctx.moveTo(-3, 0); ctx.lineTo(3, 0); // x-axis
    ctx.moveTo(0, -3); ctx.lineTo(0, 3); // ct-axis
    ctx.strokeStyle = "#e8eef7";
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    // --- Event B in S Frame ---
    ctx.fillStyle = "#5fd0e0";
    ctx.shadowColor = "#5fd0e0";
    ctx.shadowBlur = 0.5 / scale;
    ctx.beginPath();
    ctx.arc(x_B_S, ct_B_S, 0.08, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Projections for Event B in S Frame
    ctx.strokeStyle = "#5fd0e0";
    ctx.setLineDash([dashLength, dashLength]);
    ctx.beginPath();
    ctx.moveTo(x_B_S, 0); ctx.lineTo(x_B_S, ct_B_S); // Project to x-axis
    ctx.moveTo(0, ct_B_S); ctx.lineTo(x_B_S, ct_B_S); // Project to ct-axis
    ctx.stroke();
    ctx.setLineDash([]);

    // --- S' Frame (ct', x') Axes ---
    // x' axis is ct = v*x in (x, ct) frame
    // ct' axis is x = v*ct in (x, ct) frame
    ctx.strokeStyle = "#e8b64c";
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(-3, -3 * v); ctx.lineTo(3, 3 * v); // x' axis
    ctx.moveTo(-3 * v, -3); ctx.lineTo(3 * v, 3); // ct' axis
    ctx.stroke();

    // --- Event B in S' Frame ---
    // Note: (x_B_S_prime, ct_B_S_prime) are the coordinates of Event B in the S' frame,
    // but drawn in the S frame's (x, ct) coordinate system.
    ctx.fillStyle = "#e8b64c";
    ctx.shadowColor = "#e8b64c";
    ctx.shadowBlur = 0.5 / scale;
    ctx.beginPath();
    ctx.arc(x_B_S_prime, ct_B_S_prime, 0.08, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Projections for Event B in S' Frame onto S' Axes
    // Point on x' axis corresponding to x'_B_S_prime: (x, ct) = (γx', γvx')
    const x_proj_S_prime_on_xaxis_x = gamma * x_B_S_prime;
    const x_proj_S_prime_on_xaxis_ct = gamma * v * x_B_S_prime;
    // Point on ct' axis corresponding to ct'_B_S_prime: (x, ct) = (γvct', γct')
    const ct_proj_S_prime_on_ctaxis_x = gamma * v * ct_B_S_prime;
    const ct_proj_S_prime_on_ctaxis_ct = gamma * ct_B_S_prime;

    ctx.strokeStyle = "#e8b64c";
    ctx.setLineDash([dashLength, dashLength]);
    ctx.beginPath();
    // Line from B' to x' axis (parallel to ct' axis)
    ctx.moveTo(x_B_S_prime, ct_B_S_prime);
    ctx.lineTo(x_proj_S_prime_on_xaxis_x, x_proj_S_prime_on_xaxis_ct);
    // Line from B' to ct' axis (parallel to x' axis)
    ctx.moveTo(x_B_S_prime, ct_B_S_prime);
    ctx.lineTo(ct_proj_S_prime_on_ctaxis_x, ct_proj_S_prime_on_ctaxis_ct);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.restore(); // Restore canvas context

    // --- Labels ---
    const fontSize = 20 * (W / 800); // Adjust font size based on canvas width
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // General labels
    ctx.fillStyle = "#e8eef7";
    ctx.fillText("ct", W / 2 + 10, H / 2 - scale * 2.5);
    ctx.fillText("x", W / 2 + scale * 2.5, H / 2 + 10);
    ctx.fillText("Invariant Interval", W / 2, H * 0.08);


    // S Frame Labels
    ctx.fillStyle = "#5fd0e0";
    ctx.textAlign = "left";
    ctx.fillText(`Event B (S)`, W / 2 + scale * x_B_S + 10, H / 2 - scale * ct_B_S);
    ctx.fillText(`Δt = ${ct_B_S.toFixed(2)}`, W / 2 + 20, H / 2 - scale * ct_B_S / 2);
    ctx.fillText(`Δx = ${x_B_S.toFixed(2)}`, W / 2 + scale * x_B_S / 2, H / 2 - 20);
    ctx.fillText(`Δs²(S) = ${ds2_S.toFixed(3)}`, W / 2 + 20, H * 0.9);


    // S' Frame Labels
    ctx.fillStyle = "#e8b64c";
    ctx.textAlign = "right";
    ctx.fillText(`Event B (S')`, W / 2 + scale * x_B_S_prime - 10, H / 2 - scale * ct_B_S_prime);
    ctx.fillText(`Δt' = ${ct_B_S_prime.toFixed(2)}`, W / 2 - 20, H / 2 - scale * ct_B_S_prime / 2);
    ctx.fillText(`Δx' = ${x_B_S_prime.toFixed(2)}`, W / 2 - scale * x_B_S_prime / 2, H / 2 - 20);
    ctx.fillText(`Δs²(S') = ${ds2_S_prime.toFixed(3)}`, W / 2 - 20, H * 0.9);

    // Velocity label
    ctx.fillStyle = "#9db0c8";
    ctx.textAlign = "center";
    ctx.fillText(`v/c = ${v.toFixed(2)}`, W / 2, H * 0.15);
  }
}