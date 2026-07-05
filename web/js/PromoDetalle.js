
class PromoDetalle {

    constructor(selectorTarjetas, idOverlay) {
        this.tarjetas = document.querySelectorAll(selectorTarjetas);
        this.overlay = document.getElementById(idOverlay);

        if (!this.overlay || this.tarjetas.length === 0) {
            console.warn("PromoDetalle: faltan tarjetas o el contenedor del modal.");
            return;
        }

        this.imagen      = this.overlay.querySelector(".pd-imagen");
        this.titulo      = this.overlay.querySelector(".pd-titulo");
        this.mes         = this.overlay.querySelector(".pd-mes");
        this.descripcion = this.overlay.querySelector(".pd-descripcion");
        this.precioOriginal  = this.overlay.querySelector(".pd-precio-original");
        this.precioDescuento = this.overlay.querySelector(".pd-precio-descuento");
        this.badgeDescuento  = this.overlay.querySelector(".pd-descuento-badge");
        this.countdown   = this.overlay.querySelector(".pd-countdown");
        this.tituloFormulario = this.overlay.querySelector(".pd-form-titulo");
        this.form        = this.overlay.querySelector(".pd-form");
        this.inputCorreo = this.overlay.querySelector(".pd-input");
        this.mensajeError = this.overlay.querySelector(".pd-mensaje-error");
        this.mensajeExito = this.overlay.querySelector(".pd-mensaje-exito");
        this.botonCerrar  = this.overlay.querySelector(".pd-cerrar");

        this.inicializar();
    }

    inicializar() {

        this.tarjetas.forEach((tarjeta) => {
            tarjeta.setAttribute("tabindex", "0");
            tarjeta.setAttribute("role", "button");
            tarjeta.setAttribute("aria-label", "Ver detalle de " + tarjeta.getAttribute("data-nombre"));


            tarjeta.addEventListener("click", () => this.abrir(tarjeta));

            tarjeta.addEventListener("keydown", (evento) => {
                if (evento.key === "Enter" || evento.key === " ") {
                    evento.preventDefault();
                    this.abrir(tarjeta);
                }
            });
        });


        this.botonCerrar.addEventListener("click", () => this.cerrar());

        this.overlay.addEventListener("click", (evento) => {
            if (evento.target === this.overlay) this.cerrar();
        });

        document.addEventListener("keydown", (evento) => {
            if (evento.key === "Escape") this.cerrar();
        });

       
        this.form.addEventListener("submit", (evento) => this.manejarEnvioInteres(evento));
    }

    /* Lee los datos de la tarjeta clickeada directamente del DOM (sin duplicar información) */
    extraerDatos(tarjeta) {
        const img = tarjeta.querySelector(".promo-img-wrap img");
        const filasTabla = tarjeta.querySelectorAll("tbody td");

        return {
            nombre: tarjeta.getAttribute("data-nombre"),
            mesNumero: parseInt(tarjeta.getAttribute("data-mes")),
            imagenSrc: img ? img.getAttribute("src") : "",
            imagenAlt: img ? img.getAttribute("alt") : "",
            mes: filasTabla[0] ? filasTabla[0].textContent : "",
            descripcion: filasTabla[1] ? filasTabla[1].textContent : "",
            precioOriginal: tarjeta.querySelector(".precio-original")?.textContent || "",
            precioDescuento: tarjeta.querySelector(".precio-descuento")?.textContent || "",
            descuentoTexto: tarjeta.querySelector(".descuento-badge")?.textContent || ""
        };
    }

    abrir(tarjeta) {
        const datos = this.extraerDatos(tarjeta);

        this.imagen.src = datos.imagenSrc;
        this.imagen.alt = datos.imagenAlt;
        this.titulo.textContent = datos.nombre;
        this.mes.textContent = datos.mes;
        this.descripcion.textContent = datos.descripcion;
        this.precioOriginal.textContent = datos.precioOriginal;
        this.precioDescuento.textContent = datos.precioDescuento;
        this.badgeDescuento.textContent = datos.descuentoTexto;

        this.actualizarCountdown(datos.mesNumero);
        this.reiniciarFormulario(datos.mesNumero);

        this.overlay.classList.add("pd-overlay--visible");
        document.body.style.overflow = "hidden";
    }

    cerrar() {
        this.overlay.classList.remove("pd-overlay--visible");
        document.body.style.overflow = "";
    }

    /*
       Compara el mes de la tarjeta (data-mes) con el mes real actual.
       Solo tiene sentido mostrar una cuenta regresiva de "días restantes"
       si la promoción corresponde al mes en curso. Si es de otro mes,
       se informa cuándo estuvo o estará disponible.
    */
    actualizarCountdown(mesTarjeta) {
        const nombresMeses = (typeof MESES_NOMBRES !== "undefined")
            ? MESES_NOMBRES
            : ["", "enero","febrero","marzo","abril","mayo","junio","julio","agosto","setiembre","octubre","noviembre","diciembre"];

        const hoy = new Date();
        const mesActual = hoy.getMonth() + 1;

        if (mesTarjeta === mesActual) {
            const finDeMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
            const milisegundosPorDia = 1000 * 60 * 60 * 24;
            const diasRestantes = Math.max(0, Math.ceil((finDeMes - hoy) / milisegundosPorDia));

            if (diasRestantes === 0) {
                this.countdown.textContent = "Último día para aprovechar esta promoción";
            } else if (diasRestantes === 1) {
                this.countdown.textContent = "Queda 1 día para que termine esta promoción";
            } else {
                this.countdown.textContent = "Quedan " + diasRestantes + " días para que termine esta promoción";
            }
            this.countdown.classList.remove("pd-countdown--inactiva");

        } else if (mesTarjeta > mesActual) {
            const mesesFaltantes = mesTarjeta - mesActual;
            this.countdown.textContent = mesesFaltantes === 1
                ? "Esta promoción estará disponible el próximo mes (" + nombresMeses[mesTarjeta].toLowerCase() + ")"
                : "Esta promoción estará disponible en " + nombresMeses[mesTarjeta].toLowerCase();
            this.countdown.classList.add("pd-countdown--inactiva");

        } else {
            this.countdown.textContent = "Esta promoción ya finalizó. Vuelve en " + nombresMeses[mesTarjeta].toLowerCase() + " del próximo año.";
            this.countdown.classList.add("pd-countdown--inactiva");
        }
    }

    reiniciarFormulario(mesTarjeta) {
        this.inputCorreo.value = "";
        this.inputCorreo.classList.remove("pd-input--error");
        this.mensajeError.classList.remove("pd-mensaje-error--visible");
        this.mensajeExito.classList.remove("pd-mensaje-exito--visible");
        this.form.style.display = "flex";

        const hoy = new Date();
        const esMesActual = mesTarjeta === (hoy.getMonth() + 1);
        this.tituloFormulario.textContent = esMesActual
            ? "Avísame cuando esté por vencer"
            : "Avísame cuando esté disponible";
    }

    /*
       [RÚBRICA → Formulario interactivo: Validación de datos + Mensajes de error]
       Valida el correo con una expresión regular ANTES de aceptarlo.
       Si no es válido, no se envía nada: se marca el campo en rojo y
       se muestra un mensaje de error específico junto al campo.
    */
    manejarEnvioInteres(evento) {
        evento.preventDefault();

        const correo = this.inputCorreo.value.trim();
        const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

        if (!correoValido) {
            this.inputCorreo.classList.add("pd-input--error");
            this.mensajeError.classList.add("pd-mensaje-error--visible");
            return;
        }

        this.inputCorreo.classList.remove("pd-input--error");
        this.mensajeError.classList.remove("pd-mensaje-error--visible");

        this.guardarInteres(correo);

        // [RÚBRICA → Eventos visuales] feedback inmediato: se oculta el
        // formulario y aparece el mensaje de confirmación, sin recargar la página
        this.form.style.display = "none";
        this.mensajeExito.classList.add("pd-mensaje-exito--visible");
    }

    /*
       Guarda el interés en localStorage como una simulación de base de datos.
       En una siguiente fase (con backend), este método enviaría el correo
       al mismo endpoint/registro que usa el formulario de Registrarse.html.
    */
    guardarInteres(correo) {
        const clave = "bruma_intereses_promos";
        const listaPrevia = JSON.parse(localStorage.getItem(clave) || "[]");

        listaPrevia.push({
            correo: correo,
            promo: this.titulo.textContent,
            fecha: new Date().toISOString()
        });

        localStorage.setItem(clave, JSON.stringify(listaPrevia));
        console.log("Interés registrado localmente:", correo, "->", this.titulo.textContent);
    }
}

/* Inicializa el componente solo si existen tarjetas de promoción en la página */
document.addEventListener("DOMContentLoaded", () => {
    const existenTarjetas = document.querySelector(".promo-card");
    if (existenTarjetas) {
        new PromoDetalle(".promo-card", "pd-overlay");
    }
});
