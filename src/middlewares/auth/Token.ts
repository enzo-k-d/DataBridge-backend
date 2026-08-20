import jwt from "jsonwebtoken";

const tokenExpiration = "30d";

function getJwtSecret(): string {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret)
    throw new Error("JWT_SECRET não configurada.");

  return jwtSecret;
}

export function gerarToken(id: string): string {
  return jwt.sign({}, getJwtSecret(), {
    subject: id,
    expiresIn: tokenExpiration,
  });
}

export function validarToken(token: string): string {
  const payload = jwt.verify(token, getJwtSecret());

  if (typeof payload === "string" || typeof payload.sub !== "string")
    throw new Error("Token sem ID de usuário.");

  return payload.sub;
}
