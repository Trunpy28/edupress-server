import CourseService from '../Services/CourseService.js';

export const getCourses = async (req, res) => {  
  try {  
    const result = await CourseService.getCourses(req.query);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await CourseService.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCourseByUrlSlug = async (req, res) => {
  try {
    const course = await CourseService.getCourseByUrlSlug(req.params.urlSlug);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not logged in' });
    }
    if(req.user.role !== 'Admin') return res.status(403).json({ message: 'You are not allowed to create course' });

    const newCourse = await CourseService.createCourse(req.body);
    return res.status(201).json(newCourse);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createCourseMany = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not logged in' });
    }
    if(req?.user?.role !== 'Admin') return res.status(403).json({ message: 'You are not allowed to create courses' });
    
    const newCourses = await CourseService.createCourses(req.body);
    return res.status(201).json(newCourses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const updateCourse = async (req, res) => {
  try {
    const updatedCourse = await CourseService.updateCourse(req.params.id, req.body);
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    return res.status(200).json(updatedCourse);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await CourseService.deleteCourse(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    return res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getConfirmedCoursesForUser = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not logged in' });
  }
  try {
    const confirmedCourses = await CourseService.getConfirmedCoursesForUser(req.user.id);
    return res.status(200).json(confirmedCourses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
