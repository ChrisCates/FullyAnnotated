import * as bcrypt from 'bcryptjs';
import * as sharp from 'sharp';
import { remove } from 'fs-jetpack';

import { processFile } from '../Config';

import { Response, Code, ResponseTemplate } from '../service/Response.service';

import {
    UserInterface,
    User,
} from '../Database';

export async function UserRegister(req, res) {
    let routeResponse: Response = ResponseTemplate();

    try {
        const UsernameUsed = await User.findOne({ username: req.body.username });

        if (req.body.password !== req.body.confirmPassword) {
            routeResponse.code = 400;
            routeResponse.message = 'Passwords do not match...';
        } else if (UsernameUsed) {
            routeResponse.code = 400;
            routeResponse.message = 'Username is already in use...';
        } else {
            const encryptedPassword = bcrypt.hashSync(req.body.password, 10).toString();

            const NewUserObject: UserInterface = {
                username: req.body.username.toLowerCase(),
                email: '',
                name: '',
                tagline: '',
                photo: '',
                password: encryptedPassword,
                dateCreated: Number(new Date()),
                dateUpdated: Number(new Date()),
            };

            const NewUser = new User(NewUserObject);
            await NewUser.save();

            req.session.user = NewUser;
            req.session.save();

            routeResponse.code = 201;
            routeResponse.message = 'User created';
        }
    } catch (error) {
        console.log(error);
        routeResponse.code = 500;
        routeResponse.message = Code(500);
    }

    return res.status(routeResponse.code).send(routeResponse);
}

export async function UserLogin(req, res) {
    let routeResponse: Response = ResponseTemplate();

    try {
        const CheckUser = await User.findOne({ username: req.body.username });

        if (CheckUser) {
            const StoredPassword = CheckUser.password;
            if (bcrypt.compareSync(req.body.password, StoredPassword)) {
                req.session.user = CheckUser;
                req.session.save();
                routeResponse.message = 'Logged in';
            } else {
                routeResponse.code = 403;
                routeResponse.message = 'This password is incorrect';
            }
        } else {
            routeResponse.code = 403;
            routeResponse.message = 'This username is not registered';
        }
    } catch (error) {
        console.log(error);
        routeResponse.code = 500;
        routeResponse.message = Code(500);
    }

    return res.status(routeResponse.code).send(routeResponse);
}

export async function UsernameAvailable(req, res) {
    let routeResponse: Response = ResponseTemplate();

    try {
        const UserExists = await User.findOne({ username: req.query.username.toLowerCase() });
        if (UserExists) {
            routeResponse.code = 400;
            routeResponse.message = 'This username is in use...';
        } else {
            routeResponse.code = 200;
            routeResponse.message = 'This username is available...';
        }
    } catch (error) {
        console.log(error);
        routeResponse.code = 500;
        routeResponse.message = Code(500);
    }

    return res.status(routeResponse.code).send(routeResponse);
}

export async function EmailAvailable(req, res) {
    let routeResponse: Response = ResponseTemplate();

    try {
        const EmailExists = await User.findOne({ email: req.query.email.toLowerCase() });
        if (EmailExists) {
            routeResponse.code = 400;
            routeResponse.message = 'This email is in use...';
        } else {
            routeResponse.code = 200;
            routeResponse.message = 'This email is available...';
        }
    } catch (error) {
        console.log(error);
        routeResponse.code = 500;
        routeResponse.message = Code(500);
    }

    return res.status(routeResponse.code).send(routeResponse);
}

export async function UserUpdate(req, res) {
    let routeResponse: Response = ResponseTemplate();

    try {
        const UpdateQuery = {
            username: req.body.username.toLowerCase(),
            email: req.body.email.toLowerCase(),
            name: req.body.name,
            tagline: req.body.tagline,
        }

        if (req.file) {
            const path = req.file.path;
            const newUrl = `${req.session.user._id}-photo-${Number(new Date())}.jpg`;

            await sharp(path).resize(512).toFile(`upload/${newUrl}`);

            const processedFile = await processFile(newUrl);

            UpdateQuery['photo'] = processedFile;

            setTimeout(() => {
                remove(path);
                remove(newUrl);
            }, 1000);
        }

        routeResponse.response = await User.findOneAndUpdate(
            { _id: req.session.user._id },
            UpdateQuery,
        );

        req.session.user = routeResponse.response;
        req.session.save();
    } catch (error) {
        console.log(error);
        routeResponse.code = 500;
        routeResponse.message = Code(500);
    }

    return res.status(routeResponse.code).send(routeResponse);
}

export async function UserPassword(req, res) {
    let routeResponse: Response = ResponseTemplate();

    try {
        const OldPassword = req.session.user.password;

        if (bcrypt.compareSync(req.body.oldPassword, OldPassword)) {
            if (req.body.password === req.body.confirmPassword) {
                const password = bcrypt.hashSync(req.body.password, 10).toString();

                await User.updateOne(
                    { _id: req.session.user._id },
                    { password },
                );

                req.session.user.password = password;
                req.session.save();

                routeResponse.message = 'Password updated';
            } else {
                routeResponse.code = 403;
                routeResponse.message = 'Passwords do not match';
            }
        } else {
            routeResponse.code = 403;
            routeResponse.message = 'Old password is incorrect';
        }
    } catch (error) {
        console.log(error);
        routeResponse.code = 500;
        routeResponse.message = Code(500);
    }

    return res.status(routeResponse.code).send(routeResponse);
}
