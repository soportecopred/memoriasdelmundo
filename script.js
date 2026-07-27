async function cargarDatos() {
    const cuerpoTabla = document.getElementById('cuerpo-tabla');
    try {
        const respuesta = await fetch('datos.csv');
        if (!respuesta.ok) throw new Error("No se pudo cargar el archivo datos.csv");
        
        const data = await respuesta.text();
        // Separamos por líneas y filtramos las vacías
        const filas = data.split(/\r?\n/).filter(linea => linea.trim() !== "");
        
        cuerpoTabla.innerHTML = ""; 

        // Empezamos en 1 para saltar el encabezado del CSV
        for (let i = 1; i < filas.length; i++) {
            // Expresión regular para separar por comas respetando las comillas
            const columnas = filas[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

            if (columnas.length > 1) {
                const tr = document.createElement('tr');
                
                // Extraemos los datos limpiando las comillas de Notion
                // Los índices corresponden a: 0:Título, 7:Edificio, 2:Año, 5:Disciplina, 20:Resumen
                const titulo = (columnas || "Sin título").replace(/"/g, '').trim();
                const edificio = (columnas[1] || "No identificado").replace(/"/g, '').trim();
                const anio = (columnas[2] || "S/F").replace(/"/g, '').trim();
                const disciplina = (columnas[3] || "General").replace(/"/g, '').trim();
                const resumen = (columnas[4] || "Sin resumen disponible").replace(/"/g, '').trim().substring(0, 150);

                tr.innerHTML = `
                    <td><strong>${titulo}</strong></td>
                    <td>${edificio}</td>
                    <td>${anio}</td>
                    <td>${disciplina}</td>
                    <td><a href="#" class="btn-ficha" onclick="alert('RESUMEN: ${resumen}...')">Ver Detalle</a></td>
                `;
                cuerpoTabla.appendChild(tr);
            }
        }
    } catch (error) {
        console.error("Error:", error);
        cuerpoTabla.innerHTML = `<tr><td colspan="5" style="color:red; padding:20px;">Error al cargar datos: ${error.message}. Verifique que el archivo se llame 'datos.csv'.</td></tr>`;
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
