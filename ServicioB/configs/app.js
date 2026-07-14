'use strict';

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import { corsOptions } from './cors-configuration.js';
import { dbConnection } from './db.js';
import { helmetConfiguration } from './helmet-configuration.js';
import { requestLimit } from '../middlewares/request-limit.js';
import { errorHandler } from '../middlewares/handle-errors.js';
import registrationRoutes from '../src/inscriptions/registration.routes.js';
import userRegistrationRoutes from '../src/userRegistrations/user-registration.routes.js';

const BASE_URL = '/eventSystem/v1';

const middleware = (app) => {
    app.use(helmet(helmetConfiguration));
    app.use(cors(corsOptions));
    app.use(express.urlencoded({
        extended: false,
        limit: '10mb'
    }));
    app.use(express.json({
        limit: '10mb'
    }));
    app.use(requestLimit);
    app.use(morgan('dev'));
};

const routes = (app) => {
    app.get(`${BASE_URL}/health`, (req, res) => {
        res.status(200).json({
            success: true,
            service: 'ServicioB',
            message: 'Servicio B funcionando correctamente',
        });
    });

    app.use(BASE_URL, registrationRoutes);
    app.use(BASE_URL, userRegistrationRoutes);
    app.use(
        `${BASE_URL}/inscriptions`,
        registrationRoutes
    );
    app.use(
        `${BASE_URL}/inscriptions`,
        userRegistrationRoutes
    );
};

const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT || 3001;

    try {
        await dbConnection();

        middleware(app);
        routes(app);

        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
            console.log(
                `Base URL: http://localhost:${PORT}${BASE_URL}`
            );
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
};

export { initServer };
