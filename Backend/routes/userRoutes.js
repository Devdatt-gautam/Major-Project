import express from "express";
import {
  signUpUser,
  logInUser,
  logOutUser,
  followUnfollowUser,
  updateUser,
  getUserProfile,
  getSuggestedUsers,
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/profile/:query", getUserProfile);
router.post("/signup", signUpUser);
router.post("/login", logInUser);
router.post("/logout", logOutUser);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.put("/update/:id", protectRoute, updateUser);
router.get("/suggested", protectRoute, getSuggestedUsers);

export default router;
