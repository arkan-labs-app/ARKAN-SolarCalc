
const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

// Este script serve para exportação manual/backup do código-fonte.
console.log('Iniciando o empacotamento do código-fonte para backup...');

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
  console.log(`Empacotamento concluído! Total: ${archive.pointer()} bytes`);
  console.log(`Código-fonte salvo em: ${outputPath}`);
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

// Adiciona todos os arquivos da raiz do projeto, ignorando os desnecessários.
archive.glob('**/*', {
  cwd: path.join(__dirname, '..'), // O diretório de trabalho é a raiz do projeto
  ignore: [
    'node_modules/**',
    'dist/**',
    '.next/**',
    '.git/**',
    '*.zip'
  ]
});

archive.finalize();
