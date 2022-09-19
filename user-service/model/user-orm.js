import { createUser } from './repository.js';
import bcrypt from 'bcrypt';


//need to separate orm functions from repository to decouple business logic from persistence
import { createUser } from './repository.js';

export async function ormCreateUser(username, password) {
    try {
        const newUser = await createUser({username, password});
        newUser.password = await hashPassword(newUser);
        newUser.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not create new user');
        return { err };
    }
}

async function hashPassword(newUser) {
    const hashed = await bcrypt.hash(newUser.password, 10);
    return hashed;
}
