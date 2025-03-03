const searchInput = document.getElementById("search-input");
const resultsContainer = document.getElementById("search-results");
const resultsList = document.getElementById("search-result-child");
const siteLang = document.getElementById("site-lang");
let abortController = null; // Track the current AbortController

// Debounce function to limit API calls
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Handle search input
const handleSearch = debounce(async (query) => {
  clearResult(resultsList, resultsContainer);
  if (query.length > 0) {
    await performSearch(query);
    resultsContainer.classList.add("show");
  }
}, 300);

// Add event listeners
searchInput.addEventListener("keyup", (e) => {
  const query = e.target.value.trim();
  handleSearch(query);
});

document.addEventListener("click", (event) => {
  if (!searchInput.contains(event.target) && !resultsContainer.contains(event.target)) {
    resultsContainer.classList.remove("show");
  }
});

// Fetch data from a single collection
async function fetchCollection(collection, query) {
  try {
    // Abort any ongoing fetch requests
    if (abortController) {
      abortController.abort();
    }

    // Create a new AbortController instance
    abortController = new AbortController();
    const { signal } = abortController;

    const response = await fetch(
        `/api/collections/${collection}/entries?${new URLSearchParams({
            'filter[title:contains]': query,
            'filter[locale:is]': siteLang.value
        })}`,
        { signal }
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    if (error.name === "AbortError") {
      console.log(`Fetch for ${collection} aborted.`);
    } else {
      console.error(`Error fetching ${collection}:`, error);
    }
    return [];
  }
}

// Perform search across all collections
async function performSearch(query) {
//   const collections = ["experience", "place", "pages"];
  try {
    // Fetch all collections in parallel
    // const experienceResults = await fetchCollection("experience", query);
    const newsResults = await fetchCollection("news", query);
    const pagesResults = await fetchCollection("pages", query);

    // Combine results
    const allResults = [/*...experienceResults,*/ ...newsResults, ...pagesResults];

    // Display results
    displayResults(allResults);

    // Show container if there are results
    if (allResults.length > 0) {
      resultsContainer.classList.add("show");
    }

    // Combine all results
    // const allResults = results.flat();
    // displayResults(allResults);
  } catch (error) {
    console.error("Search error:", error);
    resultsList.innerHTML = siteLang.value == "arabic" ? "<p>حدث خطأ أثناء البحث.</p>" : "An error occurred during the search.";

  }
}

// Display search results
function displayResults(results) {
  resultsList.innerHTML = "";
  console.log(results);

  if (results.length === 0) {
    resultsList.innerHTML = siteLang.value == "arabic" ? "<p>لا توجد نتائج مطابقة.</p>" : "No matching results.";
    return;
  }

  const fragment = document.createDocumentFragment();

  results.forEach((item) => {
    const resultItem = document.createElement("li");
    resultItem.innerHTML = `
      <a href="${item.url}" target="_self">
        <h3>${item.title}</h3>
      </a>
    `;
    fragment.appendChild(resultItem);
  });

  resultsList.appendChild(fragment);
}

function clearResult(resultsList, resultsContainer) {
  resultsContainer.classList.remove("show");
  resultsList.innerHTML = "";
}
