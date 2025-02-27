import express from "express";
import {
  createBookmark,
  getAllBookmarks,
  deleteBookmark,
  updateBookmark,
  exportBookmarksToSQL,
} from "../controllers/bookmarkController.js";
const router = express.Router();

// Rutas de los marcadores
router.post("/bookmarks/guardar", createBookmark);
router.put("/bookmarks/update/:id", updateBookmark);
router.get("/bookmarks/obtener", getAllBookmarks);
router.delete("/bookmarks/eliminar/:id", deleteBookmark);
router.get("/bookmarks/export-sql", exportBookmarksToSQL);
export default router;
