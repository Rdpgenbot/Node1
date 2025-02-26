const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
    const { q, r } = req.query;
    if (!q) {
        return res.status(400).json({ error: 'Missing "q" parameter' });
    }

    const LOGS_FILES = ['logs.txt', 'logs1.txt', 'logs2.txt', 'logs3.txt']; // তোমার যতগুলো ফাইল আছে

    let results = [];

    LOGS_FILES.forEach(file => {
        const filePath = path.join(process.cwd(), 'api', file); // Vercel-এর জন্য process.cwd() ব্যবহার
        try {
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath, 'utf8');
                const lines = data.split('\n').map(line => line.trim());
                const matched = lines.filter(line => line.toLowerCase().includes(q.toLowerCase()));
                results.push(...matched);
            }
        } catch (err) {
            console.log(`Error reading ${file}:`, err);
        }
    });

    if (r) {
        const limit = parseInt(r, 10);
        results = results.sort(() => Math.random() - 0.5).slice(0, limit);
    }

    res.status(200).json(results.map(line => ({ result: line })));
}
