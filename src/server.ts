import "dotenv/config";

import cors from "cors";
import express from "express";

import loginRoutes from "./routes/LoginRoutes";
import CadastroRoutes from "./routes/CadastroRoutes";

const app = express();
const port = Number(process.env.PORT) || 11001;
const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:11000";

app.use(
  cors({
    origin: frontendOrigin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

app.use(loginRoutes);
app.use(CadastroRoutes);

app.listen(port, () => {
  console.log(`DataFlow backend rodando em http://localhost:${port}`);
});
