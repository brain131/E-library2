
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







function discoverBooks(inputValue){

     const apiKey = "AIzaSyAwvmOW7BOcaXWgABvGA8i6ZdplhQl4Pn8";

    fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(inputValue)}&maxResults=16&printType=books&key=${apiKey}`)
.then(response=>response.json())
.then(data =>{
    displayBooks(data.docs);

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
const coverId=book.cover_i ? book.cover_i :null;
const coverUrl=coverId
            ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
            : 'https://media.istockphoto.com/id/1055079680/vector/black-linear-photo-camera-like-no-image-available.jpg?s=612x612&w=0&k=20&c=P1DebpeMIAtXj_ZbVsKVvg-duuL0v9DlrOZUvPG6UJk=';

bookDiv.innerHTML=`<img src="${coverUrl}" alt="${book.title}">
<h3>${book.title}</h3><p>by ${book.author_name ? book.author_name.join(','):'Unknown Author'}</p>`;
container.appendChild(bookDiv);

});
}
