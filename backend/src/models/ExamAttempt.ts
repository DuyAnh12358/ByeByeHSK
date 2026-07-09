import mongoose from "mongoose";

const examAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: "anonymous",
      index: true,
    },
    hskLevel: {
      type: Number,
      required: true,
      index: true,
    },
    examNumber: {
      type: Number,
      required: true,
      index: true,
    },
    attemptsCount: {
      type: Number,
      required: true,
      default: 0,
    },
    bestScore: {
      type: Number,
      default: 0,
    },
    passed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

examAttemptSchema.index({ userId: 1, hskLevel: 1, examNumber: 1 }, { unique: true });

export default mongoose.model("ExamAttempt", examAttemptSchema);

