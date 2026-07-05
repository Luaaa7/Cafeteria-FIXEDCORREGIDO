// Alternar modo claro / oscuro para Bruma Café
(function () {
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        var btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.textContent = theme === 'dark' ? '☀️' : '🌙';
            btn.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
        }
    }

    function initTheme() {
        var saved = localStorage.getItem('bruma-theme');
        var theme = saved ? saved : 'light';
        applyTheme(theme);
    }

    function toggleTheme() {
        var current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        var next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem('bruma-theme', next);
        applyTheme(next);
    }

    document.addEventListener('DOMContentLoaded', function () {
        initTheme();
        var btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.addEventListener('click', toggleTheme);
        }
    });
})();
