import { Router } from "express";
import { BlockdateController } from "../controller/BlockdateController";
import { CreateBlockdateDTO } from "../dtos/create-blockdate.dto";
import { validateDto } from "../middlewares/validate";

const router = Router();
const blockdateController = new BlockdateController();

router.get("/blockdates", async (req, res) => {
  await blockdateController.all(req, res);
});

router.get("/blockdates/:blockdateId", async (req, res) => {
  await blockdateController.one(req, res);
});

// Get all blockdates belong to a venue (to display on calendar)
router.get("/venues/:venueId/blockdates", async (req, res) => {
  await blockdateController.getBlockdatesByVenue(req, res);
});

// Get all blockdates belong to a vendor (to display on a table)
router.get("/vendors/:vendorId/blockdates", async (req, res) => {
  await blockdateController.getBlockdatesByVendor(req, res);
});

router.post("/blockdates", validateDto(CreateBlockdateDTO), async (req, res) => {
  await blockdateController.save(req, res);
});

router.delete("/blockdates/:blockdateId", async (req, res) => {
  await blockdateController.remove(req, res);
});

export default router;
