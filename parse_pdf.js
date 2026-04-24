const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('American_Oxford_3000.pdf');

pdf(dataBuffer).then(function(data) {
    const lines = data.text.split('\n');
    const wordList = [];
    const skippedLines = [];
    let idCounter = 1;

    // We'll use a more forgiving regex or just split the line
    // Previously: /^([a-zA-Z\-\s]+)\s+([a-z\.,\/ ]+?)\s+(A1|A2|B1|B2|C1|C2|Al)$/
    
    // Let's first log what lines are actually in the PDF that were skipped by the strict regex
    const strictRegex = /^([a-zA-Z\-\s]+)\s+([a-z\.,\/ ]+?)\s+(A1|A2|B1|B2|C1|C2|Al)$/;

    lines.forEach(line => {
        const cleanLine = line.trim();
        if (!cleanLine) return; // ignore completely empty lines

        let match = cleanLine.match(strictRegex);

        if (match) {
            let level = match[3];
            if (level === 'Al') level = 'A1';

            wordList.push({
                id: idCounter++,
                word: match[1].trim(),
                type: match[2].trim(),
                level: level
            });
        } else {
            // Try a less strict fallback: Capture Word (letters/hyphens/spaces), then whatever is in between, then anything at the end looking like A1-C2
            // For example: "ability n. A2"
            // Also let's just attempt to split by space if the last token is a level and the first is a word
            const tokens = cleanLine.split(/\s+/);
            const possibleLevel = tokens[tokens.length - 1];
            
            if (['A1','A2','B1','B2','C1','C2','Al'].includes(possibleLevel)) {
                let level = possibleLevel === 'Al' ? 'A1' : possibleLevel;
                let word = tokens[0];
                let type = tokens.slice(1, -1).join(' '); // everything in the middle
                
                wordList.push({
                    id: idCounter++,
                    word: word,
                    type: type,
                    level: level
                });
            } else {
                // If it really doesn't fit the "Word ... Level" pattern, we skip and log
                // Let's also check if it's just a word and type, or just a word
                // A lot of PDFs have page numbers or headers
                skippedLines.push(cleanLine);
            }
        }
    });

    fs.writeFileSync('words.json', JSON.stringify(wordList, null, 2), 'utf-8');
    fs.writeFileSync('skipped.log', skippedLines.join('\n'), 'utf-8');
    
    console.log(`İşlem tamamlandı. ${wordList.length} adet kelime words.json dosyasına yazıldı.`);
    console.log(`${skippedLines.length} satır atlandı ve 'skipped.log' dosyasına kaydedildi.`);
}).catch(function(error){
    console.error("Hata:", error);
});
