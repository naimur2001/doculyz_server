import express from "express";
import { createDocument, getDocuments, deleteDocument,getDocumentById, searchDocumentsByTitle } from "../controllers/document.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/create", authenticate, authorize(["USER", "ADMIN"]), upload.single("file"), createDocument);

router.get("/get", authenticate, authorize(["USER", "ADMIN"]), getDocuments); 

router.get("/search", authenticate, authorize(["USER", "ADMIN"]), searchDocumentsByTitle);

router.delete("/delete/:id", authenticate, authorize(["USER", "ADMIN"]), deleteDocument);

router.get("/:id", authenticate, getDocumentById);




export default router;
