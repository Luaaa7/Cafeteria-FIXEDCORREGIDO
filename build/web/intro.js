// Preloader (taza girando) + Modal de bienvenida para registrarse
(function () {
    function ocultarLoader() {
        var loader = document.getElementById('page-loader');
        if (!loader) return;
        loader.classList.add('oculto');
    }

    function mostrarModal() {
        var overlay = document.getElementById('registro-modal-overlay');
        if (!overlay) return;
        overlay.classList.add('visible');
    }

    function cerrarModal() {
        var overlay = document.getElementById('registro-modal-overlay');
        if (!overlay) return;
        overlay.classList.remove('visible');
    }

    window.addEventListener('load', function () {
        // Deja ver la animación de la taza un instante antes de ocultarla
        setTimeout(function () {
            ocultarLoader();
            setTimeout(mostrarModal, 350);
        }, 900);
    });

    document.addEventListener('DOMContentLoaded', function () {
        var closeBtn = document.getElementById('registro-modal-close');
        var dismissBtn = document.getElementById('registro-modal-dismiss');
        var overlay = document.getElementById('registro-modal-overlay');

        if (closeBtn) closeBtn.addEventListener('click', cerrarModal);
        if (dismissBtn) dismissBtn.addEventListener('click', cerrarModal);
        if (overlay) {
            overlay.addEventListener('click', function (e) {
                if (e.target === overlay) cerrarModal();
            });
        }
    });
})();
