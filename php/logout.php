<?php
session_start(); // Entra a la sesión actual
session_unset(); // Vacía las variables
session_destroy(); // Destruye la sesión por completo

// Ahora que ya no hay rastro regresa al login
header("Location: ../login.html");
exit();
?>