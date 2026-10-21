import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app.js";

function fakeDatabase() {
  return {
    async query(text, values = []) {
      const sql = text.replace(/\s+/g, " ").trim().toLowerCase();
      if (sql.startsWith("select 1")) return { rows: [{ ok: 1 }], rowCount: 1 };
      if (sql.startsWith("delete")) return { rows: [], rowCount: 1 };
      if (sql.includes("where") && sql.startsWith("select")) {
        return { rows: [{ id: values[0], nombre: "Registro" }], rowCount: 1 };
      }
      if (sql.startsWith("select")) return { rows: [{ id: 1, nombre: "Registro" }], rowCount: 1 };
      if (sql.startsWith("insert") || sql.startsWith("update")) {
        return { rows: [{ id: 1, guardado: true }], rowCount: 1 };
      }
      throw new Error(`Consulta no simulada: ${text}`);
    }
  };
}

const app = createApp(fakeDatabase(), {
  NODE_ENV: "test",
  DATABASE_SSL: "false",
  CORS_ORIGIN: "http://localhost:5173"
});

const bodies = {
  generos: { nombre: "Accion", estado: true, descripcion: "Peliculas de accion" },
  directores: { nombres: "Greta Gerwig", estado: true },
  productoras: {
    nombre: "Warner Bros.",
    estado: true,
    slogan: "Entretenimiento",
    descripcion: "Productora"
  },
  tipos: { nombre: "Pelicula", descripcion: "Largometraje" },
  media: {
    serial: "PEL-001",
    titulo: "Barbie",
    sinopsis: "Una historia de identidad.",
    url_pelicula: "https://example.com/barbie",
    imagen_portada: "https://example.com/barbie.jpg",
    anio_estreno: 2023,
    genero_id: 1,
    director_id: 1,
    productora_id: 1,
    tipo_id: 1
  }
};

test("GET /api/health confirma disponibilidad", async () => {
  const response = await request(app).get("/api/health");
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { status: "ok" });
});

for (const [module, body] of Object.entries(bodies)) {
  test(`CRUD completo de ${module}`, async () => {
    const list = await request(app).get(`/api/${module}`);
    assert.equal(list.status, 200);
    assert.ok(Array.isArray(list.body));

    const detail = await request(app).get(`/api/${module}/1`);
    assert.equal(detail.status, 200);

    const created = await request(app).post(`/api/${module}`).send(body);
    assert.equal(created.status, 201);

    const updated = await request(app).put(`/api/${module}/1`).send(body);
    assert.equal(updated.status, 200);

    const deleted = await request(app).delete(`/api/${module}/1`);
    assert.equal(deleted.status, 204);
  });
}

test("rechaza estados y URL invalidos", async () => {
  const badGenre = await request(app).post("/api/generos").send({ nombre: "X", estado: "BORRADO" });
  assert.equal(badGenre.status, 400);

  const badMedia = await request(app).post("/api/media").send({ ...bodies.media, url_pelicula: "no-es-url" });
  assert.equal(badMedia.status, 400);
});

test("responde 404 para rutas inexistentes", async () => {
  const response = await request(app).get("/api/no-existe");
  assert.equal(response.status, 404);
});

