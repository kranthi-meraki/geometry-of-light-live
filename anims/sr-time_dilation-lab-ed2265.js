{
  duration: 6,
  setup: function(W, H) {
    // Fixed parameters for the light clocks
    const clockHeight = H * 0.4; // Vertical distance between mirrors
    const clockWidth = W * 0.05; // Visual width of the clock housing
    const photonRadius = W * 0.008;

    // Speeds (conceptual for calculation, not actual pixels/second)
    const c = 1; // Speed of light
    const v = 0.6 * c; // Velocity of the moving clock (0.6c)

    // Lorentz factor
    const gamma = 1 / Math.sqrt(1 - (v * v) / (c * c));

    // Time for one half-tick (bottom to top) in the stationary frame
    const T_half_tick_stationary = clockHeight / c;

    // Time for one half-tick (bottom to top) in the moving frame (as observed from stationary frame)
    // This is the time dilation in action: T_half_tick_moving = gamma * T_half_tick_stationary
    // However, for the animation, we want the *entire loop* (t:0->1) to represent ONE full tick
    // of the moving clock. So, the effective "duration" of the moving clock's half-tick within
    // the normalized t [0,1) loop is 0.5.
    // The actual time a photon takes to travel diagonally from bottom to top in the moving clock
    // (from the stationary observer's perspective) is L/c, where L is the diagonal path length.
    // L = sqrt(clockHeight^2 + (v * T_half_tick_moving)^2)
    // We already have T_half_tick_moving = gamma * T_half_tick_stationary.
    // So, the vertical component of the photon's speed in the moving clock (relative to stationary observer)
    // is c_y = clockHeight / T_half_tick_moving = c / gamma.
    // And the horizontal component is v.
    // Indeed, sqrt(v^2 + (c/gamma)^2) = sqrt(v^2 + c^2(1-v^2/c^2)) = sqrt(v^2 + c^2 - v^2) = c.

    // Center positions for the clocks
    const centerX_s = W * 0.3; // Stationary clock X
    const centerX_m = W * 0.7; // Moving clock X (initial position)

    // Y positions for mirrors
    const bottomY = H * 0.7;
    const topY = H * 0.7 - clockHeight;

    // Horizontal distance the moving clock travels over one full tick (t:0->1)
    // One full tick of the moving clock takes 2 * T_half_tick_moving actual time.
    // Let's define the total horizontal displacement of the moving clock over t:0->1
    // to be some reasonable value, e.g., W * 0.2.
    const totalClockTravelX = W * 0.2;
    // So, the effective velocity of the moving clock for animation purposes is totalClockTravelX / duration.
    // But for the physics calculation of gamma, we used a conceptual 'v' relative to 'c'.
    // We need to be careful with units. Let's make the animation show the *relative* speeds correctly.
    // The horizontal displacement of the moving clock's *center* over half a tick (t:0->0.5)
    // relative to its starting position, is `v_anim * 0.5 * duration`.
    // The total horizontal displacement of the moving clock over one full tick (t:0->1) is `v_anim * duration`.
    // Let's make the moving clock travel `W * 0.3` over the `duration` (6s).
    // So `v_anim = (W * 0.3) / duration`.
    // Then `v_ratio_for_gamma = v_anim / c_anim`. We need to ensure `v_ratio_for_gamma` matches `v/c`.
    // Let `c_anim` be `clockHeight / (T_half_tick_stationary * duration_scale)`.
    // This is getting complicated. Let's use the given `v` and `c` for the gamma factor,
    // and scale the visual displacements to fit the screen.

    // The animation loop (t:0->1) represents one full tick (up and down) of the MOVING clock.
    // So, over t:0->0.5, the moving photon goes up. Over t:0.5->1, it goes down.
    // The total horizontal distance covered by the moving clock over t:0->1
    // (relative to its starting position) will be `2 * clockHeight * (v/c) * gamma`.
    // This is `2 * clockHeight * (v/c) / sqrt(1 - v^2/c^2)`.
    // Let's simplify and make the total horizontal travel of the *moving clock*
    // from its initial position at t=0 to its final position at t=1.
    const movingClockTravelDistance = W * 0.3;

    return {
      clockHeight, clockWidth, photonRadius,
      c, v, gamma,
      bottomY, topY,
      centerX_s, centerX_m,
      movingClockTravelDistance
    };
  },
  frame: function(ctx, t, W, H, state) {
    const {
      clockHeight, clockWidth, photonRadius,
      c, v, gamma,
      bottomY, topY,
      centerX_s, centerX_m,
      movingClockTravelDistance
    } = state;

    // Background
    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, W, H);

    // --- Drawing Helper Function ---
    function drawClock(x_center, current_photon_y, current_photon_x_offset = 0, label = "") {
      const halfWidth = clockWidth / 2;
      const mirrorThickness = H * 0.01;

      // Clock housing
      ctx.strokeStyle = "#9db0c8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x_center - halfWidth, topY);
      ctx.lineTo(x_center - halfWidth, bottomY);
      ctx.moveTo(x_center + halfWidth, topY);
      ctx.lineTo(x_center + halfWidth, bottomY);
      ctx.stroke();

      // Top mirror
      ctx.fillStyle = "#e8eef7";
      ctx.fillRect(x_center - halfWidth, topY - mirrorThickness, clockWidth, mirrorThickness);

      // Bottom mirror
      ctx.fillRect(x_center - halfWidth, bottomY, clockWidth, mirrorThickness);

      // Photon
      ctx.fillStyle = "#e8b64c"; // Warm amber
      ctx.shadowColor = "#e8b64c";
      ctx.shadowBlur = photonRadius * 1.5;
      ctx.beginPath();
      ctx.arc(x_center + current_photon_x_offset, current_photon_y, photonRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow

      // Label
      ctx.fillStyle = "#e8eef7";
      ctx.font = `${W * 0.025}px Arial`;
      ctx.textAlign = "center";
      ctx.fillText(label, x_center, H * 0.85);
    }

    // --- Stationary Clock Calculations ---
    // The animation loop (t:0->1) represents one full tick of the MOVING clock.
    // The stationary clock ticks faster by a factor of gamma.
    // So, over t:0->1, the stationary clock completes `gamma` times its own half-tick cycles.
    const stationary_photon_progress_cycle = (t * gamma * 2) % 2; // 0 to 2, representing up and down
    let stationary_photon_y;
    if (stationary_photon_progress_cycle < 1) { // Moving up
      stationary_photon_y = bottomY - stationary_photon_progress_cycle * clockHeight;
    } else { // Moving down
      stationary_photon_y = topY + (stationary_photon_progress_cycle - 1) * clockHeight;
    }
    drawClock(centerX_s, stationary_photon_y, 0, "Stationary");

    // --- Moving Clock Calculations ---
    // The moving clock's horizontal position
    const current_moving_clock_x = centerX_m + movingClockTravelDistance * t;

    // The moving clock photon's vertical path is synchronized with t:0->1
    // (t:0->0.5 is up, t:0.5->1 is down)
    const moving_photon_progress_cycle = t * 2; // 0 to 2 over t:0->1
    let moving_photon_y;
    let moving_photon_x_offset;

    if (moving_photon_progress_cycle < 1) { // Moving up (t:0 -> 0.5)
      moving_photon_y = bottomY - moving_photon_progress_cycle * clockHeight;
      // Horizontal displacement *relative to the clock's center* for the photon
      // The total horizontal displacement of the photon relative to the clock's initial position
      // over one half-tick (t=0 to t=0.5) is `v * T_half_tick_moving`.
      // T_half_tick_moving is effectively 0.5 of the normalized loop.
      // So the horizontal displacement during the upward journey is `(movingClockTravelDistance / 2)`.
      // The photon starts at the left edge of the clock (relative to its own center) and moves to the right edge.
      // Let's simplify: the photon moves from left edge of clock to right edge of clock.
      // The total horizontal path length for the photon relative to the clock over a half-tick is
      // `v * (0.5 * duration_of_loop_in_seconds)`.
      // We want the photon to appear to travel a diagonal path.
      // The horizontal distance the photon travels *relative to the clock's center* in one half tick is `v * T_half_tick_moving`.
      // T_half_tick_moving is proportional to 0.5 of the animation loop.
      // The total horizontal distance the clock moves in one half-tick is `movingClockTravelDistance / 2`.
      // The photon needs to cover this horizontal distance relative to the clock.
      // So, `moving_photon_x_offset` goes from `-halfWidth` to `+halfWidth` over `t:0->0.5`.
      // This is not quite right. The photon's *absolute* horizontal speed is `v_clock`.
      // The photon's *absolute* vertical speed is `c_y = c / gamma`.
      // We are showing the clock moving from `centerX_m` to `centerX_m + movingClockTravelDistance` over `t:0->1`.
      // The photon's horizontal position relative to the *start* of the clock's journey at `centerX_m`
      // should be `(movingClockTravelDistance / 2) * moving_photon_progress_cycle`.
      // This photon's x_offset should be relative to the *current* clock center.
      // The total horizontal distance the photon travels relative to the clock over the upward journey is `v * T_half_tick_moving`.
      // This is `v * (clockHeight / (c/gamma)) = v * clockHeight * gamma / c`.
      // Let's scale this to the visual `movingClockTravelDistance`.
      // The ratio of horizontal photon path to total clock travel is `(v * clockHeight * gamma / c) / movingClockTravelDistance`.
      // This is effectively `(v/c) * gamma * (clockHeight / movingClockTravelDistance)`.
      // Let's use `v_visual_photon_horizontal = (movingClockTravelDistance / 2)`.
      moving_photon_x_offset = - (movingClockTravelDistance / 2) * (1 - moving_photon_progress_cycle);
    } else { // Moving down (t:0.5 -> 1)
      moving_photon_y = topY + (moving_photon_progress_cycle - 1) * clockHeight;
      moving_photon_x_offset = (movingClockTravelDistance / 2) * (moving_photon_progress_cycle - 1);
    }
    drawClock(current_moving_clock_x, moving_photon_y, moving_photon_x_offset, "Moving (v=0.6c)");

    // --- Labels ---
    ctx.fillStyle = "#5fd0e0"; // Primary cyan
    ctx.font = `${W * 0.035}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText("Time Dilation", W / 2, H * 0.1);

    ctx.font = `${W * 0.02}px Arial`;
    ctx.fillText("Stationary clock ticks faster", centerX_s, H * 0.93);
    ctx.fillText("Moving clock ticks slower", centerX_m, H * 0.93);

    // Light path lines (optional, but helps visualize)
    ctx.strokeStyle = "#e8b64c"; // Warm amber
    ctx.lineWidth = 1;
    ctx.setLineDash([W*0.005, W*0.005]); // Dashed line
    ctx.shadowColor = "#e8b64c";
    ctx.shadowBlur = photonRadius;

    // Stationary path
    ctx.beginPath();
    ctx.moveTo(centerX_s, bottomY);
    ctx.lineTo(centerX_s, topY);
    ctx.stroke();

    // Moving path (diagonal)
    ctx.beginPath();
    ctx.moveTo(centerX_m - movingClockTravelDistance / 2, bottomY);
    ctx.lineTo(centerX_m + movingClockTravelDistance / 2, topY);
    ctx.lineTo(centerX_m + movingClockTravelDistance, bottomY);
    ctx.stroke();

    ctx.setLineDash([]); // Reset line dash
    ctx.shadowBlur = 0; // Reset shadow
  }
}