// Obtener todos los nombres de archivo .ts desde la pestaña Network
const URL_BASE = 'https://embed-cloudfront.wistia.com/deliveries/485b718fc1ed7bc31a54b57c9db4a20c16910112.m3u8/'

// Límite de archivos a generar
const LIMIT = 53;

// Generar la lista de nombres de archivos
let cachedFiles = [];
for (let i = 1; i <= LIMIT; i++) {
    cachedFiles.push(`${URL_BASE}seg-${i}-v1-a1.ts`);
}

// Función para forzar la descarga de un archivo
function forceDownload(url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = url.split('/').pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Inicializar retraso en 0 milisegundos
let delay = 0;

// Descargar todos los archivos con un retraso entre cada uno
cachedFiles.forEach((url) => {
  setTimeout(() => forceDownload(url), delay);
  delay += 500;
});