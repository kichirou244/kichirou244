const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const TEMPLATE_PATH = path.join(__dirname, '..', 'README.template.md');
const README_PATH = path.join(__dirname, '..', 'README.md');
const FALLBACK_QUOTE = {
    content: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
};

async function fetchQuote() {
    try {
        const response = await axios.get('https://api.quotable.io/random?tags=technology|wisdom|inspiration');
        if (response.data && response.data.content) {
            return {
                content: response.data.content,
                author: response.data.author
            };
        }
        return FALLBACK_QUOTE;
    } catch (error) {
        console.error('Error fetching quote:', error.message);
        return FALLBACK_QUOTE;
    }
}

async function generateReadme() {
    try {
        const quote = await fetchQuote();
        const template = await fs.readFile(TEMPLATE_PATH, 'utf-8');

        const newContent = template
            .replace('{{QUOTE}}', quote.content)
            .replace('{{AUTHOR}}', quote.author)
            .replace('{{DATE}}', new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));

        await fs.writeFile(README_PATH, newContent);
        console.log('README.md updated successfully!');
    } catch (error) {
        console.error('Error generating README:', error);
        process.exit(1);
    }
}

generateReadme();
