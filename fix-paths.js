const fs = require('fs');
const path = require('path');

function fixPaths(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixPaths(filePath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Replace absolute paths with relative paths
      content = content.replace(/href="\/_next\//g, 'href="./_next/');
      content = content.replace(/src="\/_next\//g, 'src="./_next/');
      content = content.replace(/href="\/"/g, 'href="./"');
      
      fs.writeFileSync(filePath, content);
      console.log(`Fixed paths in ${filePath}`);
    }
  });
}

// Fix paths in the out directory
const outDir = path.join(__dirname, 'out');
if (fs.existsSync(outDir)) {
  fixPaths(outDir);
  console.log('Path fixing complete!');
} else {
  console.log('Out directory not found. Run npm run build first.');
}