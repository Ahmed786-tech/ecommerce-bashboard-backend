import { Router } from "express";
import * as productController from "../controllers/product.controller";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../middleware/fileUpload.middleware";

const router = Router();

router.use(authenticate)

router.post("/", upload.single('file'), productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.put("/:id",upload.single('file'), productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;
