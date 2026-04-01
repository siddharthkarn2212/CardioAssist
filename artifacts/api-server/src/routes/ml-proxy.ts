import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

const ML_BACKEND_URL = "http://localhost:8000";

async function proxyToML(req: Request, res: Response, path: string) {
  try {
    const url = `${ML_BACKEND_URL}${path}`;
    const options: RequestInit = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    res.status(response.status).json(data);
  } catch (err) {
    res.status(503).json({
      error: "ML backend unavailable",
      detail: "The machine learning service is not running. Please try again shortly.",
    });
  }
}

router.post("/predict", async (req, res) => {
  await proxyToML(req, res, "/predict");
});

router.get("/metrics", async (req, res) => {
  await proxyToML(req, res, "/metrics");
});

export default router;
