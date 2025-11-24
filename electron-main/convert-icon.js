// Convert SVG to PNG with transparency
const fs = require("fs");
const path = require("path");

// For this to work, you need to install: npm install sharp
// Run: node convert-icon.js

async function convertSvgToPng() {
  const sharp = require("sharp");

  const svgBuffer = fs.readFileSync(path.join(__dirname, "../assets/icon.svg"));

  await sharp(svgBuffer)
    .resize(256, 256)
    .png()
    .toFile(path.join(__dirname, "../assets/icon.png"));

  console.log("✅ Icon converted successfully!");
}

convertSvgToPng().catch((err) => {
  console.error("❌ Error:", err.message);
  console.log("\nTo fix this, run: npm install sharp");
});
