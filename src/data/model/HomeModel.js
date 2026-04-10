/* =========================
   Banner Class
========================= */
class Banner {
  constructor({ imageUrl = "", route = "" } = {}) {
    this.imageUrl = imageUrl;
    this.route = route;
  }

  static fromJson(json = {}) {
    return new Banner({
      imageUrl: json.imageUrl || "",
      route: json.route || "",
    });
  }

  toJson() {
    return {
      imageUrl: this.imageUrl,
      route: this.route,
    };
  }
}

/* =========================
   Category Class
========================= */
class Category {
  constructor({ category = "", imageUrl = "" } = {}) {
    this.category = category;
    this.imageUrl = imageUrl;
  }

  static fromJson(json = {}) {
    return new Category({
      category: json.category || "",
      imageUrl: json.imageUrl || "",
    });
  }

  toJson() {
    return {
      category: this.category,
      imageUrl: this.imageUrl,
    };
  }
}

/* =========================
   Home Class
========================= */
class Home {
  constructor({
    id = "",
    active = false,
    banners = [],
    promoBanners = [],
    categories = [],
    listings = [],
    whatsappSupport = "",
  } = {}) {
    this.id = id;
    this.active = active;
    this.banners = banners;
    this.promoBanners = promoBanners;
    this.categories = categories;
    this.listings = listings;
    this.whatsappSupport = whatsappSupport;
  }

  /* =========================
     fromJson
  ========================= */
  static fromJson(json = {}) {
    return new Home({
      id: json.id || "",
      active: json.active || false,

      banners: (json.banners || []).map((e) =>
        Banner.fromJson(e)
      ),

      promoBanners: (json.promoBanners || []).map((e) =>
        Banner.fromJson(e)
      ),

      categories: (json.categories || []).map((e) =>
        Category.fromJson(e)
      ),

      listings: (json.listings || []).map((e) => e || ""),

      whatsappSupport: json.whatsappSupport || "",
    });
  }

  /* =========================
     toJson
  ========================= */
  toJson() {
    return {
      id: this.id,
      active: this.active,
      banners: this.banners.map((e) => e.toJson()),
      promoBanners: this.promoBanners.map((e) => e.toJson()),
      categories: this.categories.map((e) => e.toJson()),
      listings: this.listings,
      whatsappSupport: this.whatsappSupport,
    };
  }
}

export { Home, Banner, Category };