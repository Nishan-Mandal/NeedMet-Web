export class UserModel {
  constructor({
    userId,
    name,
    phone,
    role = "customer",
    kudos = 0,
    fcmToken = null,
    createdAt = null,
    updatedAt = null,
    plans = [],
  }) {
    this.userId = userId;
    this.name = name;
    this.phone = phone;
    this.role = role;
    this.kudos = kudos;
    this.fcmToken = fcmToken;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.plans = plans;
  }

  static fromFirestore(doc) {
    const data = doc.data();

    return new UserModel({
      userId: data.userId,
      name: data.name,
      phone: data.phone,
      role: data.role ?? "customer",
      kudos: data.kudos ?? 0,
      fcmToken: data.fcmToken ?? null,
      createdAt: data.createdAt ?? null,
      updatedAt: data.updatedAt ?? null,
      plans: data.plans ?? [],
    });
  }

  toFirestore() {
    return {
      userId: this.userId,
      name: this.name,
      phone: this.phone,
      role: this.role,
      kudos: this.kudos,
      fcmToken: this.fcmToken,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      plans: this.plans,
    };
  }
}