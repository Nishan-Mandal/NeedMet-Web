export class Category {
    constructor({
        id = "",
        categoryId = "",
        createdAt = "",
        description = "",
        imageUrl = "",
        name = "",
        section = "",
        tags = [],
    } = {}) {
        this.id = id;
        this.categoryId = categoryId;
        this.createdAt = createdAt;
        this.description = description;
        this.imageUrl = imageUrl;
        this.name = name;
        this.section = section;
        this.tags = tags;
    }

    static fromJson(json = {}) {
        return new Category({
            id: json.id,
            categoryId: json.categoryId,
            createdAt: json.createdAt?.toDate?.() || json.createdAt,
            description: json.description,
            imageUrl: json.imageUrl,
            name: json.name,
            section: json.section,
            tags: json.tags || [],
        });
    }

    toJson() {
        return {
            categoryId: this.categoryId,
            createdAt: this.createdAt,
            description: this.description,
            imageUrl: this.imageUrl,
            name: this.name,
            section: this.section,
            tags: this.tags,
        };
    }
}