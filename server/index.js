import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import { Sequelize, DataTypes } from "sequelize"; // Asegúrate de tener Sequelize importado
import { Pedido } from './db.js'; // Asegúrate de que tu modelo esté bien importado

const app = express();

// Configura CORS
const corsOptions = {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(morgan("dev"));

// Configuración de la base de datos (Asegúrate de que db.js esté configurado correctamente)
const sequelize = new Sequelize('postgresql://restaurant_4q7p_user:o4I3Qv5eQfIgG1IYTitg1CCbE59GtIj8@dpg-ct1qvra3esus73d2hd1g-a.oregon-postgres.render.com/restaurant_4q7p', {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

const server = http.createServer(app);
const io = new SocketServer(server);

// Contador de pedidos entregados
let pedidosEntregados = 0;

// Función para obtener el total de ganancias
const calcularGanancias = () => {
    return pedidosEntregados * 10; // Suponiendo que cada pedido tiene un precio de 10, puedes ajustarlo
};

// Recuperar pedidos de la base de datos
const obtenerPedidos = async () => {
    try {
        const pedidos = await Pedido.findAll();
        return pedidos;
    } catch (error) {
        console.error("Error al obtener pedidos:", error);
    }
};

// Manejo de los eventos de Socket.IO
io.on("connection", (socket) => {
    console.log("Cliente conectado");

    // Enviar los pedidos actuales desde la base de datos al cliente
    obtenerPedidos().then((pedidos) => {
        socket.emit("pedidos-actualizados", pedidos);
    });

    // Enviar las ganancias actualizadas al cliente
    socket.emit("ganancias-actualizadas", calcularGanancias());

    // Recibir nuevo pedido y guardarlo en la base de datos
    socket.on("nuevo-pedido", async (plato, imagen, precio) => {
        try {
            const nuevoPedido = await Pedido.create({ plato, imagen, precio, estado: "pendiente" });
            const pedidos = await obtenerPedidos();
            io.emit("pedidos-actualizados", pedidos);
        } catch (error) {
            console.error("Error al crear nuevo pedido:", error);
        }
    });

    // Eliminar un pedido de la base de datos
    socket.on("eliminar-pedido", async (id) => {
        try {
            await Pedido.destroy({ where: { id } });
            const pedidos = await obtenerPedidos();
            io.emit("pedidos-actualizados", pedidos);
        } catch (error) {
            console.error("Error al eliminar pedido:", error);
        }
    });

    // Marcar un pedido como entregado
    socket.on("marcar-entregado", async (id) => {
        try {
            const pedido = await Pedido.findByPk(id);
            if (pedido && pedido.estado !== "entregado") {
                pedido.estado = "entregado";
                await pedido.save();
                pedidosEntregados++;
                const pedidos = await obtenerPedidos();
                io.emit("pedidos-actualizados", pedidos);
                io.emit("ganancias-actualizadas", calcularGanancias());
            }
        } catch (error) {
            console.error("Error al marcar como entregado:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
