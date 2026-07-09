{
  duration: 6,
  setup: function(W, H) {
    const c = 1; // Speed of light (unit speed)
    const v = 0.4 * c; // Speed of train (0.4c)
    const trainLength = 200; // Proper length of the train car
    const carHeight = 40;
    const lightRadius = 6;
    const pulseWidth = 8;
    const margin = 50;
    const yOffsetPlatform = H / 2 - carHeight - margin / 2;
    const yOffsetTrain = H / 2 + margin / 2;

    // Calculate event times in platform frame
    // Light hits rear: (L/2) = (c+v)*t_rear => t_rear = (L/2) / (c+v)
    const t_platform_rear_hit = (trainLength / 2) / (c + v);
    // Light hits front: (L/2) = (c-v)*t_front => t_front = (L/2) / (c-v)
    const t_platform_front_hit = (trainLength / 2) / (c - v);

    // Calculate event time in train frame
    // Light hits both ends: (L/2) = c*t_train => t_train = (L/2) / c
    const t_train_hit = (trainLength / 2) / c;

    // The animation loop (t:0->1) will cover the time until the front is hit in the platform frame.
    const max_animation_time = t_platform_front_hit;

    return {
      c, v, trainLength, carHeight, lightRadius, pulseWidth, margin,
      yOffsetPlatform, yOffsetTrain,
      t_platform_rear_hit, t_platform_front_hit, t_train_hit,
      max_animation_time
    };
  },
  frame: function(ctx, t, W, H, state) {
    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, W, H);

    const {
      c, v, trainLength, carHeight, lightRadius, pulseWidth, margin,
      yOffsetPlatform, yOffsetTrain,
      t_platform_rear_hit, t_platform_front_hit, t_train_hit,
      max_animation_time
    } = state;

    // Current time in the platform frame, scaled by animation progress t
    const time_platform = t * max_animation_time;

    // --- Platform Frame (Top) ---
    const platform_x_center = W / 2; // Fixed center for platform view
    ctx.save();
    ctx.translate(platform_x_center, yOffsetPlatform);

    // Train's position in platform frame
    const train_center_x_platform = v * time_platform;
    const train_rear_x_platform = train_center_x_platform - trainLength / 2;
    const train_front_x_platform = train_center_x_platform + trainLength / 2;

    // Draw platform
    ctx.fillStyle = "#9db0c8";
    ctx.fillRect(-W / 2, carHeight / 2 + 5, W, 2);
    ctx.fillText("Platform Frame", -W / 2 + margin, -carHeight / 2 - 20);

    // Draw train car
    ctx.fillStyle = "#5fd0e0";
    ctx.fillRect(train_rear_x_platform, -carHeight / 2, trainLength, carHeight);
    ctx.strokeStyle = "#e8eef7";
    ctx.lineWidth = 2;
    ctx.strokeRect(train_rear_x_platform, -carHeight / 2, trainLength, carHeight);

    // Draw light source (at center of train when flash occurs, then moves with train)
    const light_source_x_platform = train_center_x_platform;
    ctx.fillStyle = "#e8b64c";
    ctx.shadowColor = "#e8b64c";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(light_source_x_platform, 0, lightRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw light pulses
    ctx.fillStyle = "#e8eef7";
    ctx.shadowColor = "#e8eef7";
    ctx.shadowBlur = 8;
    if (time_platform > 0) {
      // Right pulse (expands from origin of flash)
      const right_pulse_x_platform = c * time_platform;
      if (right_pulse_x_platform > light_source_x_platform) { // Only draw if it's past the source
         ctx.fillRect(light_source_x_platform, -pulseWidth / 2, right_pulse_x_platform - light_source_x_platform, pulseWidth);
      } else { // Draw from origin to current position
         ctx.fillRect(0, -pulseWidth / 2, right_pulse_x_platform, pulseWidth);
      }
      
      // Left pulse (expands from origin of flash)
      const left_pulse_x_platform = -c * time_platform;
      if (left_pulse_x_platform < light_source_x_platform) { // Only draw if it's past the source
         ctx.fillRect(left_pulse_x_platform, -pulseWidth / 2, light_source_x_platform - left_pulse_x_platform, pulseWidth);
      } else { // Draw from current position to origin
         ctx.fillRect(left_pulse_x_platform, -pulseWidth / 2, -left_pulse_x_platform, pulseWidth);
      }
    }
    ctx.shadowBlur = 0;

    // Indicate hits
    if (time_platform >= t_platform_rear_hit) {
      ctx.fillStyle = "#e8b64c";
      ctx.fillRect(train_rear_x_platform - 5, -carHeight / 2 - 5, 10, carHeight + 10);
      ctx.fillStyle = "#e8eef7";
      ctx.fillText("HIT!", train_rear_x_platform - 20, carHeight / 2 + 20);
    }
    if (time_platform >= t_platform_front_hit) {
      ctx.fillStyle = "#e8b64c";
      ctx.fillRect(train_front_x_platform - 5, -carHeight / 2 - 5, 10, carHeight + 10);
      ctx.fillStyle = "#e8eef7";
      ctx.fillText("HIT!", train_front_x_platform - 20, carHeight / 2 + 20);
    }

    ctx.restore();

    // --- Train Frame (Bottom) ---
    ctx.save();
    ctx.translate(platform_x_center, yOffsetTrain);

    // Time in the train frame (scaled so that the hit happens at the same animation t as the front hit in platform frame)
    // This mapping ensures the *visual completion* of the event happens simultaneously in the animation loop,
    // but the *physics* is that the train observer sees it happen simultaneously in *their* time.
    // We want the train frame event to complete at the same global t as the platform frame's front hit.
    // So, when time_platform reaches t_platform_front_hit, time_train_display should reach t_train_hit.
    const time_train_display = t * t_train_hit / (t_platform_front_hit / max_animation_time); // Simplified to t * t_train_hit

    // Train's position in train frame (stationary)
    const train_center_x_train = 0;
    const train_rear_x_train = -trainLength / 2;
    const train_front_x_train = trainLength / 2;

    // Draw platform (appears to move)
    ctx.fillStyle = "#9db0c8";
    ctx.fillRect(-W / 2, carHeight / 2 + 5, W, 2);
    ctx.fillText("Train Frame", -W / 2 + margin, -carHeight / 2 - 20);

    // Draw train car
    ctx.fillStyle = "#5fd0e0";
    ctx.fillRect(train_rear_x_train, -carHeight / 2, trainLength, carHeight);
    ctx.strokeStyle = "#e8eef7";
    ctx.lineWidth = 2;
    ctx.strokeRect(train_rear_x_train, -carHeight / 2, trainLength, carHeight);

    // Draw light source (at center of train)
    ctx.fillStyle = "#e8b64c";
    ctx.shadowColor = "#e8b64c";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(train_center_x_train, 0, lightRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw light pulses
    ctx.fillStyle = "#e8eef7";
    ctx.shadowColor = "#e8eef7";
    ctx.shadowBlur = 8;
    if (time_train_display > 0) {
      // Right pulse
      const right_pulse_x_train = c * time_train_display;
      ctx.fillRect(train_center_x_train, -pulseWidth / 2, right_pulse_x_train, pulseWidth);
      // Left pulse
      const left_pulse_x_train = -c * time_train_display;
      ctx.fillRect(left_pulse_x_train, -pulseWidth / 2, -left_pulse_x_train, pulseWidth);
    }
    ctx.shadowBlur = 0;

    // Indicate hits
    if (time_train_display >= t_train_hit) {
      ctx.fillStyle = "#e8b64c";
      ctx.fillRect(train_rear_x_train - 5, -carHeight / 2 - 5, 10, carHeight + 10);
      ctx.fillRect(train_front_x_train - 5, -carHeight / 2 - 5, 10, carHeight + 10);
      ctx.fillStyle = "#e8eef7";
      ctx.fillText("HIT!", train_rear_x_train - 20, carHeight / 2 + 20);
      ctx.fillText("HIT!", train_front_x_train - 20, carHeight / 2 + 20);
    }

    ctx.restore();

    // Labels for the light source
    ctx.fillStyle = "#e8eef7";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Light Source", W / 2 + train_center_x_platform, yOffsetPlatform + carHeight / 2 + 20);
    ctx.fillText("Light Source", W / 2 + train_center_x_train, yOffsetTrain + carHeight / 2 + 20);
  }
}