{
  duration: 6,
  setup: function(W, H) {
    const margin = Math.min(W, H) * 0.15;
    const padding = Math.min(W, H) * 0.05;

    // Spacetime coordinates
    const t_final = 6; // Total time for the events
    const x_final = 2; // Final x-position for the events

    // Bent path turning point
    const t_peak = 3;
    const x_peak = 1.5; // Max x-position for the bent path

    // Velocities (c=1)
    const v_inertial = x_final / t_final;
    const v_bent1 = x_peak / t_peak;
    const v_bent2 = (x_final - x_peak) / (t_final - t_peak);

    // Total proper times
    const tau_inertial_total = t_final * Math.sqrt(1 - v_inertial * v_inertial);
    const tau_bent1_total = t_peak * Math.sqrt(1 - v_bent1 * v_bent1);
    const tau_bent2_total = (t_final - t_peak) * Math.sqrt(1 - v_bent2 * v_bent2);
    const tau_bent_total = tau_bent1_total + tau_bent2_total;

    // Scale factors for canvas
    const max_x_display = Math.max(x_final, x_peak) + 0.5; // A bit extra for labels
    const max_t_display = t_final + 1; // A bit extra for labels

    const scale_x = (W - 2 * margin) / (2 * max_x_display); // x-axis centered
    const scale_t = (H - margin - padding) / max_t_display;

    return {
      margin, padding,
      t_final, x_final, t_peak, x_peak,
      v_inertial, v_bent1, v_bent2,
      tau_inertial_total, tau_bent1_total, tau_bent2_total, tau_bent_total,
      scale_x, scale_t,
      max_tau_display: Math.max(tau_inertial_total, tau_bent_total) // For proper time bar scaling
    };
  },
  frame: function(ctx, t, W, H, state) {
    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, W, H);

    const {
      margin, padding,
      t_final, x_final, t_peak, x_peak,
      v_inertial, v_bent1, v_bent2,
      tau_inertial_total, tau_bent1_total, tau_bent2_total, tau_bent_total,
      scale_x, scale_t, max_tau_display
    } = state;

    // Current animation time (0 to t_final)
    const t_anim = t * t_final;

    // Canvas origin (bottom center)
    const origin_x = W / 2;
    const origin_y = H - margin;

    ctx.save();
    ctx.translate(origin_x, origin_y);

    // --- Draw Axes ---
    ctx.strokeStyle = "#9db0c8";
    ctx.lineWidth = 1;
    ctx.setLineDash([]);

    // x-axis
    ctx.beginPath();
    ctx.moveTo(-W / 2 + margin, 0);
    ctx.lineTo(W / 2 - margin, 0);
    ctx.stroke();

    // t-axis
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -H + margin + padding);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = "#9db0c8";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Space (x)", 0, 20);
    ctx.save();
    ctx.translate(-25, -H / 2 + margin + padding);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Time (ct)", 0, 0);
    ctx.restore();

    // --- Helper function to convert spacetime coords to canvas coords ---
    const toCanvas = (x_coord, t_coord) => ({
      x: x_coord * scale_x,
      y: -t_coord * scale_t
    });

    // --- Calculate current points and proper times ---
    // Inertial Path
    const x_current_inertial = v_inertial * t_anim;
    const p_inertial_end = toCanvas(x_current_inertial, t_anim);
    const current_tau_inertial = t_anim * Math.sqrt(1 - v_inertial * v_inertial);

    // Bent Path
    let x_current_bent, p_bent_peak, p_bent_end;
    let current_tau_bent = 0;

    const p_bent_start = toCanvas(0, 0);
    p_bent_peak = toCanvas(x_peak, t_peak);

    if (t_anim <= t_peak) {
      x_current_bent = v_bent1 * t_anim;
      p_bent_end = toCanvas(x_current_bent, t_anim);
      current_tau_bent = t_anim * Math.sqrt(1 - v_bent1 * v_bent1);
    } else {
      x_current_bent = x_peak + v_bent2 * (t_anim - t_peak);
      p_bent_end = toCanvas(x_current_bent, t_anim);
      current_tau_bent = tau_bent1_total + (t_anim - t_peak) * Math.sqrt(1 - v_bent2 * v_bent2);
    }

    // --- Draw Worldlines ---
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.shadowColor = "#e8eef7";
    ctx.shadowBlur = 8;

    // Inertial Worldline (Cyan)
    ctx.strokeStyle = "#5fd0e0";
    ctx.beginPath();
    ctx.moveTo(p_bent_start.x, p_bent_start.y);
    ctx.lineTo(p_inertial_end.x, p_inertial_end.y);
    ctx.stroke();

    // Bent Worldline (Amber)
    ctx.strokeStyle = "#e8b64c";
    ctx.beginPath();
    ctx.moveTo(p_bent_start.x, p_bent_start.y);
    if (t_anim <= t_peak) {
      ctx.lineTo(p_bent_end.x, p_bent_end.y);
    } else {
      ctx.lineTo(p_bent_peak.x, p_bent_peak.y);
      ctx.lineTo(p_bent_end.x, p_bent_end.y);
    }
    ctx.stroke();

    ctx.shadowBlur = 0; // Disable shadow for points and text

    // --- Draw Current Event Points ---
    ctx.fillStyle = "#e8eef7";
    ctx.beginPath();
    ctx.arc(p_inertial_end.x, p_inertial_end.y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(p_bent_end.x, p_bent_end.y, 5, 0, Math.PI * 2);
    ctx.fill();

    // --- Draw Proper Time Bars ---
    const bar_height = 10;
    const bar_y_offset = -H / 2 + margin + 50;
    const bar_x_start = W / 2 - margin - 200; // Left side
    const bar_max_length = 180;

    // Inertial Proper Time Bar
    const inertial_bar_length = (current_tau_inertial / max_tau_display) * bar_max_length;
    ctx.fillStyle = "#5fd0e0";
    ctx.fillRect(bar_x_start, bar_y_offset, inertial_bar_length, bar_height);
    ctx.strokeStyle = "#9db0c8";
    ctx.lineWidth = 1;
    ctx.strokeRect(bar_x_start, bar_y_offset, bar_max_length, bar_height);

    ctx.fillStyle = "#e8eef7";
    ctx.textAlign = "left";
    ctx.font = "14px sans-serif";
    ctx.fillText("Inertial Proper Time:", bar_x_start, bar_y_offset - 10);
    ctx.fillText(current_tau_inertial.toFixed(2), bar_x_start + bar_max_length + 10, bar_y_offset + bar_height / 2 + 5);

    // Bent Proper Time Bar
    const bent_bar_length = (current_tau_bent / max_tau_display) * bar_max_length;
    ctx.fillStyle = "#e8b64c";
    ctx.fillRect(bar_x_start, bar_y_offset + bar_height + 30, bent_bar_length, bar_height);
    ctx.strokeStyle = "#9db0c8";
    ctx.lineWidth = 1;
    ctx.strokeRect(bar_x_start, bar_y_offset + bar_height + 30, bar_max_length, bar_height);

    ctx.fillStyle = "#e8eef7";
    ctx.fillText("Bent Proper Time:", bar_x_start, bar_y_offset + bar_height + 20);
    ctx.fillText(current_tau_bent.toFixed(2), bar_x_start + bar_max_length + 10, bar_y_offset + bar_height * 1.5 + 35);

    // --- Labels for paths (at their current ends) ---
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";

    // Inertial label
    ctx.fillStyle = "#5fd0e0";
    ctx.fillText("Inertial", p_inertial_end.x, p_inertial_end.y - 15);

    // Bent label
    ctx.fillStyle = "#e8b64c";
    ctx.fillText("Bent", p_bent_end.x, p_bent_end.y - 15);

    // --- Draw Start and End Events ---
    const p_start_event = toCanvas(0, 0);
    const p_end_event = toCanvas(x_final, t_final);

    ctx.fillStyle = "#e8eef7";
    ctx.shadowColor = "#e8eef7";
    ctx.shadowBlur = 8;

    ctx.beginPath();
    ctx.arc(p_start_event.x, p_start_event.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText("E1", p_start_event.x, p_start_event.y + 25);

    // Only draw end event when t_anim reaches t_final
    if (t_anim >= t_final * 0.99) { // Add a small buffer for float comparison
        ctx.beginPath();
        ctx.arc(p_end_event.x, p_end_event.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText("E2", p_end_event.x, p_end_event.y - 25);
    }
    ctx.shadowBlur = 0;

    ctx.restore();
  }
}