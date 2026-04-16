$(document).ready(function () {

    // 1. CARGAR TABLA DINÁMICAMENTE
    function cargarMatriculas() {
        $.ajax({
            url: "php/crud_matricula.php",
            type: "POST",
            dataType: "json",
            data: { matri_opcion: 4 }, // Opción para listar
            success: function (data) {
                let tbody = $('#tablaMatriculasLista');
                tbody.empty();

                $.each(data, function (index, m) {
                    // IMPORTANTE: Los nombres (m.ID_MATRICULA, etc) deben ser IGUALES a tu SELECT en PHP
                    let fila = `
                    <tr>
                        <td>${m.ID_MATRICULA}</td>
                        <td>${m.NOMBRE_COMPLETO_ALUMNO}</td>
                        <td>${m.NOMBRE_DEL_CURSO}</td>
                        <td>${m.FECHA_INSCRIPCION}</td>
                        <td><span class="badge bg-success">${m.ESTADO_MATRICULA}</span></td>
                        <td class="action-icons">
                            <i class="fa-solid fa-pen-to-square" title="Editar"></i>
                            <i class="fa-solid fa-trash" title="Eliminar"></i>
                        </td>
                    </tr>
                    `;
                    tbody.append(fila);
                });
            },
            error: function(e) {
                console.log("Error al cargar datos:", e);
            }
        });
    }

    // Ejecutar carga inicial
    cargarMatriculas();

    // 2. ABRIR MODAL NUEVO
    $('#btnNuevaMatri').on('click', function () {
        $('#formMatriculaReal')[0].reset();
        $('#matri_id').val('');
        $('#matri_opcion').val('1');
        $('#modalMatriTitulo').text('Registrar Nueva Matrícula');
        $('#modalMatri').fadeIn();
    });

    // 3. CERRAR MODAL
    $('.btn-cerrar-modal-matri').on('click', function () {
        $('#modalMatri').fadeOut();
    });

    // 4. EDITAR (LLENAR MODAL)
    $(document).on('click', '.fa-pen-to-square', function () {
        let fila = $(this).closest('tr');

        // Sacamos los datos de las columnas de la tabla
        let id = fila.find('td:eq(0)').text();
        let alumno = fila.find('td:eq(1)').text();
        let curso = fila.find('td:eq(2)').text();
        let fecha = fila.find('td:eq(3)').text();
        let estado = fila.find('td:eq(4)').text();

        // Llenamos el formulario
        $('#matri_id').val(id);
        $('#matri_alumno').val(alumno);
        $('#matri_curso').val(curso);
        $('#matri_fecha').val(fecha);
        $('#matri_estado').val(estado);

        $('#matri_opcion').val('2'); 
        $('#modalMatriTitulo').text('Editar Matrícula');
        $('#modalMatri').fadeIn();
    });

    // 5. ENVIAR FORMULARIO (Guardar/Editar)
    $('#formMatriculaReal').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: "php/crud_matricula.php",
            type: "POST",
            dataType: "json",
            data: $(this).serialize(),
            success: function (respuesta) {
                if (respuesta.exito) {
                    $('#modalMatri').fadeOut();
                    Swal.fire('¡Listo!', respuesta.mensaje, 'success');
                    cargarMatriculas(); // Recarga la tabla
                } else {
                    Swal.fire('Error', respuesta.mensaje, 'error');
                }
            }
        });
    });

    // 6. ELIMINAR
    $(document).on('click', '.fa-trash', function () {
        let fila = $(this).closest('tr');
        let id = fila.find('td:eq(0)').text();

        Swal.fire({
            title: '¿Eliminar matrícula?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, borrar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "php/crud_matricula.php",
                    type: "POST",
                    dataType: "json",
                    data: { matri_opcion: 3, matri_id: id },
                    success: function (res) {
                        if (res.exito) {
                            fila.remove();
                            Swal.fire('Eliminado', res.mensaje, 'success');
                        }
                    }
                });
            }
        });
    });
});