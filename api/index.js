// api/index.js
 // path to your app.js

const app = require("../src/app");

module.exports = async (req, res) => {
  // Call the exported Vercel-compatible function from app.js
  await app(req, res);
};
