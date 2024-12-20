import { Cliente } from "../models/Cliente.js";
import axios from "axios";

// Crear o actualizar cliente a partir del token de Auth0
export const crearOActualizarCliente = async (req, res) => {
  const { auth } = req; // Información decodificada del token JWT
  const token = req.headers.authorization.split(" ")[1]; // Extraemos el token de la cabecera
  if (!auth) {
    return res.status(401).json({ error: "No se encontró información de autenticación en la solicitud." });
  }
  try {
    const userInfoResponse = await axios.get(
      "https://dev-6tss1b7wf5huiury.us.auth0.com/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const userInfo = userInfoResponse.data;
    let cliente = await Cliente.findOne({ where: { auth0Id: auth.sub } });
    if (!cliente) {
      cliente = await Cliente.create({
        nombre: userInfo.name || "Usuario", // Prioriza el nombre desde userInfo
        email: userInfo.email || "", // Prioriza el email desde userInfo
        password: "", // Campo vacío porque Auth0 maneja autenticación
        esAdministrador: false,
        auth0Id: auth.sub,
        nickname: userInfo.nickname || "", // Agregamos nickname del usuario
        picture: userInfo.picture || "", // Foto de perfil del usuario
      });
    } else {
      // Actualizamos información existente del cliente si cambia en Auth0
      cliente.nombre = userInfo.name || cliente.nombre;
      cliente.email = userInfo.email || cliente.email;
      cliente.nickname = userInfo.nickname || cliente.nickname;
      cliente.picture = userInfo.picture || cliente.picture;
      await cliente.save();
    }

    // Respondemos con los datos del cliente
    res.json({
      id: cliente.id,
      nombre: cliente.nombre,
      email: cliente.email,
      nickname: cliente.nickname,
      picture: cliente.picture,
      esAdministrador: cliente.esAdministrador,
    });
  } catch (error) {
    console.error("Error al registrar o obtener cliente:", error);
    res.status(500).send("Error en el servidor");
  }
};

// Obtener todos los clientes (ruta protegida)
export const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.status(200).json(clientes);
  } catch (error) {
    console.error("Error obteniendo los clientes:", error);
    res.status(500).json({ message: "Error obteniendo los clientes" });
  }
};

// Obtener cliente autenticado basado en el token
export const obtenerClienteAutenticado = async (req, res) => {
  const auth0Id = req.user.sub; // ID único de Auth0
  try {
    const cliente = await Cliente.findOne({ where: { auth0Id } });
    if (cliente) {
      res.status(200).json(cliente);
    } else {
      res.status(404).json({ message: "Cliente no encontrado" });
    }
  } catch (error) {
    console.error("Error obteniendo el cliente autenticado:", error);
    res
      .status(500)
      .json({ message: "Error obteniendo el cliente autenticado" });
  }
};

// Eliminar un cliente por ID (administrador)
export const eliminarCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const cliente = await Cliente.findByPk(id);
    if (cliente) {
      await cliente.destroy();
      res.status(200).json({ message: "Cliente eliminado con éxito" });
    } else {
      res.status(404).json({ message: "Cliente no encontrado" });
    }
  } catch (error) {
    console.error("Error eliminando el cliente:", error);
    res.status(500).json({ message: "Error eliminando el cliente" });
  }
};
