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
        const filas = data.split('\n').slice(1); 
        const cuerpoTabla = document.getElementById('cuerpo-tabla');
        cuerpoTabla.innerHTML = ""; // Limpia la tabla antes de cargar

        filas.forEach(linea => {
            // Dividir por comas, pero respetando las comas dentro de comillas
            const columnas = linea.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); 
            
            if (columnas.length > 1) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="padding:10px; border-bottom:1px solid #ddd;">${columnas.replace(/"/g, '')}</td> <!-- Título -->
                    <td style="padding:10px; border-bottom:1px solid #ddd;">${columnas[2] || 'No identificado'}</td> <!-- Edificio -->
                    <td style="padding:10px; border-bottom:1px solid #ddd;">${columnas[3] || 'S/F'}</td> <!-- Año -->
                    <td style="padding:10px; border-bottom:1px solid #ddd;">${columnas[4] || 'General'}</td> <!-- Disciplina -->
                    <td style="padding:10px; border-bottom:1px solid #ddd;">
                        <a href="#" onclick="alert('Resumen: ${columnas[5]?.substring(0,100)}...')" style="color:var(--gold-ucv);">Ver Ficha</a>
                    </td>
                `;
                cuerpoTabla.appendChild(tr);
            }
        });
    } catch (error) {
        console.error("Error cargando el repositorio:", error);
    }
}
