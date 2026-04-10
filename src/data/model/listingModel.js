import { Timestamp, GeoPoint } from "firebase/firestore";

/* =========================
   Geo Class
========================= */
class Geo {
  constructor({ lat = 0.0, lng = 0.0 } = {}) {
    this.lat = lat;
    this.lng = lng;
  }

  static fromJson(json) {
    if (!json) return new Geo();

    if (json instanceof GeoPoint) {
      return new Geo({
        lat: json.latitude,
        lng: json.longitude,
      });
    }

    const parse = (val) => {
      if (typeof val === "number") return val;
      if (typeof val === "string") return parseFloat(val) || 0.0;
      return 0.0;
    };

    return new Geo({
      lat: parse(json.lat),
      lng: parse(json.lng),
    });
  }

  toJson() {
    return {
      lat: this.lat,
      lng: this.lng,
    };
  }
}

/* =========================
   ImageFile Class
========================= */
class ImageFile {
  constructor({ fileId = "", fullUrl = "", thumbUrl = "" } = {}) {
    this.fileId = fileId;
    this.fullUrl = fullUrl;
    this.thumbUrl = thumbUrl;
  }

  static fromJson(json = {}) {
    return new ImageFile({
      fileId: json.fileId || "",
      fullUrl: json.fullUrl || "",
      thumbUrl: json.thumbUrl || "",
    });
  }

  toJson() {
    return {
      fileId: this.fileId,
      fullUrl: this.fullUrl,
      thumbUrl: this.thumbUrl,
    };
  }
}

/* =========================
   TimeSlot Class
========================= */
class TimeSlot {
  constructor({ open = "00:00", close = "00:00" } = {}) {
    this.open = open;
    this.close = close;
  }

  static fromJson(json = {}) {
    return new TimeSlot({
      open: json.open || "00:00",
      close: json.close || "00:00",
    });
  }

  toJson() {
    return {
      open: this.open,
      close: this.close,
    };
  }
}

/* =========================
   DaySchedule Class
========================= */
class DaySchedule {
  constructor({ isClosed = false, slots = [] } = {}) {
    this.isClosed = isClosed;
    this.slots = slots;
  }

  static fromJson(json) {
    if (!json) {
      return new DaySchedule({ isClosed: true, slots: [] });
    }

    return new DaySchedule({
      isClosed: json.isClosed || false,
      slots: (json.slots || []).map((e) => TimeSlot.fromJson(e)),
    });
  }

  toJson() {
    return {
      isClosed: this.isClosed,
      slots: this.slots.map((e) => e.toJson()),
    };
  }
}

const capitalizeWords = (str = "") =>
  str
    .trim()
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/* =========================
   Listing Class
========================= */
class Listing {
  constructor({
    listingId = "",
    contributionId = "",
    name = "",
    address = "",
    description = "",
    details = {},
    geo = new Geo(),
    phone = "",
    alternatePhone = "",
    email = "",
    category = "",
    categoryId = "",
    tags = [],
    addedBy = "",
    updatedBy = "",
    isClaimed = false,
    ownerId = "",
    ownerName = "Unknown",
    claimStatus = "unclaimed",
    verifiedBy = null,
    createdAt = null,
    updatedAt = null,
    images = [],
    reviews = 0,
    ratingCount = 0,
    rating = 0.0,
    since = 2025,
    likes = 0,
    views = 0,
    social = {},
    ratingStats = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
    factorAvgRatings = {},
    businessHours = {},
  } = {}) {
    this.listingId = listingId;
    this.contributionId = contributionId;
    this.name = name;
    this.address = address;
    this.description = description;
    this.details = details;
    this.geo = geo;
    this.phone = phone;
    this.alternatePhone = alternatePhone;
    this.email = email;
    this.category = category;
    this.categoryId = categoryId;
    this.tags = tags;
    this.addedBy = addedBy;
    this.updatedBy = updatedBy;
    this.isClaimed = isClaimed;
    this.ownerId = ownerId;
    this.ownerName = ownerName;
    this.claimStatus = claimStatus;
    this.verifiedBy = verifiedBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.images = images;
    this.reviews = reviews;
    this.ratingCount = ratingCount;
    this.rating = rating;
    this.since = since;
    this.likes = likes;
    this.views = views;
    this.social = social;
    this.ratingStats = ratingStats;
    this.factorAvgRatings = factorAvgRatings;
    this.businessHours = businessHours;
  }

  /* =========================
     fromJson
  ========================= */
  static fromJson(json = {}) {
    return new Listing({
      listingId: json.listingId || "",
      contributionId: json.contributionId || "",
      name: capitalizeWords(json.name) || "",
      address: capitalizeWords(json.address) || "",
      description: json.description || "",
      details: json.details || {},

      geo: Geo.fromJson(json.geo),

      phone: json.phone || "",
      alternatePhone: json.alternatePhone || "",
      email: json.email || "",

      category: json.category || "",
      categoryId: json.categoryId || "",
      tags: json.tags || [],

      addedBy: json.addedBy || "",
      updatedBy: json.updatedBy || "",
      isClaimed: json.isClaimed || false,

      ownerId: json.ownerId || "",
      ownerName: json.ownerName || "Unknown",
      claimStatus: json.claimStatus || "unclaimed",
      verifiedBy: json.verifiedBy || null,

      createdAt:
        json.createdAt instanceof Timestamp
          ? json.createdAt.toDate()
          : json.createdAt || null,

      updatedAt:
        json.updatedAt instanceof Timestamp
          ? json.updatedAt.toDate()
          : json.updatedAt || null,

      images: (json.images || []).map((e) => ImageFile.fromJson(e)),

      reviews: json.reviews || 0,
      ratingCount: json.ratingCount || 0,
      rating: Number(json.rating || 0),

      since: json.since || 2025,
      likes: json.likes || 0,
      views: json.views || 0,

      social: {
        instagram: json.social?.Instagram || "",
        facebook: json.social?.Facebook || "",
        website: json.social?.Website || "",
        linkedin: json.social?.Linkedin || "",
        whatsapp: json.social?.WhatsApp || "",
      },

      ratingStats: {
        '5': Number(json.ratingStats?.['5'] ?? 0),
        '4': Number(json.ratingStats?.['4'] ?? 0),
        '3': Number(json.ratingStats?.['3'] ?? 0),
        '2': Number(json.ratingStats?.['2'] ?? 0),
        '1': Number(json.ratingStats?.['1'] ?? 0),
      },

      factorAvgRatings: json.factorAvgRatings || {'behaviour': 0, 'quality': 0, 'value': 0},

      businessHours: Object.fromEntries(
        Object.entries(json.businessHours || {}).map(([day, val]) => [
          day,
          DaySchedule.fromJson(val),
        ])
      ),
    });
  }

  /* =========================
     toJson
  ========================= */
  toJson() {
    return {
      listingId: this.listingId,
      contributionId: this.contributionId,
      name: this.name,
      address: this.address,
      description: this.description,
      details: this.details,
      geo: this.geo.toJson(),
      phone: this.phone,
      alternatePhone: this.alternatePhone,
      email: this.email,
      category: this.category,
      categoryId: this.categoryId,
      tags: this.tags,
      addedBy: this.addedBy,
      isClaimed: this.isClaimed,
      ownerId: this.ownerId,
      ownerName: this.ownerName,
      claimStatus: this.claimStatus,
      verifiedBy: this.verifiedBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      images: this.images.map((e) => e.toJson()),
      since: this.since,
      social: this.social,
      businessHours: Object.fromEntries(
        Object.entries(this.businessHours).map(([day, val]) => [
          day,
          val.toJson(),
        ])
      ),
    };
  }
}

export { Listing, Geo, ImageFile, TimeSlot, DaySchedule };