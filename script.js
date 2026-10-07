// ================================
// CART
// ================================

let cart = [];

const cartBtn = document.getElementById("cartBtn");
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");

const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");


// Open cart
cartBtn.addEventListener("click", () => {
    cartModal.classList.add("show");
});


// Close cart
closeCart.addEventListener("click", () => {
    cartModal.classList.remove("show");
});


// Close when clicking outside
cartModal.addEventListener("click", (event) => {
    if (event.target === cartModal) {
        cartModal.classList.remove("show");
    }
});


// ================================
// ADD PRODUCTS TO CART
// ================================

const addButtons = document.querySelectorAll(".add-btn");

addButtons.forEach(button => {

    button.addEventListener("click", () => {

        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        cart.push({
            name: name,
            price: price
        });

        updateCart();

        // Small button animation
        button.innerText = "✓";

        setTimeout(() => {
            button.innerText = "+";
        }, 700);
    });

});


// ================================
// UPDATE CART
// ================================

function updateCart() {

    cartCount.innerText = cart.length;

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;

        cartTotal.innerText = "0";
        return;
    }


    cartItems.innerHTML = "";

    let total = 0;


    cart.forEach((product, index) => {

        total += product.price;

        const item = document.createElement("div");

        item.className = "cart-item";

        item.innerHTML = `
            <div class="cart-item-info">
                <h4>${product.name}</h4>
                <p>$${product.price}</p>
            </div>

            <button
                class="remove-item"
                onclick="removeFromCart(${index})">
                Remove
            </button>
        `;

        cartItems.appendChild(item);
    });


    cartTotal.innerText = total;
}


// ================================
// REMOVE FROM CART
// ================================

function removeFromCart(index) {

    cart.splice(index, 1);

    updateCart();
}


// ================================
// CATEGORY FILTER
// ================================

const categoryButtons = document.querySelectorAll(".category");
const products = document.querySelectorAll(".product-card");


categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        // Remove active class
        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        // Add active class
        button.classList.add("active");

        const category = button.dataset.category;


        products.forEach(product => {

            if (
                category === "all" ||
                product.dataset.category === category
            ) {

                product.style.display = "block";

            } else {

                product.style.display = "none";
            }

        });

    });

});


// ================================
// PROMOTION BUTTON
// ================================

const promoBtn = document.getElementById("promoBtn");

promoBtn.addEventListener("click", () => {

    alert(
        "Your discount code is: SOLE20\n\nUse it at checkout to get 20% off!"
    );

});


// ================================
// CHECKOUT
// ================================

const checkoutBtn = document.getElementById("checkoutBtn");

checkoutBtn.addEventListener("click", () => {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }


    alert(
        "Thanks for shopping with SOLE! 🛍️\n\n" +
        "Checkout will be connected to a payment system later."
    );

});
