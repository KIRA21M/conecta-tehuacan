require("dotenv").config();
const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.use((req, res) => res.status(404).json({ ok: false, message: "Not Found", errors: [] }));
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend corriendo en puerto ${PORT}`));
