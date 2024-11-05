import Lesson from '../Models/LessonModel.js';
import RegisterCourseService from './RegisterCourseService.js';

const createLesson = async (data) => {
    try {
        const lesson = new Lesson(data);
        await lesson.save();
        return lesson;
    } catch (error) {
        throw new Error('Error creating lesson: ' + error.message);
    }
};

const getAllLessons = async () => {
    try {
        return await Lesson.find().populate('courseId');
    } catch (error) {
        throw new Error('Error fetching lessons: ' + error.message);
    }
};

const getLessonById = async (id) => {
    try {
        const lesson = await Lesson.findById(id).populate('courseId');
        if (!lesson) throw new Error('Lesson not found');
        return lesson;
    } catch (error) {
        throw new Error('Error fetching lesson: ' + error.message);
    }
};

const updateLesson = async (id, data) => {
    try {
        const lesson = await Lesson.findByIdAndUpdate(id, data, { new: true });
        if (!lesson) throw new Error('Lesson not found');
        return lesson;
    } catch (error) {
        throw new Error('Error updating lesson: ' + error.message);
    }
};

const deleteLesson = async (id) => {
    try {
        const lesson = await Lesson.findByIdAndDelete(id);
        if (!lesson) throw new Error('Lesson not found');
        return lesson;
    } catch (error) {
        throw new Error('Error deleting lesson: ' + error.message);
    }
};

const getLessonsByCourse = async (userId, courseId) => {
    try {
        //Not sign-in
        if(!userId) {
            const lessonWithoutVideos = await Lesson.find({ courseId }).select('-videos.url').sort({ order: 'asc' });
            return lessonWithoutVideos;
        }
        
        //Sign-in
        const registeredCourse = await RegisterCourseService.getRegisteredCourse(userId, courseId);
        if(registeredCourse && registeredCourse?.status == 'Confirmed') {
            const lessonWithVideos = await Lesson.find({ courseId }).sort({ order: 'asc'});
            return lessonWithVideos;
        }
        else {
            const lessonWithoutVideos = await Lesson.find({ courseId }).select('-videos.url').sort({ order: 'asc' });
            return lessonWithoutVideos;
        }
    }
    catch (error) {
        throw new Error('Error fetching lessons by course: ' + error.message);
    }
}

export default {
    createLesson,
    getAllLessons,
    getLessonById,
    updateLesson,
    deleteLesson,
    getLessonsByCourse
};
