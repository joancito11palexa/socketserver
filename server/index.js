import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import sequelize from "./config/db.js"; // Importar sequelize para la conexión a la base de datos
import { conectarPedidosSocket } from "./sockets/pedidosSocket.js";
import { conectarPlatosSocket } from "./sockets/platosSocket.js";
import * as cheerio from "cheerio";

const app = express();
app.use(express.json());  // Para poder trabajar con req.body

const server = http.createServer(app);

// Configura CORS para Express
const corsOptions = {
  origin: [
    "https://restaurantproject1632.netlify.app", // Dominio de producción
    "http://localhost:5173", // Dominio de desarrollo (Vite)
  ],
  methods: ["GET", "POST"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(morgan("dev"));

// Configuración de Socket.IO
const io = new SocketServer(server, {
  cors: {
    origin: [
      "https://restaurantproject1632.netlify.app", // Dominio de producción
      "http://localhost:5173", // Dominio de desarrollo (Vite)
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Conexión a la base de datos y consulta de tablas
sequelize
  .authenticate()
  .then(async () => {
    console.log("Conexión establecida exitosamente.");
  })
  .catch((err) => {
    console.error("Error al conectar a la base de datos:", err);
  });

// Forzar la sincronización de la base de datos
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Tablas sincronizadas correctamente (force: false).");
  })
  .catch((err) => {
    console.error("Error al sincronizar las tablas:", err);
  });

// Establecer conexión para los eventos de socket relacionados con los pedidos
conectarPedidosSocket(io);

// Establecer conexión para los eventos de socket relacionados con los platos
conectarPlatosSocket(io);

import fetch from "node-fetch";

// Ruta para obtener la lista de productos
app.get("/obtener-lista-productos", async (req, res) => {
  try {
    // Realizamos la solicitud GET al servidor externo
    const response = await fetch(
      "http://sistemas.midagri.gob.pe/sisap/portal2/mayorista/generos/filtrarPorMercado#"
    );

    if (!response.ok) {
      throw new Error("Error al obtener la página de productos.");
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    const productos = [];
    $("#productosCheckBox li").each((index, li) => {
      const input = $(li).find("input");
      const label = $(li).find("label");
      if (input.length && label.length) {
        const value = input.val();
        const nombre = label.text().trim();
        productos.push({ value, nombre });
      }
    });

    res.json(productos);
  } catch (error) {
    console.error("Error al obtener la lista de productos:", error);
    res.status(500).json({ error: "Error al obtener la lista de productos." });
  }
});

app.post("/obtener-precio", async (req, res) => {
  try {
    const productosSeleccionados = req.body.productosSeleccionados;
    const bodyData = new URLSearchParams({
      mercado: "*",
      "variables[]": "precio_prom",
      fecha: "04/12/2024",
      desde: "01/12/2024",
      hasta: "04/12/2024",
      "anios[]": "2024",
      "meses[]": "12",
      "semanas[]": "49",
      "productos[]": productosSeleccionados,
      periodicidad: "dia",
      __ajax_carga_final: "consulta",
      ajax: "true",
    }).toString();

    const response = await fetch(
      "http://sistemas.midagri.gob.pe/sisap/portal2/mayorista/resumenes/filtrar",
      {
        method: "POST",
        headers: {
          accept: "*/*",
          "content-type": "application/x-www-form-urlencoded",
          "x-requested-with": "XMLHttpRequest",
          cookie: "autentificator=o3riqgebornmllr9t9rcvsong5; ...", // Inserta las cookies si es necesario
          Referer: "http://sistemas.midagri.gob.pe/sisap/portal2/mayorista/",
        },
        body: bodyData,
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener datos del servidor externo.");
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Inicializamos un arreglo para guardar los productos con sus variedades
    const productos = [];
    
    $("tr.contenido").each((index, element) => {
      const producto = $(element).find("td").first().text();
      const variedad = $(element).find("td").eq(1).text();
      const precio = $(element).find("td.numero").text();
      
      // Agregar el producto y su variedad
      productos.push({ producto, variedad, precio });
    });

    res.json(productos); // Devolver todos los productos y sus variedades

  } catch (error) {
    console.error("Error al obtener datos:", error);
    res.status(500).send("Error al obtener datos del servidor externo.");
  }
});


const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
