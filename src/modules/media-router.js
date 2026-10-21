import { Router } from "express";
import { HttpError } from "../errors.js";
import {
  idSchema,
  mediaColumns,
  mediaCreateSchema,
  mediaUpdateSchema
} from "./catalog-config.js";

const detailQuery = `
  select m.*,
         g.nombre as genero,
         d.nombres as director,
         p.nombre as productora,
         t.nombre as tipo
    from media m
    join generos g on g.id = m.genero_id
    join directores d on d.id = m.director_id
    join productoras p on p.id = m.productora_id
    join tipos t on t.id = m.tipo_id`;

function valuesFrom(data) {
  return mediaColumns.map((column) => data[column]);
}

const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

export function createMediaRouter(db) {
  const router = Router();

  router.get("/", asyncRoute(async (req, res) => {
    const result = await db.query(`${detailQuery} order by m.id`);
    res.json(result.rows);
  }));

  router.get("/:id", asyncRoute(async (req, res) => {
    const recordId = idSchema.parse(req.params.id);
    const result = await db.query(`${detailQuery} where m.id = $1`, [recordId]);
    if (!result.rowCount) throw new HttpError(404, "Media no encontrada");
    res.json(result.rows[0]);
  }));

  router.post("/", asyncRoute(async (req, res) => {
    const data = mediaCreateSchema.parse(req.body);
    const placeholders = mediaColumns.map((_, index) => `$${index + 1}`).join(", ");
    const result = await db.query(
      `insert into media (${mediaColumns.join(", ")}) values (${placeholders}) returning *`,
      valuesFrom(data)
    );
    res.status(201).json(result.rows[0]);
  }));

  router.put("/:id", asyncRoute(async (req, res) => {
    const recordId = idSchema.parse(req.params.id);
    const data = mediaUpdateSchema.parse(req.body);
    const assignments = mediaColumns.map((column, index) => `${column} = $${index + 1}`).join(", ");
    const result = await db.query(
      `update media set ${assignments} where id = $${mediaColumns.length + 1} returning *`,
      [...valuesFrom(data), recordId]
    );
    if (!result.rowCount) throw new HttpError(404, "Media no encontrada");
    res.json(result.rows[0]);
  }));

  router.delete("/:id", asyncRoute(async (req, res) => {
    const recordId = idSchema.parse(req.params.id);
    const result = await db.query("delete from media where id = $1", [recordId]);
    if (!result.rowCount) throw new HttpError(404, "Media no encontrada");
    res.status(204).end();
  }));

  return router;
}

