{
  duration: 6,
  setup: function(W, H) {
    return {};
  },
  frame: function(ctx, t, W, H, state) {
    // 1. Background
    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, W, H);

    // Constants for layout and appearance
    const margin_x = W * 0.15;
    const mirrorThickness = 8;
    const mirrorGap = H * 0.4; // Distance between inner faces of mirrors
    const mirrorWidth = W - 2 * margin_x;
    const photonRadius = 7;

    // Colors
    const primaryCyan = "#5fd0e0";
    const warmAmber = "#e8b64c";
    const dimColor = "#9db0c8";
    const softWhite = "#e8eef7";

    // Calculate central coordinates
    const centerX = W / 2;
    const centerY = H / 2;

    // Calculate mirror positions
    const topMirrorY_center = centerY - mirrorGap / 2 - mirrorThickness / 2;
    const bottomMirrorY_center = centerY + mirrorGap / 2 + mirrorThickness / 2;

    const topMirrorY_top = topMirrorY_center - mirrorThickness / 2;
    const bottomMirrorY_top = bottomMirrorY_center - mirrorThickness / 2;

    // Draw Mirrors
    ctx.fillStyle = primaryCyan;
    ctx.shadowColor = primaryCyan;
    ctx.shadowBlur = 15;

    // Top mirror
    ctx.fillRect(centerX - mirrorWidth / 2, topMirrorY_top, mirrorWidth, mirrorThickness);
    // Bottom mirror
    ctx.fillRect(centerX - mirrorWidth / 2, bottomMirrorY_top, mirrorWidth, mirrorThickness);

    ctx.shadowBlur = 0; // Reset shadow for other elements

    // Calculate photon path boundaries
    // y_min_photon_path: photon's center when at the top mirror
    // y_max_photon_path: photon's center when at the bottom mirror
    const y_min_photon_path = topMirrorY_top + mirrorThickness + photonRadius;
    const y_max_photon_path = bottomMirrorY_top - photonRadius;

    // Calculate photon's vertical progress (0 at bottom, 1 at top, 0 at bottom again)
    const photonProgress = (1 - Math.abs(2 * t - 1)); // Goes 0 -> 1 -> 0 over t:0->1

    // Interpolate photon's Y position
    const photonY = y_max_photon_path - photonProgress * (y_max_photon_path - y_min_photon_path);

    // Draw Photon
    ctx.beginPath();
    ctx.arc(centerX, photonY, photonRadius, 0, Math.PI * 2);
    ctx.fillStyle = softWhite;
    ctx.shadowColor = softWhite;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0; // Reset shadow

    // Add labels
    ctx.fillStyle = dimColor;
    ctx.font = "18px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // "Light Clock" title
    ctx.fillText("Light Clock", centerX, topMirrorY_top / 2);

    // "Mirror" labels
    ctx.textAlign = "left";
    ctx.fillText("Mirror", centerX + mirrorWidth / 2 + 10, topMirrorY_center);
    ctx.fillText("Mirror", centerX + mirrorWidth / 2 + 10, bottomMirrorY_center);

    // "Photon" label
    ctx.textAlign = "center";
    ctx.fillText("Photon", centerX, photonY - photonRadius - 15);

    // Draw direction arrow
    ctx.fillStyle = warmAmber;
    ctx.shadowColor = warmAmber;
    ctx.shadowBlur = 5;
    if (t < 0.5) { // Moving up
      ctx.beginPath();
      ctx.moveTo(centerX, photonY - photonRadius - 5); // Arrowhead point
      ctx.lineTo(centerX - 5, photonY - photonRadius + 5);
      ctx.lineTo(centerX + 5, photonY - photonRadius + 5);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(centerX - 2, photonY - photonRadius + 5, 4, 15); // Arrow shaft
    } else { // Moving down
      ctx.beginPath();
      ctx.moveTo(centerX, photonY + photonRadius + 5); // Arrowhead point
      ctx.lineTo(centerX - 5, photonY + photonRadius - 5);
      ctx.lineTo(centerX + 5, photonY + photonRadius - 5);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(centerX - 2, photonY + photonRadius - 20, 4, 15); // Arrow shaft
    }
    ctx.shadowBlur = 0; // Reset shadow
  }
}