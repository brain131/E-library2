
const STORAGE_KEY = "savedNovels";
const searchResults = new Map();

document.getElementById("search-button").addEventListener('click',function(){
const inputValue=document.getElementById("search-input").value;
discoverBooks(inputValue);

});
document.getElementById("search-input").addEventListener('keypress',function(event){
if(event.key ==='Enter'){
    const inputValue=document.getElementById("search-input").value;
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
container.innerHTML='';
books.slice(0,16).forEach(book => {
const bookDiv=document.createElement('div');
bookDiv.className='book';
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
