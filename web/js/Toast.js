/* =============================================
   CLASE: Toast
   Responsabilidad única: mostrar notificaciones
   flotantes modernas (no bloqueantes) con
   transición fade-in / fade-out y auto-cierre.
   No depende de ninguna página en particular:
   cualquier script puede llamar a
   new Toast().mostrar({...})
   ============================================= */

class Toast {

    constructor(idContenedor = "toast-contenedor") {
        this.contenedor = document.getElementById(idContenedor);

        if (!this.contenedor) {
            this.contenedor = document.createElement("div");
            this.contenedor.id = idContenedor;
            document.body.appendChild(this.contenedor);
        }
    }

    /**
     * Muestra una notificación flotante.
     * @param {Object} opciones
     * @param {"exito"|"advertencia"|"error"} [opciones.tipo]
     * @param {string} [opciones.titulo]
     * @param {string} opciones.mensaje
     * @param {number} [opciones.duracion] Milisegundos antes del auto-cierre. 0 = no se cierra sola.
     */
    mostrar({ tipo = "exito", titulo, mensaje, duracion = 5000 }) {
        const iconos = {
            exito: "✓",
            advertencia: "⚠",
            error: "✕"
        };

        const titulosPorDefecto = {
            exito: "Éxito",
            advertencia: "Advertencia",
            error: "Error"
        };

        const toastEl = document.createElement("div");
        toastEl.className = `toast toast--${tipo}`;
        toastEl.setAttribute("role", "status");
        toastEl.setAttribute("aria-live", "polite");

        toastEl.innerHTML = `
            <div class="toast-icono">${iconos[tipo] || iconos.exito}</div>
            <div class="toast-contenido">
                <p class="toast-titulo">${titulo || titulosPorDefecto[tipo] || ""}</p>
                <p class="toast-mensaje">${mensaje}</p>
            </div>
            <button type="button" class="toast-cerrar" aria-label="Cerrar notificación">&times;</button>
        `;

        this.contenedor.appendChild(toastEl);

        // Fuerza el reflow para que la transición de entrada se dispare correctamente
        requestAnimationFrame(() => {
            toastEl.classList.add("toast--visible");
        });

        let temporizador = null;

        const cerrar = () => {
            if (temporizador) clearTimeout(temporizador);
            toastEl.classList.remove("toast--visible");
            toastEl.classList.add("toast--saliendo");
            toastEl.addEventListener("transitionend", () => toastEl.remove(), { once: true });
        };

        toastEl.querySelector(".toast-cerrar").addEventListener("click", cerrar);

        if (duracion > 0) {
            const barraProgreso = document.createElement("div");
            barraProgreso.className = "toast-progreso";
            barraProgreso.style.animationDuration = `${duracion}ms`;
            toastEl.appendChild(barraProgreso);

            temporizador = setTimeout(cerrar, duracion);
        }

        return { elemento: toastEl, cerrar };
    }
}
