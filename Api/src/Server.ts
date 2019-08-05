import 'colors';

import * as Express from 'express';
import * as Socketio from 'socket.io';
import * as session from 'express-session';
import * as Connect from 'connect-mongo';
import * as BodyParser from 'body-parser';
import { join } from 'path';

import { env, port, testing, sessionSecret as secret, mongoUrl, cwd } from './Config';
import { InitRoutes } from './Router';
import { Configure } from './service/Route.service';

export const app = Express();
export const server = require('http').createServer(app);
export const io = Socketio(server);
export const Store = Connect(session);
export const uploadDir = join(cwd, 'upload');

app.use('/upload', Express.static(uploadDir));

app.use((req, res, next) => {
    req.io = io;
    return next();
});

app.use(
    session({
        secret,
        store: new Store({ url: mongoUrl }),
        rolling: true,
        resave: true,
        saveUninitialized: false,
    })
);

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

Configure(app);
InitRoutes(app);

if (!testing) {
    server.listen(port);
    console.log(`\n[ENV]\t\t ${env}`.green.bold);
    console.log(`[PORT]\t\t ${port}`.green.bold);
    console.log(`[STARTED]\t`.green.bold, `FULLYANNOTATED API`, `\n`);
}