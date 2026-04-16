$(document).ready(function () /*apertura que permite usar la libreria jquery*/{
  $("#loginForm").submit(function (evento) {
    evento.preventDefault(); /*al hacer click en iniciar sesion evita que la pantalla parpadee */
    /*el evento es inventado*/
    /*preventdefault es una funcion definida que evita el parpadeo o recarga de pantalla*/

    //Capturamos los datos ingresados por el usuario en una variable //
    let usuario = $("#txtUsuario").val(); /*la variable adquiere el valor que se escriba en la caja del input usuario */
    let password = $("#txtPassword").val();/*la variable adquiere el valor que se escriba en la caja del input password */

    $.ajax({
      url: "php/login.php", //la ruta pal php//
      type: "POST", //envia informacion al login.php en  formato json que esta debajo de esta linea //
      dataType: "json",
      data: {
        user: usuario,
        pass: password,
      },
      beforeSend: function () { // //
        // 1. Mensaje de carga mientras PHP consulta la Base de Datos
        Swal.fire({
          title: "Validando credenciales...",
          html: "Por favor, espere un momento.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
      },
      success: function (respuesta) {
        if (respuesta.exito) {
          // 2. CASO DE ÉXITO: Animación verde
          sessionStorage.setItem("login", "ok");

          Swal.fire({
            icon: "success",
            title: "¡Acceso Concedido!",
            text: "Redirigiendo al sistema...",
            showConfirmButton: false,
            timer: 2000, // El popup se cierra solo en 2 segundos //cuando tiempo pasa al pasar de pagina//
          }).then(() => {
            // Esta redirección se ejecuta cuando el timer termina
            window.location.href = "dashboard2.html"; ////
          });
          
        } else {
          // 3. CASO DE ERROR: Animación roja (Credenciales inválidas)
          Swal.fire({
            icon: "error",
            title: "Acceso Denegado",
            text: "El usuario o la contraseña son incorrectos.",
            confirmButtonColor: "#d33", // Color rojo para el botón
          });
        }
      },
      error: function () {
        // 4. CASO DE ERROR CRÍTICO: Falla en el servidor o ruta
        Swal.fire({
          icon: "error",
          title: "¡Error de conexión!",
          text: "No se pudo conectar con el servidor.",
          confirmButtonColor: "#3085d6",
        });
      },
    });
  });
});