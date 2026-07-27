let datosGlobales = [];

async function cargarDatos() {
    const cuerpoTabla = document.getElementById('cuerpo-tabla');
    try {
        const respuesta = await fetch('datos.csv');
        const data = await respuesta.text();
        const filas = data.split(/\r?\n/).filter(f => f.trim() !== "");
        
        cuerpoTabla.innerHTML = "";
        datosGlobales = [];

        for (let i = 1; i < filas.length; i++) {
            // Regex para manejar comas dentro de comillas de Notion
            const col = filas[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            if (col.length > 5) {
                const registro = {
                    titulo: col?.replace(/"/g, '') || "Sin título",
                    codigo: col[5]?.replace(/"/g, '') || "N/A",
                    anio: col[6]?.replace(/"/g, '') || "S/F",
                    edificio: col[7]?.replace(/"/g, '') || "No identificado",
                    disciplina: col[8]?.replace(/"/g, '') || "General",
                    resumen: col[9]?.replace(/"/g, '') || "Sin resumen",
                    localizacion: col[10]?.replace(/"/g, '') || "No especificada",
                    soporte: col[11]?.replace(/"/g, '') || "Papel"
                };
                datosGlobales.push(registro);
                
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><code>${registro.codigo}</code></td>
                    <td class="text-truncate">${registro.titulo}</td>
                    <td>${registro.edificio}</td>
                    <td>${registro.anio}</td>
                    <td><button class="btn-ver" onclick="verDetalle(${datosGlobales.length - 1})">Ver Ficha</button></td>
                `;
                cuerpoTabla.appendChild(tr);
            }
        }
    } catch (e) {
        cuerpoTabla.innerHTML = "<tr><td colspan='5'>Error cargando datos.csv</td></tr>";
    }
}

function verDetalle(index) {
    const r = datosGlobales[index];
    const contenedor = document.getElementById('detalleContenido');
    contenedor.innerHTML = `
        <h2 style="color:var(--blue-ucv)">Ficha Técnica del Documento</h2>
        <hr>
        <p><strong>Título:</strong> ${r.titulo}</p>
        <p><strong>Código Normalizado:</strong> <code>${r.codigo}</code></p>
        <div class="grid-ficha">
            <p><strong>Edificio/Sector:</strong> ${r.edificio}</p>
            <p><strong>Año:</strong> ${r.anio}</p>
            <p><strong>Disciplina:</strong> ${r.disciplina}</p>
            <p><strong>Soporte:</strong> ${r.soporte}</p>
        </div>
        <p><strong>Localización Física:</strong> ${r.localizacion}</p>
        <div class="resumen-box">
            <p><strong>Resumen / Análisis:</strong></p>
            <p>${r.resumen}</p>
        </div>
    `;
    document.getElementById('modalFicha').style.display = "block";
}

function cerrarModal() { document.getElementById('modalFicha').style.display = "none"; }

// Buscador
document.getElementById('busqueda').addEventListener('keyup', e => {
    const v = e.target.value.toLowerCase();
    document.querySelectorAll('#cuerpo-tabla tr').forEach(tr => {
        tr.style.display = tr.innerText.toLowerCase().includes(v) ? '' : 'none';
    });
});

window.onclick = e => { if(e.target == document.getElementById('modalFicha')) cerrarModal(); };
window.onload = cargarDatos;
