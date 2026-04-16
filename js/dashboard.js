// 1. DECLARAR VARIABLES PARA GRÁFICOS (Importante: fuera del ready)
let chartGenero = null;
let chartNiveles = null;
// puede ser error esto
$(document).ready(function () {

    // --- CARGA INICIAL ---
    cargarDatosDashboard(); 
    cargarAlumnos();       

    /* ========================================================
       1. NAVEGACIÓN (Corregida para ser más robusta)
       ======================================================== */
    $('.sidebar-nav li').on('click', function (e) {
        // Si hay un enlace <a>, evitamos que recargue la página
        // e.preventDefault(); 

        $('.sidebar-nav li').removeClass('active');
        $(this).addClass('active');

        // Seleccionamos el texto ignorando espacios
        let menuTexto = $(this).find('a').text().trim(); 

        $('#moduloDashboard, #moduloEstudiantes, #moduloCursos, #moduloPagos').hide();

        if (menuTexto === 'Dashboard') {
            $('#moduloDashboard').fadeIn();
            cargarDatosDashboard();
        } 
        else if (menuTexto === 'Estudiantes') {
            $('#moduloEstudiantes').fadeIn();
            cargarAlumnos();
        } 
        // Agrega aquí los otros módulos si los tienes creados
    });

    $(document).on("submit", "#formAlumno", function (e) {
    e.preventDefault(); // Detenemos la recarga de la página

    // Capturamos todos los datos del formulario
    const datos = $(this).serialize();

    $.ajax({
        url: "php/crud_alumnos.php", // Tu archivo que procesa el INSERT/UPDATE
        type: "POST",
        dataType: "json",
        data: datos,
        success: function (respuesta) {
            // Asumiendo que tu PHP devuelve un objeto con { exito: true }
            if (respuesta.exito) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Logrado!',
                    text: 'El alumno se guardó correctamente',
                    timer: 2000
                });

                $('#modalAlumno').fadeOut(); // Cerramos el modal
                cargarAlumnos(); // Refrescamos la tabla automáticamente
                cargarDatosDashboard(); // Refrescamos los KPIs y gráficos
            } else {
                Swal.fire('Error', 'No se pudo guardar: ' + respuesta.mensaje, 'error');
            }
        },
        error: function (xhr, status, error) {
            console.error("Error en AJAX:", error);
            Swal.fire('Error Crítico', 'Hubo un problema con el servidor', 'error');
        }
    });
});

    /* ========================================================
       2. AJAX (Corregido IDs para que coincidan con HTML)
       ======================================================== */


    function cargarDatosDashboard() {
        $.ajax({
            url: "php/dashboard_datos.php",
            type: "GET",
            dataType: "json",
            success: function (respuesta) {
                if (respuesta.exito) {
                    const graf = respuesta.datos.graficos;
                    
                    // Gráfico Género
                    let etiquetasG = graf.genero.map(item => item.GENERO);
                    let valoresG = graf.genero.map(item => item.cantidad);
                    dibujarGraficoGenero(etiquetasG, valoresG);

                    // Gráfico Niveles
                    let etiquetasN = graf.niveles.map(item => item.NIVEL);
                    let totalesN = graf.niveles.map(item => item.totales);
                    let dispN = graf.niveles.map(item => item.disponibles);
                    dibujarGraficoNiveles(etiquetasN, totalesN, dispN);

                    // ACTUALIZAR KPIs (Asegúrate que estos IDs existan en tu HTML)
                    $("#kpi-total-alumnos").text(respuesta.datos.kpis.totalAlumnos);
                    $("#kpi-aulas-activas").text(respuesta.datos.kpis.totalAulas);
                    $("#kpi-vacantes-disponibles").text(respuesta.datos.kpis.vacantesDisp);
                }
            },
            error: function(err) {
                console.error("Error al cargar datos del dashboard", err);
            }
        });
    }

    

    function cargarAlumnos() {
        $.ajax({
            url: "php/crud_alumnos.php",
            type: "POST",
            dataType: "json",
            data: { opcion: 4 },
            success: function (data) {
                let tbody = $('#tablaAlumnos');
                tbody.empty();
                $.each(data, function (i, alumno) {
                    let clase = alumno.ESTADO == 'A' ? 'status-active' : (alumno.ESTADO == 'I' ? 'status-inactive' : 'status-pending');
                    let texto = alumno.ESTADO == 'A' ? 'Activo' : (alumno.ESTADO == 'I' ? 'Inactivo' : 'Pendiente');
                    
                    tbody.append(`<tr>
                        <td>${alumno.ID_ALUMNO}</td>
                        <td>${alumno.NOMBRES}</td>
                        <td>${alumno.APELLIDOS}</td>
                        <td>${alumno.DNI_ALUMNO}</td>
                        <td>${alumno.FECHA_NAC}</td>
                        <td>${alumno.CELULAR}</td>
                        <td>${alumno.CORREO}</td>
                        <td><span class="status-badge ${clase}">${texto}</span></td>
                        <td class="action-icons">
                            <i class="fa-solid fa-pen-to-square btn-editar" data-id="${alumno.ID_ALUMNO}"></i>
                            <i class="fa-solid fa-trash btn-eliminar" data-id="${alumno.ID_ALUMNO}"></i>
                        </td>
                    </tr>`);
                });
            }
        });
    }

    // MODALES
    $('#btnNuevo').on('click', () => {
        $('#formAlumno')[0].reset(); // Limpiar formulario
        $('#modalTitulo').text('Registrar Nuevo Alumno');
        $('#modalAlumno').fadeIn();
    });

    $('.btn-cerrar-modal').on('click', () => $('.modal-overlay').fadeOut());

}); // FIN READY

/* ========================================================
   3. GRÁFICOS (Fuera del Ready, corregido el .destroy())
   ======================================================== */
function dibujarGraficoGenero(etiquetas, datos) {
    let ctx = document.getElementById('graficoGenero');
    if (!ctx) return; // Si no existe el canvas, no hacer nada

    if (chartGenero) {
        chartGenero.destroy();
    }

    chartGenero = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: etiquetas,
            datasets: [{
                data: datos,
                backgroundColor: ['#3498DB', '#E74C3C', '#F1C40F'],
                borderWidth: 2
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function dibujarGraficoNiveles(etiquetas, totales, disponibles) {
    let ctx = document.getElementById('graficoNiveles');
    if (!ctx) return;

    if (chartNiveles) {
        chartNiveles.destroy();
    }

    chartNiveles = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [
                { label: 'Totales', data: totales, backgroundColor: '#95A5A6' },
                { label: 'Disponibles', data: disponibles, backgroundColor: '#2ECC71' }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}