import * as Mongoose from 'mongoose';
import { mongoUrl } from './Config';

import { UserInterface, UserSchema } from './schema/User.schema';

console.log(`Mongo URL ${mongoUrl}\n`.green.bold);
Mongoose.connect(mongoUrl, { useNewUrlParser: true });

export const User = Mongoose.model('User', UserSchema);

export {
    UserInterface,
};
