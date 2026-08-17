import { Router } from "express";
import { VenueController } from "../controller/VenueController";
import { validateDto } from "../middlewares/validate";
import { CreateVenueDto } from "../dtos/create-venue.dto";
import { UpdateVenueDto } from "../dtos/update-venue.dto";


const router = Router();
const venueController = new VenueController();

// hirer: view venues
router.get("/venues", async (req, res) => {
  await venueController.all(req, res);
});

// api/venues/1

router.get("/venues/search", async (req, res) => {
  await venueController.searchVenue(req, res);
});

router.get("/venues/:venueId", async (req, res) => {
  await venueController.one(req, res);
});

// Get all venues belong to a vendor
// Vendor: manage only their own venues
router.get("/vendors/:vendorId/venues", async (req, res) => {
  await venueController.getVenuesByVendor(req, res);
});



router.post("/vendors/:vendorId/venues", validateDto(CreateVenueDto), async (req, res) => {
  await venueController.save(req, res);
});

router.put("/vendors/:vendorId/venues/:venueId", validateDto(UpdateVenueDto), async (req, res) => {
  await venueController.update(req, res);
});

router.delete("/vendors/:vendorId/venues/:venueId", async (req, res) => {
  await venueController.remove(req, res);
});

export default router;
