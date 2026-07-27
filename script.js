async function cargarDatos() {
    try {
        const respuesta = await fetch('datos.csv');
        const data = await respuesta.text();
        
        // Expresión regular para separar por comas ignorando las que están dentro de comillas
        const filas = data.split(/\r?\n/).slice(1); 
        const cuerpoTabla = document.getElementById('cuerpo-tabla');
        cuerpoTabla.innerHTML = ""; 

        filas.forEach(linea => {
            const columnas = linea.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            
            if (columnas.length > 1) {
                const tr = document.createElement('tr');
                
                // Mapeo según estructura de Fuente 8/9:
                // 0: Título, 7: Edificio, 2: Año, 5: Disciplina, 20: Resumen
                const titulo = columnas?.replace(/"/g, '') || "Sin título";
                const edificio = columnas[12]?.replace(/"/g, '') || "No identificado";
                const anio = columnas[13]?.replace(/"/g, '') || "S/F";
                const disciplina = columnas[14]?.replace(/"/g, '') || "General";
                const resumen = columnas[15]?.replace(/"/g, '').substring(0, 150);

                tr.innerHTML = `
                    <td><strong>${titulo}</strong></td>
                    <td>${edificio}</td>
                    <td>${anio}</td>
                    <td>${disciplina}</td>
                    <td><a href="#" class="btn-ficha" onclick="alert('RESUMEN: ${resumen}...')">Ficha</a></td>
                `;
                cuerpoTabla.appendChild(tr);
            }
        });
    } catch (error) {
        console.error("Error al cargar el repositorio:", error);
        document.getElementById('cuerpo-tabla').innerHTML = "<tr><td colspan='5'>Error al cargar los datos. Verifique que 'datos.csv' esté en la carpeta principal.</td></tr>";
    }
}

// Buscador en tiempo real
document.getElementById('busqueda').addEventListener('keyup', function() {
    const valor = this.value.toLowerCase();
    const filas = document.querySelectorAll('#cuerpo-tabla tr');
    
    filas.forEach(fila => {
        const texto = fila.innerText.toLowerCase();
        fila.style.display = texto.includes(valor) ? '' : 'none';
    });
});

window.onload = cargarDatos;
