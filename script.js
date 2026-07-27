// Almacenamiento seguro de datos en memoria
let acervoData = [];

async function cargarRepositorio() {
    const tabla = document.getElementById('cuerpo-tabla');
    try {
        const response = await fetch('datos.csv');
        if (!response.ok) throw new Error("No se encontró el archivo datos.csv");
        
        const rawText = await response.text();
        const filas = rawText.split(/\r?\n/).filter(linea => linea.trim() !== "");
        
        tabla.innerHTML = ""; // Limpiar mensaje de carga
        acervoData = [];

        // Procesar desde la fila 1 (saltando cabeceras)
        for (let i = 1; i < filas.length; i++) {
            // Regex profesional para CSV que respeta comas dentro de comillas
            const columnas = filas[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

            if (columnas.length > 10) {
                // Función de limpieza interna para evitar errores de tipo
                const sanear = (val) => (val === undefined || val === null) ? "" : String(val).replace(/"/g, '').trim();

                const item = {
                    titulo: sanear(columnas) || "Sin título",
                    anio: sanear(columnas[7]) || "S/F",
                    codigo: sanear(columnas[8]) || "N/A",
                    disciplina: sanear(columnas[9]) || "General",
                    edificio: sanear(columnas[10]) || "No identificado",
                    localizacion: sanear(columnas[11]) || "No especificada",
                    resumen: sanear(columnas[12]) || "Sin resumen disponible",
                    soporte: sanear(columnas[13]) || "Papel"
                };

                acervoData.push(item);
                const index = acervoData.length - 1;

                // Creación segura de la fila mediante DOM (Evita bloqueos CSP)
                const tr = document.createElement('tr');
                
                tr.innerHTML = `
                    <td><code>${item.codigo}</code></td>
                    <td class="text-truncate">${item.titulo}</td>
                    <td>${item.edificio}</td>
                    <td>${item.anio}</td>
                    <td id="cell-btn-${index}"></td>
                `;

                // Crear botón de manera programática (No usa onclick en HTML)
                const btn = document.createElement('button');
                btn.textContent = "Ver Ficha";
                btn.className = "btn-ver";
                btn.addEventListener('click', () => mostrarFicha(index));
                
                tabla.appendChild(tr);
                document.getElementById(`cell-btn-${index}`).appendChild(btn);
            }
        }
    } catch (err) {
        console.error("Error CUC:", err);
        tabla.innerHTML = `<tr><td colspan="5" style="color:red; padding:20px;">Error de seguridad o acceso: ${err.message}</td></tr>`;
    }
}

function mostrarFicha(idx) {
    const d = acervoData[idx];
    const modal = document.getElementById('modalFicha');
    const contenido = document.getElementById('detalleContenido');

    contenido.innerHTML = `
        <h2 style="color:var(--blue-ucv)">Ficha Patrimonial ICU</h2>
        <div class="ficha-grid">
            <p><strong>Título:</strong> ${d.titulo}</p>
            <p><strong>Código Normalizado:</strong> <code>${d.codigo}</code></p>
            <p><strong>Edificio / Sector:</strong> ${d.edificio}</p>
            <p><strong>Año:</strong> ${d.anio}</p>
            <p><strong>Disciplina:</strong> ${d.disciplina}</p>
            <p><strong>Soporte Original:</strong> ${d.soporte}</p>
        </div>
        <div class="resumen-container">
            <p><strong>Resumen y Análisis Histórico:</strong></p>
            <p style="white-space: pre-wrap;">${d.resumen}</p>
        </div>
        <p><small><strong>Localización Física:</strong> ${d.localizacion}</small></p>
    `;
    modal.style.display = "block";
}

// Cerrar modal
const cerrarModal = () => document.getElementById('modalFicha').style.display = "none";
window.onclick = (e) => { if(e.target == document.getElementById('modalFicha')) cerrarModal(); };

// Buscador
document.getElementById('busqueda').addEventListener('keyup', (e) => {
    const val = e.target.value.toLowerCase();
    document.querySelectorAll('#cuerpo-tabla tr').forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(val) ? '' : 'none';
    });
});

// Inicio seguro
document.addEventListener('DOMContentLoaded', cargarRepositorio);
