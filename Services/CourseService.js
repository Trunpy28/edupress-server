import Course from "../Models/CourseModel.js";
import Lesson from "../Models/LessonModel.js";
import mongoose from "mongoose";
import slugify from "slugify";
import RegisterCourseService from "./RegisterCourseService.js";

const generateUniqueSlug = async (name) => {
  let slug = slugify(name, {
    replacement: "-",
    remove: undefined,
    lower: true,
    strict: false,
    trim: true,
  });

  let slugExists = await Course.findOne({ urlSlug: slug });
  let counter = 1;
  let newSlug = slug;

  while (slugExists) {
    newSlug = `${slug}-${counter}`;
    slugExists = await Course.findOne({ urlSlug: newSlug });
    counter++;
  }

  return newSlug;
};

const getCourses = async (queries) => {
  let { search, sort, category, price, level, page = 1, limit = 10 } = queries;

  if (typeof page === "string") {
    page = parseInt(page);
    if (isNaN(page) || page < 1) page = 1;
  }

  if (typeof limit === "string") {
    limit = parseInt(limit);
    if (isNaN(limit) || limit < 1 || limit > 100) limit = 10;
  }

  try {
    let query = Course.find();
    if (search) {
      query = query.regex("name", new RegExp(search, "i"));
    }
    if (category) {
      query = query.where("category").in(category);
    }
    if (price) {
      if (price.includes("free") && price.includes("paid")) {
      } else if (price.includes("free")) {
        query = query.or([
          { discountPrice: { $exists: true, $eq: 0 } },
          { discountPrice: { $exists: false }, price: 0 },
        ]);
      } else if (price.includes("paid")) {
        query = query.or([
          { discountPrice: { $exists: true, $gt: 0 } },
          { discountPrice: { $exists: false }, price: { $gt: 0 } },
        ]);
      }
    }
    if (level) {
      query = query.where("level").in(level);
    }

    const totalCourses = await Course.countDocuments(query.getQuery());

    if (sort) {
      switch (sort) {
        case "name-asc":
          query = query.sort({ name: 1 });
          break;
        case "name-desc":
          query = query.sort({ name: -1 });
          break;
        case "price-asc":
        case "price-desc":
          const sortDirection = sort === "price-asc" ? 1 : -1;
          query = Course.aggregate([
            { $match: query.getQuery() },
            {
              $addFields: {
                priceToSort: { $ifNull: ["$discountPrice", "$price"] },
              },
            },
            { $sort: { priceToSort: sortDirection } },
            { $unset: "priceToSort" },
          ]);
          break;
      }
    }

    const courses = await query
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return { courses, totalCourses };
  } catch (error) {
    throw new Error("Error retrieving courses: " + error.message);
  }
};

const getCourseById = async (id) => {
  try {
    return await Course.findById(id);
  } catch (error) {
    throw new Error("Error retrieving course by id: " + error.message);
  }
};

const getCourseByUrlSlug = async (urlSlug) => {
  try {
    return await Course.findOne({ urlSlug });
  } catch (error) {
    throw new Error("Error retrieving course by id: " + error.message);
  }
};

const createCourse = async (data) => {
  try {
    const urlSlug = await generateUniqueSlug(data.name);
    const course = new Course({ ...data, urlSlug });
    return await course.save();
  } catch (error) {
    throw new Error("Error creating course: " + error.message);
  }
};

const createCourses = async (data) => {
  const session = await Course.startSession();
  session.startTransaction();

  try {
    const courses = [];

    for (const course of data) {
      const urlSlug = await generateUniqueSlug(course.name);
      courses.push({ ...course, urlSlug });
    }

    await Course.insertMany(courses, { session });

    await session.commitTransaction();
    session.endSession();

    return courses;
  } catch (error) {
    await session.abortTransaction();
    throw new Error("Error creating courses: " + error.message);
  } finally {
    session.endSession();
  }
};

const updateCourse = async (id, data) => {
  try {
    let urlSlug;
    if (data.name) {
      urlSlug = await generateUniqueSlug(data.name);
    }
    return await Course.findByIdAndUpdate(
      id,
      { ...data, ...(urlSlug ? { urlSlug } : {}) },
      { new: true }
    );
  } catch (error) {
    throw new Error("Error updating course: " + error.message);
  }
};

const deleteCourse = async (id) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await Lesson.deleteMany({ courseId: id }, { session });
    await RegisterCourseModel.deleteMany({ courseId: id }, { session });
    await Course.findByIdAndDelete(id, { session });

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error("Error deleting course and related data: " + error.message);
  }
};

const getConfirmedCoursesForUser = async (userId) => {
  try {
    const confirmedCourseIds =
      await RegisterCourseService.getConfirmedCoursesForUser(userId);
    const courses = await Course.find({ _id: { $in: confirmedCourseIds } });
    return courses;
  } catch (error) {
    throw new Error(
      "Error fetching confirmed courses for user: " + error.message
    );
  }
};

export default {
  getCourses,
  getCourseById,
  getCourseByUrlSlug,
  createCourse,
  createCourses,
  updateCourse,
  deleteCourse,
  getConfirmedCoursesForUser,
};
