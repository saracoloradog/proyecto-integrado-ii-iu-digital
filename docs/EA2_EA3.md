# Preparación de EA2 y EA3

## EA2 Frontend React

El frontend debe consumir exclusivamente esta API. No debe incluir la cadena PostgreSQL ni una clave de servicio de Supabase.

Estructura sugerida:

```text
frontend/
  src/
    api/client.js
    components/FormField.jsx
    components/DataTable.jsx
    features/generos/
    features/directores/
    features/productoras/
    features/tipos/
    features/media/
    pages/Dashboard.jsx
```

Flujo recomendado:

1. Crear el proyecto con Vite y React.
2. Configurar `VITE_API_URL` con la URL pública del backend.
3. Construir primero los catálogos: géneros, directores, productoras y tipos.
4. En el formulario de Media, llenar los selectores desde la API y mostrar únicamente relaciones activas.
5. Implementar confirmación antes de eliminar y mensajes claros para errores 400, 404 y 409.
6. Probar creación, edición, consulta y eliminación desde la interfaz.

## EA3 Despliegue

Backend sugerido: Render, Railway, Fly.io u otro servicio compatible con Node.js. Frontend sugerido: Vercel o Netlify.

Variables privadas del backend:

- `DATABASE_URL`: Session pooler de Supabase.
- `DATABASE_SSL=true`.
- `NODE_ENV=production`.
- `CORS_ORIGIN`: dominio HTTPS exacto del frontend.

Variables públicas del frontend:

- `VITE_API_URL`: dominio HTTPS del backend.

Lista de verificación:

- Ejecutar `npm test` antes del despliegue.
- Confirmar que `/api/health` responde `200` en producción.
- Probar los cinco módulos desde Postman contra la URL desplegada.
- Verificar que `.env` no exista en GitHub.
- Restringir CORS al dominio real del frontend.
- Guardar evidencias de Supabase, pruebas, repositorio y despliegue para la sustentación.

