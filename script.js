// Get elements
const cartButton = document.querySelector('.cart-button');
const cartBadge = document.querySelector('.cart-badge');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.close');
const buyButton = document.querySelector('.buy-btn');
const cartItemsList = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const itemsGrid = document.querySelector('.items-grid');
const searchBar = document.getElementById('myInput');
let addToCartButtons;
let increaseQuantityButtons;
let removeQuantityButtons;

let items = [
    {
        id: 1,
        name: 'Apple',
        price: 0.99,
    },
    {
        id: 2,
        name: 'Banana',
        price: 10,
    },
    {
        id: 3,
        name: 'Orange',
        price: 4.99,
    },
    {
        id:4,
        name:'Strawberry',
        price: 8.99,
    },
    {
        id:5,
        name:'Pear',
        price:1.99,
    },
    {
        id:6,
        name:'Mango',
        price:6.99,
    }
];

let cart = [];

// An example function that creates HTML elements using the DOM.
function fillItemsGrid() {
    for (const item of items) {
        let itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.innerHTML = `
            <img src="./images/${item.id}.jpg" alt="${item.name}">
            <h2>${item.name}</h2>
            <p>$${item.price}</p>
            <button class="add-to-cart-btn" data-id="${item.id}">Add to cart</button>
        `;
        itemsGrid.appendChild(itemElement);
    }
}
// whenever items in cart are updated this function updates price
function UpdatePrice(){
    let sum = 0.0;
    cart.forEach(product =>{
        sum += parseFloat(product.price) * parseInt(product.quantity) 
    })
    cartTotal.textContent = "$"+ sum.toFixed(2);
}
// Increases quantity of item in cart
function increaseItem(event){
    event.preventDefault();

    // Get the element that triggered the event
    const clickedButton = event.target;

    // Get the data-id attribute value
    const itemId = parseInt(clickedButton.getAttribute('data-id'));

    productElement = document.getElementById(`list-item-${itemId}`)
    
    product = cart.find(item => item.id === itemId);
    product.quantity +=1;
    productElement.querySelector(".product-quantity").textContent = product.quantity
    UpdatePrice()
}
// Decreases or removes Item from cart
function RemoveItem(event){
    event.preventDefault();

    // Get the element that triggered the event
    const clickedButton = event.target;

    // Get the data-id attribute value
    const itemId = parseInt(clickedButton.getAttribute('data-id'));

    product = cart.find(item => item.id === itemId);
    productElement = document.getElementById(`list-item-${product.id}`)

    // If that was the quantity of 1 in cart
    if (product.quantity === 1){
        cart=cart.filter(item => item !== product);
        productElement.remove()
        cartBadge.textContent = (parseInt(cartBadge.textContent) - 1).toString()
    }
    else{
        product.quantity-=1;
        productElement.querySelector(".product-quantity").textContent = product.quantity
    }
    UpdatePrice()
}

function fillModalTable(){
    let firstElement = document.createElement('li');
    firstElement.innerHTML = `
    <span class="product-name">Name</span>
    <span>Price</span>
    <span>Quantity</span>
    <div class="buttons-container"></div>
    `;
    cartItemsList.appendChild(firstElement);
    cart.forEach(product =>{
        let itemElement= document.createElement('li');
        itemElement.id = `list-item-${product.id}`
        itemElement.innerHTML = `
        <span class="product-name">${product.name}</span>
            <span>${product.price}</span>
            <span class='product-quantity'>${product.quantity}</span>
            <div class="buttons-container">
              <button class="add-btn" data-id="${product.id}">Add</button>
              <button class="remove-btn" data-id="${product.id}">Remove</button>
            </div>
        `;
        cartItemsList.appendChild(itemElement);
    })

    UpdatePrice()

    increaseQuantityButtons = document.querySelectorAll('.add-btn');
    removeQuantityButtons = document.querySelectorAll('.remove-btn');

    increaseQuantityButtons.forEach(button => {
        button.addEventListener('click', increaseItem);
    });
    removeQuantityButtons.forEach(button => {
        button.addEventListener('click', RemoveItem);
    });
}
function clearModal(){
    while (cartItemsList.firstChild) { 
        cartItemsList.firstChild.remove(); 
    }
}
// Adding the .show-modal class to an element will make it visible
// because it has the CSS property display: block; (which overrides display: none;)
// See the CSS file for more details.
function toggleModal() {
    clearModal()
    modal.classList.toggle('show-modal');
}

function openModal(){
    modal.classList.toggle('show-modal')
    fillModalTable()
}

function addToCart(event){
    event.preventDefault();

    // Get the element that triggered the event
    const clickedButton = event.target;

    // Get the data-id attribute value
    const itemId = parseInt(clickedButton.getAttribute('data-id'));

    let index = cart.findIndex((item) => item.id === itemId);

    if (index !== -1){
        cart[index].quantity += 1;
    }
    else{
        const item = items.find(item => item.id === itemId);
        let product ={
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1
        }
        cart.push(product)

        cartBadge.textContent = (parseInt(cartBadge.textContent) + 1).toString()
    }
}

function search(){
  // Declare variables
  var filter, li, title, i, txtValue;
  filter = searchBar.value.toUpperCase();
  li = document.getElementsByClassName("item");

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    title = li[i].getElementsByTagName("h2")[0];
    txtValue = title.textContent || title.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

function finalizeTrade(){
    if (cart.length !== 0){
        if (confirm("Confirm purchase.")){
            clearModal()
            cart=[]
            cartBadge.textContent = 0;
            UpdatePrice()
        }
    }
    else{
        alert("Error! You don't have any items in a cart")
    }
}

// Call fillItemsGrid function when page loads
fillItemsGrid();

// This must be called after the grid is filled
addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

// Example of DOM methods for adding event handling
cartButton.addEventListener('click', openModal);
modalClose.addEventListener('click', toggleModal);
buyButton.addEventListener('click', finalizeTrade);
searchBar.addEventListener('keyup',search);

// Add eventListener for each button
addToCartButtons.forEach(button => {
    button.addEventListener('click', addToCart);
});
