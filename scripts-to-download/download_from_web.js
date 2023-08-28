// Get all the .ts filenames from the Network tab
const URL_BASE = 'https://embed-cloudfront.wistia.com/deliveries/485b718fc1ed7bc31a54b57c9db4a20c16910112.m3u8/'

// Limit of files to generate
const LIMIT = 53;

// Generate the list of file names
let cachedFiles = [];
for (let i = 1; i <= LIMIT; i++) {
    cachedFiles.push(`${URL_BASE}seg-${i}-v1-a1.ts`);
}

// Function to force the download of a file
function forceDownload(url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = url.split('/').pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Initialize delay at 0 milliseconds
let delay = 0;

// Download all files with a delay between each one
cachedFiles.forEach((url) => {
  setTimeout(() => forceDownload(url), delay);
  delay += 500;
});