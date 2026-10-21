# Guion de sustentación individual

## 0:00 a 0:30 Introducción

“En esta evidencia presento la API REST desarrollada para el caso de estudio de películas de la IU Digital. La solución administra géneros, directores, productoras, tipos y producciones audiovisuales mediante Node.js, Express y PostgreSQL en Supabase.”

En pantalla: portada del repositorio y estructura general.

## 0:30 a 1:20 Base de datos

“El modelo tiene cinco tablas. Media se relaciona con un género, un director, una productora y un tipo. El serial y la URL de la película son únicos. Además, las claves foráneas evitan eliminar catálogos que todavía estén en uso.”

“La validación más importante está en PostgreSQL: solo se puede registrar o actualizar una media cuando el género, el director y la productora están activos. Las fechas de actualización se gestionan automáticamente.”

En pantalla: tablas y relaciones en Supabase, sin mostrar credenciales.

## 1:20 a 2:20 API REST

“La API separa configuración, conexión, rutas, validaciones y manejo de errores. Todas las consultas usan parámetros para evitar concatenar datos del usuario. Cada módulo cuenta con operaciones GET, POST, PUT y DELETE.”

En pantalla: archivos principales y una ruta representativa. Explicar la responsabilidad, no leer el código línea por línea.

## 2:20 a 3:30 Prueba en Postman

“Primero verifico el endpoint de salud. Después creo o consulto los catálogos necesarios y registro una media. Finalmente actualizo y elimino un registro para demostrar el CRUD completo.”

En pantalla: respuestas 200, 201 y 204. Mostrar también un caso 400 al intentar usar datos inválidos o una relación inactiva.

## 3:30 a 4:20 Calidad y seguridad

“Las entradas se validan antes de llegar a la base de datos. Los conflictos de valores únicos y relaciones se transforman en respuestas claras. Las credenciales se almacenan en variables de entorno y no se publican. Las tablas tienen RLS activo y no permiten acceso directo a usuarios anónimos.”

En pantalla: `.env.example`, `.gitignore` y resultado de `npm test`.

## 4:20 a 5:00 Cierre y continuidad

“La EA1 deja lista la base para la EA2, donde React consumirá la API y ofrecerá formularios administrativos. En la EA3 se desplegarán frontend y backend con variables de entorno separadas y CORS restringido al dominio final.”

En pantalla: diagrama simple frontend → API → Supabase y lista de próximos pasos.

