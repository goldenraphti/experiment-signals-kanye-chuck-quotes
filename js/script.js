import { Signal } from "./signal-polyfill.js";
import { effect } from "./signal-effect.js";

const apiUrl = "https://api.kanye.rest/";

const domPointQuotesList = document.getElementById("saved-quotes-list");

const newFetchedQuote = new Signal.State("");
const listQuotesSaved = new Signal.State([]);
const amountQuotesSaved = new Signal.Computed(
  () => listQuotesSaved.get().length
);

async function listenToFetchBtn() {
  document
    .getElementById("fetch-quote")
    .addEventListener("mousedown", async (e) => {
      const fetchedQuote = await fetchNewQuote();
      console.log("🌻", fetchedQuote);
      fetchedQuote === null
        ? console.log("ooopsies, null")
        : newFetchedQuote.set(fetchedQuote);
    });
}

async function fetchNewQuote() {
  const response = await fetch(apiUrl);
  const newQuote = await response.json();
  return newQuote?.quote;
}

// effect to display new quotes when fetched
effect(
  () =>
    (document.getElementById("output-fetched-quote").textContent =
      newFetchedQuote.get())
);

// effect to display new saved quotes to list

effect(() => {
  updateListQuotesInDOM(listQuotesSaved.get());
  updateQuotesSavedAmount(amountQuotesSaved.get());
});

function updateListQuotesInDOM(quotesToDisplay) {
  console.log("🚀", quotesToDisplay);
  // since we know there will not be many quotes to display, we clean and re-populate the list each time we update it, since not many nodes to play with so no perf issues
  domPointQuotesList.innerHTML = ``;
  quotesToDisplay.map((quote) => {
    const quoteElementToAppend = document.createElement("li");
    const quoteTextContent = document.createTextNode(quote);
    quoteElementToAppend.appendChild(quoteTextContent);
    domPointQuotesList.append(quoteElementToAppend);
  });
}

function updateQuotesSavedAmount(amountQuotesSaved) {
  amountQuotesSaved === 0
    ? (document.getElementById("amount-quotes-saved").textContent = "")
    : (document.getElementById(
        "amount-quotes-saved"
      ).textContent = ` (${amountQuotesSaved})`);
}

const listenToBtnSaveQuote = () => {
  document.getElementById("save-quote").addEventListener("mousedown", (e) => {
    listQuotesSaved.set([...listQuotesSaved.get(), newFetchedQuote.get()]);
  });
};

listenToFetchBtn();
listenToBtnSaveQuote();
