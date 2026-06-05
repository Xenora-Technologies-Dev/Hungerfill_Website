(function () {
  "use strict";

  const depth = (document.querySelector("[data-base]") || {}).dataset?.base || "";
  const base = depth ? depth.replace(/\/?$/, "/") : "";

  function rel(path) {
    if (!path || path.startsWith("http") || path.startsWith("#") || path.startsWith("mailto:") || path.startsWith("tel:")) return path;
    return base + path.replace(/^\//, "");
  }

  function imgPath(path) {
    if (!path || path.startsWith("http")) return path;
    return rel(path.split("/").map((seg, i) => (i === 0 ? seg : encodeURIComponent(seg))).join("/"));
  }

  const c = typeof HUNGERFILL_DATA !== "undefined" ? HUNGERFILL_DATA.company : {
    name: "Hungerfill Foods",
    legal: "Hunger Fill Foodstuff Trading LLC",
    email: "info@hungerfill.com",
    sales: "sales@hungerfill.com",
    phone: "050 5056049",
    address: "Dubai, U.A.E",
    linkedin: "https://www.linkedin.com/company/hungerfill-foods/",
    instagram: "https://www.instagram.com/hungerfillfoods"
  };

  const dropdown = typeof HUNGERFILL_DATA !== "undefined" && HUNGERFILL_DATA.productDropdown
    ? HUNGERFILL_DATA.productDropdown
    : [
        { label: "Seafood", icon: "🦐", path: "products/seafood.html" },
        { label: "Meat", icon: "🥩", path: "products/meat.html" },
        { label: "Poultry", icon: "🍗", path: "products/poultry.html" },
        { label: "Eggs", icon: "🥚", path: "products/eggs.html" },
        { label: "Others", icon: "🌾", path: "products/other.html" }
      ];

  const navItems = [
    { href: "index.html", label: "Home" },
    { href: "about.html", label: "About" },
    { href: "blog/index.html", label: "Blog" },
    { href: "contact.html", label: "Contact" }
  ];

  const pathname = window.location.pathname;
  const currentPath = pathname.split("/").pop() || "index.html";

  function isNavActive(href) {
    const segment = href.split("/").pop();
    if (href.includes("blog/") && pathname.includes("/blog")) return " active";
    return currentPath === segment ? " active" : "";
  }

  function isProductsActive() {
    return pathname.includes("/products") ? " active" : "";
  }

  const dropdownHTML = dropdown.map(item =>
    `<li><a href="${rel(item.path)}" class="nav-dropdown-link"><span class="nav-dropdown-icon">${item.icon}</span>${item.label}</a></li>`
  ).join("");

  const navHTML = `
    <nav class="site-nav" id="siteNav">
      <div class="container nav-inner">
        <a href="${rel("index.html")}" class="nav-brand">
          <img src="${rel("assets/logo.svg")}" alt="${c.name} logo" width="64" height="64" />
          <span>${c.name}</span>
        </a>
        <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation">
          <span></span><span></span><span></span>
        </button>
        <ul class="nav-links" id="navLinks">
          <li><a href="${rel("index.html")}" class="${currentPath === "index.html" || currentPath === "" ? "active" : ""}">Home</a></li>
          <li><a href="${rel("about.html")}" class="${currentPath === "about.html" ? "active" : ""}">About</a></li>
          <li class="nav-dropdown${isProductsActive()}">
            <button type="button" class="nav-dropdown-toggle${isProductsActive()}" aria-expanded="false" aria-haspopup="true">
              Products <span class="dropdown-arrow" aria-hidden="true">▾</span>
            </button>
            <ul class="nav-dropdown-menu">
              ${dropdownHTML}
            </ul>
          </li>
          <li><a href="${rel("blog/index.html")}" class="${isNavActive("blog/index.html")}">Blog</a></li>
          <li><a href="${rel("contact.html")}" class="${currentPath === "contact.html" ? "active" : ""}">Contact</a></li>
          <li><a href="${rel("contact.html")}" class="nav-cta">Get a Quote</a></li>
        </ul>
      </div>
    </nav>`;

  const footerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <img src="${rel("assets/logo.svg")}" alt="${c.name}" width="72" height="72" />
            <p>${c.legal} — premium frozen & fresh food trading from Dubai, UAE. Serving hotels, restaurants, retailers and distributors across the GCC.</p>
          </div>
          <div class="footer-col">
            <h4>Products</h4>
            <ul>
              ${dropdown.map(item => `<li><a href="${rel(item.path)}">${item.icon} ${item.label}</a></li>`).join("")}
            </ul>
          </div>
          <div class="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="${rel("about.html")}">About Us</a></li>
              <li><a href="${rel("blog/index.html")}">Blog</a></li>
              <li><a href="${rel("contact.html")}">Contact</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:${c.email}">${c.email}</a></li>
              <li><a href="mailto:${c.sales}">${c.sales}</a></li>
              <li><a href="tel:+971505056049">${c.phone}</a></li>
              <li>${c.address}</li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; ${new Date().getFullYear()} ${c.name}. All rights reserved.</span>
          <div class="social-links">
            <a href="${c.linkedin}" class="social-link" target="_blank" rel="noopener" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.96v5.66H9.31V9h3.42v1.56h.05c.48-.91 1.65-1.86 3.39-1.86 3.63 0 4.3 2.39 4.3 5.49v6.25zM5.34 7.43a2.07 2.07 0 1 1 .01-4.15 2.07 2.07 0 0 1-.01 4.15zm1.78 13.02H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .78 0 1.75v20.5C0 23.22.79 24 1.77 24h20.46c.98 0 1.77-.78 1.77-1.75V1.75C24 .78 23.21 0 22.23 0z"/></svg>
            </a>
            <a href="${c.instagram}" class="social-link" target="_blank" rel="noopener" aria-label="Instagram">
              <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.849.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.204-.012 3.584-.07 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.849.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.756 0 8.335.012 7.052.07 2.695.272.273 2.69.07 7.052.012 8.335 0 8.756 0 12c0 3.244.011 3.665.07 4.948.202 4.358 2.623 6.78 6.985 6.984 1.283.058 1.704.07 4.948.07 3.244 0 3.665-.012 4.949-.07 4.351-.205 6.769-2.623 6.984-6.984.058-1.283.07-1.704.07-4.949 0-3.244-.011-3.665-.07-4.948C23.728 2.695 21.31.273 16.948.07 15.665.012 15.244 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 0 0-2.881 1.44 1.44 0 0 0 0 2.881z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>`;

  const navSlot = document.getElementById("nav-slot");
  const footerSlot = document.getElementById("footer-slot");
  if (navSlot) navSlot.innerHTML = navHTML;
  if (footerSlot) footerSlot.innerHTML = footerHTML;

  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("active");
      navLinks.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        navToggle.classList.remove("active");
        navLinks.classList.remove("open");
        document.querySelectorAll(".nav-dropdown.open").forEach(d => d.classList.remove("open"));
      });
    });
  }

  document.querySelectorAll(".nav-dropdown-toggle").forEach(toggle => {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const parent = toggle.closest(".nav-dropdown");
      const isOpen = parent.classList.contains("open");
      document.querySelectorAll(".nav-dropdown.open").forEach(d => {
        d.classList.remove("open");
        d.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        parent.classList.add("open");
        toggle.setAttribute("aria-expanded", "true");
      }
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".nav-dropdown.open").forEach(d => {
      d.classList.remove("open");
      d.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "false");
    });
  });

  const siteNav = document.getElementById("siteNav");
  if (siteNav) {
    window.addEventListener("scroll", () => {
      siteNav.classList.toggle("scrolled", window.scrollY > 20);
    }, { passive: true });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".fade-up").forEach(el => observer.observe(el));

  const filterTabs = document.querySelectorAll(".filter-tab");
  const filterCards = document.querySelectorAll("[data-category]");
  if (filterTabs.length && filterCards.length) {
    filterTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        filterTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const cat = tab.dataset.filter;
        filterCards.forEach(card => {
          card.style.display = (cat === "all" || card.dataset.category === cat) ? "" : "none";
        });
      });
    });
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(contactForm);
      const name = fd.get("name");
      const email = fd.get("email");
      const subject = fd.get("subject") || "Website Inquiry";
      const message = fd.get("message");
      const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${encodeURIComponent(message)}`;
      window.location.href = `mailto:${c.sales}?subject=${encodeURIComponent(subject)}&body=${body}`;
    });
  }

  window.HungerfillImg = imgPath;
})();
