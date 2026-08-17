import { Router } from "express";
import { ApplicationController } from "../controller/ApplicationController";
import { CreateAppDTO } from "../dtos/create-app.dto";
import { validateDto } from "../middlewares/validate";

// import { validateDto } from "../middlewares/validate";
// import { CreatePetDTO } from "../dtos/create-pet.dto";
// import { UpdatePetDTO } from "../dtos/update-pet.dto";

const router = Router();
const appController = new ApplicationController();

router.get("/applications", async (req, res) => {
  await appController.all(req, res);
});

// api/applications/1

router.get("/applications/:applicationId", async (req, res) => {
  await appController.one(req, res);
});

router.post("/applications", validateDto(CreateAppDTO), async (req, res) => {
  await appController.save(req, res);
});


// Get a specific application for a user
router.get("/users/:id/applications", (req, res) =>
  appController.findByUser(req, res)
);

// Get applications belong to a venue
router.get("/venues/:venueId/applications", (req, res) =>
  appController.getApplicationsByVenue(req, res)
);

// Accept/reject and leave comment to application
router.patch("/applications/:applicationId", async (req, res) => {
  await appController.update(req, res);
});

router.delete("/applications/:applicationId", async (req, res) => {
  await appController.remove(req, res);
});

export default router;
