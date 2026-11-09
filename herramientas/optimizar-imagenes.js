// Optimiza las imagenes para que la pagina cargue rapido.
// Esteban Venegas
//
// Toma las imagenes de imagenes-originales/ (armas, snacks y chalecos),
// las achica y las guarda en formato WebP en frontend/img/.
// Cada imagen tiene que llamarse con el ID de la base de datos (ej: 49.png).
//
// Se ejecuta con:  npm.cmd run imagenes

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');

// Carpeta de origen -> carpeta de destino y tamaño maximo (ancho x alto en px)
const grupos = [
  { nombre: 'armas', ancho: 480, alto: 240 },
  { nombre: 'snacks', ancho: 160, alto: 160 },
  { nombre: 'chalecos', ancho: 160, alto: 160 }
];

const extensiones = ['.png', '.jpg', '.jpeg', '.webp'];

async function optimizar() {
  for (const grupo of grupos) {
    const origen = path.join(raiz, 'imagenes-originales', grupo.nombre);
    const destino = path.join(raiz, 'frontend', 'img', grupo.nombre);
    fs.mkdirSync(destino, { recursive: true });

    if (!fs.existsSync(origen)) continue;

    const archivos = fs.readdirSync(origen)
      .filter(archivo => extensiones.includes(path.extname(archivo).toLowerCase()));

    let listos = 0;
    for (const archivo of archivos) {
      const id = path.parse(archivo).name;

      // Solo se aceptan nombres que sean un numero (el ID)
      if (!/^\d+$/.test(id)) {
        console.log(`  Saltado: ${grupo.nombre}/${archivo} (el nombre tiene que ser el ID, ej: 12.png)`);
        continue;
      }

      // fit 'inside' achica sin recortar ni deformar la imagen
      await sharp(path.join(origen, archivo))
        .resize(grupo.ancho, grupo.alto, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(path.join(destino, `${id}.webp`));
      listos++;
    }

    console.log(`${grupo.nombre}: ${listos} imagenes optimizadas`);
  }
}

optimizar().catch(error => console.error('Error al optimizar:', error.message));
