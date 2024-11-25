import LessonService from '../Services/LessonService.js';

export const createLesson = async (req, res) => {
    try {
        const lesson = await LessonService.createLesson(req.body);
        return res.status(201).json(lesson);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllLessons = async (req, res) => {
    try {
        const lessons = await LessonService.getAllLessons();
        return res.status(200).json(lessons);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getLessonById = async (req, res) => {
    const { id } = req.params;
    try {
        const lesson = await LessonService.getLessonById(id);
        return res.status(200).json(lesson);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateLesson = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedLesson = await LessonService.updateLesson(id, req.body);
        return res.status(200).json(updatedLesson);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteLesson = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedLesson = await LessonService.deleteLesson(id);
        return res.status(200).json({ message: 'Lesson deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getLessonsByCourse = async (req, res) => {
    const userId = req?.user?.id;
    
    const { courseId } = req.params;
    try {
        const lessons = await LessonService.getLessonsByCourse(userId, courseId);
        return res.status(200).json(lessons);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
