
import * as cheerio from "cheerio";
import fetch from "node-fetch";
import fs from 'fs';
import { fileURLToPath } from "url";
import path from "path";

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const obtenerListaProductos = (req, res) => {
  const jsonPath = path.join(__dirname, "../../data/sisap.json");
  fs.readFile(jsonPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al obtener la lista de productos:", err);
      return res.status(500).json({ error: "Error al obtener la lista de productos." });
    }
    const productos = JSON.parse(data);
    res.json(productos);
  });
};


export const obtenerPrecio = async (req, res) => {
  try {
    const productosSeleccionados = req.body.productosSeleccionados; // Lista de IDs de productos

    if (!Array.isArray(productosSeleccionados) || productosSeleccionados.length === 0) {
      return res.status(400).json({ error: "Debe proporcionar una lista de productos válidos." });
    }

    const bodyData = new URLSearchParams({
      mercado: "*",
      "variables[]": "precio_prom",
      fecha: "04/12/2024",
      desde: "01/12/2024",
      hasta: "04/12/2024",
      "anios[]": "2024",
      "meses[]": "12",
      "semanas[]": "49",
      periodicidad: "dia",
      __ajax_carga_final: "consulta",
      ajax: "true",
    });

    productosSeleccionados.forEach((producto) => {
      bodyData.append("productos[]", producto);
    });
    console.log("bodyDataAAAAAAAAAAAAAAAA");
    console.log(bodyData)
    const response = await fetch(
      "http://sistemas.midagri.gob.pe/sisap/portal2/mayorista/resumenes/filtrar",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: bodyData.toString(),
      }
    );
    
    console.log("-------------------RESPUESTAAA-----------------: ")
    console.log(response)

    if (!response.ok) {
      throw new Error("Error al obtener datos del servidor externo.");
    }

    const html = await response.text();
    console.log("uwu");
    console.log(html);
    
    const $ = cheerio.load(html);
    
    // Eliminar los `td` con `rowspan`
    $("td[rowspan]").remove();
    
    const productos = [];
    
    // Iterar sobre las filas con clase `contenido` y extraer los datos
    $("tr.contenido").each((index, element) => {
      const celdas = $(element).find("td");
      const variedad = $(celdas).eq(0).text().trim(); // Primera celda ahora contiene la variedad
      const precio = $(celdas).eq(1).text().trim();  // Segunda celda contiene el precio
      
      productos.push({ variedad, precio });
    });
    
    console.log(productos);
    res.json(productos);
    

  } catch (error) {
    console.error("Error al obtener datos:", error);
    res.status(500).json({ error: "Error al obtener datos del servidor externo." });
  }
};
