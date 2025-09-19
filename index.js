let Totalprice = 0;
let TotalProduct = 0;
let cartItems = [];
let appliedPromo = false;
let discountRate = 0; // 0 = no discount, 0.1 = 10%, 0.5 = 50%

// Load all products
const LoadAllProduct = () => {
   fetch('https://fakestoreapi.com/products')
   .then(res => res.json())
   .then(data => displayProduct(data))
}

const displayProduct = (products) => {
   let product_container = document.querySelector(".product-container");
   product_container.innerHTML = "";

   products.forEach((product) => {
       let div = document.createElement("div");
       div.innerHTML = `
        <div class="card" style="width: 18rem;">
            <img src="${product.image}" class="card-img-top" alt="${product.title}">
            <div class="card-body">
                <h3>id : ${product.id}</h3>
                <h5 class="card-title">${product.title}</h5>
                <p class="card-text">${product.description.slice(0, 100)}</p>
                <h5 class="card-text">${product.category}</h5>
                <div class="two-btn">
                  <button onclick="singleProduct(${product.id})" class="btn btn-primary">Details</button>
                  <button onclick="add_To_cart(${product.id},'${product.title}',${product.price})" class="btn btn-primary">Add to Cart</button>
                </div>
            </div>
        </div>
       `;
       product_container.appendChild(div);
   });
}

// Single Product Details
function singleProduct(id) {
    let details = document.querySelector('.details');
    fetch(`https://fakestoreapi.com/products/${id}`)
    .then(res => res.json())
    .then(product => {
          details.innerHTML = `
             <img src="${product.image}" class="card-img-top" alt="${product.title}">
             <h5>Title: ${product.title}</h5>
             <p><b>Description</b>: ${product.description.slice(1,50)} </p>
             <p><b>Price : ${product.price}$</b></p>
             <h5>Category: ${product.category}</h5>
          `;
    });
}

// Add To Cart
const add_To_cart = (id, title, price) => {
    let item = cartItems.find(p => p.id === id);
    if (item) {
        item.quantity++;
    } else {
        cartItems.push({id, title, price, quantity: 1});
    }
    updateCartUI();
}

// Update Cart UI
const updateCartUI = () => {
    let add_to_cart = document.querySelector('.add_to_cart');
    let showPrice = document.getElementById("show_price");

    // clear old cart
    add_to_cart.querySelectorAll(".cart_info").forEach(e => e.remove());

    Totalprice = 0;
    TotalProduct = 0;

    cartItems.forEach(item => {
        Totalprice += item.price * item.quantity;
        TotalProduct += item.quantity;

        let cart_info = document.createElement('div');
        cart_info.classList.add('cart_info');
        cart_info.innerHTML = `
          <h6>${item.title}</h6>
          <h4>Price - $${item.price}</h4>
          <div>
             Quantity: 
             <button class="btn btn-sm btn-success" onclick="changeQty(${item.id}, 1)">+</button>
             <span>${item.quantity}</span>
             <button class="btn btn-sm btn-warning" onclick="changeQty(${item.id}, -1)">-</button>
          </div>
          <hr>
        `;
        add_to_cart.insertBefore(cart_info, showPrice);
    });

    // Apply discount if promo is active
    let finalPrice = appliedPromo ? (Totalprice * (1 - discountRate)) : Totalprice;

    if (appliedPromo) {
        showPrice.innerHTML = `<h3>Total Products: ${TotalProduct} <br> 
            Original Price: $${Totalprice.toFixed(2)} <br> 
            Discounted Price: $${finalPrice.toFixed(2)}</h3>`;
    } else {
        showPrice.innerHTML = `<h3>Total Products: ${TotalProduct} <br> 
            Total Price: $${Totalprice.toFixed(2)}</h3>`;
    }
}

// Change Quantity
const changeQty = (id, change) => {
    let item = cartItems.find(p => p.id === id);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        cartItems = cartItems.filter(p => p.id !== id);
    }
    updateCartUI();
}

// Clear Cart
const clearCart = () => {
    cartItems = [];
    appliedPromo = false;
    discountRate = 0;
    document.getElementById("promoMessage").innerText = "";
    updateCartUI();
}

// Apply Promo Code
const applyPromo = () => {
    if (appliedPromo) {
        document.getElementById("promoMessage").innerText = "Promo code already applied!";
        return;
    }

    let promoInput = document.getElementById("promoInput").value.trim().toLowerCase();
    let promoMessage = document.getElementById("promoMessage");

    if (promoInput === "ostad10") {
        discountRate = 0.10;
        appliedPromo = true;
        promoMessage.style.color = "green";
        promoMessage.innerText = "10% discount applied!";
    } 
    else if (promoInput === "ostad50") {
        discountRate = 0.50;
        appliedPromo = true;
        promoMessage.style.color = "green";
        promoMessage.innerText = "50% discount applied!";
    } 
    else {
        promoMessage.style.color = "red";
        promoMessage.innerText = " Invalid Promo Code";
        return;
    }

    updateCartUI();
}

// Load products initially
LoadAllProduct();
