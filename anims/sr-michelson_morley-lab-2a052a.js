{
  duration: 6,
  setup: function(W, H) {
    return {};
  },
  frame: function(ctx, t, W, H, state) {
    // HARD RULE: Background
    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, W, H);

    // --- Configuration ---
    const scale = Math.min(W, H) * 0.35; // Overall scale for the interferometer
    const armLength = scale * 0.8;
    const componentSize = scale * 0.1; // Size for source, detector, mirrors
    const splitterThickness = scale * 0.01;

    // --- Colors ---
    const primaryColor = "#5fd0e0"; // Cyan for light beams
    const warmColor = "#e8b64c"; // Amber for source/detector glow
    const dimColor = "#9db0c8"; // Dim for apparatus structure, labels
    const softWhite = "#e8eef7"; // Soft white for mirror surfaces, labels

    // --- Animation: Rotation of the entire apparatus ---
    // Rotate 180 degrees (PI radians) over the loop
    const rotationAngle = t * Math.PI;

    // --- Centering and Rotation ---
    ctx.save();
    ctx.translate(W / 2, H / 2); // Move origin to center of canvas
    ctx.rotate(rotationAngle);    // Rotate the entire apparatus

    // --- Define component positions relative to the (rotated) center ---
    const sourceLocal = { x: -armLength * 1.2, y: 0 };
    const mirror1Local = { x: armLength, y: 0 };
    const mirror2Local = { x: 0, y: -armLength };
    const detectorLocal = { x: 0, y: armLength * 1.2 };

    // --- Draw Apparatus Components ---

    // Beam Splitter (at origin)
    ctx.fillStyle = dimColor;
    ctx.fillRect(-splitterThickness / 2, -splitterThickness / 2, splitterThickness, splitterThickness);
    // Semi-transparent surface
    ctx.fillStyle = "rgba(95, 208, 224, 0.3)"; // Primary color with transparency
    ctx.fillRect(-splitterThickness / 2, -splitterThickness / 2, splitterThickness, splitterThickness);

    // Light Source
    ctx.beginPath();
    ctx.arc(sourceLocal.x, sourceLocal.y, componentSize / 2, 0, 2 * Math.PI);
    ctx.fillStyle = warmColor;
    ctx.shadowColor = warmColor;
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0; // Reset shadow

    // Mirror 1
    ctx.fillStyle = softWhite;
    ctx.fillRect(mirror1Local.x - componentSize / 20, mirror1Local.y - componentSize / 2, componentSize / 10, componentSize);
    ctx.strokeStyle = dimColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(mirror1Local.x - componentSize / 20, mirror1Local.y - componentSize / 2, componentSize / 10, componentSize);

    // Mirror 2
    ctx.fillStyle = softWhite;
    ctx.fillRect(mirror2Local.x - componentSize / 2, mirror2Local.y - componentSize / 20, componentSize, componentSize / 10);
    ctx.strokeStyle = dimColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(mirror2Local.x - componentSize / 2, mirror2Local.y - componentSize / 20, componentSize, componentSize / 10);

    // Detector
    ctx.beginPath();
    ctx.rect(detectorLocal.x - componentSize / 2, detectorLocal.y - componentSize / 2, componentSize, componentSize);
    ctx.fillStyle = warmColor;
    ctx.shadowColor = warmColor;
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0; // Reset shadow
    ctx.strokeStyle = dimColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // --- Draw Light Paths ---
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 3;
    ctx.shadowColor = primaryColor;
    ctx.shadowBlur = 10;

    // Path 1: Source to Splitter
    ctx.beginPath();
    ctx.moveTo(sourceLocal.x, sourceLocal.y);
    ctx.lineTo(-splitterThickness / 2, 0); // To the left edge of the splitter
    ctx.stroke();

    // Path 2a: Splitter to Mirror 1
    ctx.beginPath();
    ctx.moveTo(splitterThickness / 2, 0); // From the right edge of the splitter
    ctx.lineTo(mirror1Local.x, mirror1Local.y);
    ctx.stroke();

    // Path 2b: Splitter to Mirror 2
    ctx.beginPath();
    ctx.moveTo(0, -splitterThickness / 2); // From the top edge of the splitter
    ctx.lineTo(mirror2Local.x, mirror2Local.y);
    ctx.stroke();

    // Path 3a: Mirror 1 back to Splitter
    ctx.beginPath();
    ctx.moveTo(mirror1Local.x, mirror1Local.y);
    ctx.lineTo(splitterThickness / 2, 0); // Back to the splitter
    ctx.stroke();

    // Path 3b: Mirror 2 back to Splitter
    ctx.beginPath();
    ctx.moveTo(mirror2Local.x, mirror2Local.y);
    ctx.lineTo(0, -splitterThickness / 2); // Back to the splitter
    ctx.stroke();

    // Path 4: Recombined beam to Detector
    ctx.beginPath();
    ctx.moveTo(0, splitterThickness / 2); // From the bottom edge of the splitter
    ctx.lineTo(detectorLocal.x, detectorLocal.y);
    ctx.stroke();

    ctx.shadowBlur = 0; // Reset shadow for fringes

    // --- Draw Interference Fringes at Detector ---
    // These fringes remain static relative to the detector, emphasizing "no shift"
    ctx.save();
    ctx.translate(detectorLocal.x, detectorLocal.y); // Translate to detector's local center
    const fringeSpacing = componentSize / 5;
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2;
    ctx.shadowColor = primaryColor;
    ctx.shadowBlur = 8;
    for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(-componentSize / 2, i * fringeSpacing);
        ctx.lineTo(componentSize / 2, i * fringeSpacing);
        ctx.stroke();
    }
    ctx.shadowBlur = 0;
    ctx.restore(); // Restore context for detector translation

    // --- Labels ---
    ctx.restore(); // Restore context to before initial translate and rotate

    // Helper to rotate a point (x,y) around (0,0) by an angle
    function rotatePoint(p, angle) {
        return {
            x: p.x * Math.cos(angle) - p.y * Math.sin(angle),
            y: p.x * Math.sin(angle) + p.y * Math.cos(angle)
        };
    }

    ctx.fillStyle = softWhite;
    ctx.font = `${scale * 0.05}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Calculate absolute positions for labels (rotated + centered)
    const center = { x: W / 2, y: H / 2 };
    const sourceAbs = rotatePoint(sourceLocal, rotationAngle);
    const mirror1Abs = rotatePoint(mirror1Local, rotationAngle);
    const mirror2Abs = rotatePoint(mirror2Local, rotationAngle);
    const detectorAbs = rotatePoint(detectorLocal, rotationAngle);

    ctx.fillText("Light Source", center.x + sourceAbs.x, center.y + sourceAbs.y - componentSize / 2 - 10);
    ctx.fillText("Beam Splitter", center.x, center.y - splitterThickness / 2 - 10);
    ctx.fillText("Mirror 1", center.x + mirror1Abs.x, center.y + mirror1Abs.y - componentSize / 2 - 10);
    ctx.fillText("Mirror 2", center.x + mirror2Abs.x - componentSize / 2 - 10, center.y + mirror2Abs.y);
    ctx.fillText("Detector", center.x + detectorAbs.x, center.y + detectorAbs.y + componentSize / 2 + 10);
    ctx.fillText("Interference Fringes (No Shift)", center.x + detectorAbs.x, center.y + detectorAbs.y + componentSize / 2 + 30);
  }
}