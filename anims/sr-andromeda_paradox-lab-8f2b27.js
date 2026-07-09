{
  duration: 6,
  setup: function(W, H) {
    return {
      // No specific state needed, everything derived from t
    };
  },
  frame: function(ctx, t, W, H, state) {
    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, W, H);

    const PADDING = W * 0.15;
    const X_MIN = PADDING;
    const X_MAX = W - PADDING;
    const Y_CENTER = H * 0.5;

    const LINE_HEIGHT = H * 0.02; // Height of the horizontal 'time' axis for labels

    // --- Constants and Scaling ---
    const C = 1; // Speed of light (conceptual, for tilt calculation)
    const V_WALK_FACTOR = 0.05; // Exaggerated "walking speed" relative to C for visual tilt
    const GALAXY_DIST_FACTOR = 0.8; // How far the galaxy is along the X-axis
    const TIME_SCALE_FACTOR = H * 0.2; // How much vertical distance represents 'time' difference

    // --- Observers' Motion ---
    // t goes from 0 to 1. Observers start far apart, meet at t=0.5, move apart again.
    const OBSERVER_START_X = X_MIN + (X_MAX - X_MIN) * 0.2;
    const OBSERVER_END_X = X_MAX - (X_MAX - X_MIN) * 0.2;
    const OBSERVER_RANGE = OBSERVER_END_X - OBSERVER_START_X;

    // Alice moves right, Bob moves left
    const aliceX = OBSERVER_START_X + OBSERVER_RANGE * t;
    const bobX = OBSERVER_END_X - OBSERVER_RANGE * t;

    // Velocity relative to the screen frame (for tilt calculation)
    // Max velocity when moving fastest, scaled by V_WALK_FACTOR
    const v_alice = V_WALK_FACTOR * (OBSERVER_RANGE / W);
    const v_bob = -v_alice;

    // --- Galaxy Position ---
    const galaxyX = X_MAX - (X_MAX - X_MIN) * (1 - GALAXY_DIST_FACTOR);
    const galaxyY = Y_CENTER;

    // --- Draw Central Axis and Labels ---
    ctx.strokeStyle = "#9db0c8";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(W / 2, PADDING);
    ctx.lineTo(W / 2, H - PADDING);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#9db0c8";
    ctx.font = `${H * 0.025}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("x = 0 (meeting point)", W / 2, H - PADDING + LINE_HEIGHT * 1.5);
    ctx.fillText("Time (relative)", W * 0.07, Y_CENTER);
    ctx.fillText("Space", W / 2, H - PADDING + LINE_HEIGHT * 3);


    // --- Draw Andromeda Galaxy ---
    ctx.fillStyle = "#e8b64c";
    ctx.shadowColor = "#e8b64c";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(galaxyX, galaxyY, W * 0.02, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#e8b64c";
    ctx.fillText("Andromeda", galaxyX, galaxyY - W * 0.03);

    // --- Draw Observers and Planes of Simultaneity ---

    // For Alice (Cyan)
    ctx.fillStyle = "#5fd0e0";
    ctx.shadowColor = "#5fd0e0";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(aliceX, Y_CENTER, W * 0.015, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillText("Alice", aliceX, Y_CENTER + W * 0.03);

    // Alice's plane of simultaneity
    // Tilt angle: tan(theta) = v/c. Here, we use a scaled tilt for visual effect.
    // The plane passes through Alice's current position at Y_CENTER (her 'now' at her location)
    const tilt_alice = (v_alice / C) * TIME_SCALE_FACTOR; // Vertical shift per unit horizontal distance
    ctx.strokeStyle = "#5fd0e0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(X_MIN, Y_CENTER - (X_MIN - aliceX) * tilt_alice);
    ctx.lineTo(X_MAX, Y_CENTER - (X_MAX - aliceX) * tilt_alice);
    ctx.stroke();

    // Intersection point with Andromeda for Alice
    const andromeda_time_alice = Y_CENTER - (galaxyX - aliceX) * tilt_alice;
    ctx.fillStyle = "#5fd0e0";
    ctx.fillText("Alice's 'now' at Andromeda", galaxyX + W * 0.02, andromeda_time_alice - LINE_HEIGHT);
    ctx.beginPath();
    ctx.arc(galaxyX, andromeda_time_alice, W * 0.005, 0, Math.PI * 2);
    ctx.fill();


    // For Bob (Amber)
    ctx.fillStyle = "#e8b64c";
    ctx.shadowColor = "#e8b64c";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(bobX, Y_CENTER, W * 0.015, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillText("Bob", bobX, Y_CENTER + W * 0.03);

    // Bob's plane of simultaneity
    const tilt_bob = (v_bob / C) * TIME_SCALE_FACTOR;
    ctx.strokeStyle = "#e8b64c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(X_MIN, Y_CENTER - (X_MIN - bobX) * tilt_bob);
    ctx.lineTo(X_MAX, Y_CENTER - (X_MAX - bobX) * tilt_bob);
    ctx.stroke();

    // Intersection point with Andromeda for Bob
    const andromeda_time_bob = Y_CENTER - (galaxyX - bobX) * tilt_bob;
    ctx.fillStyle = "#e8b64c";
    ctx.fillText("Bob's 'now' at Andromeda", galaxyX + W * 0.02, andromeda_time_bob + LINE_HEIGHT);
    ctx.beginPath();
    ctx.arc(galaxyX, andromeda_time_bob, W * 0.005, 0, Math.PI * 2);
    ctx.fill();

    // --- Time Difference Label ---
    ctx.fillStyle = "#e8eef7";
    ctx.font = `${H * 0.03}px sans-serif`;
    ctx.textAlign = "right";
    const timeDiffY = (andromeda_time_alice + andromeda_time_bob) / 2;
    const timeDiffAbs = Math.abs(andromeda_time_alice - andromeda_time_bob);
    
    // Convert screen pixel difference to a conceptual 'days' difference
    // This mapping is purely illustrative and not physically derived from V_WALK_FACTOR
    const conceptualDaysDiff = Math.round(timeDiffAbs / TIME_SCALE_FACTOR * 100); // Scale to make it a reasonable number of 'days'
    
    if (conceptualDaysDiff > 0) {
        ctx.fillText(`${conceptualDaysDiff} days apart`, galaxyX - W * 0.03, timeDiffY);
        ctx.strokeStyle = "#e8eef7";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(galaxyX - W * 0.025, andromeda_time_alice);
        ctx.lineTo(galaxyX - W * 0.025, andromeda_time_bob);
        ctx.stroke();
    }
  }
}