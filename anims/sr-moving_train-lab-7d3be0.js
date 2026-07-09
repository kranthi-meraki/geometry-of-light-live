{
  duration: 6,
  setup: function(W, H) {
    // No specific state needed beyond what's derived from W, H, t
    return {};
  },
  frame: function(ctx, t, W, H, state) {
    // HARD RULE: Paint background
    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, W, H);

    // --- Configuration ---
    const platform_y = H * 0.7;
    const platform_length = W * 0.7;
    const platform_x_start = (W - platform_length) / 2;
    const platform_x_end = platform_x_start + platform_length;
    const platform_mid_x = W / 2;

    const train_length = platform_length * 0.8;
    const train_height = H * 0.08;
    const train_y = platform_y - train_height - H * 0.02; // Above platform
    const train_speed_anim = W * 0.4; // Visual speed across screen over the loop

    const observer_radius = H * 0.015;
    const observer_y_platform = platform_y - observer_radius * 2;
    const observer_y_train = train_y - observer_radius * 2;

    const strike_moment_t = 0.3; // When lightning strikes in platform frame
    const light_speed_anim = W * 0.8; // Visual speed of light propagation

    // --- Derived Positions ---
    // Train's current center X position
    const train_current_x_center = W / 2 + train_speed_anim * (t - 0.5); // Starts left, ends right, centered at t=0.5
    const train_left_x = train_current_x_center - train_length / 2;
    const train_right_x = train_current_x_center + train_length / 2;

    // Platform Observer (O) is fixed at platform midpoint
    const O_x = platform_mid_x;

    // Train Observer (O') moves with the train, at its center
    const O_prime_x = train_current_x_center;

    // Strike points (fixed in platform frame)
    // These are where the train's ends *were* at strike_moment_t relative to the platform.
    // We define strike points as the ends of the platform, and the train happens to be there at t=strike_moment_t
    const strike_left_x = platform_x_start;
    const strike_right_x = platform_x_end;
    const strike_y = train_y + train_height / 2; // Mid-height of the train

    // --- Drawing ---

    // 1. Platform
    ctx.fillStyle = "#9db0c8";
    ctx.fillRect(platform_x_start, platform_y, platform_length, H * 0.02);
    ctx.fillStyle = "#e8eef7";
    ctx.font = `${H * 0.025}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("Platform", platform_mid_x, platform_y + H * 0.05);

    // 2. Train
    ctx.fillStyle = "#5fd0e0";
    ctx.fillRect(train_left_x, train_y, train_length, train_height);

    // 3. Platform Observer (O)
    ctx.fillStyle = "#e8b64c";
    ctx.beginPath();
    ctx.arc(O_x, observer_y_platform, observer_radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e8eef7";
    ctx.font = `${H * 0.02}px sans-serif`;
    ctx.fillText("O", O_x, observer_y_platform - observer_radius * 1.5);

    // 4. Train Observer (O')
    ctx.fillStyle = "#e8b64c";
    ctx.beginPath();
    ctx.arc(O_prime_x, observer_y_train, observer_radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e8eef7";
    ctx.fillText("O'", O_prime_x, observer_y_train - observer_radius * 1.5);

    // 5. Lightning Strikes and Light Propagation
    if (t >= strike_moment_t) {
      // Flash at strike points
      ctx.shadowColor = "#e8b64c";
      ctx.shadowBlur = 15;
      ctx.fillStyle = "#e8b64c";
      ctx.beginPath();
      ctx.arc(strike_left_x, strike_y, H * 0.02, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(strike_right_x, strike_y, H * 0.02, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow

      // Light pulses
      const light_propagation_time = t - strike_moment_t;
      const current_light_radius = light_speed_anim * light_propagation_time;

      ctx.strokeStyle = "#e8eef7";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#e8eef7";
      ctx.shadowBlur = 10;

      // Pulse from left strike point
      ctx.beginPath();
      ctx.arc(strike_left_x, strike_y, current_light_radius, 0, Math.PI * 2);
      ctx.stroke();

      // Pulse from right strike point
      ctx.beginPath();
      ctx.arc(strike_right_x, strike_y, current_light_radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.shadowBlur = 0; // Reset shadow

      // 6. Indicate Light Reception
      ctx.fillStyle = "#e8b64c";
      ctx.font = `${H * 0.018}px sans-serif`;

      // Platform Observer (O) reception
      const dist_O_L = Math.abs(strike_left_x - O_x);
      const dist_O_R = Math.abs(strike_right_x - O_x);

      // In the platform frame, O is equidistant from both strikes, so receives simultaneously
      if (current_light_radius >= dist_O_L - 1) { // -1 for slight visual tolerance
        ctx.fillText("Simultaneous", O_x, observer_y_platform + H * 0.05);
      }

      // Train Observer (O') reception
      const dist_O_prime_L = Math.abs(strike_left_x - O_prime_x); // Distance to rear strike
      const dist_O_prime_R = Math.abs(strike_right_x - O_prime_x); // Distance to front strike

      // O' is moving towards the front strike (R) and away from the rear strike (L)
      // So O' receives R light first.
      if (current_light_radius >= dist_O_prime_R - 1) {
        ctx.fillText("Front Light", O_prime_x, observer_y_train + H * 0.03);
      }
      if (current_light_radius >= dist_O_prime_L - 1) {
        ctx.fillText("Rear Light", O_prime_x, observer_y_train + H * 0.06);
      }

      // Add a label to clarify the difference
      if (t > strike_moment_t + 0.1 && t < strike_moment_t + 0.5) { // Show label for a duration
          ctx.fillStyle = "#e8eef7";
          ctx.font = `${H * 0.025}px sans-serif`;
          ctx.fillText("Relativity of Simultaneity", W / 2, H * 0.1);
          ctx.font = `${H * 0.018}px sans-serif`;
          ctx.fillText("O sees strikes simultaneously.", W / 2, H * 0.14);
          ctx.fillText("O' sees front strike first.", W / 2, H * 0.17);
      }
    }
  }
}