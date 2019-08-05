import { Schema } from 'mongoose';

export interface UserInterface {
    username: string;
    email: string;
    name: string;
    tagline: string;
    photo: string;
    password: string;
    dateCreated: number;
    dateUpdated: number;
}

export const UserSchema = new Schema({
    username: String,
    email: String,
    name: String,
    tagline: String,
    photo: String,
    password: String,
    dateCreated: Number,
    dateUpdated: Number,
});