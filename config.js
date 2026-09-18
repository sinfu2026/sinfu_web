// config.js
// Configuración de Supabase
// IMPORTANTE: Reemplaza estas variables con tus credenciales reales de Supabase
const SUPABASE_URL = 'https://bymwckwnrzgbaskcbjbz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bXdja3ducnpnYmFza2NiamJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1NzQyOTUsImV4cCI6MjEwNTE1MDI5NX0.dKyHpVKF7Z6aO9K8iP7cuJuiOUhTxSBymOOhBqcFIGg';

// Inicializar cliente y guardarlo globalmente
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
