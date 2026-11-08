document.getElementById("search-button").addEventListener('click',function(){
const inputValue=document.getElementById("search-input").Value;
discoverBooks(inputValue);

});
document.getElementById("search-input").addEventListener("keypress",function(event){
if(event.key ==='enter'){
    const inputValue=document.getElementById("search-input").value;
    searchBooks(inputValue);
}
});

