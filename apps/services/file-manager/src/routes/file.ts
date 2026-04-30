import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import {
  downloadController,
  getFileMetaDataController,
  statusController,
  uploadController,
} from "../controllers/file.js";

const router: Router = Router();

router.post("/upload", upload.single("file"), uploadController);
router.get("/status/:id", statusController);
router.get("/download/:id", downloadController);
router.get("/meta/:id", getFileMetaDataController);

export default router;
