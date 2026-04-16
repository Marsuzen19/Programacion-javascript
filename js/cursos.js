//agregue esto para que funcione en el dashboard.js//
let chartGenero = null;
let chartNiveles = null;

$(document).ready(function () {


    $.ajax({
        url: "php/ajax_usuario.php",
        type: "GET",
        success: function (response) {
            $("#username").html(response + ' <i class="fa-solid fa-chevron-down"></i>');
        },
        error: function () {
            console.log("Error al cargar usuario");
        }
    });


    // 1. ABRIR MODAL PARA NUEVO REGISTRO
    $('#btnNuevoCurso').on('click', function () {
        $('#formCurso')[0].reset();
        $('#opcion').val('1');
        $('#modalTitulo').text('Registrar Nuevo Curso');
        $('#modalCurso').fadeIn();
    });

    // 2. CERRAR MODAL
    $('.btn-cerrar-modal').on('click', function () {
        $('#modalCurso').fadeOut();
    });

    // 3. ENVIAR FORMULARIO
    $('#formCurso').submit(function (e) {
        e.preventDefault();

        $.ajax({
            url: "php/crud_cursos.php",
            type: "POST",
            dataType: "json",
            data: $(this).serialize(),

            success: function (respuesta) {

                if (respuesta.exito) {

                    $('#modalCurso').fadeOut();

                    Swal.fire('¡Éxito!', respuesta.mensaje, 'success')
                        .then(() => {
                            location.reload();
                        });

                } else {

                    Swal.fire('Error', respuesta.mensaje, 'error');

                }
            }
        });
    });





    // 4. ELIMINAR
    $(document).on('click', '.fa-trash', function () {

        let fila = $(this).closest('tr');
        let idCurso = fila.find('td:eq(0)').text();

        Swal.fire({
            title: '¿Eliminar Curso?',
            text: "Se borrará permanentemente de la Base de Datos.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        })
            .then((result) => {

                if (result.isConfirmed) {

                    $.ajax({
                        url: "php/crud_cursos.php",
                        type: "POST",
                        dataType: "json",
                        data: { opcion: 3, id_curso: idCurso },

                        success: function (respuesta) {

                            if (respuesta.exito) {

                                fila.fadeOut(400, function () {
                                    $(this).remove();
                                });

                                Swal.fire('Eliminado', respuesta.mensaje, 'success');
                            }
                        }
                    });
                }
            });
    });

    // 5. EDITAR
    $(document).on('click', '.fa-pen-to-square', function () {

        let fila = $(this).closest('tr');

        let id = fila.find('td:eq(0)').text();
        let nombre = fila.find('td:eq(1)').text();
        let descripcion = fila.find('td:eq(2)').text();
        let horas = fila.find('td:eq(3)').text();


        $('#id_curso').val(id);
        $('#nombre').val(nombre);
        $('#descripcion').val(descripcion);
        $('#horas').val(horas);


        $('#opcion').val('2');
        $('#modalTitulo').text('Editar Curso');

        $('#modalCurso').fadeIn();

    });

    // CARGAR TABLA
    function cargarCursos() {

        $.ajax({

            url: "php/crud_cursos.php",
            type: "POST",
            dataType: "json",
            data: { opcion: 4 },

            success: function (data) {

                let tbody = $('#tablaCursos');
                tbody.empty();

                $.each(data, function (index, curso) {

                    let fila = `
                    <tr>
                    <td>${curso.ID_CURSO}</td>
                    <td>${curso.NOMBRE}</td>
                    <td>${curso.DESCRIPCION}</td>
                    <td>${curso.HORAS_SEMANA}</td>

                    <td class="action-icons">
                    <i class="fa-solid fa-pen-to-square"></i>
                    <i class="fa-solid fa-trash"></i>
                    </td>

                    </tr>
                    `;

                    tbody.append(fila);

                });
            }
        });
    }

    cargarCursos();

});