import { Request, Response } from "express";

import { healthService } from "../services/HealthService";

class HealthController {
  show(_request: Request, response: Response): void {
    response.status(200).json(healthService.getStatus());
  }
}

export const healthController = new HealthController();
