import { Router } from "express";
import { HttpError } from "../errors.js";
import { idSchema } from "./catalog-config.js";

const selectColumns = "id, nombre, estado, descripcion, fecha_creacion, fecha_actualizacion";

const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

function buildInsert(table, columns, data) {
  const selected = columns.filter((column) => data[column] !== undefined);
  const placeholders = selected.map((_, index) => `$${index + 1}`).join(", ");
  return {
    text: `insert into ${table} (${selected.join(", ")}) values (${placeholders}) returning *`,
    values: selected.map((column) => data[column])
  };
}

function buildUpdate(table, columns, data, recordId) {
  const selected = columns.filter((column) => data[column] !== undefined);
  const assignments = selected.map((column, index) => `${column} = $${index + 1}`).join(", ");
  return {
    text: `update ${table} set ${assignments} where id = $${selected.length + 1} returning *`,
    values: [...selected.map((column) => data[column]), recordId]
  };
}

export function createCrudRouter(db, config) {
  const router = Router();
  const columns = config.columns;
  const projection = config.table === "directores"
    ? "id, nombres, estado, fecha_creacion, fecha_actualizacion"
    : config.table === "productoras"
      ? "id, nombre, estado, slogan, descripcion, fecha_creacion, fecha_actualizacion"
      : config.table === "tipos"
        ? "id, nombre, descripcion, fecha_creacion, fecha_actualizacion"
        : selectColumns;

  router.get("/", asyncRoute(async (req, res) => {
    const result = await db.query(`select ${projection} from ${config.table} order by id`);
    res.json(result.rows);
  }));

  router.get("/:id", asyncRoute(async (req, res) => {
    const recordId = idSchema.parse(req.params.id);
    const result = await db.query(`select ${projection} from ${config.table} where id = $1`, [recordId]);
    if (!result.rowCount) throw new HttpError(404, "Registro no encontrado");
    res.json(result.rows[0]);
  }));

  router.post("/", asyncRoute(async (req, res) => {
    const data = config.createSchema.parse(req.body);
    const query = buildInsert(config.table, columns, data);
    const result = await db.query(query.text, query.values);
    res.status(201).json(result.rows[0]);
  }));

  router.put("/:id", asyncRoute(async (req, res) => {
    const recordId = idSchema.parse(req.params.id);
    const data = config.updateSchema.parse(req.body);
    const query = buildUpdate(config.table, columns, data, recordId);
    const result = await db.query(query.text, query.values);
    if (!result.rowCount) throw new HttpError(404, "Registro no encontrado");
    res.json(result.rows[0]);
  }));

  router.delete("/:id", asyncRoute(async (req, res) => {
    const recordId = idSchema.parse(req.params.id);
    const result = await db.query(`delete from ${config.table} where id = $1`, [recordId]);
    if (!result.rowCount) throw new HttpError(404, "Registro no encontrado");
    res.status(204).end();
  }));

  return router;
}

