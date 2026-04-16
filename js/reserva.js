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


    // 1. ABRIR MODAL
    $('#btnNuevaReserva').on('click', function () {
        $('#formReserva')[0].reset();
        $('#opcion').val('1');
        $('#modalTitulo').text('Registrar Nueva Reserva');
        $('#modalReserva').fadeIn();
    });

    // 2. CERRAR MODAL
    $('.btn-cerrar-modal').on('click', function () {
        $('#modalReserva').fadeOut();
    });

    // 3. ENVIAR FORMULARIO
    $('#formReserva').submit(function (e) {
        e.preventDefault();

        $.ajax({
            url: "php/crud_reserva.php",
            type: "POST",
            dataType: "json",
            data: $(this).serialize(),

            success: function (respuesta) {

                if (respuesta.exito) {

                    $('#modalReserva').fadeOut();

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
        let idReserva = fila.find('td:eq(0)').text();

        Swal.fire({
            title: '¿Eliminar Reserva?',
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
                        url: "php/crud_reserva.php",
                        type: "POST",
                        dataType: "json",
                        data: { opcion: 3, id_reserva: idReserva },

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
        let id_alumno = fila.find('td:eq(1)').text();
        let id_aula = fila.find('td:eq(2)').text();
        let codigo_pago = fila.find('td:eq(3)').text();
        let estado_pago = fila.find('td:eq(5) span').text(); // ✅ CORREGIDO


        $('#id_reserva').val(id);
        $('#id_alumno').val(id_alumno);
        $('#id_aula').val(id_aula);
        $('#codigo_pago').val(codigo_pago);
        $('#estado_pago').val(estado_pago);


        $('#opcion').val('2');
        $('#modalTitulo').text('Editar Reserva');

        $('#modalReserva').fadeIn();

    });



    // CARGAR TABLA
    function cargarReservas() {

        $.ajax({

            url: "php/crud_reserva.php",
            type: "POST",
            dataType: "json",
            data: { opcion: 4 },

            success: function (data) {

                let tbody = $('#tablaReservas');
                tbody.empty();

                $.each(data, function (index, reserva) {

                    let estadoTexto = '';
                    let estadoClase = '';

                    if (reserva.ESTADO_PAGO == 'PAGADO') {
                        estadoTexto = 'Pagado';
                        estadoClase = 'status-active';
                    }
                    else if (reserva.ESTADO_PAGO == 'PENDIENTE') {
                        estadoTexto = 'Pendiente';
                        estadoClase = 'status-pending';
                    }
                    else {
                        estadoTexto = 'Cancelado';
                        estadoClase = 'status-inactive';
                    }

                    let fila = `
                    <tr>
                    <td>${reserva.ID_RESERVA}</td>
                    <td>${reserva.ID_ALUMNO}</td>
                    <td>${reserva.ID_AULA}</td>
                    <td>${reserva.CODIGO_PAGO}</td>
                    <td>${reserva.FECHA_RESERVA}</td>

                    <td>
                    <span class="status-badge ${estadoClase}">
                    ${estadoTexto}
                    </span>
                    </td>

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

    cargarReservas();

});