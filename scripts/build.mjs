import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const dataCode = readFileSync(join(root, "js", "data.js"), "utf8");
const fn = new Function(dataCode + "; return HUNGERFILL_DATA;");
const DATA = fn();

const c = DATA.company;
const listedBlog = DATA.blog.filter(a => a.listed !== false);

function imgSrc(path, base = "") {
  if (!path || path.startsWith("http")) return path;
  return base + path.split("/").map((seg, i) => (i === 0 ? seg : encodeURIComponent(seg))).join("/");
}

function head({ title, description, keywords, path, image, base = "" }) {
  const url = `${c.domain}/${path}`;
  const img = image ? (image.startsWith("http") ? image : `${c.domain}/${image.split("/").map((seg, i) => (i === 0 ? seg : encodeURIComponent(seg))).join("/")}`) : "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80";
  const assetBase = base || (path.match(/\//g) || []).length ? "../".repeat((path.match(/\//g) || []).length) : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | ${c.name}</title>
  <meta name="description" content="${description}" />
  <meta name="keywords" content="${keywords}" />
  <meta name="author" content="${c.name}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${title} | ${c.name}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${img}" />
  <meta property="og:locale" content="en_AE" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="theme-color" content="#2d6a4f" />
  <link rel="icon" href="${assetBase}assets/logo.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${assetBase}css/styles.css" />
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: c.name,
    legalName: c.legal,
    alternateName: ["Hunger Fill Foodstuff Trading", "Hunger Fill Foodstuff Trading LLC", "Hunger fill foodstuff trading llc", "HUNGER FILL FOODSTUFF TRADING LLC"],
    url: c.domain,
    logo: `${c.domain}/assets/logo.svg`,
    email: c.email,
    telephone: c.phone,
    address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
    sameAs: [c.linkedin, c.instagram]
  })}</script>
</head>
<body data-base="${assetBase}">`;
}

function wrapPage({ title, description, keywords, path, image, content, base = "../" }) {
  const h = head({ title, description, keywords, path, image, base });
  return `${h}
  <div id="nav-slot"></div>
  ${content}
  <div id="footer-slot"></div>
  <script src="${base}js/data.js"></script>
  <script src="${base}js/main.js"></script>
</body></html>`;
}

function productCard(p, base) {
  const cat = DATA.categories.find(c => c.id === p.category);
  return `<a href="${p.slug}.html" class="card fade-up" data-category="${p.category}">
    <div class="card-img"><img src="${imgSrc(p.image, base)}" alt="${p.name}" loading="lazy" width="400" height="250" /></div>
    <div class="card-body">
      <span class="card-tag">${cat ? cat.name : p.category}</span>
      <h3>${p.name}</h3>
      <p>${p.short}</p>
    </div>
  </a>`;
}

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

// ── Product detail pages ──
ensureDir(join(root, "products"));
DATA.products.forEach(p => {
  const cat = DATA.categories.find(c => c.id === p.category);
  const related = DATA.products.filter(r => r.category === p.category && r.slug !== p.slug).slice(0, 3);
  const content = `
  <section class="product-hero">
    <div class="container">
      <nav class="breadcrumb">
        <a href="../index.html">Home</a> ›
        <a href="index.html">Products</a> ›
        <a href="${p.category}.html">${cat.name}</a> ›
        <span>${p.name}</span>
      </nav>
      <div class="product-hero-grid">
        <div class="product-hero-img fade-up"><img src="${imgSrc(p.image, "../")}" alt="${p.name}" width="600" height="450" /></div>
        <div class="fade-up">
          <span class="card-tag">${cat.name}</span>
          <h1>${p.name}</h1>
          <p>${p.description}</p>
          <ul class="product-meta">
            ${p.features.map(f => `<li>${f}</li>`).join("")}
          </ul>
          <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:24px">
            <a href="../contact.html" class="btn btn-primary">Request a Quote</a>
            <a href="mailto:${c.sales}?subject=Inquiry: ${encodeURIComponent(p.name)}" class="btn btn-outline">Email Sales</a>
          </div>
        </div>
      </div>
    </div>
  </section>
  ${related.length ? `<section class="section">
    <div class="container">
      <div class="section-header"><h2>Related Products</h2></div>
      <div class="card-grid">${related.map(r => productCard(r, "../")).join("")}</div>
    </div>
  </section>` : ""}
  <section class="section bg-alt">
    <div class="container">
      <div class="cta-banner fade-up">
        <h2>Need ${p.name} for Your Business?</h2>
        <p>Contact our sales team for pricing, pack sizes and delivery schedules across Dubai and the UAE.</p>
        <a href="../contact.html" class="btn btn-white">Contact Sales Team</a>
      </div>
    </div>
  </section>`;

  writeFileSync(join(root, "products", `${p.slug}.html`), wrapPage({
    title: `${p.name} — ${cat.name} Supplier Dubai`,
    description: p.short,
    keywords: p.keywords,
    path: `products/${p.slug}.html`,
    image: p.image,
    content,
    base: "../"
  }));
});

// Remove orphaned product pages
const validSlugs = new Set(DATA.products.map(p => p.slug));
readdirSync(join(root, "products")).forEach(file => {
  if (file.endsWith(".html") && file !== "index.html") {
    const slug = file.replace(".html", "");
    const isCategory = DATA.categories.some(c => c.id === slug);
    if (!validSlugs.has(slug) && !isCategory) {
      unlinkSync(join(root, "products", file));
    }
  }
});

// ── Category pages ──
const catMeta = {
  seafood: { title: "Frozen Seafood", desc: "Premium frozen seafood supplier in Dubai — shrimps, lobster, crab, fish fillets, salmon, squid, scallops and more.", kw: "frozen seafood Dubai, seafood supplier UAE, shrimp lobster crab Dubai" },
  poultry: { title: "Frozen Poultry", desc: "Frozen chicken supplier Dubai — whole chicken, breast and leg quarters for HORECA and retail.", kw: "frozen chicken Dubai, poultry supplier UAE, halal chicken Dubai" },
  meat: { title: "Fresh & Frozen Meat", desc: "Indian mutton carcass and frozen beef cuts — halal certified meat supplier in Dubai, UAE.", kw: "Indian mutton Dubai, beef supplier UAE, halal meat Dubai" },
  eggs: { title: "Fresh Eggs", desc: "Commercial egg supplier in Dubai for bakeries, hotels and foodservice operations.", kw: "fresh eggs Dubai, egg supplier UAE, commercial eggs Dubai" },
  other: { title: "Other Food Products", desc: "Dates, ghee, vegetables, grains, fruits, cheese and dairy — wholesale food supplier Dubai.", kw: "dates ghee supplier Dubai, vegetables grains UAE, dairy cheese wholesale Dubai" }
};

Object.entries(catMeta).forEach(([id, meta]) => {
  const prods = DATA.products.filter(p => p.category === id);
  const cat = DATA.categories.find(c => c.id === id);
  const content = `
  <header class="page-header">
    <div class="container fade-up">
      <span class="eyebrow">${cat.icon} ${cat.name}</span>
      <h1>${meta.title}</h1>
      <p>${meta.desc}</p>
    </div>
  </header>
  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="category-writeup fade-up">${cat.writeup}</div>
    </div>
  </section>
  <section class="section bg-alt" style="padding-top:0">
    <div class="container">
      <div class="section-header fade-up">
        <h2>Our ${meta.title} Range</h2>
        <p>Browse individual products below or contact our sales team for pricing and pack sizes.</p>
      </div>
      <div class="card-grid">${prods.map(p => productCard(p, "../")).join("")}</div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="cta-banner fade-up">
        <h2>Looking for ${meta.title}?</h2>
        <p>Get competitive wholesale pricing and reliable delivery across Dubai and the GCC.</p>
        <a href="../contact.html" class="btn btn-white">Get a Quote</a>
      </div>
    </div>
  </section>`;

  writeFileSync(join(root, "products", `${id}.html`), wrapPage({
    title: meta.title,
    description: meta.desc,
    keywords: meta.kw,
    path: `products/${id}.html`,
    content,
    base: "../"
  }));
});

// ── Products index ──
const productsIndex = `
<header class="page-header">
  <div class="container fade-up">
    <span class="eyebrow">Our Catalog</span>
    <h1>Product Catalog</h1>
    <p>Premium frozen seafood, poultry, meat, eggs and specialty food products for hotels, restaurants, retailers and distributors in Dubai and the UAE.</p>
  </div>
</header>
<section class="section">
  <div class="container">
    <div class="filter-tabs fade-up">
      <button class="filter-tab active" data-filter="all">All Products</button>
      ${DATA.categories.map(cat => `<button class="filter-tab" data-filter="${cat.id}">${cat.name}</button>`).join("")}
    </div>
    <div class="card-grid">${DATA.products.map(p => productCard(p, "../")).join("")}</div>
  </div>
</section>`;

writeFileSync(join(root, "products", "index.html"), wrapPage({
  title: "Product Catalog — Food Wholesale Dubai",
  description: "Browse Hungerfill Foods' complete product catalog — frozen seafood, poultry, meat, eggs, dates, ghee and more.",
  keywords: "food wholesale Dubai, product catalog UAE, frozen food supplier Dubai",
  path: "products/index.html",
  content: productsIndex,
  base: "../"
}));

// ── Blog articles (all pages generated; index shows listed only) ──
ensureDir(join(root, "blog"));
DATA.blog.forEach(article => {
  const content = `
  <header class="page-header">
    <div class="container fade-up" style="text-align:left;max-width:760px">
      <nav class="breadcrumb">
        <a href="../index.html">Home</a> ›
        <a href="index.html">Blog</a> ›
        <span>${article.title}</span>
      </nav>
      <div class="blog-meta">
        <span>${article.date}</span>
        <span>${article.readTime} read</span>
        <span>By ${article.author}</span>
      </div>
      <h1>${article.title}</h1>
      <p>${article.excerpt}</p>
    </div>
  </header>
  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="article-content">
        <div class="article-hero-img fade-up"><img src="${article.image}" alt="${article.title}" width="900" height="400" /></div>
        <div class="fade-up">${article.content}</div>
      </div>
    </div>
  </section>
  <section class="section bg-alt">
    <div class="container">
      <div class="cta-banner fade-up">
        <h2>Ready to Source Premium Food Products?</h2>
        <p>Contact Hungerfill Foods for wholesale pricing on seafood, poultry, meat and more.</p>
        <a href="../contact.html" class="btn btn-white">Contact Us</a>
      </div>
    </div>
  </section>`;

  writeFileSync(join(root, "blog", `${article.slug}.html`), wrapPage({
    title: article.title,
    description: article.excerpt,
    keywords: article.keywords,
    path: `blog/${article.slug}.html`,
    image: article.image,
    content,
    base: "../"
  }));
});

const blogIndex = `
<header class="page-header">
  <div class="container fade-up">
    <span class="eyebrow">Insights</span>
    <h1>Food Industry Blog</h1>
    <p>Expert insights on food sourcing, cold-chain logistics, and B2B food trading in Dubai and the GCC.</p>
  </div>
</header>
<section class="section">
  <div class="container">
    <div class="card-grid">
      ${listedBlog.map(a => `<a href="${a.slug}.html" class="card blog-card fade-up">
        <div class="card-img"><img src="${a.image}" alt="${a.title}" loading="lazy" width="400" height="225" /></div>
        <div class="card-body">
          <div class="blog-meta"><span>${a.date}</span><span>${a.readTime}</span></div>
          <h3>${a.title}</h3>
          <p>${a.excerpt}</p>
          <span class="card-link">Read Article</span>
        </div>
      </a>`).join("")}
    </div>
  </div>
</section>`;

writeFileSync(join(root, "blog", "index.html"), wrapPage({
  title: "Food Industry Blog — Dubai Food Trading Insights",
  description: "Expert articles on food sourcing, cold-chain logistics and B2B food trading in Dubai and the UAE.",
  keywords: "food industry blog Dubai, food trading insights UAE, seafood sourcing blog",
  path: "blog/index.html",
  content: blogIndex,
  base: "../"
}));

// ── Sitemap & crawl files ──
const staticPages = ["", "about.html", "contact.html", "privacy-policy.html"];
const pages = [
  ...staticPages,
  "products/index.html",
  ...DATA.categories.map(c => `products/${c.id}.html`),
  ...DATA.products.map(p => `products/${p.slug}.html`),
  "blog/index.html",
  ...listedBlog.map(b => `blog/${b.slug}.html`)
];

const today = new Date().toISOString().split("T")[0];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => {
  const priority = p === "" ? "1.0" : p === "privacy-policy.html" ? "0.3" : p.includes("products/") && !p.includes("index") ? "0.8" : "0.7";
  return `  <url><loc>${c.domain}/${p}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${priority}</priority></url>`;
}).join("\n")}
</urlset>`;
writeFileSync(join(root, "sitemap.xml"), sitemap);

writeFileSync(join(root, "robots.txt"), `User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: ${c.domain}/sitemap.xml
`);

console.log(`Built ${DATA.products.length} product pages, ${listedBlog.length} listed blog articles, ${DATA.categories.length} category pages, sitemap & robots.txt`);
