import type { NextFunction, Request, Response } from "express";

import { validarToken } from "./Jwt";

function extrairBearerToken(authorization: string | undefined): string | null {
  if (!authorization)
    return null;

  const [tipo, token] = authorization.split(" ");

  if (tipo !== "Bearer" || !token)
    return null;

  return token;
}

function authMiddleware(request: Request, response: Response, next: NextFunction): Response | void {
  const token = extrairBearerToken(request.headers.authorization);

  if (!token)
    return response.status(401).json({message: "Token não informado ou inválido."});

  try {
    response.locals.userId = validarToken(token);
    return next();
  } catch {
    return response.status(401).json({message: "Token inválido ou expirado."});
  }
}

export default authMiddleware;
