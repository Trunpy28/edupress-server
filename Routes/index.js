import UserRouters from '../Routes/UserRouter.js'
import CourseRouters from '../Routes/CourseRouter.js'
import LessonRouter from '../Routes/LessonRouter.js'

const routes = (app) => {
    app.use('/api/user', UserRouters);
    app.use('/api/course', CourseRouters);
    app.use('/api/lesson', LessonRouter);
}

export default routes;