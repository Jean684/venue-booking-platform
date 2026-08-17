import { Router } from "express";
import { AnalyticsController } from "../controller/AnalyticsController";

const router = Router();
const analyticsController = new AnalyticsController();

router.get("/vendors/:vendorId/analytics", async (req, res) => {
  await analyticsController.getAnalytics(req, res);
});

export default router;