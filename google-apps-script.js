/**
 * GOOGLE APPS SCRIPT: Conector de Formulario de Contacto a Google Sheets
 * 
 * INSTRUCCIONES DE CONFIGURACIÓN:
 * 1. Crea una hoja de cálculo en Google Sheets.
 * 2. En la primera fila (Fila 1), escribe los siguientes encabezados en las columnas A, B, C, D, E:
 *    A1: timestamp | B1: name | C1: email | D1: subject | E1: message
 * 3. En el menú superior, ve a "Extensiones" -> "Apps Script".
 * 4. Borra el código por defecto y pega todo este script.
 * 5. Haz clic en "Guardar" (icono de disquete).
 * 6. Haz clic en el botón "Implementar" (arriba a la derecha) -> "Nueva implementación".
 * 7. Selecciona el tipo de implementación haciendo clic en el engranaje: "Aplicación web".
 * 8. Configura los parámetros:
 *    - Descripción: Conector Formulario Portafolio
 *    - Ejecutar como: Tú (tu correo de Google)
 *    - Quién tiene acceso: Cualquier persona (Anyone) -> IMPORTANTE: Debe ser "Cualquier persona" para que el sitio web pueda enviar datos sin iniciar sesión.
 * 9. Haz clic en "Implementar" y autoriza los permisos necesarios.
 * 10. Copia la "URL de la aplicación web" generada (termina en /exec) y pégala en el atributo 'action' del formulario en tu 'index.html'.
 */

function doPost(e) {
  try {
    // 1. Obtener la hoja de cálculo por su URL específica
    var sheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1RiLtpzlXVW2aKZW0SMEqXiZt-0rNWIs1HsEzahbbszk/edit").getActiveSheet();
    
    // 2. Extraer los datos del cuerpo de la petición (POST request)
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        // Si no es un JSON válido, intentar leer parámetros normales (urlencoded o query params)
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }
    
    // 3. Organizar los datos conforme a los encabezados requeridos
    var timestamp = data.timestamp || Utilities.formatDate(new Date(), "America/Managua", "dd/MM/yyyy HH:mm:ss");
    var name = data.name || "N/A";
    var email = data.email || "N/A";
    var subject = data.subject || "N/A";
    var message = data.message || "N/A";
    
    // 4. Agregar la nueva fila a la hoja de cálculo
    sheet.appendRow([timestamp, name, email, subject, message]);
    
    // 5. Devolver una respuesta exitosa
    return ContentService.createTextOutput(JSON.stringify({
      "result": "success",
      "message": "Datos guardados correctamente."
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // En caso de error, retornar el mensaje del fallo para depuración
    return ContentService.createTextOutput(JSON.stringify({
      "result": "error",
      "error": error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}
