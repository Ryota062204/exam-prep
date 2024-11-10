const BASE_URL = "https://koene.cvoatweb.be/api/public/";
let allQuotes = [];
let currentPage = 1;
let currentAuthor = "";
let currentGenre = "";

document.addEventListener('DOMContentLoaded', loadQuotes);

document.querySelector('#all-quotes').addEventListener('click', () => {
    currentPage = 1;
    currentAuthor = "";
    currentGenre = "";
    displayQuotes();
});

document.querySelector('#apply-filter').addEventListener('click', () => {
    const authorInput = document.querySelector('#author-filter').value.trim()
    const genreInput = document.querySelector('#genre-filter').value.trim();
    const selectedAuthor = document.querySelector('#author-dropdown').value;
    const selectedGenre = document.querySelector('#genre-dropdown').value;

    currentAuthor = authorInput || selectedAuthor;
    currentGenre = genreInput || selectedGenre;
    currentPage = 1;
    displayQuotes();
});

document.querySelector('#next-quotes').addEventListener('click', () => {
    currentPage++;
    displayQuotes();
});

document.querySelector('#prev-quotes').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayQuotes();
    }
});

async function loadQuotes() {
    try {
        const response = await fetch(`${BASE_URL}quotes`);
        const data = await response.json();

        if (data.length === 0) return;

        allQuotes = data;
        populateDropdowns();
        displayQuotes();

    } catch (error) {
        console.error("Error fetching quotes:", error);
    }
}

function populateDropdowns() {
    const authors = new Set();
    const genres = new Set();

    allQuotes.forEach(quote => {
        if (quote.author) authors.add(quote.author);
        if (quote.genre) genres.add(quote.genre);
    });

    const authorDropdown = document.querySelector('#author-dropdown');
    authors.forEach(author => {
        const option = document.createElement('option');
        option.value = author;
        option.innerText = author;
        authorDropdown.appendChild(option);
    });

    const genreDropdown = document.querySelector('#genre-dropdown');
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.innerText = genre;
        genreDropdown.appendChild(option);
    });
}

function displayQuotes() {
    const quotesPerPage = 2;
    const startIndex = (currentPage - 1) * quotesPerPage;
    const endIndex = startIndex + quotesPerPage;

    const filteredQuotes = allQuotes.filter(quote => {
        const matchesAuthor = currentAuthor === "" || (quote.author && quote.author.toLowerCase() === currentAuthor.toLowerCase());
        const matchesGenre = currentGenre === "" || (quote.genre && quote.genre.toLowerCase() === currentGenre.toLowerCase());
        return matchesAuthor && matchesGenre;
    });

    const quotesToDisplay = filteredQuotes.slice(startIndex, endIndex);
    const quoteContainer = document.querySelector('.quote-container');
    quoteContainer.innerHTML = '';

    if (quotesToDisplay.length === 0) {
        quoteContainer.innerHTML = '<p>No quotes found matching the filter.</p>';
        return;
    }

    const template = document.querySelector('template');
    quotesToDisplay.forEach(quote => {
        const quoteClone = template.content.cloneNode(true);
        quoteClone.querySelector('.quote-text').innerText = `"${quote.quote}"`;
        quoteClone.querySelector('.quote-author').innerText = `- ${quote.author}`;
        quoteClone.querySelector('.quote-genre').innerText = `Genre: ${quote.genre}`;

        quoteContainer.appendChild(quoteClone);
    });
}

