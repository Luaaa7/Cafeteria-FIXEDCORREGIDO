/* =============================================
   CLASE: HamburgerMenu
   Responsabilidad única: controlar la apertura y
   cierre del menú de navegación en modo móvil.
   Se usa en: index.html, CATALOGO.html, Direccion.html,
              Registrarse.html, Promociones.html
   ============================================= */

class HamburgerMenu {

    /**
     * @param {string} selectorBoton   Selector del botón hamburguesa
     * @param {string} selectorMenu    Selector del <nav> a mostrar/ocultar
     * @param {string} selectorOverlay Selector del fondo oscuro
     */
    constructor(selectorBoton, selectorMenu, selectorOverlay) {
        this.boton = document.querySelector(selectorBoton);
        this.menu = document.querySelector(selectorMenu);
        this.overlay = document.querySelector(selectorOverlay);

        // Variable de estado interna de la clase
        this.abierto = false;

        // Si algún elemento no existe en la página, no se inicializa
        if (!this.boton || !this.menu || !this.overlay) {
            console.warn("HamburgerMenu: no se encontraron todos los elementos necesarios.");
            return;
        }

        this.inicializar();
    }

    /* Registra los eventos del componente */
    inicializar() {
        this.boton.addEventListener("click", () => this.alternar());
        this.overlay.addEventListener("click", () => this.cerrar());

        // Cierra el menú al hacer clic en un enlace (mejora UX en móvil)
        this.menu.querySelectorAll("a").forEach((enlace) => {
            enlace.addEventListener("click", () => this.cerrar());
        });

        // Cierra el menú si la ventana vuelve a tamaño de escritorio
        window.addEventListener("resize", () => {
            if (window.innerWidth > 768 && this.abierto) {
                this.cerrar();
            }
        });

        // Cierra el menú con la tecla ESC (accesibilidad - WCAG 2.1.1)
        document.addEventListener("keydown", (evento) => {
            if (evento.key === "Escape" && this.abierto) {
                this.cerrar();
            }
        });
    }

    /* Alterna entre abierto/cerrado según el estado actual */
    alternar() {
        this.abierto ? this.cerrar() : this.abrir();
    }

    abrir() {
        this.abierto = true;
        this.menu.classList.add("menu--abierto");
        this.overlay.classList.add("nav-overlay--visible");
        this.boton.classList.add("nav-toggle--abierto");
        this.boton.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden"; // evita scroll de fondo
    }

    cerrar() {
        this.abierto = false;
        this.menu.classList.remove("menu--abierto");
        this.overlay.classList.remove("nav-overlay--visible");
        this.boton.classList.remove("nav-toggle--abierto");
        this.boton.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
    }
}

/* Inicializa el componente cuando el DOM está listo */
document.addEventListener("DOMContentLoaded", () => {
    new HamburgerMenu("#nav-toggle", "#menu-principal", "#nav-overlay");
});
