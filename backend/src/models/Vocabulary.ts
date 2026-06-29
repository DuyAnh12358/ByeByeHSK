import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema({
  zh: { type: String, required: true },
  pinyin: { type: String, required: true },
  vi: { type: String, required: true }
});

const vocabularySchema = new mongoose.Schema({
  simplified: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  traditional: {
    type: String,
    required: true,
    trim: true
  },
  pinyin: {
    type: String,
    required: true,
    trim: true
  },
  pinyin_unsigned: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  han_viet: {
    type: String,
    required: true,
    uppercase: true
  },
  meaning_vi: {
    type: String,
    required: true
  },
  audio_url: String,
  lesson_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  level: {
    type: String,
    enum: ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6', 'Custom'],
    required: true
  },
  stroke_data: String,
  examples: [exampleSchema]
});

// Text index để hỗ trợ tra cứu toàn văn
vocabularySchema.index({ pinyin_unsigned: 'text', simplified: 'text', meaning_vi: 'text' });

export default mongoose.model('Vocabulary', vocabularySchema);