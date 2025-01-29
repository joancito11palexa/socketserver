import Bookmark from "../models/Bookmarks.js";

// Crear un nuevo marcador
export const createBookmark = async (req, res) => {
  const { url, titulo, imagen } = req.body;
  try {
    const nuevoBookmark = await Bookmark.create({ url, titulo, imagen });
    res.status(201).json({
      mensaje: "Marcador creado exitosamente",
      data: nuevoBookmark,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el marcador" });
  }
};

// Obtener todos los marcadores
export const getAllBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.findAll();
    res.status(200).json(bookmarks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los marcadores" });
  }
};

// Eliminar un marcador por ID
export const deleteBookmark = async (req, res) => {
  const { id } = req.body;
  console.log(id)
  try {
    const marcador = await Bookmark.destroy({ where: { id } });
    if (marcador) {
      res.status(200).json({ mensaje: "Marcador eliminado" });
    } else {
      res.status(404).json({ error: "Marcador no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el marcador" });
  }
};
