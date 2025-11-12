const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Resources', 'words.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading the file:", err);
        return;
    }

    const words = data.split(/\s+/);
    const cleanedWords = words
        .map(word => word.replace(/[^a-zA-Z]/g, ''))
        .filter(word => word.length >= 5 && word.length <= 7);

    const newContent = cleanedWords.join('\n');

    fs.writeFile(filePath, newContent, 'utf8', (err) => {
        if (err) {
            console.error("Error writing to the file:", err);
            return;
        }
        console.log("The file has been cleaned and updated successfully.");
    });
});
