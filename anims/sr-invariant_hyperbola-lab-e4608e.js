{
  duration: 6,
  setup: function(W, H) {
    return {
      // No specific state needed, everything derived from t
    };
  },
  frame: function(ctx, t, W, H, state) {
    // --- Configuration ---
    const BG_COLOR = "#0a0d14";
    const PRIMARY_CYAN = "#5fd0e0";
    const WARM_AMBER = "#e8b64c";
    const DIM_COLOR = "#9db0c8";
    const SOFT_WHITE = "#e8eef7";

    const MAX_BETA = 0.8; // Maximum Lorentz beta (v/c)
    const AXIS_LENGTH_UNITS = 2.5; // Length of axes in abstract units
    const HYPERBOLA_RANGE_UNITS = 2.0; // Range for drawing hyperbola x/ct values
    const POINT_RADIUS_PIXELS = 6;
    const LABEL_OFFSET_PIXELS = 15;
    const SHADOW_BLUR = 10;

    // --- Background ---
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, W, H);

    // --- Transform to centered, scaled coordinate system ---
    // Determine a dynamic scale based on canvas size, ensuring content fits
    const minDim = Math.min(W, H);
    const scale = minDim / (2 * AXIS_LENGTH_UNITS + 1.0); // Pixels per unit length
    
    ctx.save();
    ctx.translate(W / 2, H / 2); // Center origin
    ctx.scale(scale, -scale);    // Flip Y-axis so +ct is up, apply scale

    // --- Animation Parameter: beta (v/c) ---
    // t goes from 0 to 1. Beta goes from 0 to MAX_BETA and back to 0.
    const beta = MAX_BETA * Math.sin(t * Math.PI);
    const gamma = 1 / Math.sqrt(1 - beta * beta);

    // --- Helper function to draw a line ---
    const drawLine = (x1, y1, x2, y2, color, width, shadow = false) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = color;
      ctx.lineWidth = width / scale; // Adjust line width for scaling
      if (shadow) {
        ctx.shadowColor = color;
        ctx.shadowBlur = SHADOW_BLUR / scale;
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.stroke();
    };

    // --- Helper function to draw a point ---
    const drawPoint = (x, y, radius, color, shadow = false) => {
      ctx.beginPath();
      ctx.arc(x, y, radius / scale, 0, Math.PI * 2);
      ctx.fillStyle = color;
      if (shadow) {
        ctx.shadowColor = color;
        ctx.shadowBlur = SHADOW_BLUR / scale;
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.fill();
    };

    // --- Helper function to draw text ---
    const drawText = (text, x, y, color, alignment, shadow = false) => {
      ctx.save();
      ctx.scale(1, -1); // Flip text back upright
      ctx.fillStyle = color;
      ctx.font = `${18 / scale}px sans-serif`; // Adjust font size for scaling
      ctx.textAlign = alignment;
      ctx.textBaseline = 'middle';
      if (shadow) {
        ctx.shadowColor = color;
        ctx.shadowBlur = SHADOW_BLUR / scale;
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.fillText(text, x, -y); // Adjust y for flipped canvas
      ctx.restore();
    };

    // --- Draw Light Cone (Invariant) ---
    drawLine(-AXIS_LENGTH_UNITS, -AXIS_LENGTH_UNITS, AXIS_LENGTH_UNITS, AXIS_LENGTH_UNITS, WARM_AMBER, 1.5, true);
    drawLine(-AXIS_LENGTH_UNITS, AXIS_LENGTH_UNITS, AXIS_LENGTH_UNITS, -AXIS_LENGTH_UNITS, WARM_AMBER, 1.5, true);

    // --- Draw S-frame Axes (ct, x) ---
    drawLine(0, -AXIS_LENGTH_UNITS, 0, AXIS_LENGTH_UNITS, WARM_AMBER, 2, true); // ct-axis
    drawLine(-AXIS_LENGTH_UNITS, 0, AXIS_LENGTH_UNITS, 0, WARM_AMBER, 2, true); // x-axis

    // --- Draw S'-frame Axes (ct', x') ---
    // Angle of x' axis from x-axis is atan(beta)
    const angle_x_prime = Math.atan(beta);
    // Angle of ct' axis from x-axis is PI/2 - atan(beta)
    const angle_ct_prime = Math.atan(1 / beta); // Or Math.PI/2 - angle_x_prime

    const x_prime_end_x = AXIS_LENGTH_UNITS * Math.cos(angle_x_prime);
    const x_prime_end_y = AXIS_LENGTH_UNITS * Math.sin(angle_x_prime);
    drawLine(-x_prime_end_x, -x_prime_end_y, x_prime_end_x, x_prime_end_y, PRIMARY_CYAN, 2, true); // x'-axis

    const ct_prime_end_x = AXIS_LENGTH_UNITS * Math.cos(angle_ct_prime);
    const ct_prime_end_y = AXIS_LENGTH_UNITS * Math.sin(angle_ct_prime);
    drawLine(-ct_prime_end_x, -ct_prime_end_y, ct_prime_end_x, ct_prime_end_y, PRIMARY_CYAN, 2, true); // ct'-axis

    // --- Draw Invariant Hyperbolae ---
    ctx.beginPath();
    ctx.strokeStyle = PRIMARY_CYAN;
    ctx.lineWidth = 1.5 / scale;
    ctx.shadowColor = PRIMARY_CYAN;
    ctx.shadowBlur = SHADOW_BLUR / scale;

    // Hyperbola: ct^2 - x^2 = 1 (time-like, passes through (0, +/-1))
    // Upper branch: ct = sqrt(1 + x^2)
    ctx.moveTo(-HYPERBOLA_RANGE_UNITS, Math.sqrt(1 + HYPERBOLA_RANGE_UNITS * HYPERBOLA_RANGE_UNITS));
    for (let x = -HYPERBOLA_RANGE_UNITS; x <= HYPERBOLA_RANGE_UNITS; x += 0.01) {
      ctx.lineTo(x, Math.sqrt(1 + x * x));
    }
    // Lower branch: ct = -sqrt(1 + x^2)
    ctx.moveTo(-HYPERBOLA_RANGE_UNITS, -Math.sqrt(1 + HYPERBOLA_RANGE_UNITS * HYPERBOLA_RANGE_UNITS));
    for (let x = -HYPERBOLA_RANGE_UNITS; x <= HYPERBOLA_RANGE_UNITS; x += 0.01) {
      ctx.lineTo(x, -Math.sqrt(1 + x * x));
    }
    ctx.stroke();

    // Hyperbola: x^2 - ct^2 = 1 (space-like, passes through (+/-1, 0))
    ctx.beginPath();
    ctx.strokeStyle = PRIMARY_CYAN;
    ctx.lineWidth = 1.5 / scale;
    ctx.shadowColor = PRIMARY_CYAN;
    ctx.shadowBlur = SHADOW_BLUR / scale;
    // Right branch: x = sqrt(1 + ct^2)
    ctx.moveTo(Math.sqrt(1 + HYPERBOLA_RANGE_UNITS * HYPERBOLA_RANGE_UNITS), -HYPERBOLA_RANGE_UNITS);
    for (let ct = -HYPERBOLA_RANGE_UNITS; ct <= HYPERBOLA_RANGE_UNITS; ct += 0.01) {
      ctx.lineTo(Math.sqrt(1 + ct * ct), ct);
    }
    // Left branch: x = -sqrt(1 + ct^2)
    ctx.moveTo(-Math.sqrt(1 + HYPERBOLA_RANGE_UNITS * HYPERBOLA_RANGE_UNITS), -HYPERBOLA_RANGE_UNITS);
    for (let ct = -HYPERBOLA_RANGE_UNITS; ct <= HYPERBOLA_RANGE_UNITS; ct += 0.01) {
      ctx.lineTo(-Math.sqrt(1 + ct * ct), ct);
    }
    ctx.stroke();
    ctx.shadowBlur = 0; // Reset shadow for points and labels

    // --- Draw Unit Points ---
    // S-frame unit points (on ct^2 - x^2 = 1 and x^2 - ct^2 = 1)
    drawPoint(0, 1, POINT_RADIUS_PIXELS, WARM_AMBER, true);
    drawPoint(1, 0, POINT_RADIUS_PIXELS, WARM_AMBER, true);
    drawPoint(0, -1, POINT_RADIUS_PIXELS, WARM_AMBER);
    drawPoint(-1, 0, POINT_RADIUS_PIXELS, WARM_AMBER);

    // S'-frame unit points (on ct^2 - x^2 = 1 and x^2 - ct^2 = 1)
    // (ct'=1, x'=0) corresponds to (x, ct) = (gamma*beta, gamma)
    drawPoint(gamma * beta, gamma, POINT_RADIUS_PIXELS, PRIMARY_CYAN, true);
    // (ct'=0, x'=1) corresponds to (x, ct) = (gamma, gamma*beta)
    drawPoint(gamma, gamma * beta, POINT_RADIUS_PIXELS, PRIMARY_CYAN, true);
    // Also draw negative unit points
    drawPoint(-gamma * beta, -gamma, POINT_RADIUS_PIXELS, PRIMARY_CYAN);
    drawPoint(-gamma, -gamma * beta, POINT_RADIUS_PIXELS, PRIMARY_CYAN);


    // --- Labels ---
    // S-frame labels
    drawText("ct", 0, AXIS_LENGTH_UNITS + LABEL_OFFSET_PIXELS / scale, WARM_AMBER, 'center', true);
    drawText("x", AXIS_LENGTH_UNITS + LABEL_OFFSET_PIXELS / scale, 0, WARM_AMBER, 'left', true);

    // S'-frame labels
    const label_x_prime_x = (AXIS_LENGTH_UNITS + LABEL_OFFSET_PIXELS / scale) * Math.cos(angle_x_prime);
    const label_x_prime_y = (AXIS_LENGTH_UNITS + LABEL_OFFSET_PIXELS / scale) * Math.sin(angle_x_prime);
    drawText("x'", label_x_prime_x, label_x_prime_y, PRIMARY_CYAN, 'left', true);

    const label_ct_prime_x = (AXIS_LENGTH_UNITS + LABEL_OFFSET_PIXELS / scale) * Math.cos(angle_ct_prime);
    const label_ct_prime_y = (AXIS_LENGTH_UNITS + LABEL_OFFSET_PIXELS / scale) * Math.sin(angle_ct_prime);
    drawText("ct'", label_ct_prime_x, label_ct_prime_y, PRIMARY_CYAN, 'left', true);

    // Invariant hyperbola label
    drawText("c²t² - x² = 1", 1.5, 1.5, DIM_COLOR, 'center');
    drawText("x² - c²t² = 1", 1.5, -1.5, DIM_COLOR, 'center');

    ctx.restore(); // Restore original canvas state
  }
}