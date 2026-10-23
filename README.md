# Proyecto Integrado II IU Digital

API REST de la EA1 de Ingeniería Web II para gestionar un catálogo audiovisual administrativo. Implementa los cinco módulos solicitados en el caso de estudio: géneros, directores, productoras, tipos y media (películas y series).

## Estado de la entrega

- Base de datos PostgreSQL creada en la conexión **IU Digital - Supabase**.
- Proyecto Supabase usado: `proyecto-integrado-ii-iu-digital` (`mwqsbjkfztphrxosbphj`).
- Esquema versionado en `supabase/migrations`.
- API Node.js y Express con GET, POST, PUT y DELETE para los cinco módulos.
- Validación de entrada, consultas parametrizadas, manejo uniforme de errores, CORS y cabeceras seguras.
- Colección de Postman incluida.
- Pruebas automatizadas incluidas.

## Modelo de datos

| Tabla | Información principal | Reglas relevantes |
|---|---|---|
| `generos` | nombre, estado, descripción, fechas | Nombre único; estado booleano |
| `directores` | nombres, estado, fechas | Nombre obligatorio; estado booleano |
| `productoras` | nombre, estado, slogan, descripción, fechas | Nombre único; estado booleano |
| `tipos` | nombre, descripción, fechas | Nombre único |
| `media` | serial, título, sinopsis, URL, portada, año y cuatro relaciones | Serial y URL únicos; año válido; claves foráneas restrictivas |

La base de datos valida mediante un trigger que una media solo pueda relacionarse con un género, director y productora activos. El tipo debe existir. Las fechas de actualización se modifican automáticamente.

Las cinco tablas tienen Row Level Security habilitado. `anon` y `authenticated` no poseen permisos directos: la aplicación accede mediante la conexión PostgreSQL privada del servidor. `DATABASE_URL` es una variable privada del servidor y no se incluye en clientes ni en el repositorio.

## Requisitos

- Node.js 20 o superior.
- Una cadena privada de conexión PostgreSQL de Supabase.

## Instalación local

```bash
npm install
cp .env.example .env
npm run dev
```

La variable `DATABASE_URL` debe contener la cadena privada de **Session pooler** mostrada en Supabase > Connect. Esta modalidad es apropiada para un backend persistente y funciona en redes IPv4. El archivo `.env` está excluido del control de versiones mediante `.gitignore`.

La API queda disponible en `http://localhost:3000`. Comprueba la conexión con:

```bash
curl http://localhost:3000/api/health
```

## Endpoints

Cada módulo admite listar, consultar por id, crear, reemplazar y eliminar:

| Método | Ruta base |
|---|---|
| GET, POST | `/api/generos` |
| GET, POST | `/api/directores` |
| GET, POST | `/api/productoras` |
| GET, POST | `/api/tipos` |
| GET, POST | `/api/media` |

Para consultar, reemplazar o eliminar un registro agrega `/:id`, por ejemplo `GET /api/generos/1`, `PUT /api/generos/1` o `DELETE /api/generos/1`.

### Ejemplo de Media

```json
{
  "serial": "PEL-001",
  "titulo": "Ejemplo",
  "sinopsis": "Descripción breve de la producción.",
  "url_pelicula": "https://example.com/pelicula",
  "imagen_portada": "https://example.com/portada.jpg",
  "anio_estreno": 2026,
  "genero_id": 1,
  "director_id": 1,
  "productora_id": 1,
  "tipo_id": 1
}
```

Antes de crear una media deben existir un director y una productora activos. Los géneros iniciales y los tipos Película y Serie ya fueron cargados por la migración.

## Pruebas

```bash
npm test
npm run test:coverage
```

Las pruebas recorren GET, POST, PUT y DELETE de los cinco módulos, el endpoint de salud, la validación de entrada y las rutas inexistentes. La integridad relacional también se verifica directamente en PostgreSQL.

## Postman

Importa `postman/IU-Digital-Peliculas.postman_collection.json`. La colección usa la variable `baseUrl`, cuyo valor inicial es `http://localhost:3000`. Ejecuta primero las solicitudes de creación de director y productora; después usa sus identificadores en las solicitudes de Media.

## Migraciones

Los archivos de `supabase/migrations` reflejan el historial aplicado:

1. `20261021173535_crear_modelo_cine_ea1.sql`: tablas, claves, restricciones, índices, RLS, fechas y datos iniciales.
2. `20261021173715_validar_relaciones_activas_media.sql`: regla de relaciones activas para Media.

## Estructura

```text
src/
  config/       variables de entorno
  db/           conexión PostgreSQL
  middleware/   errores y rutas no encontradas
  modules/      rutas y validaciones de los cinco módulos
supabase/       migraciones SQL
postman/        colección para pruebas manuales
test/           pruebas automatizadas
```
