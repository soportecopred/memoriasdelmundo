let acervoData = [];

async function cargarRepositorio() {
    const tabla = document.getElementById('cuerpo-tabla');
    try {
        const response = await fetch('datos.csv');
        const rawText = await response.text();
        const filas = rawText.split(/\r?\n/).filter(linea => linea.trim() !== "");
        
        tabla.innerHTML = "";
        acervoData = [];

        for (let i = 1; i < filas.length; i++) {
            const col = filas[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            if (col.length > 10) {
                const sanear = (val) => (val === undefined || val === null) ? "" : String(val).replace(/"/g, '').trim();
                const item = {
                    titulo: sanear(col),
                    anio: sanear(col[6]),
                    codigo: sanear(col[7]),
                    edificio: sanear(col[8]),
                    resumen: sanear(col[9])
                };
                acervoData.push(item);
                const idx = acervoData.length - 1;

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><code>${item.codigo}</code></td>
                    <td class="text-truncate">${item.titulo}</td>
                    <td>${item.edificio}</td>
                    <td>${item.anio}</td>
                    <td id="btn-container-${idx}"></td>
                `;
                
                const btn = document.createElement('button');
                btn.textContent = "Ver Ficha";
                btn.className = "btn-ver";
                btn.addEventListener('click', () => mostrarFicha(idx));
                
                tabla.appendChild(tr);
                document.getElementById(`btn-container-${idx}`).appendChild(btn);
            }
        }
    } catch (err) {
        tabla.innerHTML = "<tr><td colspan='5'>Error cargando datos.csv</td></tr>";
    }
}

function mostrarFicha(idx) {
    const d = acervoData[idx];
    const contenido = document.getElementById('detalleContenido');
    contenido.innerHTML = `
        <h2 style="color:var(--blue-ucv)">Ficha Patrimonial ICU</h2>
        <div class="ficha-grid">
            <p><strong>Título:</strong> ${d.titulo}</p>
            <p><strong>Código:</strong> <code>${d.codigo}</code></p>
            <p><strong>Edificio:</strong> ${d.edificio}</p>
            <p><strong>Año:</strong> ${d.anio}</p>
        </div>
        <div style="border-left: 4px solid var(--gold-ucv); padding-left: 20px; line-height: 1.8;">
            <p><strong>Análisis y Resumen:</strong></p>
            <p>${d.resumen}</p>
        </div>
    `;
    document.getElementById('modalFicha').style.display = "block";
}

document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('modalFicha').style.display = "none";
});

document.getElementById('busqueda').addEventListener('keyup', (e) => {
    const v = e.target.value.toLowerCase();
    document.querySelectorAll('#cuerpo-tabla tr').forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(v) ? '' : 'none';
    });
});
