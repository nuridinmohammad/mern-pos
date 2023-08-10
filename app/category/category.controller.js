const CategoryModel = require("./category.model");

const categoryController = {
  index: async (req, res, next) => {
    try {
      const name = req.query;
      console.log(name);
      const category = await CategoryModel.find(name);
      return res.status(200).json({
        response: 200,
        total_data: category.length,
        data: category,
      });
    } catch (error) {
      if (error && error.name == "ValidationError") {
        return res.status(400).json({
          errorNumber: 1,
          message: error.message,
          fields: error.errors,
        });
      }
      next(error);
    }
  },
  getCategory: async (req, res, next) => {
    try {
      const category = await CategoryModel.findById(req.params.id);
      return res.status(200).json({
        response: 200,
        total_data: category.length,
        data: category,
      });
    } catch (error) {
      if (error && error.name == "ValidationError") {
        return res.status(400).json({
          errorNumber: 1,
          message: error.message,
          fields: error.errors,
        });
      }
      next(error);
    }
  },
  store: async (req, res, next) => {
    try {
      const payload = req.body;
      const category = await CategoryModel(payload);
      await category.save();
      return res.status(201).json(category);
    } catch (error) {
      if (error && error.name == "ValidationError") {
        return res.status(400).json({
          errorNumber: 1,
          message: error.message,
          fields: error.errors,
        });
      }
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const payload = req.body;
      const category = await CategoryModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
      });
      await category.save();
      return res.status(201).json(category);
    } catch (error) {
      if (error && error.name == "ValidationError") {
        return res.status(400).json({
          errorNumber: 1,
          message: error.message,
          fields: error.errors,
        });
      }
      next(error);
    }
  },
  destroy: async (req, res, next) => {
    try {
      const deleteCategory = await CategoryModel.findByIdAndDelete(
        req.params.id
      );
      return res.status(200).json({
        response: 200,
        message: "Success delete category",
        datad_id: deleteCategory._id,
      });
    } catch (error) {
      if (error && error.name == "ValidationError") {
        return res.status(400).json({
          errorNumber: 1,
          message: error.message,
          fields: error.errors,
        });
      }
      next(error);
    }
  },
};

module.exports = categoryController;
