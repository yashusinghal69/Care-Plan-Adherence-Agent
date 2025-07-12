import fs from 'fs';
import path from 'path';

// Function to recursively find and replace localhost URLs in built files
function fixLocalhostUrls(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixLocalhostUrls(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.html')) {
      try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Replace localhost:3001 with relative paths
        if (content.includes('localhost:3001')) {
          content = content.replace(/http:\/\/localhost:3001\/api\//g, '/agents/patient-care-agent/api/');
          content = content.replace(/http:\/\/localhost:3001/g, '');
          modified = true;
          console.log(`Fixed localhost URLs in: ${filePath}`);
        }
        
        if (modified) {
          fs.writeFileSync(filePath, content, 'utf8');
        }
      } catch (error) {
        console.warn(`Could not process file ${filePath}:`, error.message);
      }
    }
  });
}

// Run the fix on the dist directory
const distDir = path.join(process.cwd(), 'dist');
if (fs.existsSync(distDir)) {
  console.log('Fixing localhost URLs in built files...');
  fixLocalhostUrls(distDir);
  console.log('Finished fixing localhost URLs.');
} else {
  console.log('Dist directory not found. Run build first.');
} 