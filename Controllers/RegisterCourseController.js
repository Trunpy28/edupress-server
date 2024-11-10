import RegisterCourseService from '../Services/RegisterCourseService.js';

export const getAllRegistrations = async (req, res) => {
    try {
        const registrations = await RegisterCourseService.getAllRegistrations();
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const approveRegistration = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;  

    if (!['Confirmed', 'Cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const updatedRegistration = await RegisterCourseService.updateRegistrationStatus(id, status);
        res.status(200).json(updatedRegistration);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createRegistration = async (req, res) => {
    const userId = req.user.id;
    const { courseId } = req.body;
    if (!userId) return res.status(401).json({ message: 'User does not exist' });
    try {
        const registration = await RegisterCourseService.createRegistration(userId, courseId);
        res.status(201).json(registration);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const getRegisteredCourse = async (req, res) => {
    const userId = req.user.id;
    
    const { courseId } = req.params;
    if (!userId) return res.status(401).json({ message: 'User does not exist' });
    try {
        const registration = await RegisterCourseService.getRegisteredCourse(userId, courseId);
        if (!registration) return res.status(404).json({ message: 'Registration not found' });
        res.status(200).json(registration);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
