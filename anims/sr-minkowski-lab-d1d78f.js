{
  duration: 6,
  setup: function(W, H) {
    return {};
  },
  frame: function(ctx, t, W, H, state) {
    // Background
    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, W, H);

    const centerX = W / 2;
    const centerY = H / 2;
    // Scale factor for spacetime units to pixels, ensuring margins
    const S = Math.min(W, H) * 0.35; 

    // Max coordinate value for drawing lines to the edge of the diagram area
    const maxCoord = 1.2; 

    // Animate velocity (v/c) from 0 to v_max_rel and back to 0 over the loop
    const v_max_rel = 0.8; // Maximum velocity as a fraction of c
    const v_rel = v_max_rel * Math.sin(t * Math.PI); // t=0->0, t=0.5->v_max_rel, t=1->0

    // Set up text styles
    ctx.font = "16px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // --- Draw Axes ---
    ctx.strokeStyle = "#9db0c8"; // Dim color
    ctx.lineWidth = 1;
    ctx.shadowBlur = 0; // No shadow for axes

    // X-axis (horizontal)
    ctx.beginPath();
    ctx.moveTo(centerX - maxCoord * S, centerY);
    ctx.lineTo(centerX + maxCoord * S, centerY);
    ctx.stroke();

    // CT-axis (vertical)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY + maxCoord * S);
    ctx.lineTo(centerX, centerY - maxCoord * S);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = "#9db0c8";
    ctx.fillText("x", centerX + maxCoord * S * 0.9, centerY + 15);
    ctx.fillText("ct", centerX - 20, centerY - maxCoord * S * 0.9);
    ctx.fillText("0", centerX - 15, centerY + 15); // Origin label

    // --- Draw Light Cone (45-degree lines) ---
    ctx.strokeStyle = "#e8b64c"; // Warm amber
    ctx.lineWidth = 2;
    ctx.shadowColor = "#e8b64c";
    ctx.shadowBlur = 10; // Gentle glow

    // Light line ct = x (top-right quadrant)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + maxCoord * S, centerY - maxCoord * S);
    ctx.stroke();

    // Light line ct = -x (top-left quadrant)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX - maxCoord * S, centerY - maxCoord * S);
    ctx.stroke();

    // Light line label
    ctx.fillStyle = "#e8b64c";
    ctx.textAlign = "left";
    ctx.fillText("c", centerX + maxCoord * S * 0.8, centerY - maxCoord * S * 0.8 - 15);
    ctx.textAlign = "center"; // Reset for other labels

    // --- Draw Object's Worldline ---
    ctx.strokeStyle = "#5fd0e0"; // Primary cyan
    ctx.lineWidth = 3;
    ctx.shadowColor = "#5fd0e0";
    ctx.shadowBlur = 15; // More prominent glow

    // The worldline equation in spacetime coordinates (x, ct) is x = v_rel * ct.
    // To draw it, we pick a maximum ct_coord value and calculate the corresponding x_coord.
    const ct_coord_end = maxCoord * 0.9; // Draw up to 90% of maxCoord
    const x_coord_end = v_rel * ct_coord_end;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + x_coord_end * S, centerY - ct_coord_end * S);
    ctx.stroke();

    // Worldline label
    ctx.fillStyle = "#5fd0e0";
    // Position the label along the worldline, slightly offset
    const labelX = centerX + x_coord_end * S * 0.6;
    const labelY = centerY - ct_coord_end * S * 0.6 - 15; // Offset upwards
    ctx.fillText("Worldline", labelX, labelY);
    
    // Display current velocity as v/c
    ctx.textAlign = "left";
    ctx.fillText(`v/c = ${v_rel.toFixed(2)}`, centerX + S * 0.7, centerY + S * 0.7);
    ctx.textAlign = "center"; // Reset

    // Clear shadows
    ctx.shadowBlur = 0; 
  }
}