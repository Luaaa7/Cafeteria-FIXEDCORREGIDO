/* ── CONSTANTES (valor fijo, no cambia) ── */
const NOMBRE_CAFETERIA  = "Bruma Café";          // Nombre del negocio
const TOTAL_MESES       = 12;                    // Siempre hay 12 meses
const MESES_NOMBRES = [                          // Array constante de nombres
    "", "Enero","Febrero","Marzo","Abril",
    "Mayo","Junio","Julio","Agosto",
    "Setiembre","Octubre","Noviembre","Diciembre"
];

/* ── VARIABLES (pueden cambiar durante la ejecución) ── */
let categoriaActual = "todas";   // Categoría seleccionada en el filtro
let ordenActual     = "original"; // Orden actual de las tarjetas

/* ── Diagnóstico inicial en consola ── */
console.log("=== " + NOMBRE_CAFETERIA + " — Página de Promociones cargada ===");
console.log("Total de promociones disponibles: " + TOTAL_MESES);

/* ── Al cargar la página: resalta el mes actual automáticamente ── */
window.onload = function() {
    actualizarContador();       // Muestra el contador inicial
};


function resaltarMesActual() {
    // Variable: obtiene el mes actual del navegador (1–12)
    let mesActual = new Date().getMonth() + 1;

    // Constante local: nombre del mes para mostrar en consola
    const nombreMes = MESES_NOMBRES[mesActual];

    // Diagnóstico en consola (console.log)
    console.log("Mes actual detectado: " + mesActual + " (" + nombreMes + ")");

    // Selecciona todas las tarjetas del DOM
    let tarjetas = document.querySelectorAll(".promo-card");

    // Recorre cada tarjeta con forEach
    tarjetas.forEach(function(tarjeta) {
        // Lee el atributo data-mes de cada tarjeta
        let mesTarjeta = parseInt(tarjeta.getAttribute("data-mes"));

        // Quita badges anteriores para no duplicar
        let badgeAnterior = tarjeta.querySelector(".badge-mes");
        if (badgeAnterior) badgeAnterior.remove();
        tarjeta.classList.remove("destacada");

        // Si el mes coincide → añade clase y badge visual
        if (mesTarjeta === mesActual) {
            tarjeta.classList.add("destacada");

            let badge = document.createElement("span");
            badge.className = "badge-mes";
            badge.textContent = "Promo de " + nombreMes;
            tarjeta.appendChild(badge);

            // Hace scroll suave hacia la tarjeta destacada
            setTimeout(function() {
                tarjeta.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 300);
        }
    });

    mostrarToast("Mostrando la promo de " + nombreMes);
    console.log("Tarjeta del mes " + nombreMes + " destacada correctamente.");
}


function filtrarPorCategoria(valor) {
    // Variable: guarda la categoría elegida
    categoriaActual = valor;

    console.log("Filtro aplicado — categoría: " + categoriaActual);

    let tarjetas = document.querySelectorAll(".promo-card");
    let visibles  = 0;   // Variable: contador de tarjetas visibles

    tarjetas.forEach(function(tarjeta) {
        // Lee el atributo data-categoria de cada tarjeta
        let catTarjeta = tarjeta.getAttribute("data-categoria");

        if (categoriaActual === "todas" || catTarjeta === categoriaActual) {
            tarjeta.classList.remove("oculta");
            visibles++;
        } else {
            tarjeta.classList.add("oculta");
        }
    });

    actualizarContador();
    mostrarToast("Mostrando " + visibles + " promoción(es) de «" + etiquetaCategoria(categoriaActual) + "»");
    console.log("Tarjetas visibles tras filtro: " + visibles + " de " + TOTAL_MESES);
}


function ordenarTarjetas(criterio) {
    // Variable: guarda el criterio de orden
    ordenActual = criterio;

    console.log("Ordenando tarjetas por: " + ordenActual);

    let grid     = document.getElementById("grid-promos");
    let tarjetas = Array.from(grid.querySelectorAll(".promo-card"));

    // Ordena el array según el criterio elegido
    tarjetas.sort(function(a, b) {
        if (ordenActual === "original") {
            return parseInt(a.getAttribute("data-mes")) - parseInt(b.getAttribute("data-mes"));
        }
        // Variable: nombre de cada tarjeta para comparar alfabéticamente
        let nombreA = a.getAttribute("data-nombre");
        let nombreB = b.getAttribute("data-nombre");
        if (ordenActual === "az") return nombreA.localeCompare(nombreB);
        if (ordenActual === "za") return nombreB.localeCompare(nombreA);

        // Variable: precios de cada tarjeta para comparar (de menor a mayor o viceversa)
        let precioA = parseFloat(a.getAttribute("data-precio"));
        let precioB = parseFloat(b.getAttribute("data-precio"));
        if (ordenActual === "precio-asc")  return precioA - precioB;
        if (ordenActual === "precio-desc") return precioB - precioA;

        // Variable: porcentaje de descuento de cada tarjeta (mayor descuento primero)
        let descA = parseFloat(a.getAttribute("data-descuento"));
        let descB = parseFloat(b.getAttribute("data-descuento"));
        if (ordenActual === "descuento") return descB - descA;
    });

    // Reinserta las tarjetas en el nuevo orden
    tarjetas.forEach(function(tarjeta) {
        grid.appendChild(tarjeta);
    });

    mostrarToast("Orden actualizado ✓");
    console.log("Reordenamiento completado — criterio: " + ordenActual);
}

/*
   FUNCIÓN: restablecerFiltros()
   Evento disparado por: onclick del botón "Restablecer"
*/
function restablecerFiltros() {
    // Restablece variables a valores iniciales
    categoriaActual  = "todas";
    ordenActual      = "original";

    // Restablece los selectores visualmente
    document.getElementById("sel-categoria").value = "todas";
    document.getElementById("sel-orden").value     = "original";

    // Aplica filtro y orden por defecto
    filtrarPorCategoria("todas");
    ordenarTarjetas("original");

    mostrarToast("Filtros restablecidos");
    console.log("Filtros restablecidos a valores por defecto.");
}

/*
   FUNCIÓN AUXILIAR: actualizarContador()
   Actualiza el párrafo que muestra cuántas tarjetas se ven
*/
function actualizarContador() {
    let visibles = document.querySelectorAll(".promo-card:not(.oculta)").length;
    let etiqueta  = etiquetaCategoria(categoriaActual);

    // Variable: texto del contador
    let textoContador = "Mostrando " + visibles + " de " + TOTAL_MESES + " promociones";
    if (categoriaActual !== "todas") textoContador += " · Categoría: " + etiqueta;

    document.getElementById("contador-resultado").textContent = textoContador;
}


function etiquetaCategoria(valor) {
    // Constante local: mapa de valores a etiquetas
    const etiquetas = {
        todas: "Todas",
        cafe:  "Café",
        bebida:"Bebidas",
        postre:"Postres",
        te:    "Tés"
    };
    return etiquetas[valor] || valor;
}

/*
   FUNCIÓN AUXILIAR: mostrarToast(mensaje)
   Muestra una notificación temporal en pantalla
*/
function mostrarToast(mensaje) {
    let toast = document.getElementById("toast");
    toast.textContent = mensaje;
    toast.classList.add("visible");

    // Variable: temporizador para ocultar el toast
    let timerToast = setTimeout(function() {
        toast.classList.remove("visible");
    }, 2500);

    console.log("Toast mostrado: \"" + mensaje + "\"");
}


document.addEventListener("DOMContentLoaded", function() {
    const btnMesActual   = document.getElementById("btn-mes-actual");
    const btnRestablecer = document.getElementById("btn-restablecer");
    const selCategoria   = document.getElementById("sel-categoria");
    const selOrden       = document.getElementById("sel-orden");

    if (btnMesActual)   btnMesActual.addEventListener("click", resaltarMesActual);
    if (btnRestablecer) btnRestablecer.addEventListener("click", restablecerFiltros);
    if (selCategoria)   selCategoria.addEventListener("change", function() { filtrarPorCategoria(this.value); });
    if (selOrden)        selOrden.addEventListener("change", function() { ordenarTarjetas(this.value); });
});
