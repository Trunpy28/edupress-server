import RegisterCourseService from '../Services/RegisterCourseService.js';

const getAllRegistrations = async (req, res) => {
    try {
        const registrations = await RegisterCourseService.getAllRegistrations();
        return res.status(200).json(registrations);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateRegistrationStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;  

    if (!['Confirmed', 'Cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const updatedRegistration = await RegisterCourseService.updateRegistrationStatus(id, status);
        return res.status(200).json(updatedRegistration);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const createRegistration = async (req, res) => {
    const userId = req.user.id;
    const { courseId } = req.body;
    if (!userId) return res.status(401).json({ message: 'User does not exist' });
    try {
        const registration = await RegisterCourseService.createRegistration(userId, courseId);
        return res.status(201).json(registration);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const getRegisteredCourse = async (req, res) => {
    const userId = req.user.id;
    
    const { courseId } = req.params;
    if (!userId) return res.status(401).json({ message: 'User does not exist' });
    try {
        const registration = await RegisterCourseService.getRegisteredCourse(userId, courseId);
        if (!registration) return res.status(404).json({ message: 'Registration not found' });
        return res.status(200).json(registration);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export default {
    getAllRegistrations,
    updateRegistrationStatus,
    createRegistration,
    getRegisteredCourse,
};