import { upload } from './Config';
import { RouteCollection, LoggedIn } from './service/Route.service';

import {
    ServerInfo,
    Session,
    Logout,
} from './route/Server.route';

import {
    UserRegister,
    UserLogin,
    UserUpdate,
    UsernameAvailable,
    EmailAvailable,
    UserPassword,
} from './route/User.route';

import {
    GetQuote,
    GetOptions,
} from './route/Tradier.route';

import {
    CreateChat,
    GetChat,
} from './route/Chat.route';

import {
    CreateStrike,
    GetStrikes,
    RecentStrikes,
} from './route/Strike.route';

export const ServerRoutes = [
    { type: 'GET', path: '/', component: ServerInfo },
    { type: 'GET', path: '/session', component: Session },
    { type: 'GET', path: '/logout', component: Logout },
    { type: 'GET', path: '/username', component: UsernameAvailable },
    { type: 'GET', path: '/email', component: EmailAvailable },
];

export const UserRoutes = [
    { type: 'POST', path: '/register', component: UserRegister },
    { type: 'POST', path: '/login', component: UserLogin },
    { type: 'POST', path: '/user', component: UserUpdate, middleware: upload.single('photo') },
    { type: 'POST', path: '/user/password', component: UserPassword },
];

export const TradierRoutes = [
    { type: 'GET', path: '/tradier/quote', component: GetQuote },
    { type: 'GET', path: '/tradier/options', component: GetOptions },
];

export const ChatRoutes = [
    { type: 'GET', path: '/chat', component: GetChat },
    { type: 'POST', path: '/chat', component: CreateChat, middleware: LoggedIn, },
];

export const StrikeRoutes = [
    { type: 'GET', path: '/strike', component: GetStrikes },
    { type: 'GET', path: '/strike/recent', component: RecentStrikes },
    { type: 'POST', path: '/strike', component: CreateStrike, middleware: LoggedIn, },
];

export function InitRoutes(app) {
    RouteCollection(app, 'Base Server', ServerRoutes);
    RouteCollection(app, 'User', UserRoutes);
    RouteCollection(app, 'Tradier', TradierRoutes);
    RouteCollection(app, 'Chat', ChatRoutes);
    RouteCollection(app, 'Strike', StrikeRoutes);
}
