$(document).ready(function () {

    // 1. CARGA INICIAL
    cargarAlumnos();

    // 2. ABRIR MODAL PARA NUEVO REGISTRO
    $('#btnNuevo').on('click', function () {
        $('#formAlumno')[0].reset();
        $('#opcion').val('1'); 
        $('#id_alumno').val(''); 
        $('#modalTitulo').text('Registrar Nuevo Alumno');
        $('#password').attr('required', true); 
        $('#modalAlumno').fadeIn();
    });

    // 3. CERRAR MODAL
    $('.btn-cerrar-modal').on('click', function () {
        $('#modalAlumno').fadeOut();
    });

    // 4. ENVIAR FORMULARIO (CREAR Y EDITAR)
    $('#formAlumno').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: "php/crud_alumnos.php",
            type: "POST",
            dataType: "json",
            data: $(this).serialize(),
            success: function (respuesta) {
                if (respuesta.exito) {
                    $('#modalAlumno').fadeOut();
                    Swal.fire('¡Éxito!', respuesta.mensaje, 'success');
                    cargarAlumnos(); 
                } else {
                    Swal.fire('Error', respuesta.mensaje, 'error');
                }
            }
        });
    });

    // 5. ELIMINAR (Corregido con clase específica .btn-eliminar)
    $(document).on('click', '.btn-eliminar', function () {
        let fila = $(this).closest('tr');
        let idAlumno = fila.find('td:eq(0)').text();

        Swal.fire({
            title: '¿Eliminar Alumno?',
            text: "Se borrará de forma permanente.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "php/crud_alumnos.php",
                    type: "POST",
                    dataType: "json",
                    data: { opcion: 3, id_alumno: idAlumno },
                    success: function (respuesta) {
                        if (respuesta.exito) {
                            fila.fadeOut(400, function () { $(this).remove(); });
                            Swal.fire('Eliminado', respuesta.mensaje, 'success');
                        }
                    }
                });
            }
        });
    });

    // 6. EDITAR (Corregido con clase específica .btn-editar)
    $(document).on('click', '.btn-editar', function () {
        let fila = $(this).closest('tr');

        // Llenamos el formulario con los datos de la fila
        $('#id_alumno').val(fila.find('td:eq(0)').text());
        $('#nombres').val(fila.find('td:eq(1)').text());
        $('#apellidos').val(fila.find('td:eq(2)').text());
        $('#dni').val(fila.find('td:eq(3)').text());
        $('#fecha_nac').val(fila.find('td:eq(4)').text());
        $('#edad').val(fila.find('td:eq(5)').text());
        $('#genero').val(fila.find('td:eq(6)').text());
        $('#direccion').val(fila.find('td:eq(7)').text());
        $('#celular').val(fila.find('td:eq(8)').text());
        $('#correo').val(fila.find('td:eq(9)').text());
        $('#apoderado').val(fila.find('td:eq(10)').text());
        $('#cel_apoderado').val(fila.find('td:eq(11)').text());
        
        // Usamos el ID corregido del HTML (txt_username)
        $('#txt_username').val(fila.find('td:eq(12)').text());

        // Lógica para el badge del estado
        let estadoText = fila.find('td:eq(13) span').text().trim();
        if (estadoText === "Activo") $('#estado').val('A');
        else if (estadoText === "Inactivo") $('#estado').val('I');
        else $('#estado').val('P');

        $('#opcion').val('2'); 
        $('#modalTitulo').text('Editar Alumno');
        $('#password').removeAttr('required'); 
        $('#modalAlumno').fadeIn();
    });

    // 7. FUNCIÓN CARGAR TABLA
    function cargarAlumnos() {
        $.ajax({
            url: "php/crud_alumnos.php",
            type: "POST",
            dataType: "json",
            data: { opcion: 4 },
            success: function (data) {
                let tbody = $('#tablaAlumnos');
                tbody.empty();

                $.each(data, function (index, alumno) {
                    let eTexto = (alumno.ESTADO == 'A') ? 'Activo' : (alumno.ESTADO == 'I' ? 'Inactivo' : 'En proceso');
                    let eClase = (alumno.ESTADO == 'A') ? 'status-active' : (alumno.ESTADO == 'I' ? 'status-inactive' : 'status-pending');

                    let fila = `
                    <tr>
                        <td>${alumno.ID_ALUMNO}</td>
                        <td>${alumno.NOMBRES}</td>
                        <td>${alumno.APELLIDOS}</td>
                        <td>${alumno.DNI_ALUMNO}</td>
                        <td>${alumno.FECHA_NACIMIENTO}</td>
                        <td style="display:none">${alumno.EDAD}</td>
                        <td style="display:none">${alumno.GENERO}</td>
                        <td style="display:none">${alumno.DIRECCION}</td>
                        <td>${alumno.CELULAR}</td>
                        <td>${alumno.CORREO}</td>
                        <td style="display:none">${alumno.NOMBRE_APODERADO}</td>
                        <td style="display:none">${alumno.CELULAR_APODERADO}</td>
                        <td style="display:none">${alumno.USERNAME}</td>
                        <td><span class="status-badge ${eClase}">${eTexto}</span></td>
                        <td class="action-icons">
                            <i class="fa-solid fa-pen-to-square btn-editar"></i>
                            <i class="fa-solid fa-trash btn-eliminar"></i>
                        </td>
                    </tr>`;
                    tbody.append(fila);
                });
            }
        });
    }
});
// hcie un cambio de codigo completo 2