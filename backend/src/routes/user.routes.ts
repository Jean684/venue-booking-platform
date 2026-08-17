import { Router } from "express";
import { UserController } from "../controller/UserController";
import { validateDto } from "../middlewares/validate";
// import { CreatePetDTO } from "../dtos/create-pet.dto";
// import { UpdatePetDTO } from "../dtos/update-pet.dto";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDTO } from "../dtos/update-user.dto";
import { LoginUserDto } from "../dtos/login-user.dto";

const router = Router();
const userController = new UserController();

router.get("/users", async (req, res) => {
  await userController.all(req, res);
});

// api/users/1
router.post("/users/login", validateDto(LoginUserDto), async (req, res) => {
  await userController.login(req, res);
});

router.get("/users/:id", async (req, res) => {
  await userController.one(req, res);
});

//router.post("/users", async (req, res) => 
router.post("/users", validateDto(CreateUserDto), async (req, res) => {
  await userController.save(req, res);
});

// Update documents
router.patch("/users/:id", async (req, res) => {
  await userController.updateDocuments(req, res);
});

//router.put("/users/:id", async (req, res) => 
router.put("/users/:id", validateDto(UpdateUserDTO), async (req, res) => {
  await userController.update(req, res);
});

router.delete("/users/:id", async (req, res) => {
  await userController.remove(req, res);
});

export default router;
