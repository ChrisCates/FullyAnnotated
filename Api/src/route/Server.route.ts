import { FileStorage } from '../Config';

export const startTime = Number(new Date());

export async function ServerInfo(req, res, next) {
    const serverTime = Number(new Date());
    const upTime = serverTime - startTime;

    return res.status(200).send({
        'status': 'OK',
        startTime,
        serverTime,
        upTime,
        FileStorage,
    });
}

export async function Session(req, res) {
    if (req.session.user) {
        return res.status(200).send({
            active: true,
            user: {
                _id: req.session.user._id,
                name: req.session.user.name,
                email: req.session.user.email,
                username: req.session.user.username,
                tagline: req.session.user.tagline,
                photo: req.session.user.photo,
            }
        });
    } else {
        return res.status(200).send({
            active: false,
            user: {}
        });
    }
}

export async function Logout(req, res) {
    req.session.destroy();

    return res.status(200).send({
        message: 'Logged out!~'
    });
}
