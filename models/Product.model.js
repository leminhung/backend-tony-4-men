const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be at least 0"],
    },
    code: { type: String, required: true },
    color: { type: String, required: true },
    status: { type: String, required: true },
    size: {
      type: String,
      enum: ["XL", "L", "M", "S", "XXL", "3XL"],
      required: true,
    },
    slug: String,
    description: String,
    discount: { type: Number, min: [0, "Discount must be at least 0"] },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },
    order: {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

productSchema.pre("remove", async function (next) {
  await this.model("Image").deleteMany({ product: this._id });
  next();
});

productSchema.virtual("images", {
  ref: "Image",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

productSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

module.exports = mongoose.model("Product", productSchema);
