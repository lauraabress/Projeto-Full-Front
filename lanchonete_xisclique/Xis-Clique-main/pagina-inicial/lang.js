// Sistema de internacionalização moderno
class LanguageManager {
  constructor() {
    this.currentLang = localStorage.getItem("selectedLanguage") || "pt";
    this.translations = {};
    this.init();
  }

  async init() {
    await this.loadTranslations();
    this.setupEventListeners();
    this.applyLanguage(this.currentLang);
  }

  async loadTranslations() {
    this.translations = {
      pt: {
        // Navbar
        "navbar.search.placeholder": "Buscar delícias...",
        "navbar.cart": "Carrinho",
        "navbar.language": "Idioma",
        "navbar.menu": "Menu",

        // Hero Section
        "hero.title": "Sabores que Conquistam",
        "hero.subtitle": "Descubra nossa seleção especial de delícias",
        "hero.cta": "Explorar Cardápio",

        // Products Section
        "products.title": "Nosso Cardápio",
        "products.subtitle": "Escolha seus sabores favoritos",

        // Category Filters
        "filter.all": "Todos",
        "filter.lanches": "Lanches",
        "filter.bebidas": "Bebidas",
        "filter.doces": "Doces",
        "filter.saudaveis": "Saudáveis",

        // Product Cards
        "product.add": "Adicionar",
        "product.view": "Ver Detalhes",

        // Product Modal
        "modal.quantity": "Quantidade:",
        "modal.addToCart": "Adicionar ao Carrinho",
        "modal.close": "Fechar",

        // Cart Modal
        "cart.title": "Seu Pedido",
        "cart.empty": "Seu carrinho está vazio",
        "cart.empty.subtitle": "Adicione alguns itens deliciosos!",
        "cart.total": "Total:",
        "cart.checkout": "Finalizar Pedido",
        "cart.clear": "Limpar Carrinho",
        "cart.remove": "Remover",

        // Toast Messages
        "toast.added": "adicionado ao carrinho!",
        "toast.removed": "Item removido do carrinho",
        "toast.cleared": "Carrinho limpo",
        "toast.error": "Erro ao carregar produtos",
        "toast.checkout": "Redirecionando para pagamento...",
        "toast.success":
          "Pedido finalizado com sucesso! Em breve você receberá a confirmação.",
        "toast.empty.cart": "Adicione itens ao carrinho primeiro",

        // Confirmations
        "confirm.clear.cart": "Tem certeza que deseja limpar o carrinho?",

        // Loading
        "loading.products": "Carregando produtos...",

        // Currency
        "currency.symbol": "R$",

        // Time/Date
        "time.now": "agora",
        "time.minutes": "minutos atrás",

        // Categories (for filtering)
        "category.hamburger": "hambúrguer",
        "category.pizza": "pizza",
        "category.drink": "bebida",
        "category.dessert": "sobremesa",
      },

      en: {
        // Navbar
        "navbar.search.placeholder": "Search delicacies...",
        "navbar.cart": "Cart",
        "navbar.language": "Language",
        "navbar.menu": "Menu",

        // Hero Section
        "hero.title": "Conquering Flavors",
        "hero.subtitle": "Discover our special selection of delicacies",
        "hero.cta": "Explore Menu",

        // Products Section
        "products.title": "Our Menu",
        "products.subtitle": "Choose your favorite flavors",

        // Category Filters
        "filter.all": "All",
        "filter.lanches": "Meals",
        "filter.bebidas": "Drinks",
        "filter.doces": "Sweets",
        "filter.saudaveis": "Healthy",

        // Product Cards
        "product.add": "Add",
        "product.view": "View Details",

        // Product Modal
        "modal.quantity": "Quantity:",
        "modal.addToCart": "Add to Cart",
        "modal.close": "Close",

        // Cart Modal
        "cart.title": "Your Order",
        "cart.empty": "Your cart is empty",
        "cart.empty.subtitle": "Add some delicious items!",
        "cart.total": "Total:",
        "cart.checkout": "Checkout",
        "cart.clear": "Clear Cart",
        "cart.remove": "Remove",

        // Toast Messages
        "toast.added": "added to cart!",
        "toast.removed": "Item removed from cart",
        "toast.cleared": "Cart cleared",
        "toast.error": "Error loading products",
        "toast.checkout": "Redirecting to payment...",
        "toast.success":
          "Order completed successfully! You will receive confirmation shortly.",
        "toast.empty.cart": "Add items to cart first",

        // Confirmations
        "confirm.clear.cart": "Are you sure you want to clear the cart?",

        // Loading
        "loading.products": "Loading products...",

        // Currency
        "currency.symbol": "$",

        // Time/Date
        "time.now": "now",
        "time.minutes": "minutes ago",

        // Categories (for filtering)
        "category.hamburger": "hamburger",
        "category.pizza": "pizza",
        "category.drink": "drink",
        "category.dessert": "dessert",
      },
    };
  }

  setupEventListeners() {
    // Language dropdown items
    document
      .querySelectorAll(".lang-dropdown .dropdown-item")
      .forEach((item) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          const lang = e.target.dataset.lang;
          this.changeLanguage(lang);
        });
      });

    // Update language button text
    this.updateLanguageButton();
  }

  changeLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem("selectedLanguage", lang);
      this.applyLanguage(lang);
      this.updateLanguageButton();
      this.showLanguageChangeToast();
    }
  }

  applyLanguage(lang) {
    const elements = document.querySelectorAll("[data-i18n]");

    elements.forEach((element) => {
      const key = element.dataset.i18n;
      const translation = this.getTranslation(key, lang);

      if (translation) {
        if (
          element.tagName === "INPUT" &&
          element.type !== "button" &&
          element.type !== "submit"
        ) {
          element.placeholder = translation;
        } else {
          element.textContent = translation;
        }
      }
    });

    // Update document language
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";

    // Update meta description if exists
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      const descKey =
        lang === "pt" ? "meta.description.pt" : "meta.description.en";
      const description = this.getTranslation(descKey, lang);
      if (description) {
        metaDescription.content = description;
      }
    }

    // Trigger custom event for other components
    document.dispatchEvent(
      new CustomEvent("languageChanged", {
        detail: { language: lang, translations: this.translations[lang] },
      })
    );
  }

  updateLanguageButton() {
    const langButton = document.getElementById("currentLangText");
    if (langButton) {
      langButton.textContent = this.currentLang.toUpperCase();
    }

    // Update flag emoji if needed
    const flagEmojis = {
      pt: "🇧🇷",
      en: "🇺🇸",
    };

    const langDropdown = document.getElementById("langDropdown");
    if (langDropdown) {
      const flagSpan = langDropdown.querySelector(".flag-emoji");
      if (flagSpan) {
        flagSpan.textContent = flagEmojis[this.currentLang];
      }
    }
  }

  getTranslation(key, lang = null) {
    const targetLang = lang || this.currentLang;
    return this.translations[targetLang]?.[key] || key;
  }

  // Method for dynamic content translation
  translateText(text, lang = null) {
    const targetLang = lang || this.currentLang;
    return this.getTranslation(text, targetLang);
  }

  // Format currency based on language
  formatCurrency(amount, lang = null) {
    const targetLang = lang || this.currentLang;
    const symbol = this.getTranslation("currency.symbol", targetLang);

    if (targetLang === "en") {
      return `${symbol}${amount.toFixed(2)}`;
    } else {
      return `${symbol} ${amount.toFixed(2).replace(".", ",")}`;
    }
  }

  // Format numbers based on language
  formatNumber(number, lang = null) {
    const targetLang = lang || this.currentLang;

    if (targetLang === "en") {
      return number.toLocaleString("en-US");
    } else {
      return number.toLocaleString("pt-BR");
    }
  }

  showLanguageChangeToast() {
    const message =
      this.currentLang === "pt"
        ? "Idioma alterado para Português"
        : "Language changed to English";

    // Create and show toast
    this.showToast(message, "success");
  }

  showToast(message, type = "success") {
    // Create toast element if it doesn't exist
    let toastContainer = document.querySelector(".toast-language-container");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.className =
        "toast-language-container position-fixed top-0 end-0 p-3";
      toastContainer.style.zIndex = "9999";
      document.body.appendChild(toastContainer);
    }

    const toastId = "toast-lang-" + Date.now();
    const toastHTML = `
            <div id="${toastId}" class="toast toast-${type}" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-body d-flex align-items-center">
                    <i class="fas fa-globe me-2"></i>
                    <span>${message}</span>
                </div>
            </div>
        `;

    toastContainer.insertAdjacentHTML("beforeend", toastHTML);

    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, {
      autohide: true,
      delay: 3000,
    });

    toast.show();

    // Remove toast element after it's hidden
    toastElement.addEventListener("hidden.bs.toast", () => {
      toastElement.remove();
    });
  }

  // Get current language
  getCurrentLanguage() {
    return this.currentLang;
  }

  // Check if RTL language (for future Arabic/Hebrew support)
  isRTL(lang = null) {
    const targetLang = lang || this.currentLang;
    const rtlLanguages = ["ar", "he", "fa", "ur"];
    return rtlLanguages.includes(targetLang);
  }

  // Add translation key dynamically (for plugins/extensions)
  addTranslation(key, translations) {
    Object.keys(translations).forEach((lang) => {
      if (this.translations[lang]) {
        this.translations[lang][key] = translations[lang];
      }
    });
  }

  // Translate product names if needed
  translateProduct(product, lang = null) {
    const targetLang = lang || this.currentLang;

    // Define product name translations
    const productTranslations = {
      en: {
        "Hambúrguer Clássico 🍔": "Classic Hamburger 🍔",
        "Cheeseburger Duplo 🧀🍔": "Double Cheeseburger 🧀🍔",
        "X-Bacon 🥓🍔": "Bacon Burger 🥓🍔",
        "Cachorro-Quente 🌭": "Hot Dog 🌭",
        "Cachorro-Quente Duplo 🌭🌭": "Double Hot Dog 🌭🌭",
        "Pizza Mussarela 🍕": "Mozzarella Pizza 🍕",
        "Pizza Calabresa 🍕": "Pepperoni Pizza 🍕",
        "Pizza Frango Catupiry 🍕": "Chicken Catupiry Pizza 🍕",
        "Batata Frita 🍟": "French Fries 🍟",
        "Batata com Cheddar e Bacon 🧀🥓": "Fries with Cheddar and Bacon 🧀🥓",
        "Refrigerante Lata 🥤": "Soda Can 🥤",
        "Refrigerante 600ml 🥤": "Soda 600ml 🥤",
        "Suco Natural 🍊": "Fresh Juice 🍊",
        "Milkshake Morango 🍓": "Strawberry Milkshake 🍓",
        "Milkshake Chocolate 🍫": "Chocolate Milkshake 🍫",
        "Açaí 300ml 🥶": "Açaí 300ml 🥶",
        "Açaí 500ml 🥶": "Açaí 500ml 🥶",
        "Pão de Queijo 🧀": "Cheese Bread 🧀",
        "Croissant 🥐": "Croissant 🥐",
        "Pastel Carne 🥟": "Beef Pastel 🥟",
        "Pastel Queijo 🥟🧀": "Cheese Pastel 🥟🧀",
        "Salada Tropical 🥗": "Tropical Salad 🥗",
        "Salada Caesar 🥗": "Caesar Salad 🥗",
        "Wrap Frango 🌯": "Chicken Wrap 🌯",
        "Wrap Vegetariano 🌯": "Vegetarian Wrap 🌯",
        "Hot Roll Sushi 🍣": "Hot Roll Sushi 🍣",
        "Temaki Salmão 🍣": "Salmon Temaki 🍣",
        "Brownie 🍫": "Brownie 🍫",
        "Bolo Cenoura 🍰": "Carrot Cake 🍰",
        "Churros Doce de Leite 🍩": "Dulce de Leche Churros 🍩",
      },
    };

    if (targetLang === "en" && productTranslations.en[product.name]) {
      return {
        ...product,
        name: productTranslations.en[product.name],
      };
    }

    return product;
  }
}

// Initialize language manager
const languageManager = new LanguageManager();

// Export for global use
window.languageManager = languageManager;

// Add data-i18n attributes to HTML elements automatically when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Add i18n attributes to common elements
  const elementsToTranslate = [
    {
      selector: "#searchInput",
      key: "navbar.search.placeholder",
      attr: "placeholder",
    },
    { selector: ".hero-title", key: "hero.title" },
    { selector: ".hero-subtitle", key: "hero.subtitle" },
    { selector: ".btn-hero span", key: "hero.cta" },
    { selector: ".section-title", key: "products.title" },
    { selector: ".section-subtitle", key: "products.subtitle" },
    { selector: '[data-category="all"]', key: "filter.all" },
    { selector: '[data-category="lanches"]', key: "filter.lanches" },
    { selector: '[data-category="bebidas"]', key: "filter.bebidas" },
    { selector: '[data-category="doces"]', key: "filter.doces" },
    { selector: '[data-category="saudaveis"]', key: "filter.saudaveis" },
    { selector: "#addToCartBtn span", key: "modal.addToCart" },
    { selector: ".quantity-label", key: "modal.quantity" },
    { selector: ".modal-title", key: "cart.title" },
    { selector: ".total-label", key: "cart.total" },
    { selector: "#checkoutBtn", key: "cart.checkout" },
    { selector: "#clearCartBtn", key: "cart.clear" },
    { selector: ".cart-empty h5", key: "cart.empty" },
    { selector: ".cart-empty p", key: "cart.empty.subtitle" },
  ];

  elementsToTranslate.forEach(({ selector, key, attr }) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      element.setAttribute("data-i18n", key);
      if (attr) {
        element.setAttribute("data-i18n-attr", attr);
      }
    });
  });

  // Apply initial language
  setTimeout(() => {
    languageManager.applyLanguage(languageManager.getCurrentLanguage());
  }, 100);
});
