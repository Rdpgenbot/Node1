const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const PORT = 8080;
const LOGS_DIR = '.'; // Current directory where logs files are stored
const LOGS_FILES = ['logs.txt', 'logs1.txt', 'logs2.txt', 'logs3.txt']; // List of log files to search

// Function to search all log files
function searchLogs(query, limit) {
    const results = [];

    LOGS_FILES.forEach(fileName => {
        const filePath = path.join(LOGS_DIR, fileName);
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            const lines = data.split('\n').map(line => line.trim()); // Remove \r
            const matchedLines = lines.filter(line => line.toLowerCase().includes(query.toLowerCase()));

            results.push(...matchedLines); // Add matched lines to results
        } catch (err) {
            console.log(`Error reading file ${fileName}:`, err);
        }
    });

    if (limit > 0) {
        results.sort(() => Math.random() - 0.5); // Randomize order
        return results.slice(0, limit);
    }
    return results;
}

// Create HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query.q;
    const randomLimit = parseInt(parsedUrl.query.r) || 0;

    if (!query) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing "q" parameter' }));
        return;
    }

    const results = searchLogs(query, randomLimit).map(line => ({ result: line }));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(results, null, 4)); // Pretty JSON output
});

// Start server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});