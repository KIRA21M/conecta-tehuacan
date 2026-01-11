const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Backend OK");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Backend corriendo en puerto " + PORT);
});
