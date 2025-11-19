const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initTabs();
  initAccordion();
  initGalleryLightbox();
  initProducts();
  initMap();
  if (typeof initSocialShare === "function") initSocialShare();
  initFormHandlers();
});

//Nav toggle (mobile)
function initNavToggle() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    links.classList.toggle("open");
  });
}

function initTabs() {
  const tabButtons = $$(".tab-btn");
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const panels = $$(".tab-panel");
      panels.forEach((p) => p.classList.remove("active"));

      const target = btn.dataset.tabTarget;
      const panel = document.querySelector(target);
      if (panel) panel.classList.add("active");
    });
  });
}

function initAccordion() {
  const items = $$(".accordion-item");
  items.forEach((item) => {
    const toggle = item.querySelector(".accordion-toggle");
    const panel = item.querySelector(".accordion-panel");
    if (!toggle || !panel) return;
    toggle.addEventListener("click", () => {
      const open = panel.classList.contains("open");
      if (open) {
        panel.style.maxHeight = null;
        panel.classList.remove("open");
      } else {
        panel.classList.add("open");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
    if (panel.classList.contains("open"))
      panel.style.maxHeight = panel.scrollHeight + "px";
  });
}

function initGalleryLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const galleryImages = $$(".gallery-img");

  galleryImages.forEach((img) => {
    img.addEventListener("click", () => {
      openLightbox(img);
    });
  });

  document.addEventListener("click", (e) => {
    if (!lightbox) return;
    if (
      e.target.closest(".modal-close") ||
      e.target.classList.contains("modal-backdrop")
    ) {
      closeModal(lightbox);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (lightbox && !lightbox.classList.contains("hidden"))
        closeModal(lightbox);
      const generalModal = document.getElementById("generalModal");
      if (generalModal && !generalModal.classList.contains("hidden"))
        closeModal(generalModal);
    }
  });

  function openLightbox(img) {
    if (!lightbox) return;
    lightboxImage.src = img.src;
    lightboxCaption.textContent = img.alt || "";
    openModal(lightbox);
  }
}

function openModal(modal) {
  if (!modal) return;
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}
function closeModal(modal) {
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

async function initProducts() {
  const products = [
    {
      id: 1,
      name: "Cheirosa 62",
      price: 45,
      img: "images/collection_picture2.jpg",
      desc: "Pistachio & salted caramel.",
      location: [51.5136, -0.1365],
    },
    {
      id: 2,
      name: "Cheirosa 40",
      price: 42,
      img: "images/collection_picture3.jpg",
      desc: "Black amber & vanilla woods.",
      location: [51.5098, -0.118],
    },
    {
      id: 3,
      name: "Cheirosa 71",
      price: 48,
      img: "images/collection_picture4.jpg",
      desc: "Sea salt & caramelised vanilla.",
      location: [51.5074, -0.1278],
    },
    {
      id: 4,
      name: "Bum Bum Cream",
      price: 30,
      img: "images/bumbum_cream.jpg",
      desc: "Firming and hydrating body cream.",
      location: [51.5155, -0.0922],
    },
    {
      id: 5,
      name: "Radiance Body Oil",
      price: 28,
      img: "images/collection_picture5.jpg",
      desc: "Lightweight glow oil.",
      location: [51.5107, -0.12],
    },
  ];

  const grid = document.getElementById("productGrid");
  const search = document.getElementById("searchInput");
  const sort = document.getElementById("sortSelect");
  const modal = document.getElementById("generalModal");
  const modalBody = document.getElementById("modalBody");

  if (!grid) return;

  // 2. Load Cart from LocalStorage (PERSISTENCE FIX)
  let cart = JSON.parse(localStorage.getItem("sol_cart")) || [];

  function render(list) {
    grid.innerHTML = "";
    list.forEach((p) => {
      // Check if in cart
      const isAdded = cart.includes(p.id);

      const el = document.createElement("div");
      el.className = "card product-card";
      el.dataset.id = p.id;
      el.innerHTML = `
        <div class="card-body">
          <img src="${p.img}" alt="${escapeHtml(
        p.name
      )}" class="img img-responsive rounded" />
          <h5>${escapeHtml(p.name)}</h5>
          <p class="product-desc">${escapeHtml(p.desc)}</p>
          <p class="product-price">£${p.price}</p>
          <div style="margin-top:8px;">
            <button class="btn ghost quickview">Quick view</button>
            <button class="btn add-btn" data-add="${p.id}" ${
        isAdded ? "disabled" : ""
      }>
                ${isAdded ? "Added" : "Add"}
            </button>
          </div>
        </div>
      `;
      el.addEventListener("click", (e) => {
        // Handle Add to Cart
        if (e.target.closest("button[data-add]")) {
          if (!cart.includes(p.id)) {
            cart.push(p.id);
            localStorage.setItem("sol_cart", JSON.stringify(cart)); // Save to storage
          }
          e.target.textContent = "Added";
          e.target.disabled = true;
          e.stopPropagation(); // prevent opening modal
          return;
        }
        // Handle Quick View
        if (e.target.closest(".quickview")) {
          openProductModal(p);
          return;
        }
        openProductModal(p);
      });
      grid.appendChild(el);
    });
  }

  // Initial Render
  render(products);

  // Search & Sort
  if (search) {
    search.addEventListener("input", () => applyFilters());
  }
  if (sort) {
    sort.addEventListener("change", () => applyFilters());
  }

  function applyFilters() {
    const q = search ? search.value.trim().toLowerCase() : "";
    let filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
    );

    const s = sort ? sort.value : "default";
    if (s === "price-asc") filtered.sort((a, b) => a.price - b.price);
    if (s === "price-desc") filtered.sort((a, b) => b.price - a.price);
    if (s === "name-asc") filtered.sort((a, b) => a.name.localeCompare(b.name));
    render(filtered);
  }

  function openProductModal(product) {
    if (!modal) return;
    // Check if in cart for modal button state
    const isAdded = cart.includes(product.id);

    modalBody.innerHTML = `
      <h3>${escapeHtml(product.name)}</h3>
      <img src="${product.img}" alt="${escapeHtml(
      product.name
    )}" style="max-width:100%;border-radius:8px;margin:12px 0;">
      <p>${escapeHtml(product.desc)}</p>
      <p><strong>Price:</strong> £${product.price}</p>
      <button class="btn" id="modalAdd" ${isAdded ? "disabled" : ""}>
        ${isAdded ? "Item in Cart" : "Add to cart"}
      </button>
    `;

    const btn = $("#modalAdd", modalBody);
    btn.addEventListener("click", () => {
      if (!cart.includes(product.id)) {
        cart.push(product.id);
        localStorage.setItem("sol_cart", JSON.stringify(cart));
      }
      btn.textContent = "Item in Cart";
      btn.disabled = true;
      // Update grid button as well
      const gridBtn = document.querySelector(
        `button[data-add="${product.id}"]`
      );
      if (gridBtn) {
        gridBtn.textContent = "Added";
        gridBtn.disabled = true;
      }
      alert(`${product.name} added to cart.`);
      closeModal(modal);
    });
    openModal(modal);
  }

  document.addEventListener("click", (e) => {
    if (
      e.target.closest("#generalModal .modal-close") ||
      e.target.classList.contains("modal-backdrop")
    ) {
      closeModal(modal);
    }
  });
}

//Map (Leaflet)

function initMap() {
  if (typeof L === "undefined") return;
  const mapEl = document.getElementById("map");
  if (!mapEl) return;

  const map = L.map(mapEl).setView([51.5128, -0.1245], 13);

  mapEl._leaflet_map = map;
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  const sample = [
    { name: "Selfridges", coords: [51.5155, -0.141] },
    { name: "Harrods", coords: [51.4995, -0.1635] },
    { name: "John Lewis", coords: [51.5166, -0.101] },
  ];
  sample.forEach((s) => {
    L.marker(s.coords)
      .addTo(map)
      .bindPopup(`<strong>${escapeHtml(s.name)}</strong>`);
  });
}
//Forms & Validation

function initFormHandlers() {
  const enquiryForm = document.getElementById("enquiryForm");
  const contactForm = document.getElementById("contactForm");

  if (enquiryForm) bindEnquiryForm(enquiryForm);
  if (contactForm) bindContactForm(contactForm);
}

/* Simple XSS protection helper */
function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showError(input, message) {
  input.classList.add("is-invalid");
  const el = document.querySelector(`.error[data-for="${input.id}"]`);
  if (el) el.textContent = message;
}

function clearError(input) {
  input.classList.remove("is-invalid");
  const el = document.querySelector(`.error[data-for="${input.id}"]`);
  if (el) el.textContent = "";
}

function validateField(input) {
  clearError(input);
  const val = input.value.trim();

  if (
    input.required &&
    (val === "" || (input.type === "checkbox" && !input.checked))
  ) {
    showError(input, "This field is required.");
    return false;
  }
  if (input.type === "email" && val) {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    if (!ok) {
      showError(input, "Enter a valid email address.");
      return false;
    }
  }
  if (input.type === "tel" && val) {
    const ok = /^\+?[0-9\s\-]{7,20}$/.test(val);
    if (!ok) {
      showError(input, "Enter a valid phone number.");
      return false;
    }
  }
  if (input.minLength && val.length < input.minLength) {
    showError(input, `Please enter at least ${input.minLength} characters.`);
    return false;
  }
  return true;
}

function validateForm(form) {
  const inputs = Array.from(form.querySelectorAll("input,textarea,select"));
  let ok = true;
  inputs.forEach((input) => {
    if (input.classList.contains("js-hide") && input.style.display === "none")
      return;
    if (!validateField(input)) ok = false;
  });
  return ok;
}

async function postJSON(url, data) {
  // 1. Simulate Network Delay for realism
  await new Promise((resolve) => setTimeout(resolve, 800));

  // 2. Intercept Fake URLS (Fixes the Red Console Error)
  if (url.includes("example.com") || url.includes("/api/")) {
    console.log("MOCK API SUCCESS:", data);
    return { ok: true, simulated: true };
  }

  // 3. Real Fetch (Only runs if you use a Real API like Formspree)
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Network response not ok");
    return await res.json().catch(() => ({ ok: true }));
  } catch (err) {
    return { ok: false, _error: err.message };
  }
}

function bindEnquiryForm(form) {
  const type = form.querySelector("#enqType");
  const product = form.querySelector("#enqProduct");
  const qty = form.querySelector("#enqQuantity");
  const productFields = [product, qty];
  const productPriceMap = {
    cheirosa62: 45,
    cheirosa40: 42,
    cheirosa71: 48,
    bumbum: 30,
  };

  function updateFields() {
    const showProduct = type.value === "product";
    productFields.forEach((f) => {
      if (showProduct) {
        f.style.display = "";
        f.classList.remove("js-hide");
      } else {
        f.style.display = "none";
        f.classList.add("js-hide");
      }
    });
  }
  updateFields();
  type.addEventListener("change", updateFields);

  form.querySelectorAll("input,select,textarea").forEach((inp) => {
    inp.addEventListener("blur", () => validateField(inp));
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateForm(form)) {
      const result = document.getElementById("enquiryResult");
      if (result)
        result.innerHTML =
          '<p class="error">Please fix the errors in the form.</p>';
      return;
    }

    const data = {
      name: form.enqName.value.trim(),
      email: form.enqEmail.value.trim(),
      type: form.enqType.value,
      product: form.enqProduct ? form.enqProduct.value : "",
      quantity: form.enqQuantity ? Number(form.enqQuantity.value) : 0,
      message: form.enqMessage.value.trim(),
    };

    const result = document.getElementById("enquiryResult");
    if (result) result.innerHTML = "<p>Sending enquiry...</p>";

    const res = await postJSON(form.action, data);

    let responseHTML = `<h3>Enquiry received</h3><p>Thanks, ${escapeHtml(
      data.name
    )}.</p>`;

    if (data.type === "product" && data.product) {
      const price = productPriceMap[data.product] || 0;
      const total = price * data.quantity;
      responseHTML += `<p>Product: ${escapeHtml(
        data.product
      )}. Total: <strong>£${total}</strong>.</p>`;
    }

    if (res.ok) {
      responseHTML += `<p class="success">We will be in touch shortly at ${escapeHtml(
        data.email
      )}.</p>`;
      form.reset();
      updateFields();
    } else {
      responseHTML += `<p class="error">Error: ${
        res._error || "Could not send"
      }</p>`;
    }
    if (result) result.innerHTML = responseHTML;
  });
}

function bindContactForm(form) {
  form.querySelectorAll("input,select,textarea").forEach((inp) => {
    inp.addEventListener("blur", () => validateField(inp));
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const result = document.getElementById("contactResult");
    if (result) result.innerHTML = "<p>Sending message...</p>";

    const payload = {
      name: form.cName.value,
      email: form.cEmail.value,
      message: form.cMessage.value,
    };

    const res = await postJSON(form.action, payload);

    if (res.ok) {
      if (result)
        result.innerHTML =
          '<p class="success">Message sent successfully! We will reply shortly.</p>';
      form.reset();
    } else {
      if (result)
        result.innerHTML =
          '<p class="error">Server error — please try again later.</p>';
    }
  });
}

/* Social share helper */
function initSocialShare() {
  const shareLinks = document.querySelectorAll(".social-share");
  shareLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const network = a.dataset.network;
      const pageUrl = location.href;
      const title = document.title;
      let url = "#";
      if (network === "twitter") {
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title
        )}&url=${encodeURIComponent(pageUrl)}`;
      } else if (network === "facebook") {
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          pageUrl
        )}`;
      }
      window.open(url, "_blank", "width=640,height=480");
    });
  });
}
const form = document.getElementById("contactForm");
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  formData.append("access_key", "42178a9e-f057-4d7f-9df9-2897ef380633");

  const originalText = submitBtn.textContent;

  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      alert("Success! Your message has been sent.");
      form.reset();
    } else {
      alert("Error: " + data.message);
    }
  } catch (error) {
    alert("Something went wrong. Please try again.");
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});
function initTabs() {
  const tabButtons = $$(".tab-btn");
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // 1. Switch Active Button
      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // 2. Switch Active Panel
      const panels = $$(".tab-panel");
      panels.forEach((p) => p.classList.remove("active"));

      const target = btn.dataset.tabTarget;
      const panel = document.querySelector(target);
      if (panel) panel.classList.add("active");

      if (target === "#tab-map") {
        setTimeout(() => {
          const mapEl = document.getElementById("map");
          if (mapEl && mapEl._leaflet_map) {
            mapEl._leaflet_map.invalidateSize();
          }
        }, 200); // Short delay to allow the CSS transition to finish
      }
    });
  });
}
