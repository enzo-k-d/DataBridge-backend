import cors from "cors";
import express from "express";

import healthRoutes from "./routes/healthRoutes";

const app = express();
const port = Number(process.env.PORT) || 3231;
const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: frontendOrigin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

app.use("/health", healthRoutes);

app.listen(port, () => {
  console.log(`DataFlow backend rodando em http://localhost:${port}`);
});
