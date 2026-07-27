// Efecto de scroll suave para la navegación
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        section.scrollIntoView({ behavior: 'smooth' });
        
  // Función para cargar el CSV de Notion
async function cargarDatos() {
    try {
        const respuesta = await fetch('datos.csv');
        const data = await respuesta.text();
        const filas = data.split('\n').slice(1); // Omitimos el encabezado
        const cuerpoTabla = document.getElementById('cuerpo-tabla');

        filas.forEach(linea => {
            const columnas = linea.split(','); // Divide por comas
            if (columnas.length > 1) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="padding:10px; border-bottom:1px solid #ddd;">${columnas}</td> <!-- Título -->
                    <td style="padding:10px; border-bottom:1px solid #ddd;">${columnas[8] || 'N/A'}</td> <!-- Edificio -->
                    <td style="padding:10px; border-bottom:1px solid #ddd;">${columnas[9] || 'S/F'}</td> <!-- Año -->
                    <td style="padding:10px; border-bottom:1px solid #ddd;">${columnas[10] || 'General'}</td> <!-- Disciplina -->
                    <td style="padding:10px; border-bottom:1px solid #ddd;"><a href="#" style="color:var(--gold-ucv);">Ver Ficha</a></td>
                `;
                cuerpoTabla.appendChild(tr);
            }
        });
    } catch (error) {
        console.error("Error cargando el repositorio:", error);
    }
}

// Filtro de búsqueda
document.getElementById('busqueda').addEventListener('keyup', function() {
    const valor = this.value.toLowerCase();
    const filas = document.querySelectorAll('#cuerpo-tabla tr');
    
    filas.forEach(fila => {
        const texto = fila.innerText.toLowerCase();
        fila.style.display = texto.includes(valor) ? '' : 'none';
    });
});

window.onload = cargarDatos;
