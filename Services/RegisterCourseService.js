import RegisterCourseModel from '../Models/RegisterCourseModel.js';

const getAllRegistrations = async () => {
    try {
        return await RegisterCourseModel.find()
            .populate('userId', 'userName')
            .populate('courseId', 'name');
    } catch (error) {
        throw new Error('Error fetching registrations: ' + error.message);
    }
};

const updateRegistrationStatus = async (id, status) => {
    try {
        const registration = await RegisterCourseModel.findById(id);
        if (!registration) throw new Error('Registration not found');

        registration.status = status;
        await registration.save();

        return registration;
    } catch (error) {
        throw new Error('Error updating registration status: ' + error.message);
    }
};

const createRegistration = async (userId, courseId) => {
    try {
        const existingRegistration = await RegisterCourseModel.findOne({ userId, courseId });
        if(existingRegistration) throw new Error('Registration already exists');
        const registration = new RegisterCourseModel({ userId, courseId });
        await registration.save();
    } catch (error) {
        throw new Error('Error creating registration: ' + error.message);
    }
}

const getRegisteredCourse = async (userId, courseId) => {
    try {
        return await RegisterCourseModel.findOne({ userId, courseId });
    } catch (error) {
        throw new Error('Error fetching registration: ' + error.message);
    }
}

const getConfirmedCoursesForUser = async (userId) =>{
    try {
        const confirmedCourses = await RegisterCourseModel.find({ userId, status: 'Confirmed' }).select('courseId');
    
        const courseIds = confirmedCourses.map(course => course.courseId);
        return courseIds;
    } catch (error) {
        throw new Error('Error fetching registrations of user: ' + error.message);
    }
}

export default { getAllRegistrations, updateRegistrationStatus, createRegistration, getRegisteredCourse, getConfirmedCoursesForUser };
