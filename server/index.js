import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import { Sequelize, DataTypes } from "sequelize";
import { Pedido, Plato } from './db.js'; // Asegúrate de que tu modelo esté bien importado

const app = express();

// Configura CORS para Express
const corsOptions = {
    origin: "*",  // Permite solicitudes desde cualquier origen (en producción, restringir esto)
    methods: ["GET", "POST"],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(morgan("dev"));

// Configuración de la base de datos
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

// Configura CORS para Socket.IO
const io = new SocketServer(server, {
    cors: {
        origin: "http://192.168.0.109:5173", // Ajusta esto a tu URL frontend en producción
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Contador de pedidos entregados
let pedidosEntregados = 0;

// Función para obtener el total de ganancias
const calcularGanancias = () => {
    return pedidosEntregados * 10; // Cambia el valor según el precio real de los pedidos
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

// Recuperar platos disponibles desde la base de datos
const obtenerPlatos = async () => {
    try {
        const platos = await Plato.findAll();
        return platos;
    } catch (error) {
        console.error("Error al obtener platos:", error);
    }
};

// Manejo de los eventos de Socket.IO
io.on("connection", (socket) => {
    console.log("Cliente conectado");

    // Enviar los pedidos actuales desde la base de datos al cliente
    obtenerPedidos().then((pedidos) => {
        socket.emit("pedidos-actualizados", pedidos);
    });

    // Enviar los platos disponibles desde la base de datos al cliente
    obtenerPlatos().then((platos) => {
        socket.emit("platos-actualizados", platos);
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
            await Pedido.destroy({ where: { id } }); // Elimina el pedido por ID
            const pedidos = await obtenerPedidos(); // Actualiza la lista de pedidos
            io.emit("pedidos-actualizados", pedidos); // Notifica a todos los clientes
        } catch (error) {
            console.error("Error al eliminar pedido:", error);
        }
    });

    // Marcar un pedido como entregado
    socket.on("marcar-entregado", async (id) => {
        try {
            const pedido = await Pedido.findByPk(id); // Busca el pedido por ID
            if (pedido && pedido.estado !== "entregado") {
                pedido.estado = "entregado"; // Cambia el estado
                await pedido.save(); // Guarda el cambio en la base de datos
                pedidosEntregados++; // Incrementa el contador de entregados
                const pedidos = await obtenerPedidos(); // Actualiza la lista de pedidos
                io.emit("pedidos-actualizados", pedidos); // Notifica a los clientes
                io.emit("ganancias-actualizadas", calcularGanancias()); // Notifica ganancias
            }
        } catch (error) {
            console.error("Error al marcar como entregado:", error);
        }
    });

    // Recibir la solicitud de crear un plato
    socket.on("crear-plato", async (nuevoPlato) => {
        try {
            const platoCreado = await Plato.create(nuevoPlato);
            console.log("Nuevo plato creado:", platoCreado);

            // Enviar la lista actualizada de platos al cliente
            const platos = await obtenerPlatos();
            io.emit("platos-actualizados", platos);
        } catch (error) {
            console.error("Error al crear plato:", error);
        }
    });

    // Eliminar un plato
    socket.on("eliminar-plato", async (id) => {
        try {
            await Plato.destroy({ where: { id } });
            console.log("Plato eliminado:", id);

            // Enviar la lista actualizada de platos al cliente
            const platos = await obtenerPlatos();
            io.emit("platos-actualizados", platos);
        } catch (error) {
            console.error("Error al eliminar plato:", error);
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
