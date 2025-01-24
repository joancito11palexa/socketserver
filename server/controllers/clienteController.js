import { Cliente } from "../models/Cliente.js";
import axios from "axios";

// Crear o actualizar cliente a partir del token de Auth0
export const crearOActualizarCliente = async (req, res) => {
  const { auth } = req; // Información decodificada del token JWT
  const token = req.headers.authorization.split(" ")[1]; // Extraemos el token de la cabecera

  if (!auth) {
    return res.status(401).json({
      error: "No se encontró información de autenticación en la solicitud.",
    });
  }

  try {
    const roles = auth["https://miappirest.com/roles"] || [];
    const esAdministrador = roles.includes("admin");
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
        nombre: userInfo.given_name || "Usuario",
        apellidos: userInfo.family_name || "",
        email: userInfo.email || "",
        password: "",
        esAdministrador: esAdministrador,
        auth0Id: auth.sub,
        nickname: userInfo.nickname || "",
        picture: userInfo.picture || "",
      });
    } else {
      (cliente.nombre = userInfo.given_name || cliente.nombre),
        (cliente.apellidos = userInfo.family_name || cliente.apellidos);
      cliente.email = userInfo.email || cliente.email;
      cliente.nickname = userInfo.nickname || cliente.nickname;
      cliente.picture = userInfo.picture || cliente.picture;
      cliente.esAdministrador = esAdministrador;
      await cliente.save();
    }
    const a = {
      id: cliente.id,
      nombre: cliente.nombre,
      apellidos: cliente.apellidos,
      email: cliente.email,
      nickname: cliente.nickname,
      picture: cliente.picture,
      esAdministrador: cliente.esAdministrador,
    };
    console.log(a);
    console.log("actualizado")
    res.json({
      id: cliente.id,
      nombre: cliente.nombre,
      apellidos: cliente.apellidos,
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
export const obtenerCliente = async (req, res) => {
  const { id } = req.params;
  try {
    const cliente = await Cliente.findByPk(id);
    if (cliente) {
      res.status(200).json(cliente);
    } else {
      res.status(404).json({ message: "Cliente no encontrado" });
    }
  } catch (error) {
    console.error("Error obteniendo el cliente:", error);
    res.status(500).json({ message: "Error obteniendo el cliente" });
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
