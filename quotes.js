const BASE_URL = "https://koene.cvoatweb.be/api/public/";
let allQuotes = [];
let currentPage = 1;
let currentAuthor = "";
let currentGenre = "";

document.querySelector('#all-quotes').addEventListener('click', () => {
    currentPage = 1;
    loadAlbums();
});

document.querySelector('#apply-filter').addEventListener('click', () => {
    const authorInput = document.querySelector('#author-filter').value.trim();
    const genreInput = document.querySelector('#genre-filter').value.trim();

    currentAuthor = authorInput.toLowerCase();
    currentGenre = genreInput.toLowerCase();
    currentPage = 1;
    loadAlbums();
});

document.querySelector('#next-quotes').addEventListener('click', () => {
    currentPage++;
    displayAlbums();
});

document.querySelector('#prev-quotes').addEventListener('click', () => {
    currentPage--;
    displayAlbums();
});

async function loadAlbums() {
    try {
        const response = await fetch(`${BASE_URL}quotes`);
        const data = await response.json();

        if (data.length === 0) return;

        allQuotes = data;  
        displayAlbums();   

    } catch (error) {
        console.error("Error fetching quotes:", error);
    }
}

function displayAlbums() {
    const quotesPerPage = 10;
    const startIndex = (currentPage - 1) * quotesPerPage;
    const endIndex = startIndex + quotesPerPage;

    const filteredQuotes = allQuotes.filter(quote => {
        const matchesAuthor = currentAuthor === "" || (quote.author && quote.author.toLowerCase().includes(currentAuthor));
        const matchesGenre = currentGenre === "" || (quote.genre && quote.genre.toLowerCase().includes(currentGenre));
        return matchesAuthor && matchesGenre;
    });

    const quotesToDisplay = filteredQuotes.slice(startIndex, endIndex);

    const quoteContainer = document.querySelector('.quote-container');
    quoteContainer.innerHTML = '';  // Clear previous quotes

    const template = document.querySelector('template');
    quotesToDisplay.forEach(quote => {
        const quoteClone = template.content.cloneNode(true);
        quoteClone.querySelector('.quote-text').textContent = quote.text || quote.quote || "Quote not found";
        quoteClone.querySelector('.quote-author').textContent = quote.author || "Unknown";
        quoteClone.querySelector('.quote-genre').textContent = quote.genre || "Unknown";

        quoteContainer.appendChild(quoteClone);
    });

    document.querySelector('#prev-quotes').disabled = currentPage === 1;
    document.querySelector('#next-quotes').disabled = endIndex >= filteredQuotes.length;
}
