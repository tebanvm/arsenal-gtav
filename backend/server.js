// ============================================================
// Arsenal GTA V - Servidor backend
// Autor: Esteban Venegas
//
// Levanta un servidor con Express que:
//   1. Se conecta a la base de datos MySQL "Combat_gtaV".
//   2. Entrega los datos en formato JSON por rutas /api/...
//   3. Sirve la pagina web que esta en la carpeta frontend.
// ============================================================

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const compression = require('compression');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());

// Comprime las respuestas (JSON, HTML, CSS, JS) para que pesen menos
app.use(compression());

// Las imagenes se guardan 7 dias en el navegador, asi no se descargan
// de nuevo cada vez que se recarga la pagina
app.use('/img', express.static(path.join(__dirname, '..', 'frontend', 'img'), { maxAge: '7d' }));

// El resto de la carpeta frontend se entrega tal cual (index.html, estilos.css, app.js)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ------------------------------------------------------------
// Conexion a MySQL
// CAMBIAR user y password por los de tu MySQL
// ------------------------------------------------------------
// Se usa un "pool": un grupo de conexiones que se reutilizan. Si una
// conexion se corta (por ejemplo tras mucho rato sin uso), el pool abre
// otra sola, asi el servidor no deja de responder.
const conexion = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'Combat_gtaV',
  connectionLimit: 5
});

// Prueba la conexion al iniciar, para saber altiro si MySQL responde
conexion.getConnection((err, prueba) => {
  if (err) {
    console.error('Error de conexion a MySQL:', err.message);
    return;
  }
  console.log('Conexion a MySQL exitosa (base Combat_gtaV)');
  prueba.release();
});

// Funcion de apoyo: ejecuta una consulta y responde con JSON.
// Si algo falla, responde con error 500 y un mensaje.
function responderConsulta(res, sql, parametros = []) {
  conexion.query(sql, parametros, (err, resultados) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Error al consultar la base de datos' });
      return;
    }
    res.json(resultados);
  });
}

// ------------------------------------------------------------
// Consulta base de armas: une Armas con Tipo, Municion, Cualidad
// y Estadistica, para que cada arma traiga sus datos con nombre
// (no solo los ID) y sus estadisticas.
// ------------------------------------------------------------
const SQL_ARMAS = `
  SELECT
    a.ID_Armas        AS id,
    a.Nombre_Arma     AS nombre,
    t.ID_Tipo         AS id_tipo,
    t.Nombre_Tipo     AS tipo,
    m.Nombre_Municion AS municion,
    m.Capacidad       AS capacidad,
    m.Cantidad_Actual AS cantidad_actual,
    c.Modificable     AS modificable,
    e.Danio           AS danio,
    e.Cadencia        AS cadencia,
    e.Precision_Arma  AS precision_arma,
    e.Alcance         AS alcance,
    e.Precio          AS precio,
    e.Descripcion     AS descripcion
  FROM Armas a
  JOIN Tipo t      ON a.ID_Tipo = t.ID_Tipo
  JOIN Municion m  ON a.ID_Municion = m.ID_Municion
  JOIN Cualidad c  ON a.ID_Cualidad = c.ID_Cualidad
  LEFT JOIN Estadistica e ON e.ID_Armas = a.ID_Armas
`;

// GET /api/armas -> todas las armas
// GET /api/armas?tipo=3 -> solo las armas de ese tipo
app.get('/api/armas', (req, res) => {
  const tipo = req.query.tipo;

  if (tipo) {
    responderConsulta(res, SQL_ARMAS + ' WHERE t.ID_Tipo = ? ORDER BY a.Nombre_Arma', [tipo]);
  } else {
    responderConsulta(res, SQL_ARMAS + ' ORDER BY t.ID_Tipo, a.Nombre_Arma');
  }
});

// GET /api/armas/5 -> una sola arma por su ID
app.get('/api/armas/:id', (req, res) => {
  conexion.query(SQL_ARMAS + ' WHERE a.ID_Armas = ?', [req.params.id], (err, resultados) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Error al consultar la base de datos' });
      return;
    }
    if (resultados.length === 0) {
      res.status(404).json({ error: 'No existe un arma con ese ID' });
      return;
    }
    res.json(resultados[0]);
  });
});

// GET /api/tipos -> tipos de arma con cuantas armas tiene cada uno (GROUP BY)
app.get('/api/tipos', (req, res) => {
  responderConsulta(res, `
    SELECT t.ID_Tipo AS id, t.Nombre_Tipo AS nombre, COUNT(a.ID_Armas) AS cantidad
    FROM Tipo t
    LEFT JOIN Armas a ON a.ID_Tipo = t.ID_Tipo
    GROUP BY t.ID_Tipo, t.Nombre_Tipo
    ORDER BY t.ID_Tipo
  `);
});

// GET /api/snacks -> snacks de curacion
app.get('/api/snacks', (req, res) => {
  responderConsulta(res, `
    SELECT ID_Snack AS id, Nombre_Snack AS nombre, Descripcion AS descripcion,
           Curacion AS curacion, Cantidad AS cantidad
    FROM Snack
    ORDER BY Curacion DESC
  `);
});

// GET /api/chalecos -> chalecos antibalas
app.get('/api/chalecos', (req, res) => {
  responderConsulta(res, `
    SELECT ID_ChalecoAntibalas AS id, Nombre_Chaleco AS nombre, Descripcion AS descripcion,
           Capacidad_De_Proteccion AS proteccion, Cantidad AS cantidad
    FROM ChalecoAntibalas
    ORDER BY Capacidad_De_Proteccion DESC
  `);
});

// Pagina principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor Express en http://localhost:${port}`);
});
