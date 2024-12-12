// Array per gestire il carrello - memorizza gli oggetti libro aggiunti
let cart = []

// URL dell'API che fornisce i dati dei libri
let url = "https://striveschool-api.herokuapp.com/books"

// Attende che il DOM sia completamente caricato prima di eseguire fetchBooks
document.addEventListener("DOMContentLoaded", () => {
    fetchBooks();
})

// Recupera i dati dei libri dall'API usando fetch
const fetchBooks = () => {
    fetch(url)
        .then(raw => raw.json())  // Converte la risposta in JSON
        .then((response) => {
            let res = response
            console.log(res)  // Debug: mostra i dati ricevuti
            stampaLibri(res)  // Passa i dati alla funzione che crea le card
        })
        .catch((err) => console.log(err))  // Gestisce eventuali errori
}

// Crea e visualizza le card dei libri nella pagina
const stampaLibri = (res) => {
    const bookContainer = document.getElementById("book-container")
    // Usa map per creare una card HTML per ogni libro e le unisce in una stringa
    bookContainer.innerHTML += res.map(element => {
        return `<div class="col-10 col-sm-6 col-lg-4 col-xl-3 mb-4" id ="book_${element.asin}">
                    <div class="card h-100">
                        <img src="${element.img}" class="card-img-top" alt="${element.title}" height="450px">
                        <div class="card-body">
                            <h5 class="card-title" style="height: 100px;">${element.title}</h5>
                            <p class="card-text price ps-1">Price: ${element.price.toFixed(2)} €</p>
                            <div id="button-container" class="d-flex justify-content-center gap-2">
                                <button type="button" class="btn btn-outline-dark add-to-cart col d-flex justify-content-center align-items-center" onclick="addToCart('${element.img}', '${element.title}', '${element.price}', '${element.asin}')">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-cart-fill" viewBox="0 0 16 16">
                                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                                    </svg>
                                </button>
                                <button type="button" class="btn btn-outline-primary col d-flex justify-content-center align-items-center" onclick="hideBook('${element.asin}')">
                                Hide
                                </button>
                                <button type="button" class="btn p-0 col d-flex justify-content-center align-items-center" id="details-button">
                                <a class="btn btn-outline-danger text-decoration-none" href="details.html?id=${element.asin}">Details</a>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`
    }).join("");

    // Sostituisce i punti decimali con le virgole nei prezzi (formato europeo)
    let price = document.querySelectorAll(".price")
    price.forEach(price => {
        price.textContent = price.textContent.replace(".", ",")
    })

}

// Gestisce l'aggiunta di un libro al carrello
const addToCart = (img, title, price, asin) => {
    const book = document.querySelector("#book_" + asin)
    book.style.border = "2px solid red";  // Evidenzia visivamente il libro nel carrello

    // Controlla se il libro è già nel carrello
    let existingItem = cart.find(item => item.asin === asin)
    if (existingItem) {
        existingItem.quantity += 1;  // Incrementa la quantità se già presente
    } else {
        // Aggiunge un nuovo oggetto libro al carrello
        cart.push({
            img: img,
            asin: asin,
            title: title,
            price: (Number(price)).toFixed(2),
            quantity: 1
        })
    }

    updateCartDisplay();  // Aggiorna la visualizzazione del carrello
}

// Aggiorna il contatore degli articoli nel carrello
const updateCartDisplay = () => {
    let cartButton = document.querySelectorAll(".number-of-articles");

    // Calcola il totale degli articoli sommando le quantità
    cartButton.forEach(item => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
        item.textContent = totalItems
    })

    updateCart()  // Aggiorna il contenuto del carrello
}

// Aggiorna il contenuto del carrello e calcola i totali
const updateCart = () => {
    let cartItems = document.getElementById("cartItems")
    const oderValue = document.getElementById("oderValue")
    const shippingCostDisplay = document.getElementById("shippingCost")
    const totalCart = document.getElementById("cartTotal")

    // Svuota il contenitore prima di aggiungere nuovi elementi
    cartItems.innerHTML = ""
    let total = 0.00
    const shippingCost = 4.99;

    // Crea gli elementi HTML per ogni libro nel carrello e calcola il totale
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal

        // crea la card da inserire al carrello
        cartItems.innerHTML += `
                        <li class="list-group-item">
                            <div class="d-flex gap-3">
                                <img src=${item.img} class="col-4 h-50"
                                    alt="...">
                                <div>
                                    <h6 class="card-title" style="height: 75px;">${item.title}</h6>
                                    <p class="m-0">Quantity: ${item.quantity}</p>
                                    <p class="price">Unit price: ${(Number(item.price)).toFixed(2).replace(".", ",")} €</p>
                                    <button type="button" id="delete-from-cart" class="btn btn-outline-dark d-flex align-items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                        </svg><span class="ps-2" onclick="removeFromCart('${item.asin}')">Delete from cart</span>
                                    </button>
                                </div>
                            </div>
                        </li>`
    })

    console.log(total);

    // riposta il totale nel carrello
    oderValue.innerText = `${total.toFixed(2).replace(".", ",")} €`;


    // Controlla se il totale supera i 50 euro per applicare o azzerare le spese di spedizione
    let finalShippingCost = total > 50 ? 0.00 : shippingCost;

    // Aggiorna il display per le spese di spedizione e il totale del carrello
    shippingCostDisplay.textContent = ` ${finalShippingCost.toFixed(2).replace(".", ",")} €`;
    totalCart.textContent = `${(total + finalShippingCost).toFixed(2).replace(".", ",")} €`;
    
}

// Funzione per svuotare il carrello
const clearCart = () => {
   cart = [];
   updateCartDisplay();
   updateCart();
}

document.getElementById("clear-cart").addEventListener("click", clearCart);

// Rimuove un libro dal carrello
const removeFromCart = (asin) => {
    cart = cart.filter(item => item.asin !== asin);  // Rimuove l'elemento dall'array
    const book = document.querySelector("#book_" + asin)
    book.style.border = "none";  // Rimuove l'evidenziazione visiva
    updateCartDisplay();
    updateCart();
}

// Gestisce la visibilità dei libri nella pagina
const hideBook = (asin) => {
    const book = document.querySelector("#book_" + asin)
    // Non nasconde i libri che sono nel carrello
    if (book.style.border !== "2px solid red") {
        book.style.display = "none";
    } else {
        book.style.display = "block";
    }
}

// Implementa la funzionalità di ricerca dei libri
const searchBook = (searchInput) => {
    const booksAllTitle = document.querySelectorAll(".card-title")

    // Itera su tutti i titoli e mostra/nasconde le card in base alla corrispondenza
    booksAllTitle.forEach(book => {
        const currentBook = book.parentElement.parentElement.parentElement
        if (book.textContent.toLowerCase().includes(searchInput.toLowerCase())) {
            currentBook.style.display = "block";  // Mostra se corrisponde
        } else {
            currentBook.style.display = "none";   // Nasconde se non corrisponde
        }
    })
}

document.getElementById("search-button-2").addEventListener("click", () => {
    const searchInput = document.getElementById("search-input-2").value;    
    searchBook(searchInput);
    document.getElementById("search-input-2").value = "";
})


document.getElementById("search-button").addEventListener("click", () => {
    const searchInput = document.getElementById("search-input").value;    
    searchBook(searchInput);
    document.getElementById("search-input").value = "";
})
