import express from "express";
import { updateUser, deleteUser, getUserListing, getUser } from "../controllers/user.controllers.js";
import { varifyToken } from "../utils/varifyUser.js";

const router = express.Router();

router.post("/update/:id", varifyToken, updateUser)
router.delete("/delete/:id", varifyToken, deleteUser)
router.get("/listings/:id", varifyToken, getUserListing)
router.get("/:id", varifyToken, getUser)

export default router