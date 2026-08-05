class HealthService {
  getStatus() {
    return {
      service: "dataflow-backend",
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }
}

export const healthService = new HealthService();
