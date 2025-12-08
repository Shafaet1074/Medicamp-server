require("dotenv").config();
const app = require("./app");

const port = process.env.PORT || 5005;

app.listen(port, () => {
  console.log(`MediCamp server running on port ${port}`);
});
