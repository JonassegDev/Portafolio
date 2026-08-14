const url = 'https://script.google.com/macros/s/AKfycbz8A3ueD9rdL8mtAQ820QPUs833du5NXZyX0MOrMdkNJUHP8nZMILRFlGf_hfHnS1hx/exec';

// Simulating browser's FormData submission as x-www-form-urlencoded
const data = new URLSearchParams({
  timestamp: new Date().toISOString(),
  name: 'Kevin Form URL-Encoded Test',
  email: 'kevin.urlencoded@example.com',
  subject: 'Prueba de Enlace Funcional',
  message: 'Hola Kevin, esta prueba confirma que los datos URL-encoded llegan perfectamente a las columnas.'
});

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: data.toString()
})
.then(res => res.json())
.then(json => {
  console.log('Respuesta del Servidor:', JSON.stringify(json, null, 2));
})
.catch(err => {
  console.error('Error al conectar:', err);
});
