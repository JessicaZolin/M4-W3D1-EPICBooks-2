// Ottiene i parametri dall'URL della pagina corrente
const params = new URLSearchParams(window.location.search)
// Stampa i parametri nella console per debug
console.log(params)
// Estrae il parametro 'id' dall'URL e lo assegna alla variabile asin
const asin = params.get("id")
// Costruisce l'URL per la richiesta API usando l'id del libro
const url = `https://striveschool-api.herokuapp.com/books/${asin}`

// Effettua una richiesta GET all'API
fetch(url)
// Converte la risposta in formato JSON
.then(response => response.json())
// Passa i dati alla funzione stampaDettagli
.then(data => stampaDettagli(data))
// Gestisce eventuali errori stampandoli in console
.catch(error => console.error(error))

// Funzione che mostra i dettagli del libro nella pagina
const stampaDettagli = (data) => {
    // Ottiene riferimenti agli elementi HTML dove inserire i dati
    const bookImage = document.getElementById("book-image")
    const bookTitle = document.getElementById("book-title")
    const bookPrice = document.getElementById("book-price")
    
    // Inserisce l'immagine del libro nell'elemento corrispondente
    bookImage.innerHTML = `<img src="${data.img}" alt="${data.title}" class="img-fluid">`
    // Inserisce il titolo del libro nell'elemento corrispondente
    bookTitle.innerText = data.title
    // Inserisce il prezzo formattato del libro nell'elemento corrispondente
    bookPrice.innerText = `Price: ${data.price.toFixed(2).replace(".", ",")} €`
}
