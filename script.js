async function cargarDatos() {
    const cuerpoTabla = document.getElementById('cuerpo-tabla');
    try {
        const respuesta = await fetch('datos.csv');
        if (!respuesta.ok) throw new Error("Archivo 'datos.csv' no encontrado");
        
        const data = await respuesta.text();
        // Dividimos por líneas y eliminamos las que estén totalmente vacías
        const filas = data.split(/\r?\n/).filter(linea => linea.trim() !== "");
        
        cuerpoTabla.innerHTML = ""; 

        // Saltamos la fila 0 (encabezados) y procesamos el resto
        for (let i = 1; i < filas.length; i++) {
            // Regex para manejar comas dentro de comillas (común en Notion)
            const columnas = filas[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

            if (columnas.length > 0) {
                const tr = document.createElement('tr');
                
                // Función interna de limpieza ultra-segura
                const limpiar = (dato, fallback) => {
                    const texto = (dato === undefined || dato === null) ? fallback : String(dato);
                    return texto.replace(/"/g, '').trim() || fallback;
                };

                // Mapeo según los índices de tu archivo datos.csv (Fuente 8/9):
                // 0:Título, 7:Edificio, 2:Año, 5:Disciplina, 20:Resumen
                const titulo = limpiar(columnas, "Sin título");
                const edificio = limpiar(columnas[3], "No identificado");
                const anio = limpiar(columnas[4], "S/F");
                const disciplina = limpiar(columnas[5], "General");
                const resumen = limpiar(columnas[6], "Sin resumen disponible").substring(0, 150);

                tr.innerHTML = `
                    <td><strong>${titulo}</strong></td>
                    <td>${edificio}</td>
                    <td>${anio}</td>
                    <td>${disciplina}</td>
                    <td><button class="btn-ficha" onclick="alert('RESUMEN: ${resumen}...')">Ver Ficha</button></td>
                `;
                cuerpoTabla.appendChild(tr);
            }
        }
    } catch (error) {
        console.error("Error crítico:", error);
        cuerpoTabla.innerHTML = `<tr><td colspan="5" style="color:red; padding:20px;">Error: ${error.message}. <br>Revisa que el archivo se llame exactamente 'datos.csv' y esté en la raíz.</td></tr>`;
    }
}

// Buscador (se mantiene igual)
document.getElementById('busqueda').addEventListener('keyup', function() {
    const valor = this.value.toLowerCase();
    const filas = document.querySelectorAll('#cuerpo-tabla tr');
    filas.forEach(fila => {
        fila.style.display = fila.innerText.toLowerCase().includes(valor) ? '' : 'none';
    });
});

window.onload = cargarDatos;
