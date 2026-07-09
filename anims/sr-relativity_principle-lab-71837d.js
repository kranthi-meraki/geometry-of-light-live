{
  duration: 6,
  setup: function(W, H) {
    return {};
  },
  frame: function(ctx, t, W, H, state) {
    // Background
    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, W, H);

    // Common parameters
    const margin = W * 0.05;
    const labWidth = W * 0.35;
    const labHeight = H * 0.4;
    const labY = H * 0.5 - labHeight / 2; // Vertically centered

    const pendulumLength = labHeight * 0.6;
    const bobRadius = W * 0.012;
    const maxAngle = Math.PI / 6; // 30 degrees amplitude
    // Pendulum oscillates ~1.5 cycles over t:0->1. Starts at max angle (right extreme).
    const pendulumAngle = maxAngle * Math.cos(t * 1.5 * 2 * Math.PI + Math.PI / 2);

    // Colors
    const warmAmber = "#e8b64c";
    const dimGray = "#9db0c8";
    const softWhite = "#e8eef7";

    // Text properties
    ctx.font = `bold ${W * 0.025}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillStyle = softWhite;

    // Helper function to draw a lab and its pendulum
    function drawLab(xOffset, label) {
      ctx.save();
      ctx.translate(xOffset, labY);

      // Lab structure (walls and floor)
      ctx.beginPath();
      ctx.rect(0, 0, labWidth, labHeight);
      ctx.strokeStyle = dimGray;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Ceiling for pendulum
      ctx.beginPath();
      ctx.moveTo(labWidth * 0.5 - labWidth * 0.1, 0);
      ctx.lineTo(labWidth * 0.5 + labWidth * 0.1, 0);
      ctx.strokeStyle = dimGray;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Pendulum pivot point (top-center of the lab)
      const pivotX = labWidth / 2;
      const pivotY = 0;

      // Pendulum bob position
      const bobX = pivotX + pendulumLength * Math.sin(pendulumAngle);
      const bobY = pivotY + pendulumLength * Math.cos(pendulumAngle);

      // Pendulum string
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(bobX, bobY);
      ctx.strokeStyle = softWhite;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Pendulum bob
      ctx.beginPath();
      ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
      ctx.fillStyle = warmAmber;
      ctx.shadowColor = warmAmber;
      ctx.shadowBlur = W * 0.01; // Gentle glow
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow

      // Lab label
      ctx.fillText(label, labWidth / 2, -margin / 2);

      // Experiment label
      ctx.font = `${W * 0.018}px sans-serif`;
      ctx.fillText("Pendulum Experiment", labWidth / 2, labHeight + margin / 2);
      ctx.font = `bold ${W * 0.025}px sans-serif`; // Reset font for next lab label

      ctx.restore();
    }

    // Draw "Rest Lab"
    const restLabX = W * 0.1;
    drawLab(restLabX, "Rest Lab");

    // Draw "Moving Lab"
    // It moves from right (W*0.7) to left (W*0.2) across the screen.
    // This makes its motion relative to the canvas clearly visible.
    const movingLabStartX = W * 0.7;
    const movingLabEndX = W * 0.2;
    const movingLabX = movingLabStartX - (movingLabStartX - movingLabEndX) * t;

    drawLab(movingLabX, "Moving Lab");
  }
}