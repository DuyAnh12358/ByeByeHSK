import getVocabulariesByLevel from "../controllers/vocabulary.controller";

import express from 'express';
const router = express.Router();

// Route duyệt từ vựng theo Cấp độ (Ví dụ: /api/vocabularies/level/hsk1 hoặc /api/vocabularies/level/custom)
router.get('/level/:level', getVocabulariesByLevel);

export default router;