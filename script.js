
const STORAGE_KEY = "savedNovels";
const searchResults = new Map();

document.getElementById("search-button").addEventListener('click',function(){
const inputValue=document.getElementById("search-input").value.trim();
discoverBooks(inputValue);

});
document.getElementById("search-input").addEventListener('keypress',function(event){
if(event.key ==="Enter"){
    const inputValue=document.getElementById("search-input").value.trim();
    discoverBooks(inputValue);
}
});
//save book button
document.getElementById("books-container").addEventListener("click",function(event){

 const button = event.target.closest(".save-button");

    if (!button || button.disabled) {
        return;
    }

    const novel = searchResults.get(button.dataset.id);

    if (!novel) {
        return;
    }

    saveNovel(novel);

    button.textContent = "Saved";
    button.disabled = true;



});
//delete button
document.getElementById("saved-container").addEventListener("click", function(event) {

    const button = event.target.closest(".delete-button");

    if (!button) {
        return;
    }

    deleteNovel(button.dataset.id);
});

renderSavedNovels();

function discoverBooks(inputValue){

     const apiKey = "AIzaSyAwvmOW7BOcaXWgABvGA8i6ZdplhQl4Pn8";

    fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(inputValue)}&maxResults=16&printType=books&key=${apiKey}`)
.then(response=>response.json())

 .then(data => {

        if (data.items && data.items.length > 0) {
            displayBooks(data.items);
        } else {
            document.getElementById("books-container").innerHTML =
                '<p class="empty-message">No books found</p>';
        }

    })
.catch(error=>{
    console.log('error fetching data',error);
});
}
function displayBooks(books){
const container=document.getElementById('books-container');

container.innerHTML="";
searchResults.clear();

books.slice(0,16).forEach(book => {
const bookDiv=document.createElement('div');
bookDiv.className="book";
const title = book.volumeInfo.title || "Unknown Title";

        const authors = book.volumeInfo.authors
            ? book.volumeInfo.authors.join(", ")
            : "Unknown Author";

        const coverUrl = book.volumeInfo.imageLinks
            ? book.volumeInfo.imageLinks.thumbnail.replace("http://", "https://")
            : "https://placehold.co/150x200?text=No+Cover";

const saleStatus = book.saleInfo?.saleability;

        let availability;

        if (saleStatus === "FREE") {
            availability = "Free";
        } else if (saleStatus === "FOR_SALE") {
            availability = "Paid";
        } else {
            availability = "Preview / Not for sale";
        }
        const pdfLink = book.accessInfo?.pdf?.acsTokenLink;
        const previewLink = book.volumeInfo.previewLink;
        const readLink = safeUrl(pdfLink || previewLink);

        const novel = {
            id: book.id || `${title}-${authors}`,
            title,
            authors,
            coverUrl: safeUrl(coverUrl) || "https://placehold.co/150x200?text=No+Cover",
            availability,
            readLink
        };
searchResults.set(novel.id,novel);
const alreadySaved=isNovelSaved(novel.id);
bookDiv.innerHTML = `

            <img src="${escapeHtml(novel.coverUrl)}"
                 alt="${escapeHtml(title)}">

            <h3>${escapeHtml(title)}</h3>

            <p>By ${escapeHtml(authors)}</p>

            <p class="availability">
                Availability: <strong>${escapeHtml(availability)}</strong>
            </p>

            <div class="book-actions">

                ${readLink ? `
                    <a class="read-link"
                       href="${escapeHtml(readLink)}"
                       target="_blank"
                       rel="noopener noreferrer">
                       Read Book
                    </a>
                ` : `
                    <p>Reading link not available</p>
                `}

                <button
                    type="button"
                    class="save-button"
                    data-id="${escapeHtml(novel.id)}"
                    ${alreadySaved ? "disabled" : ""}
                >
                    ${alreadySaved ? "Saved" : "Save Novel"}
                </button>

            </div>
        `;

        container.appendChild(bookDiv);
});
}
function getSavedNovels() {

    try {

        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

        return Array.isArray(saved) ? saved : [];

    } catch (error) {

        console.log("Error reading saved novels", error);

        return [];

    }

}
function setSavedNovels(novels) {

    localStorage.setItem(STORAGE_KEY, JSON.stringify(novels));

}
function isNovelSaved(id) {

    const saved = getSavedNovels();

    return saved.some(novel => novel.id === id);

}
function saveNovel(novel){
const saved=getSavedNovels();
if(saved.some(item=>item.id ===novel.id)){
    return;
}
saved.push(novel);
setSavedNovels(saved);
renderSavedNovels();
}
function deleteNovel(id) {

    const saved = getSavedNovels();


    const updatedBooks = saved.filter(novel => novel.id !== id);

    setSavedNovels(updatedBooks);

    renderSavedNovels();

    
    const saveButton = document.querySelector(
        `.save-button[data-id="${CSS.escape(id)}"]`
    );

    if (saveButton) {

        saveButton.textContent = "Save Novel";

        saveButton.disabled = false;

    }

}
function renderSavedNovels(){
const container=document.getElementById("saved-container");
const count=document.getElementById("saved-count");
const saved=getSavedNovels();
count.textContent=saved.length ===1
  ? "1 saved"
        : `${saved.length} saved`;
    container.innerHTML = "";
if(saved.length ===0){
container.innerHTML=`<p class="empty-message">No saved novels yet. Save a book from your search results.</p>`

return;
}
saved.forEach(novel =>{
    const bookDiv=document.createElement("div");
    bookDiv.className="book";
    bookDiv.innerHTML=`  <img src="${escapeHtml(novel.coverUrl)}"
                 alt="${escapeHtml(novel.title)}">

            <h3>${escapeHtml(novel.title)}</h3>

            <p>By ${escapeHtml(novel.authors)}</p>

            <p class="availability">
                Availability: <strong>${escapeHtml(novel.availability)}</strong>
            </p>

            <div class="book-actions">

                ${novel.readLink ? `
                    <a class="read-link"
                       href="${escapeHtml(novel.readLink)}"
                       target="_blank"
                       rel="noopener noreferrer">
                       Read Book
                    </a>
                ` : `
                    <p>Reading link not available</p>
                `}

                <button
                    type="button"
                    class="delete-button"
                    data-id="${escapeHtml(novel.id)}">
                    Remove Book
                </button>

            </div>`;
            container.appendChild(bookDiv);
})

}
function escapeHtml(value){
return String(value)

    .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

}
function safeUrl(url) {

    if (!url) {
        return "";
    }

    try {

        const parsed = new URL(url);

        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
            return parsed.href;
        }

    } catch (error) {

        return "";

    }

    return "";

}




