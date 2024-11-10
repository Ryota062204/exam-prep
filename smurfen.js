const BASE_URL = "https://koene.cvoatweb.be/api/public/smurf-api/";
let allAlbums = [];
let currentPage = 1;
let currentTitle = "";
let currentYear = "";

document.addEventListener('DOMContentLoaded', loadAlbums);

document.querySelector('#all-albums').addEventListener('click', () => {
    currentPage = 1;
    loadAlbums();
});

document.querySelector('#apply-filter').addEventListener('click', () => {
    const titleInput = document.querySelector('#title-filter').value.trim();
    const yearInput = document.querySelector('#year-filter').value.trim();
    const selectedYear = document.querySelector('#year-dropdown').value;
    const selectedTitleNL = document.querySelector('#title-dropdown-nl').value;
    const selectedTitleFR = document.querySelector('#title-dropdown-fr').value;

    currentTitle = titleInput || selectedTitleNL || selectedTitleFR;
    currentYear = yearInput || selectedYear;
    currentPage = 1;
    displayAlbums();
});

document.querySelector('#next-albums').addEventListener('click', () => {
    currentPage++;
    displayAlbums();
});

document.querySelector('#prev-albums').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayAlbums();
    }
});

async function loadAlbums() {
    try {
        const response = await fetch(`${BASE_URL}albums`);
        const data = await response.json();

        if (data.length === 0) return;

        allAlbums = data;
        populateDropdowns();
        displayAlbums();

    } catch (error) {
        console.error("Error fetching albums:", error);
    }
}

function populateDropdowns() {
    const years = [];
    const titlesNL = [];
    const titlesFR = [];

    allAlbums.forEach(album => {
        if (!years.includes(album.year)) {
            years.push(album.year);
        }
        if (album.title && album.title.nl && !titlesNL.includes(album.title.nl)) {
            titlesNL.push(album.title.nl);
        }
        if (album.title && album.title.fr && !titlesFR.includes(album.title.fr)) {
            titlesFR.push(album.title.fr);
        }
    });

    years.sort((a, b) => a - b);
    titlesNL.sort();
    titlesFR.sort();

    const yearDropdown = document.querySelector('#year-dropdown');
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.innerText = year;
        yearDropdown.appendChild(option);
    });

    const titleDropdownNL = document.querySelector('#title-dropdown-nl');
    titlesNL.forEach(title => {
        const option = document.createElement('option');
        option.value = title;
        option.innerText = title;
        titleDropdownNL.appendChild(option);
    });

    const titleDropdownFR = document.querySelector('#title-dropdown-fr');
    titlesFR.forEach(title => {
        const option = document.createElement('option');
        option.value = title;
        option.innerText = title;
        titleDropdownFR.appendChild(option);
    });
}

function displayAlbums() {
    const albumsPerPage = 2;
    const startIndex = (currentPage - 1) * albumsPerPage;
    const endIndex = startIndex + albumsPerPage;

    const filteredAlbums = allAlbums.filter(album => {
        const matchesTitle = currentTitle === "" || 
                             (album.title && (album.title.nl === currentTitle || album.title.fr === currentTitle));
        const matchesYear = currentYear === "" || (album.year && album.year.toString() === currentYear);
        return matchesTitle && matchesYear;
    });

    filteredAlbums.sort((a, b) => a.album_id - b.album_id);

    const albumsToDisplay = filteredAlbums.slice(startIndex, endIndex);

    const albumsContainer = document.querySelector('.album-container');
    albumsContainer.innerHTML = '';

    if (albumsToDisplay.length === 0) {
        albumsContainer.innerHTML = '<p>No albums found matching the filter.</p>';
        return;
    }

    const template = document.querySelector('template');
    albumsToDisplay.forEach(album => {
        const albumClone = template.content.cloneNode(true);
        albumClone.querySelector('.album-id').innerText = `Album ID: ${album.album_id}`;
        albumClone.querySelector('.album-nl').innerText = `Title (NL): ${album.title.nl}`;
        albumClone.querySelector('.album-fr').innerText = `Title (FR): ${album.title.fr}`;
        albumClone.querySelector('.album-year').innerText = `Year: ${album.year}`;

        albumsContainer.appendChild(albumClone);
    });
}
