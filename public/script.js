// ============================================
// SOLE CTF - CLIENT JAVASCRIPT
// ============================================


// ============================================
// STATE
// ============================================

let cart = [];

let currentUser = null;


// ============================================
// ELEMENTS
// ============================================

const cartBtn = document.getElementById("cartBtn");
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");

const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const loginModal = document.getElementById("loginModal");
const closeLogin = document.getElementById("closeLogin");

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

const buyCtf = document.getElementById("buyCtf");

const flagModal = document.getElementById("flagModal");
const flagText = document.getElementById("flagText");
const closeFlag = document.getElementById("closeFlag");


// ============================================
// CART
// ============================================

cartBtn.addEventListener("click", () => {

    cartModal.classList.add("show");

});


closeCart.addEventListener("click", () => {

    cartModal.classList.remove("show");

});


cartModal.addEventListener("click", (event) => {

    if (event.target === cartModal) {

        cartModal.classList.remove("show");

    }

});


// ============================================
// ADD PRODUCTS
// ============================================

const addButtons =
    document.querySelectorAll(".add-btn");


addButtons.forEach(button => {

    button.addEventListener("click", () => {

        const name =
            button.dataset.name;

        const price =
            Number(button.dataset.price);

        const id =
            Number(button.dataset.id);


        cart.push({
            id,
            name,
            price
        });


        updateCart();


        button.innerText = "✓";


        setTimeout(() => {

            button.innerText = "+";

        }, 700);

    });

});


// ============================================
// UPDATE CART
// ============================================

function updateCart() {

    cartCount.innerText =
        cart.length;


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


        const item =
            document.createElement("div");

        item.className =
            "cart-item";


        item.innerHTML = `

            <div class="cart-item-info">

                <h4>
                    ${product.name}
                </h4>

                <p>
                    $${product.price}
                </p>

            </div>

            <button
                class="remove-item"
                onclick="removeFromCart(${index})"
            >
                Remove
            </button>
        `;


        cartItems.appendChild(item);

    });


    cartTotal.innerText = total;

}


// ============================================
// REMOVE CART ITEM
// ============================================

function removeFromCart(index) {

    cart.splice(index, 1);

    updateCart();

}


// ============================================
// LOGIN MODAL
// ============================================

loginBtn.addEventListener("click", () => {

    loginModal.classList.add("show");

});


closeLogin.addEventListener("click", () => {

    loginModal.classList.remove("show");

});


loginModal.addEventListener("click", event => {

    if (event.target === loginModal) {

        loginModal.classList.remove("show");

    }

});


// ============================================
// LOGIN
// ============================================

loginForm.addEventListener("submit", async event => {

    event.preventDefault();


    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;


    loginMessage.innerText =
        "Authenticating...";


    try {

        const response =
            await fetch("http://localhost:3000/api/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username,
                    password
                })

            });


        const data =
            await response.json();


        if (!data.success) {

            loginMessage.innerText =
                data.message;

            return;
        }
        // else {
        //     alert(data.message)
        // }


        currentUser =
            data.user;


        loginMessage.innerText =
            `Welcome ${data.user}!`;


        setTimeout(() => {

            loginModal.classList.remove("show");

            updateUserInterface();

        }, 700);


    } catch (error) {

        loginMessage.innerText =
            "Server error.";

    }

});


// ============================================
// USER INTERFACE
// ============================================

function updateUserInterface() {

    if (currentUser) {

        loginBtn.classList.add("hidden");

        logoutBtn.classList.remove("hidden");

        buyCtf.disabled = false;

        buyCtf.innerText =
            "Buy Article →";

    } else {

        loginBtn.classList.remove("hidden");

        logoutBtn.classList.add("hidden");

        buyCtf.disabled = false;

        buyCtf.innerText =
            "Login to Buy →";

    }

}


// ============================================
// LOGOUT
// ============================================

logoutBtn.addEventListener("click", async () => {

    await fetch("http://localhost:3000/api/logout", {
        method: "POST"
    });


    currentUser = null;

    updateUserInterface();

});


// ============================================
// CHECK SESSION
// ============================================

async function checkSession() {

    try {

        const response =
            await fetch("http://localhost:3000/api/me");

        const data =
            await response.json();


        if (data.loggedIn) {

            currentUser =
                data.user;

        }


        updateUserInterface();

    } catch (error) {

        console.log("Session check failed.");

    }

}


checkSession();


// ============================================
// BUY CTF ARTICLE
// ============================================

buyCtf.addEventListener("click", async () => {

    if (!currentUser) {

        loginModal.classList.add("show");

        loginMessage.innerText =
            "Please sign in first.";

        return;
    }


    buyCtf.disabled = true;

    buyCtf.innerText =
        "Processing...";


    try {

        const response =
            await fetch("http://localhost:3000/api/purchase", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    productId: 5
                })

            });


        const data =
            await response.json();


        if (!data.success) {

            alert(data.message);

            buyCtf.disabled = false;

            buyCtf.innerText =
                "Buy Article →";

            return;
        }


        if (data.flag) {

            flagText.innerText =
                data.flag;

            flagModal.classList.add("show");

        } else {

            alert(data.message);

        }


        buyCtf.disabled = false;

        buyCtf.innerText =
            "Purchased ✓";


    } catch (error) {

        alert("Server error.");

        buyCtf.disabled = false;

        buyCtf.innerText =
            "Buy Article →";

    }

});


// ============================================
// FLAG MODAL
// ============================================

closeFlag.addEventListener("click", () => {

    flagModal.classList.remove("show");

});


// ============================================
// CATEGORY FILTER
// ============================================

const categoryButtons =
    document.querySelectorAll(".category");

const products =
    document.querySelectorAll(".product-card");


categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        const category =
            button.dataset.category;


        products.forEach(product => {

            if (
                category === "all" ||
                product.dataset.category === category
            ) {

                product.style.display =
                    "block";

            } else {

                product.style.display =
                    "none";

            }

        });

    });

});


// ============================================
// PROMOTION
// ============================================

const promoBtn =
    document.getElementById("promoBtn");


promoBtn.addEventListener("click", () => {

    alert(
        "Your discount code is: SOLE20\n\n" +
        "Use it at checkout to get 20% off!"
    );

});


// ============================================
// CHECKOUT
// ============================================

const checkoutBtn =
    document.getElementById("checkoutBtn");


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