const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '..', 'src', 'app', 'api');
const hiddenApiDir = path.join(__dirname, '..', 'src', 'app', '_api');

function build() {
    try {
        // 1. Hide API routes if they exist
        // 1. Hide API routes if they exist (REMOVED: We now need APIs for the dynamic server)
        /* 
        if (fs.existsSync(apiDir)) {
            console.log('Hiding API routes for static build...');
            fs.renameSync(apiDir, hiddenApiDir);
        } 
        */

        // 2. Run Next.js Build
        console.log('Running Next.js build...');
        execSync('next build', { stdio: 'inherit' });

    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    } finally {
        // 3. Restore API routes (Not needed if we didn't hide them, but keep check just in case of leftover)
        if (fs.existsSync(hiddenApiDir) && !fs.existsSync(apiDir)) {
            console.log('Restoring API routes (recovery)...');
            fs.renameSync(hiddenApiDir, apiDir);
        }
    }
}

build();
