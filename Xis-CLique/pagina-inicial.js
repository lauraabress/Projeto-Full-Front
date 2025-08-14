// Estado da aplicação
const app = {
  currentUser: null,
  cart: [],
  products: [],
  banners: [],
  currentCategory: "all",
  searchTerm: "",
};

// Inicialização
document.addEventListener("DOMContentLoaded", function () {
  loadMockData();
});

// Carregar dados do JSON
async function loadMockData() {
  try {
    const response = await fetch("elementos.json");
    const data = await response.json();
    app.products = data.products;
    app.banners = data.banners;

    // Iniciar aplicação após carregar dados
    initializeApp();
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    // Fallback com dados básicos se não conseguir carregar o JSON
    initializeApp();
  }
}

function initializeApp() {
  loadUser();
  loadCart();
  setupEventListeners();
  renderBanners();
}

// Gerenciamento de usuário
function loadUser() {
  const userData = JSON.parse(
    localStorage.getItem("lanchonete_user") || "null"
  );
  if (userData) {
    app.currentUser = userData;
    showMainApp();
  } else {
    showLoginScreen();
  }
}

function showLoginScreen() {
  document.getElementById("loginScreen").style.display = "flex";
  document.getElementById("mainApp").style.display = "none";
}

function showMainApp() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("mainApp").style.display = "block";
  document.getElementById("userName").textContent = app.currentUser.name;
  renderProducts();
  updateCartUI();
  startBannerCarousel();
}

// Event Listeners
function setupEventListeners() {
  // Login/Register
  document
    .getElementById("showRegister")
    ?.addEventListener("click", toggleForms);
  document.getElementById("showLogin")?.addEventListener("click", toggleForms);
  document.getElementById("loginForm")?.addEventListener("submit", handleLogin);
  document
    .getElementById("registerForm")
    ?.addEventListener("submit", handleRegister);
  document.getElementById("logoutBtn")?.addEventListener("click", handleLogout);

  // Filtros e busca
  document
    .getElementById("searchInput")
    ?.addEventListener("input", handleSearch);
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", handleCategoryFilter);
  });

  // Carrinho
  document.getElementById("clearCartBtn")?.addEventListener("click", clearCart);
  document.getElementById("checkoutBtn")?.addEventListener("click", checkout);

  // Produtos (delegação de eventos)
  document
    .getElementById("productGrid")
    ?.addEventListener("click", handleProductClick);
  document
    .getElementById("cartItems")
    ?.addEventListener("click", handleCartClick);
}

// Renderização de banners
function renderBanners() {
  const carouselInner = document.querySelector(
    "#bannerCarousel .carousel-inner"
  );
  if (!carouselInner || !app.banners.length) return;

  carouselInner.innerHTML = app.banners
    .map(
      (banner, index) => `
        <div class="carousel-item ${index === 0 ? "active" : ""}">
            <img src="${banner.image}" class="d-block w-100" alt="${
        banner.title
      }" style="height: 200px; object-fit: cover;">
            <div class="carousel-caption d-none d-md-block">
                <h5>${banner.title}</h5>
                <p>${banner.subtitle}</p>
            </div>
        </div>
    `
    )
    .join("");
}

// Formulários de login/registro
function toggleForms(e) {
  e.preventDefault();
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm.style.display === "none") {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
  } else {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
  }
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const users = JSON.parse(localStorage.getItem("lanchonete_users") || "[]");
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    app.currentUser = user;
    localStorage.setItem("lanchonete_user", JSON.stringify(user));
    showToast("Login realizado com sucesso!", "success");
    showMainApp();
  } else {
    showToast("Email ou senha inválidos!", "error");
  }
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  if (!name || !email || !password) {
    showToast("Preencha todos os campos!", "error");
    return;
  }

  const users = JSON.parse(localStorage.getItem("lanchonete_users") || "[]");

  if (users.find((u) => u.email === email)) {
    showToast("Email já cadastrado!", "error");
    return;
  }

  const newUser = { id: Date.now(), name, email, password };
  users.push(newUser);
  localStorage.setItem("lanchonete_users", JSON.stringify(users));

  app.currentUser = newUser;
  localStorage.setItem("lanchonete_user", JSON.stringify(newUser));
  showToast("Cadastro realizado com sucesso!", "success");
  showMainApp();
}

function handleLogout() {
  localStorage.removeItem("lanchonete_user");
  app.currentUser = null;
  app.cart = [];
  localStorage.removeItem("lanchonete_cart");
  showLoginScreen();
  showToast("Logout realizado!", "success");
}

// Banner carousel
function startBannerCarousel() {
  const carousel = new bootstrap.Carousel(
    document.getElementById("bannerCarousel"),
    {
      interval: 5000,
      wrap: true,
    }
  );
}

// Renderização de produtos
function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid || !app.products.length) return;

  let filtered = app.products;

  // Filtro por categoria
  if (app.currentCategory !== "all") {
    filtered = filtered.filter((p) => p.category === app.currentCategory);
  }

  // Filtro por busca
  if (app.searchTerm) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(app.searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(app.searchTerm.toLowerCase())
    );
  }

  grid.innerHTML = filtered
    .map(
      (product) => `
        <div class="col-md-6 col-lg-4 mb-3 fade-in">
            <div class="card product-card h-100">
                ${
                  product.image
                    ? `<img src="${product.image}" class="card-img-top product-image" alt="${product.name}">`
                    : ""
                }
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="product-price">R$ ${product.price
                          .toFixed(2)
                          .replace(".", ",")}</span>
                        <button class="btn btn-danger btn-sm add-to-cart" data-id="${
                          product.id
                        }">
                            <i class="bi bi-plus-lg"></i> Adicionar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

// Filtros e busca
function handleCategoryFilter(e) {
  document
    .querySelectorAll(".filter-btn")
    .forEach((btn) => btn.classList.remove("active"));
  e.target.classList.add("active");
  app.currentCategory = e.target.dataset.category;
  renderProducts();
}

function handleSearch(e) {
  app.searchTerm = e.target.value;
  renderProducts();
}

// Carrinho
function handleProductClick(e) {
  if (e.target.closest(".add-to-cart")) {
    const productId = parseInt(e.target.closest(".add-to-cart").dataset.id);
    addToCart(productId);
  }
}

function addToCart(productId) {
  const product = app.products.find((p) => p.id === productId);
  if (!product) return;

  const existing = app.cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    app.cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartUI();
  showToast(`${product.name} adicionado ao carrinho!`, "success");
}

function handleCartClick(e) {
  const cartItem = e.target.closest(".cart-item");
  if (!cartItem) return;

  const productId = parseInt(cartItem.dataset.id);

  if (e.target.closest(".btn-increase")) {
    updateQuantity(productId, 1);
  } else if (e.target.closest(".btn-decrease")) {
    updateQuantity(productId, -1);
  } else if (e.target.closest(".btn-remove")) {
    removeFromCart(productId);
  }
}

function updateQuantity(productId, delta) {
  const item = app.cart.find((item) => item.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart();
  updateCartUI();
}

function removeFromCart(productId) {
  app.cart = app.cart.filter((item) => item.id !== productId);
  saveCart();
  updateCartUI();
  showToast("Item removido do carrinho!", "success");
}

function clearCart() {
  if (app.cart.length === 0) return;

  if (confirm("Tem certeza que deseja limpar o carrinho?")) {
    app.cart = [];
    saveCart();
    updateCartUI();
    showToast("Carrinho limpo!", "success");
  }
}

function updateCartUI() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");
  const emptyCart = document.getElementById("emptyCart");

  if (!cartItems || !cartCount || !cartTotal || !emptyCart) return;

  if (app.cart.length === 0) {
    emptyCart.style.display = "block";
    cartItems.innerHTML = "";
    cartCount.textContent = "0";
    cartTotal.textContent = "0,00";
    return;
  }

  emptyCart.style.display = "none";

  const totalItems = app.cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = app.cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  cartCount.textContent = totalItems;
  cartTotal.textContent = totalPrice.toFixed(2).replace(".", ",");

  cartItems.innerHTML = app.cart
    .map(
      (item) => `
        <div class="cart-item" data-id="${item.id}">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-0">${item.name}</h6>
                    <small class="text-muted">R$ ${item.price
                      .toFixed(2)
                      .replace(".", ",")}</small>
                </div>
                <div class="quantity-controls">
                    <button class="btn btn-outline-danger btn-sm btn-decrease">-</button>
                    <input type="text" class="form-control form-control-sm" value="${
                      item.quantity
                    }" readonly>
                    <button class="btn btn-outline-danger btn-sm btn-increase">+</button>
                    <button class="btn btn-danger btn-sm btn-remove ms-2">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

function saveCart() {
  if (app.currentUser) {
    const cartKey = `lanchonete_cart_${app.currentUser.id}`;
    localStorage.setItem(cartKey, JSON.stringify(app.cart));
  }
}

function loadCart() {
  if (app.currentUser) {
    const cartKey = `lanchonete_cart_${app.currentUser.id}`;
    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) {
      app.cart = JSON.parse(savedCart);
    }
  }
}

function checkout() {
  if (app.cart.length === 0) {
    showToast("Carrinho vazio!", "error");
    return;
  }

  const total = app.cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemsList = app.cart
    .map((item) => `${item.name} x${item.quantity}`)
    .join("\n");

  const confirmMessage = `Finalizar pedido?\n\nItens:\n${itemsList}\n\nTotal: R$ ${total
    .toFixed(2)
    .replace(".", ",")}`;

  if (confirm(confirmMessage)) {
    // Simular processamento do pedido
    showToast("Processando pedido...", "success");

    setTimeout(() => {
      showToast(
        "Pedido realizado com sucesso! Tempo estimado: 30-40 minutos.",
        "success"
      );
      app.cart = [];
      saveCart();
      updateCartUI();
    }, 2000);
  }
}

// Utilitários
function showToast(message, type = "success") {
  const toastContainer = document.querySelector(".toast-container");
  if (!toastContainer) return;

  const toastId = "toast-" + Date.now();

  const toastHTML = `
        <div id="${toastId}" class="toast ${type}" role="alert">
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;

  toastContainer.insertAdjacentHTML("beforeend", toastHTML);

  const toast = new bootstrap.Toast(document.getElementById(toastId));
  toast.show();

  document
    .getElementById(toastId)
    .addEventListener("hidden.bs.toast", function () {
      this.remove();
    });
}
