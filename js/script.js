//  listen to mouse-down event from button fetch-quote
// fetch quote from api "https://api.kanye.rest/"
// display quote in div with id="output-fetched-quote"

async function listenToFetchBtn() {
  document
    .getElementById("fetch-quote")
    .addEventListener("mousedown", async (e) => {
      const fetchedQuote = await fetchNewQuote();
      console.log("🌻", fetchedQuote);
      fetchedQuote === null
        ? console.log("ooopsies, null")
        : displayNewlyFecthedQuote(fetchedQuote);
    });
}

const apiUrl = "https://api.kanye.rest/";

async function fetchNewQuote() {
  const response = await fetch(apiUrl);
  const newQuote = await response.json();
  console.log("🍉", newQuote?.quote);
  return newQuote?.quote;
}

function displayNewlyFecthedQuote(quoteToDisplay) {
  document.getElementById("output-fetched-quote").textContent = quoteToDisplay;
}

let listQuotesSaved = [];

function saveQuote(quoteToSave) {
  console.log("🎁", quoteToSave, listQuotesSaved);
  listQuotesSaved.push(quoteToSave);
}

function stagedQuote() {
  return document.getElementById("output-fetched-quote").textContent ?? null;
}

const domPointQuotesList = document.getElementById("saved-quotes-list");

function updateListQuotesInDOM(quotesToDisplay) {
  console.log("🚀", quotesToDisplay);
  // since we know there will not be many quotes to display, we clean and re-populate the list each time we update it, since not many nodes to play with so no perf issues
  domPointQuotesList.innerHTML = ``;
  quotesToDisplay.map((quote) => {
    const quoteElementToAppend = document.createElement("li");
    const quoteTextContent = document.createTextNode(quote);
    quoteElementToAppend.appendChild(quoteTextContent);
    console.log("🚀🚀", quoteElementToAppend);
    domPointQuotesList.append(quoteElementToAppend);
  });
}

const listenToBtnSaveQuote = () => {
  document.getElementById("save-quote").addEventListener("mousedown", (e) => {
    saveQuote(stagedQuote());
    updateListQuotesInDOM(listQuotesSaved);
  });
};

listenToFetchBtn();
listenToBtnSaveQuote();

// listen to mouse-down event from button save-quote
// save quote in local storage
// display quote in div with id="output-saved-quote"
