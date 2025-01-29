import express from "express";
import {
  createBookmark,
  getAllBookmarks,
  deleteBookmark,
} from "../controllers/bookmarkController.js";
const router = express.Router();

// Rutas de los marcadores
router.post("/bookmarks/guardar", createBookmark);
router.get("/bookmarks/obtener", getAllBookmarks);
router.delete("/bookmarks/eliminar", deleteBookmark);

export default router;
