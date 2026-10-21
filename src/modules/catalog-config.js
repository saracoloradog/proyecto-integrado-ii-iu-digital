import { z } from "zod";

const id = z.coerce.number().int().positive();
const estado = z.boolean();
const nombre = z.string().trim().min(2).max(120);
const descripcion = z.string().trim().max(1000).nullable().optional();

export const idSchema = id;

export const catalogs = {
  generos: {
    table: "generos",
    columns: ["nombre", "estado", "descripcion"],
    createSchema: z.object({ nombre, estado: estado.default(true), descripcion }),
    updateSchema: z.object({ nombre, estado, descripcion })
  },
  directores: {
    table: "directores",
    columns: ["nombres", "estado"],
    createSchema: z.object({ nombres: nombre, estado: estado.default(true) }),
    updateSchema: z.object({ nombres: nombre, estado })
  },
  productoras: {
    table: "productoras",
    columns: ["nombre", "estado", "slogan", "descripcion"],
    createSchema: z.object({
      nombre,
      estado: estado.default(true),
      slogan: z.string().trim().max(250).nullable().optional(),
      descripcion
    }),
    updateSchema: z.object({
      nombre,
      estado,
      slogan: z.string().trim().max(250).nullable(),
      descripcion: z.string().trim().max(1000).nullable()
    })
  },
  tipos: {
    table: "tipos",
    columns: ["nombre", "descripcion"],
    createSchema: z.object({ nombre, descripcion }),
    updateSchema: z.object({ nombre, descripcion: z.string().trim().max(1000).nullable() })
  }
};

export const mediaColumns = [
  "serial",
  "titulo",
  "sinopsis",
  "url_pelicula",
  "imagen_portada",
  "anio_estreno",
  "genero_id",
  "director_id",
  "productora_id",
  "tipo_id"
];

const mediaShape = {
  serial: z.string().trim().min(1).max(80),
  titulo: z.string().trim().min(1).max(200),
  sinopsis: z.string().trim().min(1).max(5000),
  url_pelicula: z.string().url().max(2048),
  imagen_portada: z.string().url().max(2048),
  anio_estreno: z.coerce.number().int().min(1888).max(2100),
  genero_id: id,
  director_id: id,
  productora_id: id,
  tipo_id: id
};

export const mediaCreateSchema = z.object(mediaShape);
export const mediaUpdateSchema = z.object(mediaShape);

