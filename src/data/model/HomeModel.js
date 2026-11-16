/* =========================
   Banner Class
========================= */
class Banner {
  constructor({
    id = "",
    title = "",
    imageUrl = "",
    image = "",
    route = "",
    redirectUrl = "",
    webUrl = "",
    weburl = "",
    isActive = true,
    order = 0,
    createdAt = null,
    updatedAt = null,
  } = {}) {
    const finalMobile = imageUrl || image || "";
    const finalDesktop = webUrl || weburl || "";
    const finalRoute = route || redirectUrl || "";

    this.id = id;
    this.title = title;
    this.imageUrl = finalMobile;
    this.image = finalMobile;
    this.webUrl = finalDesktop;
    this.weburl = finalDesktop;
    this.route = finalRoute;
    this.redirectUrl = finalRoute;
    this.isActive = isActive !== false;
    this.order = typeof order === "number" ? order : 0;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromJson(json = {}) {
    const finalMobile = json.imageUrl || json.image || "";
    const finalDesktop = json.webUrl || json.weburl || "";
    const finalRoute = json.route || json.redirectUrl || "";
    const isActive = json.isActive !== undefined ? json.isActive : (json.active !== undefined ? json.active : true);

    return new Banner({
      id: json.id || "",
      title: json.title || json.name || json.label || "",
      imageUrl: finalMobile,
      image: finalMobile,
      route: finalRoute,
      redirectUrl: finalRoute,
      webUrl: finalDesktop,
      weburl: finalDesktop,
      isActive: isActive,
      order: typeof json.order === "number" ? json.order : 0,
      createdAt: json.createdAt || null,
      updatedAt: json.updatedAt || null,
    });
  }

  toJson() {
    const data = {
      title: this.title || "",
      imageUrl: this.imageUrl || "",
      image: this.imageUrl || "",
      webUrl: this.webUrl || "",
      weburl: this.webUrl || "",
      route: this.route || "",
      redirectUrl: this.route || "",
      isActive: this.isActive !== false,
      order: typeof this.order === "number" ? this.order : 0,
    };
    if (this.id) data.id = this.id;
    if (this.createdAt) data.createdAt = this.createdAt;
    if (this.updatedAt) data.updatedAt = this.updatedAt;
    return data;
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
    posters = [],
    categories = [],
    listings = [],
    whatsappSupport = "",
  } = {}) {
    this.id = id;
    this.active = active;
    this.banners = banners;
    this.promoBanners = promoBanners;
    this.posters = posters;
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

      posters: (json.posters || []).map((e) =>
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
      posters: this.posters.map((e) => e.toJson()),
      categories: this.categories.map((e) => e.toJson()),
      listings: this.listings,
      whatsappSupport: this.whatsappSupport,
    };
  }
}

export { Home, Banner, Category };