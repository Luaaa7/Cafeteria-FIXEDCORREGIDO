

class Modal {

    constructor(idOverlay = "modal-generico") {
        this.overlay = document.getElementById(idOverlay);

        if (!this.overlay) {
            console.warn(`Modal: no se encontró el contenedor #${idOverlay}`);
            return;
        }

        this.caja = this.overlay.querySelector(".modal-caja");
        this.elIcono = this.overlay.querySelector(".modal-icono");
        this.elTitulo = this.overlay.querySelector(".modal-titulo");
        this.elTexto = this.overlay.querySelector(".modal-texto");
        this.botonCerrar = this.overlay.querySelector(".modal-cerrar");
        this.botonCerrarX = this.overlay.querySelector(".modal-cerrar-x");

        this.inicializar();
    }

    inicializar() {
        this.botonCerrar.addEventListener("click", () => this.ocultar());
        this.botonCerrarX.addEventListener("click", () => this.ocultar());

        // Cierra al hacer clic fuera de la caja (fuera del contenido)
        this.overlay.addEventListener("click", (evento) => {
            if (evento.target === this.overlay) this.ocultar();
        });

        // Cierra con ESC
        document.addEventListener("keydown", (evento) => {
            if (evento.key === "Escape") this.ocultar();
        });
    }

    /**
     * Muestra el modal con contenido dinámico.
     * @param {Object} opciones
     * @param {"exito"|"error"} opciones.tipo
     * @param {string} opciones.titulo
     * @param {string} opciones.mensaje
     * @param {string} [opciones.textoBoton]
     */
    mostrar({ tipo = "exito", titulo, mensaje, textoBoton = "Entendido" }) {
        this.elIcono.textContent = tipo === "exito" ? "✓" : "!";
        this.elIcono.classList.toggle("modal-icono--error", tipo === "error");

        this.elTitulo.textContent = titulo;
        this.elTexto.textContent = mensaje;
        this.botonCerrar.textContent = textoBoton;

        this.overlay.classList.add("modal-overlay--visible");
        this.botonCerrar.focus();
        document.body.style.overflow = "hidden";
    }

    ocultar() {
        this.overlay.classList.remove("modal-overlay--visible");
        document.body.style.overflow = "";
    }
}
