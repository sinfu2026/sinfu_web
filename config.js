// config.js
// Configuración de Supabase
// IMPORTANTE: Reemplaza estas variables con tus credenciales reales de Supabase
const SUPABASE_URL = 'https://mzdoqoawmyigbnibajds.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16ZG9xb2F3bXlpZ2JuaWJhamRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3MzEzMDIsImV4cCI6MjEwNTMwNzMwMn0.F8ijWUEU7HU5axtQUXMUSJXwrTnGcUQhUGrVBArJ2Es';

// Inicializar cliente y guardarlo globalmente
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
