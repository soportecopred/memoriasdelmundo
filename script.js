// Efecto de scroll suave para la navegación
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        section.scrollIntoView({ behavior: 'smooth' });
    });
});

// Mensaje de bienvenida dinámico
window.onload = () => {
    console.log("Plataforma de Salvaguarda Tecnológica CUC activada.");
    // Aquí podrías agregar una función para cargar dinámicamente los datos de tu Notion CSV
};
