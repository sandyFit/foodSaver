import mongoose from 'mongoose';

export const isValidObjectId = (id: string): boolean => {
    if (!id || typeof id !== "string") {
        return false;
    } 

    return (
        mongoose.Types.ObjectId.isValid(id) &&
        new mongoose.Types.ObjectId(id).toString() === id);
};
