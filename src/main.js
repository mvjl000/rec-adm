const API_KEY = "444ea2bf";
const TABLE_NTH_CLASSNAME = "[&>*:nth-child(even)]:bg-zinc-50";

const searchInput = document.getElementById("searchInput");
const typeSelect = document.getElementById("typeSelect");
const resultsBody = document.getElementById("resultsBody");

let debounceTimer;
let isLoading = false;

searchInput.addEventListener("input", debounceSearch);
typeSelect.addEventListener("change", debounceSearch);

function debounceSearch() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(performSearch, 250);
}

async function performSearch() {
    const searchTerm = searchInput.value.trim();
    const type = typeSelect.value;

    if (searchTerm === "") {
        resultsBody.innerHTML =
            '<tr><td colspan="4" class="text-center py-4">Enter a search term</td></tr>';
        resultsBody.classList.remove(TABLE_NTH_CLASSNAME);
        return;
    }

    setLoading(true);

    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(
        searchTerm
    )}&type=${type}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === "True") {
            displayResults(data.Search);
        } else {
            resultsBody.innerHTML =
                '<tr><td colspan="4" class="text-center py-4">No results found</td></tr>';
            resultsBody.classList.remove(TABLE_NTH_CLASSNAME);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        resultsBody.innerHTML =
            '<tr><td colspan="4" class="text-center py-4">An error occurred while fetching data</td></tr>';
    } finally {
        setLoading(false);
    }
}

function displayResults(results) {
    resultsBody.innerHTML = "";
    resultsBody.classList.add(TABLE_NTH_CLASSNAME);

    results.forEach((item) => {
        const row = document.createElement("tr");
        row.className = "border-b border-gray-200";
        row.innerHTML = `
                    <td class="py-3 px-6 text-left whitespace-nowrap">${item.Title}</td>
                    <td class="py-3 px-6 text-left">${item.Year}</td>
                    <td class="py-3 px-6 text-left">N/A</td>
                    <td class="py-3 px-6 text-left">${item.Type}</td>
                `;
        resultsBody.appendChild(row);
    });
}

function setLoading(loading) {
    isLoading = loading;
    if (loading) {
        resultsBody.innerHTML =
            '<tr><td colspan="4" class="text-center py-4"><div class="w-7 h-7 border border-t-0 animate-spin border-black rounded-full mx-auto"></div></td></tr>';
    }
}
