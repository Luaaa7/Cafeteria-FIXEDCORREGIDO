/* =============================================
   Scrip_catalogo.js
   Lógica de la página CATALOGO.html:
   búsqueda, filtros por categoría/estación,
   orden y favoritos (localStorage).
   Extraído del <script> inline para mantener
   HTML / CSS / JS en archivos separados.
   ============================================= */

const chips = document.querySelectorAll(".chip");            /* BOTONES DE CATEGORÍA */
const buscador = document.getElementById("buscador");        /* BUSCADOR */
const ordenar = document.getElementById("ordenar");          /* SELECT DE ORDEN */
const estacion = document.getElementById("estacion");        /* SELECT DE ESTACIÓN */
const toggleOrden = document.getElementById("toggleOrden");  /* BOTÓN DE TOGGLE ORDEN */
let ascendente = true;           /* ORDEN INICIAL */
let categoriaActiva = "all";     /* CATEGORÍA INICIAL */
let mostrandoFavoritos = false;  /* ESTADO DE FAVORITOS */

/* FAVORITOS desde localStorage */
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

/* MARCAR favoritos al cargar */
document.querySelectorAll(".card").forEach(card => {
    const id = card.dataset.id;
    const btn = card.querySelector(".fav-btn");
    if (favoritos.includes(id)) {
        btn.classList.add("activo");
        btn.textContent = "❤";
    }
    btn.addEventListener("click", () => {
        if (favoritos.includes(id)) {
            favoritos = favoritos.filter(f => f !== id);
            btn.classList.remove("activo");
            btn.textContent = "♡";
        } else {
            favoritos.push(id);
            btn.classList.add("activo");
            btn.textContent = "❤";
        }
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
        if (mostrandoFavoritos) filtrar();

        btn.classList.remove("pop");
        void btn.offsetWidth; // fuerza el re-render para que funcione si se hace click rápido
        btn.classList.add("pop");
        btn.addEventListener("animationend", () => btn.classList.remove("pop"), { once: true });
    });
});

/* VER FAVORITOS */
document.getElementById("verFavoritos").addEventListener("click", () => {
    mostrandoFavoritos = !mostrandoFavoritos;
    const btn = document.getElementById("verFavoritos");
    btn.classList.toggle("activo", mostrandoFavoritos);
    filtrar();
});

/* CAMBIO DE CATEGORÍA */
chips.forEach(btn => {
    if (btn.id === "verFavoritos") return;
    btn.addEventListener("click", () => {
        chips.forEach(b => b.classList.remove("activo"));
        btn.classList.add("activo");
        categoriaActiva = btn.dataset.cat;
        mostrandoFavoritos = false;
        document.getElementById("verFavoritos").classList.remove("activo");
        filtrar();
    });
});

/* TOGGLE ORDEN */
toggleOrden.addEventListener("click", () => {
    ascendente = !ascendente;
    toggleOrden.textContent = ascendente ? "↑" : "↓";
    ordenarProductos();
});

estacion.addEventListener("change", filtrar);
buscador.addEventListener("input", filtrar);
ordenar.addEventListener("change", ordenarProductos);

/* FILTRAR */
function filtrar() {
    const texto = buscador.value.toLowerCase();
    const filtroEstacion = estacion.value;

    document.querySelectorAll(".card").forEach(p => {
        const nombre = (p.dataset.nombre || "").toLowerCase();
        const categoria = p.dataset.categoria || "";
        const est = p.dataset.estacion || "";
        const id = p.dataset.id;

        const okTexto = nombre.includes(texto);
        const okCat = categoriaActiva === "all" || categoria === categoriaActiva;
        const okEstacion = filtroEstacion === "all" || est === filtroEstacion || est === "all";
        const okFav = !mostrandoFavoritos || favoritos.includes(id);

        p.style.display = (okTexto && okCat && okEstacion && okFav) ? "" : "none";
    });

    ordenarProductos();
}

/* ORDENAR */
function ordenarProductos() {
    const contenedor = document.querySelector(".contenedor-productos");
    if (!contenedor) return;
    const productos = Array.from(contenedor.children);

    productos.sort((a, b) => {
        const tipo = ordenar.value;
        let resultado = 0;
        if (tipo === "nombre-asc") resultado = a.dataset.nombre.localeCompare(b.dataset.nombre);
        if (tipo === "precio-asc") resultado = parseFloat(a.dataset.precio) - parseFloat(b.dataset.precio);
        if (tipo === "fecha-desc") resultado = new Date(b.dataset.fecha) - new Date(a.dataset.fecha);
        return ascendente ? resultado : -resultado;
    });

    contenedor.innerHTML = "";
    productos.forEach(p => contenedor.appendChild(p));
}
