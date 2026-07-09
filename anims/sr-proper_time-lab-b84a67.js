{
  duration: 6,
  setup: function(W, H) {
    return {};
  },
  frame: function(ctx, t, W, H, state) {
    // Background
    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, W, H);

    // Spacetime diagram parameters
    const margin = Math.min(W, H) * 0.15;
    const plotHeight = H - 2 * margin;
    const plotWidth = W - 2 * margin;

    const Y_total_spacetime = 100; // Total time in spacetime units
    const X_peak_spacetime = 30;   // Max spatial displacement in spacetime units

    // Canvas scaling and offset
    const scaleY = plotHeight / Y_total_spacetime;
    const scaleX = (plotWidth / 2) / X_peak_spacetime; // Half width for positive X, half for negative X

    const cx_center = W / 2;
    const cy_bottom = H - margin;

    // Helper to convert spacetime (x_s, y_s) to canvas (cx, cy)
    const toCanvas = (x_s, y_s) => ({
      cx: cx_center + x_s * scaleX,
      cy: cy_bottom - y_s * scaleY
    });

    // Current time in spacetime units, driven by animation phase t
    const current_y_s = t * Y_total_spacetime;

    // Reset shadow for paths
    ctx.shadowBlur = 0;

    // --- Draw Stay-at-home (Inertial) Worldline ---
    ctx.beginPath();
    const start_inertial = toCanvas(0, 0);
    const end_inertial = toCanvas(0, current_y_s);
    ctx.moveTo(start_inertial.cx, start_inertial.cy);
    ctx.lineTo(end_inertial.cx, end_inertial.cy);
    ctx.strokeStyle = "#e8eef7"; // Soft white
    ctx.lineWidth = 4;
    ctx.shadowColor = "#e8eef7";
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0; // Reset shadow after drawing

    // --- Draw Traveler Worldline ---
    ctx.beginPath();
    const Y_peak_time_traveler = Y_total_spacetime / 2; // Traveler reaches max X at half total time
    const start_traveler = toCanvas(0, 0);
    ctx.moveTo(start_traveler.cx, start_traveler.cy);

    if (current_y_s <= Y_peak_time_traveler) {
      // Outward journey
      const x_at_current_y = (X_peak_spacetime / Y_peak_time_traveler) * current_y_s;
      const current_traveler = toCanvas(x_at_current_y, current_y_s);
      ctx.lineTo(current_traveler.cx, current_traveler.cy);
    } else {
      // Outward journey completed, now on return journey
      const peak_traveler = toCanvas(X_peak_spacetime, Y_peak_time_traveler);
      ctx.lineTo(peak_traveler.cx, peak_traveler.cy);

      if (current_y_s < Y_total_spacetime) {
        const x_at_current_y = X_peak_spacetime - (X_peak_spacetime / Y_peak_time_traveler) * (current_y_s - Y_peak_time_traveler);
        const current_traveler = toCanvas(x_at_current_y, current_y_s);
        ctx.lineTo(current_traveler.cx, current_traveler.cy);
      } else {
        // Fully returned
        const end_traveler = toCanvas(0, Y_total_spacetime);
        ctx.lineTo(end_traveler.cx, end_traveler.cy);
      }
    }
    ctx.strokeStyle = "#5fd0e0"; // Primary cyan
    ctx.lineWidth = 4;
    ctx.shadowColor = "#5fd0e0";
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0; // Reset shadow after drawing

    // --- Draw Events (Points) ---
    ctx.fillStyle = "#e8b64c"; // Warm amber

    // Start Event
    const start_event_c = toCanvas(0, 0);
    ctx.beginPath();
    ctx.arc(start_event_c.cx, start_event_c.cy, 6, 0, Math.PI * 2);
    ctx.fill();

    // End Event (only draw if current_y_s has reached it or passed it)
    if (t >= 0.999) { // Draw fully at the end
      const end_event_c = toCanvas(0, Y_total_spacetime);
      ctx.beginPath();
      ctx.arc(end_event_c.cx, end_event_c.cy, 6, 0, Math.PI * 2);
      ctx.fill();
    }


    // --- Labels ---
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#9db0c8"; // Dim color
    ctx.textAlign = "center";

    // Start Event label
    ctx.fillText("Start Event", start_event_c.cx, start_event_c.cy + 25);

    // End Event label
    const end_event_label_c = toCanvas(0, Y_total_spacetime);
    ctx.fillText("End Event", end_event_label_c.cx, end_event_label_c.cy - 15);

    ctx.textAlign = "left";
    // Stay-at-home label
    const stay_home_label_c = toCanvas(-5, Y_total_spacetime * 0.5);
    ctx.fillText("Stay-at-home", stay_home_label_c.cx, stay_home_label_c.cy);
    ctx.fillText("(Longer Proper Time)", stay_home_label_c.cx, stay_home_label_c.cy + 20);

    // Traveler label
    const traveler_label_c = toCanvas(X_peak_spacetime * 0.5, Y_total_spacetime * 0.75);
    ctx.fillText("Traveler", traveler_label_c.cx, traveler_label_c.cy);
  }
}