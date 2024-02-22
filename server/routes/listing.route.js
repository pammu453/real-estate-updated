import express from "express";
import { createListing, deleteListing, updateListing, getListing, getListings } from "../controllers/listing.controllers.js";
import { varifyToken } from "../utils/varifyUser.js";

const router = express.Router();

router.post("/create", varifyToken, createListing)
router.delete("/delete/:id", varifyToken, deleteListing)
router.post("/update/:id", varifyToken, updateListing)
router.get("/getListing/:id", getListing)
router.get("/get", getListings)

export default router

