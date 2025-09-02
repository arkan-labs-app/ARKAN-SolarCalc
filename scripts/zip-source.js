
const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

console.log('Starting to zip the project source...');

const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const outputPath = path.join(distDir, 'source.zip');
const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', function() {
  console.log(`Zipping complete! ${archive.pointer()} total bytes`);
  console.log(`Source code has been zipped to: ${outputPath}`);
});

archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    console.warn('Warning:', err);
  } else {
    throw err;
  }
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

// Add all files from the project root directory, except for ignored ones.
archive.glob('**/*', {
  cwd: path.join(__dirname, '..'), // Set current working directory to project root
  ignore: [
    'node_modules/**', // Ignore node_modules
    'dist/**',         // Ignore the output directory
    '.next/**',        // Ignore the Next.js build cache
    '.git/**',         // Ignore git directory
    '*.zip'            // Ignore zip files
  ]
});

archive.finalize();
