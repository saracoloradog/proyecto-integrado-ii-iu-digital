import { ZodError } from "zod";

export function notFound(req, res) {
  res.status(404).json({ error: "Ruta no encontrada" });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      error: "Datos de entrada invalidos",
      details: error.issues.map(({ path, message }) => ({ field: path.join("."), message }))
    });
  }

  if (error.code === "23505") {
    return res.status(409).json({ error: "Ya existe un registro con un valor que debe ser unico" });
  }

  if (error.code === "23503") {
    return res.status(409).json({ error: "La operacion viola una relacion entre registros" });
  }

  if (["23502", "23514", "P0001"].includes(error.code)) {
    return res.status(400).json({ error: error.message });
  }

  const status = error.status ?? 500;
  const message = status === 500 ? "Error interno del servidor" : error.message;
  if (status === 500 && process.env.NODE_ENV !== "test") console.error(error);
  return res.status(status).json({ error: message, ...(error.details && { details: error.details }) });
}

