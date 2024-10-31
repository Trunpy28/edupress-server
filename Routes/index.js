import UserRouters from '../Routes/UserRouter.js'

const routes = (app) => {
    app.use('/api/user', UserRouters);
}

export default routes;