export const checkAdmin = (req, res, next) => {
    const roles = req.user["https://yourdomain.com/roles"]; // Claim personalizado en Auth0
    if (roles && roles.includes("admin")) {
      next();
    } else {
      res.status(403).json({ message: "No tienes permisos suficientes" });
    }
  };
  