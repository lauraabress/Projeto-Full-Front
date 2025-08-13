let mockData = null;

async function loadMockData() {
  const res = await fetch("./elementos.json");
  mockData = await res.json();

  // Depois que os dados forem carregados, inicia a aplicação
  initializeApp();
}

document.addEventListener("DOMContentLoaded", () => {
  loadMockData();
});
const appState = {
  currentCategory: "all", // valor inicial
  searchTerm: "",
  viewMode: "grid",
  cart: [],
  isCartOpen: false,

  addToCart(product, quantity = 1, observations = "") {
    // lógica de adicionar produto no carrinho
    const existingItem = this.cart.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.observations = observations; // opcional
    } else {
      this.cart.push({
        ...product,
        quantity,
        observations,
        cartId: Date.now(),
      });
    }
    this.updateCartUI();
  },

  removeFromCart(cartId) {
    this.cart = this.cart.filter((item) => item.cartId != cartId);
    this.updateCartUI();
  },

  updateQuantity(cartId, quantity) {
    const item = this.cart.find((i) => i.cartId == cartId);
    if (!item) return;
    if (quantity <= 0) this.removeFromCart(cartId);
    else {
      item.quantity = quantity;
      this.updateCartUI();
    }
  },

  clearCart() {
    this.cart = [];
    this.updateCartUI();
  },

  getCartTotal() {
    return this.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },

  updateCartUI() {
    // Atualize a UI do carrinho (total, itens, etc)
    // Essa função deve ser implementada conforme seu HTML do carrinho
    // Se não tiver, pode deixar vazia por enquanto
  },

  showToast(message, type) {
    // Opcional: mostrar mensagem toast para usuário
    // tipo: 'success', 'error', etc
    alert(message);
  },
};

function initializeApp() {
  // Simular loading
  setTimeout(() => {
    const loadingScreen = document.getElementById("loadingScreen");
    loadingScreen.classList.add("fade-out");
    setTimeout(() => loadingScreen.remove(), 500);
  }, 1500);

  renderBanners();
  renderCategories();
  renderProducts();
  bindEvents();
  appState.updateCartUI();
}

// ===== RENDERIZAÇÃO =====
function renderBanners() {
  const carousel = document.querySelector("#bannerCarousel .carousel-inner");
  if (!carousel) return;

  carousel.innerHTML = mockData.banners
    .map(
      (banner, index) => `
    <div class="carousel-item ${index === 0 ? "active" : ""}">
      <img src="${banner.image}" class="d-block w-100" alt="${banner.title}">
      <div class="carousel-caption d-none d-md-block">
        <h5>${banner.title}</h5>
        <p>${banner.subtitle}</p>
      </div>
    </div>
  `
    )
    .join("");
}

function renderCategories() {
  const desktopList = document.getElementById("categoryList");
  const mobileList = document.getElementById("mobileCategoryList");

  const categoryHTML = mockData.categories
    .map(
      (category) => `
    <li class="nav-item">
      <button class="nav-link ${
        category.id === appState.currentCategory ? "active" : ""
      }" 
              data-category="${category.id}">
        <i class="${category.icon}"></i>
        ${category.name}
      </button>
    </li>
  `
    )
    .join("");

  if (desktopList) desktopList.innerHTML = categoryHTML;
  if (mobileList) mobileList.innerHTML = categoryHTML;
}

function renderProducts() {
  const productGrid = document.getElementById("productGrid");
  const emptyState = document.getElementById("emptyState");
  const sectionTitle = document.getElementById("sectionTitle");

  if (!productGrid) return;

  let filteredProducts = mockData.products;

  // Filtrar por categoria
  if (appState.currentCategory !== "all") {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === appState.currentCategory
    );
  }

  // Filtrar por busca
  if (appState.searchTerm) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name
          .toLowerCase()
          .includes(appState.searchTerm.toLowerCase()) ||
        product.description
          .toLowerCase()
          .includes(appState.searchTerm.toLowerCase())
    );
  }

  // Atualizar título da seção
  const categoryName =
    mockData.categories.find((cat) => cat.id === appState.currentCategory)
      ?.name || "Produtos";
  if (sectionTitle) {
    sectionTitle.textContent = appState.searchTerm
      ? `Resultados para "${appState.searchTerm}"`
      : categoryName;
  }

  // Mostrar estado vazio se necessário
  if (filteredProducts.length === 0) {
    productGrid.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  if (emptyState) emptyState.style.display = "none";

  // Aplicar modo de visualização
  productGrid.className = `product-grid ${
    appState.viewMode === "list" ? "list-view" : ""
  }`;

  // Renderizar produtos
  productGrid.innerHTML = filteredProducts
    .map(
      (product) => `
    <div class="product-card fade-in" data-product-id="${product.id}">
      ${
        product.featured
          ? '<div class="badge bg-primary position-absolute" style="top: 10px; left: 10px; z-index: 1;">Destaque</div>'
          : ""
      }
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <div class="product-info">
        ${
          appState.viewMode === "list"
            ? `
          <div class="product-details">
            <h5 class="product-title">${product.name}</h5>
            <p class="product-description">${product.description}</p>
          </div>
        `
            : `
          <h5 class="product-title">${product.name}</h5>
          <p class="product-description">${product.description}</p>
        `
        }
        <div class="product-footer">
          <div class="product-price">R$ ${product.price.toFixed(2)}</div>
          <button class="btn add-to-cart-btn" data-product-id="${product.id}">
            <i class="bi bi-plus-lg me-1"></i>Adicionar
          </button>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

// ===== EVENT LISTENERS =====
function bindEvents() {
  // Busca
  const searchInputs = document.querySelectorAll(
    "#searchInput, #mobileSearchInput"
  );
  searchInputs.forEach((input) => {
    input.addEventListener("input", handleSearch);
  });

  // Categorias
  document.addEventListener("click", function (e) {
    if (e.target.matches("[data-category]")) {
      handleCategoryChange(e.target.dataset.category);
    }
  });

  // Produtos - clique no card
  document.addEventListener("click", function (e) {
    const productCard = e.target.closest(".product-card");
    if (
      productCard &&
      !e.target.matches(".add-to-cart-btn, .add-to-cart-btn *")
    ) {
      const productId = parseInt(productCard.dataset.productId);
      openProductModal(productId);
    }
  });

  // Adicionar ao carrinho (botão rápido)
  document.addEventListener("click", function (e) {
    if (e.target.matches(".add-to-cart-btn, .add-to-cart-btn *")) {
      e.stopPropagation();
      const btn = e.target.closest(".add-to-cart-btn");
      const productId = parseInt(btn.dataset.productId);
      const product = mockData.products.find((p) => p.id === productId);
      if (product) {
        appState.addToCart(product);
      }
    }
  });

  // Toggle de visualização
  document
    .getElementById("gridViewBtn")
    ?.addEventListener("click", () => setViewMode("grid"));
  document
    .getElementById("listViewBtn")
    ?.addEventListener("click", () => setViewMode("list"));

  // Carrinho
  document
    .getElementById("cartToggleBtn")
    ?.addEventListener("click", toggleCart);
  document.getElementById("closeCartBtn")?.addEventListener("click", closeCart);
  document
    .getElementById("clearCartBtn")
    ?.addEventListener("click", handleClearCart);
  document
    .getElementById("checkoutBtn")
    ?.addEventListener("click", handleCheckout);

  // Eventos do carrinho (delegação)
  document
    .getElementById("cartItems")
    ?.addEventListener("click", handleCartActions);
  document
    .getElementById("cartItems")
    ?.addEventListener("input", handleCartQuantityChange);

  // Modal do produto
  document
    .getElementById("addToCartBtn")
    ?.addEventListener("click", handleModalAddToCart);
  document
    .getElementById("increaseQty")
    ?.addEventListener("click", () => updateModalQuantity(1));
  document
    .getElementById("decreaseQty")
    ?.addEventListener("click", () => updateModalQuantity(-1));

  // Fechar carrinho ao clicar fora
  document.addEventListener("click", function (e) {
    if (
      appState.isCartOpen &&
      !e.target.closest(".cart-sidebar") &&
      !e.target.closest(".cart-toggle-btn")
    ) {
      closeCart();
    }
  });

  // Teclas de atalho
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeCart();
      bootstrap.Modal.getInstance(
        document.getElementById("productModal")
      )?.hide();
    }
  });
}

// ===== HANDLERS =====
function handleSearch(e) {
  appState.searchTerm = e.target.value;
  renderProducts();
}

function handleCategoryChange(categoryId) {
  appState.currentCategory = categoryId;

  // Atualizar classes ativas
  document.querySelectorAll("[data-category]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.category === categoryId);
  });

  renderProducts();

  // Fechar menu mobile se estiver aberto
  const offcanvas = bootstrap.Offcanvas.getInstance(
    document.getElementById("mobileMenu")
  );
  if (offcanvas) offcanvas.hide();
}

function setViewMode(mode) {
  appState.viewMode = mode;

  // Atualizar botões
  document
    .getElementById("gridViewBtn")
    ?.classList.toggle("active", mode === "grid");
  document
    .getElementById("listViewBtn")
    ?.classList.toggle("active", mode === "list");

  renderProducts();
}

function toggleCart() {
  if (appState.isCartOpen) {
    closeCart();
  } else {
    openCart();
  }
}

function openCart() {
  appState.isCartOpen = true;
  document.getElementById("cartSidebar")?.classList.add("show");
}

function closeCart() {
  appState.isCartOpen = false;
  document.getElementById("cartSidebar")?.classList.remove("show");
}

function handleClearCart() {
  if (appState.cart.length === 0) return;

  if (confirm("Tem certeza que deseja limpar o carrinho?")) {
    appState.clearCart();
  }
}

function handleCheckout() {
  if (appState.cart.length === 0) {
    appState.showToast("Carrinho vazio!", "error");
    return;
  }

  // Simular processo de checkout
  appState.showToast("Redirecionando para pagamento...", "success");

  // Aqui você integraria com seu sistema de pagamento
  setTimeout(() => {
    alert(
      "Pedido realizado com sucesso!\n\nDetalhes:\n" +
        appState.cart
          .map((item) => `${item.name} (${item.quantity}x)`)
          .join("\n") +
        `\n\nTotal: R$ ${appState.getCartTotal().toFixed(2)}`
    );
    appState.clearCart();
    closeCart();
  }, 2000);
}

function handleCartActions(e) {
  const cartId =
    e.target.dataset.cartId ||
    e.target.closest("[data-cart-id]")?.dataset.cartId;
  if (!cartId) return;

  if (e.target.matches(".remove-item-btn, .remove-item-btn *")) {
    appState.removeFromCart(cartId);
  } else if (e.target.matches(".increase-qty")) {
    const item = appState.cart.find((item) => item.cartId == cartId);
    if (item) appState.updateQuantity(cartId, item.quantity + 1);
  } else if (e.target.matches(".decrease-qty")) {
    const item = appState.cart.find((item) => item.cartId == cartId);
    if (item) appState.updateQuantity(cartId, item.quantity - 1);
  }
}

function handleCartQuantityChange(e) {
  if (e.target.matches(".qty-input")) {
    const cartId = e.target.dataset.cartId;
    const newQuantity = parseInt(e.target.value);
    appState.updateQuantity(cartId, newQuantity);
  }
}

function openProductModal(productId) {
  const product = mockData.products.find((p) => p.id === productId);
  if (!product) return;

  // Preencher modal
  document.getElementById("productModalTitle").textContent = product.name;
  document.getElementById("productModalImage").src = product.image;
  document.getElementById("productModalImage").alt = product.name;
  document.getElementById("productModalDescription").textContent =
    product.description;
  document.getElementById(
    "productModalPrice"
  ).textContent = `R$ ${product.price.toFixed(2)}`;
  document.getElementById("modalQuantity").value = 1;
  document.getElementById("productObservations").value = "";

  // Armazenar produto atual
  document.getElementById("productModal").dataset.productId = productId;

  // Mostrar modal
  const modal = new bootstrap.Modal(document.getElementById("productModal"));
  modal.show();
}

function updateModalQuantity(delta) {
  const input = document.getElementById("modalQuantity");
  const currentValue = parseInt(input.value);
  const newValue = Math.max(1, Math.min(10, currentValue + delta));
  input.value = newValue;
}

function handleModalAddToCart() {
  const productId = parseInt(
    document.getElementById("productModal").dataset.productId
  );
  const quantity = parseInt(document.getElementById("modalQuantity").value);
  const observations = document
    .getElementById("productObservations")
    .value.trim();

  const product = mockData.products.find((p) => p.id === productId);
  if (product) {
    appState.addToCart(product, quantity, observations);
    bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
  }
}

// ===== UTILITÁRIOS =====
function formatPrice(price) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ===== PERFORMANCE =====
// Usar debounce na busca para melhor performance
const debouncedSearch = debounce(handleSearch, 300);
document.addEventListener("DOMContentLoaded", function () {
  const searchInputs = document.querySelectorAll(
    "#searchInput, #mobileSearchInput"
  );
  searchInputs.forEach((input) => {
    input.removeEventListener("input", handleSearch);
    input.addEventListener("input", debouncedSearch);
  });
});

// ===== PWA SUPPORT (OPCIONAL) =====
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
