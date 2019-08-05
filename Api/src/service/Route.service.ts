import * as morgan from 'morgan';
import { cors } from '../Config';

export function Configure(app) {
    app.use(morgan((tokens, req, res) => {
        return [
            `[${tokens.method(req, res)}]`.bold,
            `[${tokens.status(req, res)}]\t`.yellow.bold,
            `${tokens.url(req, res)} `,
            `${tokens['response-time'](req, res)}ms`.blue
        ].join('');
    }));

    if (cors === 'origin') {
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', req.get('origin'));
            next();
        });
    } else {
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', cors);
            next();
        });
    }

    app.use(function(req, res, next) {
        res.header('X-Powered-By', 'PutVersusCall');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    console.log(`[CONFIG]\t`.green.bold, `configuration loaded\n`);
}

export function Loaded(type: string, url: string) {
    let tabs = '\t\t';
    if (type.length > 5) { tabs = '\t'; }
    console.log(`[${type}]${tabs}`.green.bold, `${url}`.green, `loaded`);
}

export function RouteCollection(app, name, routes, middleware = null) {
    console.log(`${name} routes\n`.green.bold);

    for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        LoadRoute(app, route, middleware);
        Loaded(route['type'], route['path']);
    }

    console.log('');
}

export function LoadRoute(app, route, middleware = null) {
    if (middleware) {
        if (route['middleware']) {
            app[route['type'].toLowerCase()](
                route['path'],
                middleware,
                route['middleware'],
                route['component']
            );
        } else {
            app[route['type'].toLowerCase()](
                route['path'],
                middleware,
                route['component']
            );
        }
    } else {
        if (route['middleware']) {
            app[route['type'].toLowerCase()](
                route['path'],
                route['middleware'],
                route['component']
            );
        } else {
            app[route['type'].toLowerCase()](
                route['path'],
                route['component']
            );
        }
    }
}

export async function LoggedIn(req, res, next) {
    if (!req.session.user) {
        return res.status(403).send({
            code: 403,
            message: 'You are not logged in...',
            response: null,
            errors: [],
        });
    } else {
        return next();
    }
}
