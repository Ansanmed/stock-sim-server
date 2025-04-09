import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";
import { FinnhubService } from "../services/finnhubSrvice";

const router = Router();

router.get("/*", authMiddleware, async (req: Request, res: Response) => {
  try {
    const endpoint = req.path;
    const response = await FinnhubService.proxyRequest(endpoint, req.query);
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
