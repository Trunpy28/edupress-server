import CourseReview from '../Models/CourseReview.js';

const createReview = async (userId, courseId, rating, review) => {
  const newReview = new CourseReview({ userId, courseId, rating, review });
  return await newReview.save();
};

const updateReview = async (userId, courseId, rating, review) => {
  return await CourseReview.findOneAndUpdate(
    { userId, courseId },
    { rating, review },
    { new: true }
  );
};

const getReviewsByCourse = async (courseId) => {
  return await CourseReview.find({ courseId }).populate({
    path: 'userId',
    select: 'name _id email',
  });
};

const deleteReview = async (reviewId) => {
  return await CourseReview.findByIdAndDelete(reviewId);
};

export default {
  createReview,
  updateReview,
  getReviewsByCourse,
  deleteReview
};
