// ============================================================
//  File   : Project.js
//  Place  : C:\Users\chait\donut\server\models\Project.js
// ============================================================

const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
      default: null,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Project must have an owner"],
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["viewer", "editor", "admin"],
          default: "viewer",
        },
      },
    ],
    status: {
      type: String,
      enum: ["planning", "active", "on-hold", "completed", "archived"],
      default: "planning",
    },
    tags: {
      type: [String],
      default: [],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    // Denormalized count — fast reads without counting members array
    memberCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ───────────────────────────────────────────────────
ProjectSchema.index({ owner: 1, createdAt: -1 }); // fast owner project listing
ProjectSchema.index({ status: 1 });                // filter by status
ProjectSchema.index({ tags: 1 });                  // tag-based search

// ── Keep memberCount in sync when members change ──────────────
ProjectSchema.pre("save", function () {
  this.memberCount = this.members.length;
});

module.exports = mongoose.model("Project", ProjectSchema);