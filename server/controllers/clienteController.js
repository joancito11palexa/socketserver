import { Cliente } from "../models/Cliente.js";

// Crear un nuevo cliente
export const crearCliente = async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    const nuevoCliente = await Cliente.create({ nombre, email, password });
    res.status(201).json(nuevoCliente);
  } catch (error) {
    console.error("Error creando el cliente:", error);
    res
      .status(500)
      .json({ message: "Error creando el cliente", error: error.message });
  }
};
// Iniciar sesión (verificar usuario)
export const iniciarSesion = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password)
  try {
    const cliente = await Cliente.findOne({ where: { email } });
    if (cliente) {
      if (cliente.password === password) {
        res.status(200).json(cliente);
      } else {
        res.status(401).json({ message: "Contraseña incorrecta" });
      }
    } else {
      res.status(404).json({ message: "Cliente no encontrado" });
    }
  } catch (error) {
    console.error("Error iniciando sesión:", error);
    res.status(500).json({ message: "Error iniciando sesión", error: error.message });
  }
};
// Obtener todos los clientes
export const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.status(200).json(clientes);
  } catch (error) {
    console.error("Error obteniendo los clientes:", error);
    res.status(500).json({ message: "Error obteniendo los clientes" });
  }
};

// Obtener un cliente por ID
export const obtenerClientePorId = async (req, res) => {
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

// Eliminar un cliente por ID
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
