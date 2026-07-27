async function cargarDatos() {
    const cuerpoTabla = document.getElementById('cuerpo-tabla');
    try {
        const respuesta = await fetch('datos.csv');
        if (!respuesta.ok) throw new Error("No se pudo cargar el archivo datos.csv");
        
        const data = await respuesta.text();
        const filas = data.split(/\r?\n/).filter(linea => linea.trim() !== "");
        
        cuerpoTabla.innerHTML = ""; // Limpiar mensaje de carga

        // Empezamos desde 1 para saltar el encabezado
        for (let i = 1; i < filas.length; i++) {
            // Regex para separar por comas ignorando las que están dentro de comillas
            const columnas = filas[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

            if (columnas.length > 1) {
                const tr = document.createElement('tr');
                
                // Mapeo basado en tu archivo datos.csv (Fuente 8/9)
                const titulo = (columnas || "Sin título").replace(/"/g, '');
                const edificio = (columnas[15] || "No identificado").replace(/"/g, '');
                const anio = (columnas[16] || "S/F").replace(/"/g, '');
                const disciplina = (columnas[17] || "General").replace(/"/g, '');
                const resumen = (columnas[18] || "Sin resumen disponible").replace(/"/g, '').substring(0, 150);

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
        cuerpoTabla.innerHTML = `<tr><td colspan="5" style="color:red;">Error: ${error.message}. Asegúrese de que 'datos.csv' esté en la raíz del repositorio.</td></tr>`;
    }
}

// Buscador
document.getElementById('busqueda').addEventListener('keyup', function() {
    const valor = this.value.toLowerCase();
    const filas = document.querySelectorAll('#cuerpo-tabla tr');
    filas.forEach(fila => {
        fila.style.display = fila.innerText.toLowerCase().includes(valor) ? '' : 'none';
    });
});

window.onload = cargarDatos;
