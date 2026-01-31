const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const TEMPLATE_PATH = path.join(__dirname, '..', 'README.template.md');
const README_PATH = path.join(__dirname, '..', 'README.md');
const FALLBACK_QUOTE = {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
};

async function fetchQuote() {
    try {
        const response = await axios.get('https://api.api-ninjas.com/v2/quoteoftheday', {
            headers: {
                'X-Api-Key': process.env.API_NINJAS_KEY
            }
        });

        if (response.data && response.data[0].quote) {
            return {
                quote: response.data[0].quote,
                author: response.data[0].author
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
            .replace('{{QUOTE}}', quote.quote)
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
