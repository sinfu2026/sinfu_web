// theme.js - Manejo global de Dark Mode y Light Mode con persistencia en localStorage

(function() {
    // 1. Aplicar tema inicial inmediatamente para evitar parpadeos
    const savedTheme = localStorage.getItem('app_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
    } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
    }

    // 2. Función global para alternar tema
    window.toggleTheme = function() {
        // 1. Disable ALL transitions instantly
        document.documentElement.classList.add('theme-switching');
        
        // 2. Swap theme classes
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
            localStorage.setItem('app_theme', 'light');
        } else {
            document.documentElement.classList.remove('light');
            document.documentElement.classList.add('dark');
            localStorage.setItem('app_theme', 'dark');
        }
        updateThemeIcons();
        
        // 3. Re-enable transitions after a single frame
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                document.documentElement.classList.remove('theme-switching');
            });
        });
    };

    // 3. Actualizar iconos en la UI
    function updateThemeIcons() {
        const isDark = document.documentElement.classList.contains('dark');
        document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
            btn.innerHTML = isDark 
                ? '☀️ <span class="hidden sm:inline text-xs font-normal">Claro</span>' 
                : '🌙 <span class="hidden sm:inline text-xs font-normal">Oscuro</span>';
            btn.setAttribute('title', isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro');
        });
    }

    // 4. Inyectar botón de tema si la página no lo tiene o inicializar los existentes
    document.addEventListener('DOMContentLoaded', () => {
        updateThemeIcons();
    });
})();
