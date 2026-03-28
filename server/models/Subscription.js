// ============================================================
//  File   : Subscription.js
//  Place  : C:\Users\chait\donut\server\models\Subscription.js
// ============================================================

const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Subscription must belong to a user"],
    },
    plan: {
      type: String,
      enum: ["free", "starter", "pro", "enterprise"],
      default: "free",
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired", "past_due"],
      default: "active",
    },
    // How many projects this plan allows
    projectLimit: {
      type: Number,
      default: 3, // free tier default
    },
    // How many team members this plan allows
    memberLimit: {
      type: Number,
      default: 1, // free tier default
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: null, // null = no expiry (free tier)
    },
    // For future payment integration — store external reference only
    // Never store card details here
    paymentReference: {
      type: String,
      default: null,
      select: false, // hide from normal queries
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ───────────────────────────────────────────────────
SubscriptionSchema.index({ user: 1 }, { unique: true }); // one subscription per user
SubscriptionSchema.index({ status: 1 });
SubscriptionSchema.index({ endDate: 1 });                // for expiry checks

// ── Instance method: check if subscription is currently active ─
SubscriptionSchema.methods.isActive = function () {
  if (this.status !== "active") return false;
  if (this.endDate && this.endDate < new Date()) return false;
  return true;
};

// ── Static method: get active subscription for a user ─────────
SubscriptionSchema.statics.getActiveForUser = async function (userId) {
  return await this.findOne({ user: userId, status: "active" });
};

module.exports = mongoose.model("Subscription", SubscriptionSchema);