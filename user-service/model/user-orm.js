import { createUser, exists, findUser } from './repository.js';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
    try {
        const newUser = await createUser({ username, password });
        const existingUser = await exists(username);
        if (existingUser) {
            return false;
        }

        newUser.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not create new user');
        return { err };
    }
}

export async function ormFindUser(username) {
    return await findUser(username);
}
