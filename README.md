# Arsenal GTA V

Proyecto de la Evaluación 3 de Diseño Web. Es una página que muestra las armas de GTA V sacándolas de mi base de datos en MySQL (Combat_gtaV).

**Integrante:** Esteban Venegas

## Qué usé

- Backend: Node.js + Express + mysql2
- Frontend: HTML, CSS, JavaScript y Bootstrap 5
- Base de datos: MySQL (archivo `backend/datos.sql`)

## Carpetas

```
arsenal-gtav/
├── backend/
│   ├── server.js
│   └── datos.sql
├── frontend/
│   ├── index.html
│   ├── estilos.css
│   ├── app.js
│   ├── datos/      (copia de los datos en JSON para GitHub Pages)
│   └── img/        (imagenes optimizadas en WebP)
├── herramientas/
│   └── optimizar-imagenes.js
├── imagenes-originales/   (las imagenes sin optimizar + LISTA.txt)
├── pruebas/        (capturas de Thunder Client)
├── index.html      (redirige a frontend/, para GitHub Pages)
├── package.json
└── README.md
```

## Cómo ejecutarlo

1. Abrir `backend/datos.sql` en MySQL Workbench y ejecutarlo con el rayo. Crea la base Combat_gtaV.
2. En `backend/server.js` poner el usuario y la contraseña de tu MySQL.
3. En la terminal, dentro de la carpeta del proyecto:
   ```
   npm install
   npm start
   ```
   (en PowerShell puede que haya que usar `npm.cmd install` y `npm.cmd start`)
4. Entrar a http://localhost:3000

## Versión en GitHub Pages

GitHub Pages no puede correr Node ni MySQL, así que ahí la página usa una copia de los datos que está en `frontend/datos/` (los mismos JSON que entregan las rutas `/api/...`). Al cargar, la página prueba si el servidor responde: si responde usa la base de datos, y si no, usa los JSON.

Si se cambia la base de datos, hay que volver a guardar esos JSON abriendo cada ruta (por ejemplo http://localhost:3000/api/armas) y copiando el resultado en su archivo.

## Imágenes

Cada imagen se llama con el ID de la base de datos (por ejemplo `46.png` es el Railgun). La lista de IDs está en `imagenes-originales/LISTA.txt`.

1. Guardar las imágenes en `imagenes-originales/armas`, `snacks` o `chalecos`.
2. Ejecutar `npm run imagenes` (o `npm.cmd run imagenes`). El script las achica y las pasa a WebP en `frontend/img/`.

Para que la página cargue rápido: las imágenes son WebP chicas, se cargan solo cuando aparecen en pantalla (`loading="lazy"`), el navegador las guarda 7 días y el servidor comprime las respuestas. Si falta una imagen se muestra "sin imagen".

Las imágenes de las armas son del juego GTA V (Rockstar Games) y se usan solo con fines académicos.

## Rutas

| Ruta | Qué devuelve |
| --- | --- |
| GET `/api/armas` | todas las armas con su tipo, munición y stats |
| GET `/api/armas?tipo=5` | solo las armas de un tipo |
| GET `/api/armas/:id` | una sola arma (si no existe da 404) |
| GET `/api/tipos` | los tipos y cuántas armas tiene cada uno |
| GET `/api/snacks` | los snacks |
| GET `/api/chalecos` | los chalecos |

Las probé con Thunder Client, las capturas están en `pruebas/`.

## Lo que tiene la página

- Tabla con las 67 armas, con barras de daño y cadencia y su precio
- Filtros: buscar por nombre, tipo, munición y solo modificables
- Ordenar por daño, cadencia, precisión, alcance o precio
- Ficha de cada arma al hacer clic en su fila
- Lista de snacks y chalecos

Las stats y precios de la tabla Estadistica son aproximados, no son los oficiales del juego.
