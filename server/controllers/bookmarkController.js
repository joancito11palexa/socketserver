import Bookmark from "../models/Bookmarks.js";

// Crear un nuevo marcador
export const createBookmark = async (req, res) => {
  const { url, titulo, imagen, tags, nota } = req.body; // Aseguramos que se pueden incluir 'tags' y 'nota'

  try {
    const nuevoBookmark = await Bookmark.create({
      url,
      titulo,
      imagen,
      tags,
      nota,
    });

    res.status(201).json({
      mensaje: "Marcador creado exitosamente",
      data: nuevoBookmark,
    });
  } catch (error) {
    console.error("Error al crear el marcador:", error);
    res.status(500).json({ error: "Error al crear el marcador" });
  }
};
export const updateBookmark = async (req, res) => {
  const { id } = req.params;
  const { url, titulo, imagen, tags, nota } = req.body;

  try {
    const bookmark = await Bookmark.findByPk(id);
    if (!bookmark) {
      return res.status(404).json({ error: "Marcador no encontrado" });
    }

    await bookmark.update({ url, titulo, imagen, tags, nota });

    res.status(200).json({
      mensaje: "Marcador actualizado exitosamente",
      data: bookmark,
    });
  } catch (error) {
    console.error("Error al actualizar el marcador:", error);
    res.status(500).json({ error: "Error al actualizar el marcador" });
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
  const { id } = req.params;

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


export const exportBookmarksToSQL = async (req, res) => {
  try {
    const bookmarks = await Bookmark.findAll();

    if (bookmarks.length === 0) {
      return res.status(404).json({ error: "No hay marcadores para exportar" });
    }

    let sqlStatements = `INSERT INTO "Bookmarks" (url, titulo, imagen, tags, nota) VALUES\n`;

    sqlStatements += bookmarks
      .map((b) => {
        const tags = b.tags ? `'{"${b.tags.join('","')}"}'` : "NULL";
        const nota = b.nota ? `'${b.nota.replace(/'/g, "''")}'` : "NULL";
        return `('${b.url}', '${b.titulo.replace(/'/g, "''")}', '${b.imagen}', ${tags}, ${nota})`;
      })
      .join(",\n") + ";";

    // Configurar cabeceras para descargar el archivo
    res.setHeader("Content-Disposition", "attachment; filename=bookmarks.sql");
    res.setHeader("Content-Type", "application/sql");

    res.send(sqlStatements);
  } catch (error) {
    console.error("Error al exportar los marcadores:", error);
    res.status(500).json({ error: "Error al exportar los marcadores" });
  }
};