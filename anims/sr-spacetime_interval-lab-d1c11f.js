{
  duration: 6,
  setup: function(W, H) {
    return {
      // Fixed event coordinates in S frame (physics units)
      event_x_s_phys: 1.5,
      event_ct_s_phys: 2.0,
      
      // Maximum boost velocity as a fraction of c
      max_beta: 0.8, 
      
      // Scaling for drawing
      scale_factor: Math.min(W, H) / 5.5 // Adjust for desired size
    };
  },
  frame: function(ctx, t, W, H, state) {
    // Background
    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, W, H);

    const { event_x_s_phys, event_ct_s_phys, max_beta, scale_factor } = state;

    // --- Animation Logic ---
    // t goes from 0 to 1, beta (v/c) goes from 0 to max_beta
    const beta = t * max_beta;
    const gamma = 1 / Math.sqrt(1 - beta * beta);
    // The angle of the boosted axes relative to the unboosted axes
    // ct' axis rotates clockwise from ct (vertical) by alpha
    // x' axis rotates counter-clockwise from x (horizontal) by alpha
    const alpha = Math.atan(beta); // "scissoring" angle

    // --- Canvas Setup ---
    ctx.save();
    ctx.translate(W / 2, H / 2); // Move origin to center
    ctx.scale(scale_factor, -scale_factor); // Scale and flip y-axis (ct up)

    // --- Drawing Helper ---
    function drawLine(x1, y1, x2, y2, color, width, dash = []) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.setLineDash(dash);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash
    }

    function drawCircle(x, y, radius, fillColor, strokeColor, lineWidth, shadow = false) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = fillColor;
      ctx.fill();
      if (strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }
      if (shadow) {
        ctx.shadowColor = fillColor;
        ctx.shadowBlur = 10;
      }
      ctx.shadowBlur = 0; // Reset shadow
    }

    function drawText(text, x, y, color, align = "center", baseline = "middle") {
      ctx.save();
      ctx.scale(1, -1); // Flip text back upright
      ctx.fillStyle = color;
      ctx.font = `0.25px sans-serif`; // Adjust font size for scaled coordinates
      ctx.textAlign = align;
      ctx.textBaseline = baseline;
      ctx.fillText(text, x, -y); // Adjust y for flipped coordinates
      ctx.restore();
    }

    // --- Light Lines (fixed) ---
    ctx.strokeStyle = "#9db0c8";
    ctx.lineWidth = 0.03;
    ctx.setLineDash([0.1, 0.1]);
    ctx.beginPath();
    ctx.moveTo(-W / (2 * scale_factor), -W / (2 * scale_factor));
    ctx.lineTo(W / (2 * scale_factor), W / (2 * scale_factor));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-W / (2 * scale_factor), W / (2 * scale_factor));
    ctx.lineTo(W / (2 * scale_factor), -W / (2 * scale_factor));
    ctx.stroke();
    ctx.setLineDash([]);
    drawText("Light Line", 2.5, 2.5, "#9db0c8", "left", "bottom");

    // --- S Frame (ct, x) Axes ---
    drawLine(-3, 0, 3, 0, "#e8eef7", 0.05); // x-axis
    drawLine(0, -3, 0, 3, "#e8eef7", 0.05); // ct-axis
    drawText("x", 2.8, -0.2, "#e8eef7", "right", "top");
    drawText("ct", -0.2, 2.8, "#e8eef7", "right", "bottom");

    // --- S' Frame (ct', x') Axes ---
    // ct' axis: rotated clockwise from ct (vertical) by alpha. Angle from positive x-axis is PI/2 - alpha.
    // x' axis: rotated counter-clockwise from x (horizontal) by alpha. Angle from positive x-axis is alpha.
    const ct_prime_angle = Math.PI / 2 - alpha;
    const x_prime_angle = alpha;

    drawLine(
      -3 * Math.cos(ct_prime_angle), -3 * Math.sin(ct_prime_angle),
      3 * Math.cos(ct_prime_angle), 3 * Math.sin(ct_prime_angle),
      "#5fd0e0", 0.05
    ); // ct' axis
    drawLine(
      -3 * Math.cos(x_prime_angle), -3 * Math.sin(x_prime_angle),
      3 * Math.cos(x_prime_angle), 3 * Math.sin(x_prime_angle),
      "#5fd0e0", 0.05
    ); // x' axis

    // Labels for S' axes
    const ct_prime_label_x = 2.8 * Math.cos(ct_prime_angle);
    const ct_prime_label_y = 2.8 * Math.sin(ct_prime_angle);
    drawText("ct'", ct_prime_label_x, ct_prime_label_y, "#5fd0e0", "center", "bottom");

    const x_prime_label_x = 2.8 * Math.cos(x_prime_angle);
    const x_prime_label_y = 2.8 * Math.sin(x_prime_angle);
    drawText("x'", x_prime_label_x, x_prime_label_y, "#5fd0e0", "center", "bottom");

    // --- Event P ---
    drawCircle(event_x_s_phys, event_ct_s_phys, 0.08, "#e8b64c", "#e8b64c", 0.02, true);
    drawText("P", event_x_s_phys + 0.2, event_ct_s_phys + 0.2, "#e8b64c", "left", "bottom");

    // --- Coordinates in S Frame ---
    drawLine(event_x_s_phys, event_ct_s_phys, event_x_s_phys, 0, "#e8eef7", 0.02, [0.1, 0.1]);
    drawLine(event_x_s_phys, event_ct_s_phys, 0, event_ct_s_phys, "#e8eef7", 0.02, [0.1, 0.1]);
    drawCircle(event_x_s_phys, 0, 0.04, "#e8eef7");
    drawCircle(0, event_ct_s_phys, 0.04, "#e8eef7");

    // --- Coordinates in S' Frame ---
    // Calculate P' coordinates using Lorentz transform
    const event_ct_prime_phys = gamma * (event_ct_s_phys - beta * event_x_s_phys);
    const event_x_prime_phys = gamma * (event_x_s_phys - beta * event_ct_s_phys);

    // To draw the coordinate lines for P in S', we need to draw lines parallel to the S' axes
    // Line for x' coordinate: from P, parallel to ct' axis (angle PI/2 - alpha)
    // Line for ct' coordinate: from P, parallel to x' axis (angle alpha)

    // Calculate projection points on S' axes
    // Projection of P onto x' axis: (event_x_prime_phys * cos(x_prime_angle), event_x_prime_phys * sin(x_prime_angle))
    const proj_x_prime_x = event_x_prime_phys * Math.cos(x_prime_angle);
    const proj_x_prime_y = event_x_prime_phys * Math.sin(x_prime_angle);
    // Projection of P onto ct' axis: (event_ct_prime_phys * cos(ct_prime_angle), event_ct_prime_phys * sin(ct_prime_angle))
    const proj_ct_prime_x = event_ct_prime_phys * Math.cos(ct_prime_angle);
    const proj_ct_prime_y = event_ct_prime_phys * Math.sin(ct_prime_angle);

    drawLine(event_x_s_phys, event_ct_s_phys, proj_x_prime_x, proj_x_prime_y, "#5fd0e0", 0.02, [0.1, 0.1]);
    drawLine(event_x_s_phys, event_ct_s_phys, proj_ct_prime_x, proj_ct_prime_y, "#5fd0e0", 0.02, [0.1, 0.1]);
    drawCircle(proj_x_prime_x, proj_x_prime_y, 0.04, "#5fd0e0");
    drawCircle(proj_ct_prime_x, proj_ct_prime_y, 0.04, "#5fd0e0");
    
    // --- Display Invariant Interval ---
    const s_sq_s = (event_ct_s_phys * event_ct_s_phys - event_x_s_phys * event_x_s_phys);
    const s_sq_s_prime = (event_ct_prime_phys * event_ct_prime_phys - event_x_prime_phys * event_x_prime_phys);

    ctx.restore(); // Restore to original canvas coordinates

    ctx.fillStyle = "#e8eef7";
    ctx.font = "18px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    
    ctx.fillText(`S: (ct, x) = (${event_ct_s_phys.toFixed(2)}, ${event_x_s_phys.toFixed(2)})`, 20, 20);
    ctx.fillText(`S': (ct', x') = (${event_ct_prime_phys.toFixed(2)}, ${event_x_prime_phys.toFixed(2)})`, 20, 50);
    ctx.fillText(`s² = (ct)² - x² = ${s_sq_s.toFixed(3)}`, 20, 80);
    ctx.fillText(`s'² = (ct')² - (x')² = ${s_sq_s_prime.toFixed(3)}`, 20, 110);
    ctx.fillText(`v/c = ${beta.toFixed(2)}`, 20, 140);
  }
}