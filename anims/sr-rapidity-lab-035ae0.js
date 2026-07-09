{
  duration: 6,
  setup: function(W, H) {
    return {};
  },
  frame: function(ctx, t, W, H, state) {
    // --- Configuration ---
    const bgColor = "#0a0d14";
    const primaryColor = "#5fd0e0"; // Cyan (for boosted frame)
    const warmColor = "#e8b64c";    // Amber (for light cone)
    const dimColor = "#9db0c8";     // Dim (for original frame grid/axes)
    const softWhite = "#e8eef7";    // Soft white (for text)

    const maxRapidity = 1.8; // Maximum rapidity to display (0 to 1.8)
    const gridStep = 1;      // Spacing of grid lines in physics units

    // --- Calculate current rapidity ---
    const phi = t * maxRapidity; // Rapidity evolves from 0 to maxRapidity

    // --- Canvas setup ---
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, W, H);

    const centerX = W / 2;
    const centerY = H / 2;

    // Determine a scaling factor. We want about 4 units on each side of the origin.
    const unit = Math.min(W, H) / 8; // 8 units total width/height, so -4 to +4 visible

    // Helper to convert physics coordinates (x, y) to canvas coordinates (cx, cy)
    // Canvas Y increases downwards, so we subtract from centerY for positive physics Y.
    const toCx = (x_phys) => centerX + x_phys * unit;
    const toCy = (y_phys) => centerY - y_phys * unit;

    // Helper to draw a line segment
    const drawLine = (x1, y1, x2, y2, color, width, shadow) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.shadowColor = color;
      ctx.shadowBlur = shadow ? 10 : 0;
      ctx.beginPath();
      ctx.moveTo(toCx(x1), toCy(y1));
      ctx.lineTo(toCx(x2), toCy(y2));
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow
    };

    // Helper to draw text
    const drawText = (text, x_phys, y_phys, color, align = 'center', baseline = 'middle', rotation = 0) => {
      ctx.fillStyle = color;
      ctx.font = `${Math.round(unit * 0.2)}px Arial`; // Font size relative to unit
      ctx.textAlign = align;
      ctx.textBaseline = baseline;
      ctx.save();
      ctx.translate(toCx(x_phys), toCy(y_phys));
      if (rotation !== 0) {
        ctx.rotate(-rotation); // Canvas rotation is clockwise, physics rotation is counter-clockwise
      }
      ctx.fillText(text, 0, 0);
      ctx.restore();
    };

    const maxCoord = Math.min(W, H) / (2 * unit); // Max physics coord value visible from center

    // --- Draw Original Spacetime Grid (x, ct) ---
    // Vertical lines (constant x)
    for (let x = -maxCoord; x <= maxCoord; x += gridStep) {
      drawLine(x, -maxCoord, x, maxCoord, dimColor, 1, false);
    }
    // Horizontal lines (constant ct)
    for (let ct = -maxCoord; ct <= maxCoord; ct += gridStep) {
      drawLine(-maxCoord, ct, maxCoord, ct, dimColor, 1, false);
    }

    // Original Axes (thicker)
    drawLine(-maxCoord, 0, maxCoord, 0, dimColor, 2, false); // x-axis
    drawLine(0, -maxCoord, 0, maxCoord, dimColor, 2, false); // ct-axis

    // --- Draw Light Cone (Invariant) ---
    drawLine(-maxCoord, -maxCoord, maxCoord, maxCoord, warmColor, 2, true); // ct = x
    drawLine(-maxCoord, maxCoord, maxCoord, -maxCoord, warmColor, 2, true); // ct = -x

    // --- Draw Boosted Spacetime Grid (x', ct') ---
    const tanhPhi = Math.tanh(phi);

    // Boosted axes are lines:
    // x' axis (ct' = 0): ct = x * tanh(phi)
    // ct' axis (x' = 0): x = ct * tanh(phi)

    // Determine endpoints for the boosted axes to fit within the visible area
    // For x' axis (ct = x * tanh(phi)):
    let x_prime_x1, x_prime_y1, x_prime_x2, x_prime_y2;
    if (Math.abs(tanhPhi) <= 1) { // Line is shallower than or equal to 45 deg
      x_prime_x1 = -maxCoord;
      x_prime_y1 = -maxCoord * tanhPhi;
      x_prime_x2 = maxCoord;
      x_prime_y2 = maxCoord * tanhPhi;
    } else { // Line is steeper than 45 deg (should not happen for tanh(phi))
      x_prime_y1 = -maxCoord;
      x_prime_x1 = -maxCoord / tanhPhi;
      x_prime_y2 = maxCoord;
      x_prime_x2 = maxCoord / tanhPhi;
    }
    drawLine(x_prime_x1, x_prime_y1, x_prime_x2, x_prime_y2, primaryColor, 2, true);

    // For ct' axis (x = ct * tanh(phi)):
    let ct_prime_x1, ct_prime_y1, ct_prime_x2, ct_prime_y2;
    if (Math.abs(tanhPhi) <= 1) { // Line is shallower than or equal to 45 deg
        ct_prime_y1 = -maxCoord;
        ct_prime_x1 = -maxCoord * tanhPhi;
        ct_prime_y2 = maxCoord;
        ct_prime_x2 = maxCoord * tanhPhi;
    } else { // Line is steeper than 45 deg (should not happen for tanh(phi))
        ct_prime_x1 = -maxCoord;
        ct_prime_y1 = -maxCoord / tanhPhi;
        ct_prime_x2 = maxCoord;
        ct_prime_y2 = maxCoord / tanhPhi;
    }
    drawLine(ct_prime_x1, ct_prime_y1, ct_prime_x2, ct_prime_y2, primaryColor, 2, true);

    // Draw boosted grid lines
    // Lines of constant x' (parallel to ct' axis): x - ct * tanh(phi) = C
    for (let C = -maxCoord * 2; C <= maxCoord * 2; C += gridStep) {
        if (C === 0) continue; // Skip axis, already drawn
        // We need to find the endpoints that are within the visible canvas bounds.
        // Line equation: x = C + ct * tanh(phi)
        // Points: (C + ct_min * tanh(phi), ct_min) and (C + ct_max * tanh(phi), ct_max)
        const p1x = C + (-maxCoord) * tanhPhi;
        const p1y = -maxCoord;
        const p2x = C + (maxCoord) * tanhPhi;
        const p2y = maxCoord;
        // Only draw if at least part of the line is visible. Heuristic check.
        if ((p1x > -maxCoord && p1x < maxCoord) || (p2x > -maxCoord && p2x < maxCoord) || (C > -maxCoord && C < maxCoord)) {
            drawLine(p1x, p1y, p2x, p2y, primaryColor, 1, false);
        }
    }

    // Lines of constant ct' (parallel to x' axis): ct - x * tanh(phi) = C
    for (let C = -maxCoord * 2; C <= maxCoord * 2; C += gridStep) {
        if (C === 0) continue; // Skip axis, already drawn
        // Line equation: ct = C + x * tanh(phi)
        // Points: (x_min, C + x_min * tanh(phi)) and (x_max, C + x_max * tanh(phi))
        const p1x = -maxCoord;
        const p1y = C + (-maxCoord) * tanhPhi;
        const p2x = maxCoord;
        const p2y = C + (maxCoord) * tanhPhi;
        if ((p1y > -maxCoord && p1y < maxCoord) || (p2y > -maxCoord && p2y < maxCoord) || (C > -maxCoord && C < maxCoord)) {
            drawLine(p1x, p1y, p2x, p2y, primaryColor, 1, false);
        }
    }

    // --- Labels ---
    drawText("x", maxCoord * 0.9, -0.3, dimColor, 'right', 'top');
    drawText("ct", 0.3, maxCoord * 0.9, dimColor, 'left', 'bottom');

    // Calculate rotation for boosted axes labels.
    // The "angle" of the x' axis with respect to the x axis is effectively atan(tanh(phi)).
    // For ct' axis, it's atan(1/tanh(phi)) - 90 deg, or just atan(tanh(phi)) relative to ct axis.
    // The hyperbolic angle (rapidity) itself is not a Euclidean angle.
    // We rotate the label by the Euclidean angle of the axis.
    const xPrimeAngle = Math.atan2(tanhPhi, 1); // Angle of ct = x*tanh(phi)
    const ctPrimeAngle = Math.atan2(1, tanhPhi) - Math.PI/2; // Angle of x = ct*tanh(phi) relative to ct axis

    drawText("x'", maxCoord * 0.9 * Math.cos(xPrimeAngle), maxCoord * 0.9 * Math.sin(xPrimeAngle) - 0.3, primaryColor, 'right', 'top', xPrimeAngle);
    drawText("ct'", maxCoord * 0.3 * Math.sin(ctPrimeAngle), maxCoord * 0.9 * Math.cos(ctPrimeAngle), primaryColor, 'left', 'bottom', ctPrimeAngle);

    // Rapidity value label
    ctx.font = `${Math.round(unit * 0.25)}px Arial`;
    ctx.fillStyle = softWhite;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`Rapidity φ: ${phi.toFixed(2)}`, toCx(-maxCoord * 0.95), toCy(maxCoord * 0.95));
  }
}