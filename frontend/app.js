// Arsenal GTA V - logica de la pagina
// Esteban Venegas
//
// 1. Pide los datos al servidor (fetch a las rutas /api/...).
// 2. Dibuja la tabla de armas y la lista de snacks y chalecos.
// 3. Filtra y ordena las armas en el DOM segun lo que elige el usuario.

// Aqui se guardan todas las armas que llegan de la base de datos.
// Los filtros trabajan sobre este arreglo, sin volver a pedir datos.
let armas = [];

// Elementos del DOM que se usan varias veces
const listaArmas = document.getElementById('listaArmas');
const contador = document.getElementById('contador');
const buscador = document.getElementById('buscador');
const filtroTipo = document.getElementById('filtroTipo');
const filtroMunicion = document.getElementById('filtroMunicion');
const soloModificables = document.getElementById('soloModificables');
const ordenar = document.getElementById('ordenar');
const formFiltros = document.getElementById('filtros');

// Ventana (modal) de Bootstrap para la ficha del arma
const ventanaFicha = new bootstrap.Modal(document.getElementById('fichaArma'));


// Evita que un texto de la base de datos se interprete como HTML
function limpiarTexto(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

// Precio con formato GTA: $1,000,000 (0 = no se vende en tienda)
function formatoPrecio(precio) {
  if (!precio) return 'No se vende';
  return '$' + precio.toLocaleString('en-US');
}

// Imagen de un arma, snack o chaleco. Las imagenes se llaman con el ID
// de la base de datos (img/armas/49.webp). loading="lazy" hace que solo
// se descarguen cuando aparecen en pantalla, y el ancho/alto fijo evita
// que la pagina "salte" mientras cargan.
function imagen(carpeta, id, nombre, ancho, alto, clase) {
  return `<img class="foto ${clase}" src="img/${carpeta}/${id}.webp" alt="${limpiarTexto(nombre)}"
    width="${ancho}" height="${alto}" loading="lazy" decoding="async">`;
}

// Si una imagen no existe, se muestra la imagen "sin imagen"
document.addEventListener('error', evento => {
  const img = evento.target;
  if (img.classList && img.classList.contains('foto') && !img.dataset.reemplazada) {
    img.dataset.reemplazada = 'si';
    img.src = 'img/sin-imagen.svg';
  }
}, true);

// Barra de 0 a 100 para una stat
function barra(valor) {
  return `<div class="barra-stat" title="${valor}/100"><span style="width: ${valor}%"></span></div>`;
}

// Stat con nombre, numero y barra (se usa en la ficha)
function stat(nombre, valor) {
  return `
    <div class="stat">
      <p><span>${nombre}</span><span>${valor}</span></p>
      ${barra(valor)}
    </div>
  `;
}

// Pide una ruta al servidor y devuelve el JSON
async function pedirDatos(ruta) {
  const respuesta = await fetch(ruta);
  if (!respuesta.ok) {
    throw new Error(`La ruta ${ruta} respondio con error ${respuesta.status}`);
  }
  return respuesta.json();
}


// ---- Dibujar en pantalla ----

// Linea con las cantidades que hay en la base de datos
function mostrarResumen(tipos, snacks, chalecos) {
  document.getElementById('resumen').textContent =
    `${armas.length} armas · ${tipos.length} tipos · ${snacks.length} snacks · ${chalecos.length} chalecos`;
}

// Llena los desplegables de tipo y municion
function llenarFiltros(tipos) {
  tipos.forEach(tipo => {
    const opcion = document.createElement('option');
    opcion.value = tipo.id;
    opcion.textContent = `${tipo.nombre} (${tipo.cantidad})`;
    filtroTipo.appendChild(opcion);
  });

  // Las municiones se sacan de las mismas armas, sin repetir
  const municiones = [...new Set(armas.map(a => a.municion))];
  municiones.forEach(nombre => {
    const opcion = document.createElement('option');
    opcion.value = nombre;
    opcion.textContent = nombre;
    filtroMunicion.appendChild(opcion);
  });
}

// Dibuja una fila de la tabla por cada arma
function mostrarArmas(lista) {
  contador.textContent = `Mostrando ${lista.length} de ${armas.length} armas · haz clic en una para ver su ficha`;

  if (lista.length === 0) {
    listaArmas.innerHTML = '<tr class="sin-resultados"><td colspan="7">No hay armas con esos filtros.</td></tr>';
    return;
  }

  // data-id guarda el ID del arma para abrir su ficha al hacer clic
  listaArmas.innerHTML = lista.map(arma => `
    <tr data-id="${arma.id}" tabindex="0">
      <td>${imagen('armas', arma.id, arma.nombre, 96, 48, 'foto-tabla')}</td>
      <td class="nombre-arma">${limpiarTexto(arma.nombre)}</td>
      <td><span class="etiqueta-tipo">${limpiarTexto(arma.tipo)}</span></td>
      <td class="dato-gris">${limpiarTexto(arma.municion)}</td>
      <td>${barra(arma.danio ?? 0)}</td>
      <td>${barra(arma.cadencia ?? 0)}</td>
      <td class="text-end text-nowrap">${formatoPrecio(arma.precio)}</td>
    </tr>
  `).join('');
}

// Lista de snacks y chalecos
function mostrarEquipo(snacks, chalecos) {
  document.getElementById('listaSnacks').innerHTML = snacks.map(s => `
    <li>
      ${imagen('snacks', s.id, s.nombre, 48, 48, 'foto-equipo')}
      <div class="flex-grow-1">
        ${limpiarTexto(s.nombre)}<br>
        <small>${limpiarTexto(s.descripcion)} · ${s.cantidad} unidades</small>
      </div>
      <span class="valor">+${s.curacion} vida</span>
    </li>
  `).join('');

  document.getElementById('listaChalecos').innerHTML = chalecos.map(c => `
    <li>
      ${imagen('chalecos', c.id, c.nombre, 48, 48, 'foto-equipo')}
      <div class="flex-grow-1">
        ${limpiarTexto(c.nombre)}<br>
        <small>${limpiarTexto(c.descripcion)} · ${c.cantidad} unidades</small>
      </div>
      <span class="valor">${c.proteccion}% proteccion</span>
    </li>
  `).join('');
}


// ---- Ficha del arma ----

// Pide una sola arma al servidor (/api/armas/:id) y la muestra en el modal
async function abrirFicha(id) {
  try {
    const arma = await pedirDatos(`/api/armas/${id}`);
    const tieneMunicion = arma.municion !== 'Sin municion';

    document.getElementById('fichaTipo').textContent = arma.tipo;
    document.getElementById('fichaTitulo').textContent = arma.nombre;

    document.getElementById('fichaCuerpo').innerHTML = `
      ${imagen('armas', arma.id, arma.nombre, 480, 240, 'foto-ficha')}
      <p class="ficha-descripcion">${limpiarTexto(arma.descripcion || 'Sin descripcion.')}</p>
      <div class="row g-4">
        <div class="col-md-7">
          <h3 class="ficha-subtitulo">Stats</h3>
          ${stat('Daño', arma.danio ?? 0)}
          ${stat('Cadencia de fuego', arma.cadencia ?? 0)}
          ${stat('Precision', arma.precision_arma ?? 0)}
          ${stat('Alcance', arma.alcance ?? 0)}
        </div>
        <div class="col-md-5">
          <h3 class="ficha-subtitulo">Datos</h3>
          <dl class="ficha-datos">
            <dt>Precio</dt><dd>${formatoPrecio(arma.precio)}</dd>
            <dt>Municion</dt><dd>${limpiarTexto(arma.municion)}</dd>
            ${tieneMunicion ? `<dt>Cargador</dt><dd>${arma.cantidad_actual} / ${arma.capacidad}</dd>` : ''}
            <dt>Modificaciones</dt><dd>${arma.modificable ? 'Se puede modificar' : 'No se puede modificar'}</dd>
          </dl>
        </div>
      </div>
    `;

    ventanaFicha.show();
  } catch (error) {
    console.error('Error al abrir la ficha:', error);
  }
}

// Un solo "escuchador" en la tabla detecta el clic en cualquier fila
listaArmas.addEventListener('click', evento => {
  const fila = evento.target.closest('tr[data-id]');
  if (fila) abrirFicha(fila.dataset.id);
});

// Tambien se abre con Enter, para quien usa el teclado
listaArmas.addEventListener('keydown', evento => {
  const fila = evento.target.closest('tr[data-id]');
  if (fila && evento.key === 'Enter') abrirFicha(fila.dataset.id);
});


// ---- Filtro DOM ----

// Revisa cada arma contra los cuatro filtros, ordena y vuelve a dibujar
function aplicarFiltros() {
  const texto = buscador.value.trim().toLowerCase();
  const tipo = filtroTipo.value;
  const municion = filtroMunicion.value;
  const modificables = soloModificables.checked;

  const filtradas = armas.filter(arma => {
    const coincideNombre = arma.nombre.toLowerCase().includes(texto);
    const coincideTipo = tipo === '' || arma.id_tipo === Number(tipo);
    const coincideMunicion = municion === '' || arma.municion === municion;
    const coincideModificable = !modificables || arma.modificable === 1;
    return coincideNombre && coincideTipo && coincideMunicion && coincideModificable;
  });

  // Orden: por nombre (A-Z) o por una stat de mayor a menor
  const criterio = ordenar.value;
  if (criterio === 'nombre') {
    filtradas.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  } else if (criterio !== '') {
    filtradas.sort((a, b) => (b[criterio] ?? 0) - (a[criterio] ?? 0));
  }

  mostrarArmas(filtradas);
}

buscador.addEventListener('input', aplicarFiltros);
filtroTipo.addEventListener('change', aplicarFiltros);
filtroMunicion.addEventListener('change', aplicarFiltros);
soloModificables.addEventListener('change', aplicarFiltros);
ordenar.addEventListener('change', aplicarFiltros);

// "Limpiar filtros" resetea el formulario; se espera un instante
// para que los campos queden vacios antes de volver a filtrar
formFiltros.addEventListener('reset', () => setTimeout(aplicarFiltros, 0));


// ---- Inicio ----

async function iniciar() {
  try {
    // Se piden las cuatro rutas al mismo tiempo
    const [datosArmas, tipos, snacks, chalecos] = await Promise.all([
      pedirDatos('/api/armas'),
      pedirDatos('/api/tipos'),
      pedirDatos('/api/snacks'),
      pedirDatos('/api/chalecos')
    ]);

    armas = datosArmas;
    mostrarResumen(tipos, snacks, chalecos);
    llenarFiltros(tipos);
    mostrarArmas(armas);
    mostrarEquipo(snacks, chalecos);
  } catch (error) {
    console.error('Error al cargar los datos:', error);
    contador.textContent = 'No se pudieron cargar los datos. Revisa que el servidor y MySQL esten encendidos.';
  }
}

iniciar();
