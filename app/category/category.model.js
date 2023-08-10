const { model, Schema } = require("mongoose");

const categorySchema = new Schema({
  name: {
    type: String,
    minlength: [3, "Panjang Nama Kategori minimal 3 karakter"],
    maxlength: [255, "Panjang Nama Kategori maksimal 255 karakter"],
    required: [true, "Nama Kategori harus diisi!"],
  },
});

const CategoryModel = model("Category", categorySchema);
module.exports = CategoryModel;
