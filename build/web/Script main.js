
        const toggleMenu = (abrir) => {
            menu.classList.toggle("abierto", abrir);
            hamburguesa.classList.toggle("activo", abrir);
            hamburguesa.setAttribute("aria-expanded", abrir);
            menuOverlay.classList.toggle("visible", abrir);
            document.body.style.overflow = abrir ? "hidden" : "";
        };

        hamburguesa.addEventListener("click", () => {
            toggleMenu(!menu.classList.contains("abierto"));
        });

        /* Cierra el menú al tocar el fondo oscuro */
        menuOverlay.addEventListener("click", () => toggleMenu(false));

        /* Cierra el menú si el usuario da click en un link (móvil) */
        menu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => toggleMenu(false));
        });

        /* ==========================================================
           MODAL DE PRODUCTO
        ========================================================== */
        const abrirModal = (card) => {
            const { nombre, precio } = card.dataset;
            const img = card.querySelector("img").src;
            const alt = card.querySelector("img").alt;
            const desc = card.querySelector(".text-card").textContent;

            modalContenido.innerHTML = `
                <img src="${img}" alt="${alt}">
                <h3 id="modalTitulo">${nombre}</h3>
                <p class="text-card">${desc}</p>
                <p class="precio">S/ ${parseFloat(precio).toFixed(2)}</p>
            `;
            modal.hidden = false;
            document.body.style.overflow = "hidden";
        };

        const cerrarModal = () => {
            modal.hidden = true;
            document.body.style.overflow = "";
        };

        cards.forEach(card => card.addEventListener("click", (e) => {
            if (e.target.closest(".fav-btn")) return; // el corazón no abre el modal
            abrirModal(card);
        }));

        modal.querySelector(".modal-cerrar").addEventListener("click", cerrarModal);
        modal.addEventListener("click", (e) => { if (e.target === modal) cerrarModal(); });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && !modal.hidden) cerrarModal();
        });
