const fs = require('fs/promises');
const path = require('path');

async function processDirectory(dir) {
    let updatedFiles = 0;

    async function scan(currentDir) {
        let entries;
        try {
            entries = await fs.readdir(currentDir, { withFileTypes: true });
        } catch (e) {
            console.log(`Could not read dir: ${currentDir}`);
            return;
        }

        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);
            if (entry.isDirectory()) {
                await scan(fullPath);
            } else {
                const ext = path.extname(entry.name).toLowerCase();
                // Only process text files like ts, tsx, json, md, css
                if (['.ts', '.tsx', '.json', '.md', '.css', '.js', '.jsx'].includes(ext)) {
                    try {
                        let content = await fs.readFile(fullPath, 'utf8');
                        const originalContent = content;

                        // Replace matches like /images/... .jpg with .webp
                        // We use a regex that matches .jpg, .jpeg, .png
                        content = content.replace(/\.(jpg|jpeg|png)(\b|")/gi, (match, p1, p2) => {
                            // If it's a file path reference, replace it
                            return `.webp${p2}`;
                        });

                        if (content !== originalContent) {
                            await fs.writeFile(fullPath, content, 'utf8');
                            console.log(`Updated references in: ${fullPath}`);
                            updatedFiles++;
                        }
                    } catch (err) {
                        console.error(`Failed to process ${fullPath}:`, err.message);
                    }
                }
            }
        }
    }

    await scan(dir);
    return updatedFiles;
}

async function main() {
    console.log("Starting codebase reference update...");
    const srcDir = path.join(__dirname, '../src');
    const updatedSrc = await processDirectory(srcDir);
    console.log(`Codebase update complete. Updated ${updatedSrc} files in src/.`);
}

main().catch(console.error);
