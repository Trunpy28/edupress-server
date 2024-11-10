import UserRouters from '../Routes/UserRouter.js'
import CourseRouters from '../Routes/CourseRouter.js'
import CourseReviewRouters from '../Routes/CourseReviewRouter.js'
import RegisterCourseRouter from '../Routes/RegisterCourseRouter.js'
import LessonRouter from '../Routes/LessonRouter.js'

const routes = (app) => {
    app.use('/api/user', UserRouters);
    app.use('/api/course', CourseRouters);
    app.use('/api/course-review', CourseReviewRouters);
    app.use('/api/register-course', RegisterCourseRouter);
    app.use('/api/lesson', LessonRouter);
}

export default routes;