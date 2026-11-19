
const products = [
  {id:1,name:"Simsiz Bluetooth quloqchin",category:"Elektronika",price:129000,old:189000,rating:4.8,image:"https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500"},
  {id:2,name:"Aqlli elektron soat",category:"Elektronika",price:219000,old:299000,rating:4.7,image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"},
  {id:3,name:"Bluetooth kolonka",category:"Elektronika",price:159000,old:220000,rating:4.9,image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500"},
  {id:4,name:"Erkaklar krossovkasi",category:"Poyabzal",price:289000,old:359000,rating:4.6,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"},
  {id:5,name:"Ayollar sumkasi",category:"Kiyim",price:175000,old:245000,rating:4.8,image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500"},
  {id:6,name:"Stol chirog‘i",category:"Uy-ro‘zg‘or",price:99000,old:139000,rating:4.5,image:"https://images.unsplash.com/photo-1503602642458-232111445657?w=500"},
  {id:7,name:"Yuz parvarishi to‘plami",category:"Go‘zallik",price:145000,old:199000,rating:4.9,image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500"},
  {id:8,name:"Elektr blender",category:"Maishiy texnika",price:249000,old:329000,rating:4.7,image:"https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500"},
  {id:9,name:"Sport suv idishi",category:"Sport",price:49000,old:69000,rating:4.6,image:"https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500"},
  {id:10,name:"Yumshoq uy pled",category:"Uy-ro‘zg‘or",price:119000,old:159000,rating:4.8,image:"https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?w=500"},
  {id:11,name:"Quyosh ko‘zoynagi",category:"Kiyim",price:89000,old:129000,rating:4.5,image:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500"},
  {id:12,name:"Bolalar konstruktori",category:"Bolalar",price:139000,old:179000,rating:4.9,image:"https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500"},
  {id:13,name:"RGB mexanik klaviatura",category:"Elektronika",price:359000,old:449000,rating:4.8,image:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500"},
  {id:14,name:"Zamonaviy termos",category:"Uy-ro‘zg‘or",price:79000,old:109000,rating:4.7,image:"https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500"},
  {id:15,name:"Havo namlagich",category:"Maishiy texnika",price:189000,old:259000,rating:4.6,image:"https://images.unsplash.com/photo-1602928321679-560bb453f190?w=500"}
];

let cart = JSON.parse(localStorage.getItem("marketCart")) || [];
let favorites = JSON.parse(localStorage.getItem("marketFavorites")) || [];
let category = "Hammasi";
let search = "";
let visible = 10;
let slideIndex = 0;

const grid = document.getElementById("productGrid");

const formatMoney = number =>
  new Intl.NumberFormat("uz-UZ").format(number) + " so‘m";

function saveData() {
  localStorage.setItem("marketCart", JSON.stringify(cart));
  localStorage.setItem("marketFavorites", JSON.stringify(favorites));
  updateCount();
}

function updateCount() {
  document.getElementById("cartCount").textContent =
    cart.reduce((sum, item) => sum + item.qty, 0);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

// MAHSULOTLARNI CHIQARISH

function renderProducts() {
  let filtered = products.filter(product => {
    const categoryMatch =
      category === "Hammasi" || product.category === category;

    const searchMatch =
      (product.name + " " + product.category)
        .toLowerCase()
        .includes(search.toLowerCase());

    return categoryMatch && searchMatch;
  });

  const sort = document.getElementById("sortSelect").value;

  if (sort === "cheap") {
    filtered.sort((a, b) => a.price - b.price);
  }

  if (sort === "expensive") {
    filtered.sort((a, b) => b.price - a.price);
  }

  grid.innerHTML = "";

  if (!filtered.length) {
    grid.innerHTML = `
      <div style="padding:30px;color:#888">
        Mahsulot topilmadi.
      </div>
    `;
    return;
  }

  filtered.slice(0, visible).forEach(product => {
    const discount = Math.round(
      (1 - product.price / product.old) * 100
    );

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.src='https://placehold.co/400x300?text=Product'"
        >

        <span class="discount">-${discount}%</span>

        <button class="heart ${
          favorites.includes(product.id) ? "active" : ""
        }" data-favorite="${product.id}">♡</button>
      </div>

      <div class="product-info">
        <p class="product-title">${product.name}</p>

        <div class="rating">
          <span>★</span> ${product.rating} · 120 ta sharh
        </div>

        <div class="old-price">${formatMoney(product.old)}</div>

        <div class="price">${formatMoney(product.price)}</div>

        <span class="installment">
          ${formatMoney(Math.ceil(product.price / 12))} / 12 oy
        </span>

        <button class="add-btn" data-add="${product.id}">
          ＋ Savatga
        </button>
      </div>
    `;

    grid.appendChild(card);
  });

  document.getElementById("loadMore").style.display =
    filtered.length > visible ? "block" : "none";
}

// KATEGORIYALAR

function setCategory(value) {
  category = value;
  visible = 10;

  document.getElementById("sectionTitle").textContent =
    value === "Hammasi" ? "Ommabop mahsulotlar" : value;

  document.querySelectorAll("[data-filter]").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.filter === value
    );
  });

  renderProducts();
}

// SAVATGA QO‘SHISH

function addToCart(id) {
  const item = cart.find(product => product.id === id);

  if (item) {
    item.qty++;
  } else {
    cart.push({ id, qty: 1 });
  }

  saveData();
  showToast("Mahsulot savatga qo‘shildi!");
}

// SAVATNI OCHISH

function openCart() {
  document.getElementById("overlay").classList.remove("hidden");
  document.getElementById("cartDrawer").classList.remove("hidden");

  renderCart();
}

function closeAll() {
  document.getElementById("overlay").classList.add("hidden");
  document.getElementById("cartDrawer").classList.add("hidden");

  document.querySelectorAll(".modal").forEach(modal => {
    modal.classList.add("hidden");
  });
}

// SAVAT MAHSULOTLARI

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";

  if (!cart.length) {
    cartItems.innerHTML = `
      <div style="text-align:center;padding:60px 10px;color:#999">
        <div style="font-size:45px">🛒</div>
        <h3>Savatingiz bo‘sh</h3>
        <p>Mahsulotlarni savatga qo‘shing.</p>
      </div>
    `;

    document.querySelector(".cart-bottom").style.display = "none";
    return;
  }

  document.querySelector(".cart-bottom").style.display = "block";

  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);

    if (!product) return;

    const row = document.createElement("div");
    row.className = "cart-row";

    row.innerHTML = `
      <img src="${product.image}" alt="${product.name}">

      <div>
        <h4>${product.name}</h4>
        <strong>${formatMoney(product.price * item.qty)}</strong>

        <div class="qty">
          <button data-qty="${product.id}" data-step="-1">−</button>
          <span>${item.qty}</span>
          <button data-qty="${product.id}" data-step="1">+</button>
        </div>
      </div>

      <button class="remove" data-remove="${product.id}">×</button>
    `;

    cartItems.appendChild(row);
  });

  const total = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + product.price * item.qty;
  }, 0);

  document.getElementById("cartTotal").textContent =
    formatMoney(total);
}

// SEVIMLILAR

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(item => item !== id);
    showToast("Sevimlilardan olib tashlandi");
  } else {
    favorites.push(id);
    showToast("Sevimlilarga qo‘shildi");
  }

  saveData();
  renderProducts();
}

// BARCHA TUGMALAR

document.addEventListener("click", event => {

  const add = event.target.closest("[data-add]");

  if (add) {
    addToCart(Number(add.dataset.add));

    add.textContent = "✓ Qo‘shildi";

    setTimeout(() => {
      add.textContent = "＋ Savatga";
    }, 900);
  }

  const favorite = event.target.closest("[data-favorite]");

  if (favorite) {
    toggleFavorite(Number(favorite.dataset.favorite));
  }

  const qty = event.target.closest("[data-qty]");

  if (qty) {
    const id = Number(qty.dataset.qty);
    const item = cart.find(p => p.id === id);

    item.qty += Number(qty.dataset.step);

    if (item.qty <= 0) {
      cart = cart.filter(p => p.id !== id);
    }

    saveData();
    renderCart();
  }

  const remove = event.target.closest("[data-remove]");

  if (remove) {
    cart = cart.filter(
      p => p.id !== Number(remove.dataset.remove)
    );

    saveData();
    renderCart();
  }

  const filter = event.target.closest("[data-filter]");

  if (filter) {
    setCategory(filter.dataset.filter);
  }

  const nav = event.target.closest("[data-category]");

  if (nav) {
    event.preventDefault();
    setCategory(nav.dataset.category);

    document.getElementById("products").scrollIntoView({
      behavior: "smooth"
    });
  }

  if (event.target.closest("[data-scroll]")) {
    document.getElementById("products").scrollIntoView({
      behavior: "smooth"
    });
  }

  if (event.target.closest("[data-close]")) {
    closeAll();
  }
});

// QIDIRUV

function performSearch() {
  search = document.getElementById("searchInput").value.trim();

  category = "Hammasi";
  visible = 20;

  document.getElementById("sectionTitle").textContent =
    search ? `"${search}" bo‘yicha natijalar` : "Ommabop mahsulotlar";

  renderProducts();

  document.getElementById("products").scrollIntoView({
    behavior: "smooth"
  });
}

document.getElementById("searchBtn").onclick = performSearch;

document.getElementById("searchInput").addEventListener("keydown", e => {
  if (e.key === "Enter") performSearch();
});

document.getElementById("sortSelect").onchange = renderProducts;

// KO‘PROQ MAHSULOT

document.getElementById("loadMore").onclick = () => {
  visible += 5;
  renderProducts();
};

// SAVAT TUGMALARI

document.getElementById("cartBtn").onclick = openCart;

document.getElementById("closeCart").onclick = closeAll;

document.getElementById("overlay").onclick = closeAll;

// KATALOG

document.getElementById("catalogBtn").onclick = () => {
  setCategory("Hammasi");

  document.getElementById("products").scrollIntoView({
    behavior: "smooth"
  });
};

// SEVIMLILAR SAHIFASI

document.getElementById("favoriteBtn").onclick = () => {
  category = "Hammasi";
  search = "";

  const favoriteProducts = products.filter(p =>
    favorites.includes(p.id)
  );

  grid.innerHTML = "";

  document.getElementById("sectionTitle").textContent =
    "Sevimli mahsulotlar";

  if (!favoriteProducts.length) {
    grid.innerHTML = "<p>Sevimli mahsulotlar hozircha yo‘q.</p>";
  }

  favoriteProducts.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <p class="product-title">${product.name}</p>
        <div class="price">${formatMoney(product.price)}</div>
        <button class="add-btn" data-add="${product.id}">
          ＋ Savatga
        </button>
      </div>
    `;

    grid.appendChild(card);
  });

  document.getElementById("products").scrollIntoView({
    behavior: "smooth"
  });
};

// LOGIN

document.getElementById("loginBtn").onclick = () => {
  document.getElementById("overlay").classList.remove("hidden");
  document.getElementById("loginModal").classList.remove("hidden");
};

document.getElementById("loginForm").onsubmit = event => {
  event.preventDefault();
  closeAll();
  showToast("Demo kirish. SMS xizmati ulanmagan.");
};

// BUYURTMA

document.getElementById("checkoutBtn").onclick = () => {
  if (!cart.length) {
    showToast("Savatingiz bo‘sh!");
    return;
  }

  document.getElementById("cartDrawer").classList.add("hidden");
  document.getElementById("checkoutModal").classList.remove("hidden");
};

document.getElementById("checkoutForm").onsubmit = event => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const order = Object.fromEntries(formData);

  const total = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + product.price * item.qty;
  }, 0);

  const orders = JSON.parse(
    localStorage.getItem("marketOrders") || "[]"
  );

  orders.push({
    ...order,
    products: cart,
    total,
    date: new Date().toLocaleString("uz-UZ")
  });

  localStorage.setItem("marketOrders", JSON.stringify(orders));

  cart = [];
  saveData();

  event.target.reset();
  closeAll();

  showToast("Buyurtmangiz qabul qilindi!");
};

// CAROUSEL

function changeSlide(index) {
  const slides = document.querySelectorAll(".slide");

  slideIndex = (index + slides.length) % slides.length;

  document.getElementById("slider").style.transform =
    `translateX(-${slideIndex * 100}%)`;
}

document.getElementById("next").onclick = () => {
  changeSlide(slideIndex + 1);
};

document.getElementById("prev").onclick = () => {
  changeSlide(slideIndex - 1);
};

let sliderTimer = setInterval(() => {
  changeSlide(slideIndex + 1);
}, 5000);

document.querySelector(".hero").addEventListener("mouseenter", () => {
  clearInterval(sliderTimer);
});

document.querySelector(".hero").addEventListener("mouseleave", () => {
  sliderTimer = setInterval(() => {
    changeSlide(slideIndex + 1);
  }, 5000);
});

// DASTLABKI ISHGA TUSHIRISH

renderProducts();
updateCount();
