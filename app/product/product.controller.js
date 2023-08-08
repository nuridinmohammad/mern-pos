const {
  createReadStream,
  createWriteStream,
  unlinkSync,
  existsSync,
} = require("fs");
const path = require("path");

const ProductModel = require("./product.model");
const config_env = require("../../configs/config");

const productController = {
  index: async (req, res, next) => {
    try {
      const products = await ProductModel.find();
      const total_products = await ProductModel.countDocuments();
      return res
        .status(200)
        .json({ response: "success", total_products, data: products });
    } catch (error) {
      if (error && error.name === "ValidationError") {
        return res.status(400).json({
          errorNnumber: 1,
          message: error.message,
          fields: error.errors,
        });
      }
      next(error);
    }
  },
  getProduct: async (req, res, next) => {
    const { id } = req.params;
    try {
      const product = await ProductModel.findById(id);
      return res.status(200).json(product);
    } catch (error) {
      if (error & (error.name === "ValidationError")) {
        return res.status(400).json({
          errorNnumber: 1,
          message: error.message,
        });
      }
      next(error);
    }
  },
  store: async (req, res, next) => {
    const payload = req.body;
    console.log(payload);
    try {
      if (req.file) {
        console.log(req.file);
        const src_path = req.file.path;
        const img_originalname = req.file.originalname;
        const img_ext =
          img_originalname.split(".")[img_originalname.split(".").length - 1];
        const img_name = `${req.file.filename}.${img_ext}`;
        const target_path = path.resolve(
          config_env.rootPath,
          `public/images/products/${img_name}`
        );
        const src = createReadStream(src_path);
        const dest = createWriteStream(target_path);
        src.pipe(dest);
        src.on("end", async () => {
          try {
            const product = new ProductModel({
              ...payload,
              image_url: img_name,
            });
            await product.save();
            return res.status(201).json(product);
          } catch (error) {
            unlinkSync(target_path);
            if (error && error.name === "ValidationError") {
              return res.status(400).json({
                errorNumber: 1,
                message: error.message,
                fields: error.errors,
              });
            }
            next(error);
          }
        });

        src.on("error", async () => {
          next(error);
        });
      } else {
        const product = new ProductModel(payload);
        await product.save();
        return res.status(201).json(product);
      }
    } catch (error) {
      if (error && error.name === "ValidationError") {
        return res.status(400).json({
          errorNnumber: 1,
          message: error.message,
          fields: error.errors,
        });
      }
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      let payload = req.body;
      console.log(payload);
      const { id } = req.params;
      if (req.file) {
        console.log(req.file);
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originalExt;
        let target_path = path.resolve(
          config_env.rootPath,
          `public/images/products/${filename}`
        );
        const src = createReadStream(tmp_path);
        const dest = createWriteStream(target_path);
        src.pipe(dest);
        src.on("end", async () => {
          try {
            const productById = await ProductModel.findById(id);
            const currentImage = `${config_env.rootPath}/public/images/products/${productById.image_url}`;

            if (existsSync(currentImage)) {
              unlinkSync(currentImage);
            }
            const product = await ProductModel.findByIdAndUpdate(
              id,
              { ...payload, image_url: filename },
              {
                new: true,
                runValidators: true,
              }
            );
            await product.save();
            return res.status(201).json(product);
          } catch (error) {
            unlinkSync(target_path);
            if (error && error.name === "ValidationError") {
              return res.status(400).json({
                errorNumber: 1,
                message: error.message,
                fields: error.errors,
              });
            }
            next(error);
          }
        });

        src.on("error", async () => {
          next(error);
        });
      } else {
        const product = await ProductModel.findByIdAndUpdate(id, payload, {
          new: true,
          runValidators: true,
        });
        await product.save();
        return res.status(201).json(product);
      }
    } catch (error) {
      if (error && error.name === "ValidationError") {
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
      const product = await ProductModel.findByIdAndDelete(req.params.id);
      if (product.image_url) {
        const current_img = `${config_env.rootPath}/public/images/products/${product.image_url}`;
        if (existsSync(current_img)) {
          unlinkSync(current_img);
        }
      }
      return res.status(200).json({
        response: "success delete",
        product_id: product._id,
      });
    } catch (error) {
      if (error && error.name === "ValidationError") {
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

module.exports = productController;
