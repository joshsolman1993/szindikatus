import { updateProfile } from './users';

export interface UpdateProfilePayload {
    bio?: string;
    settings?: {
        soundEnabled?: boolean;
    };
}

export const updateUserProfile = async (payload: UpdateProfilePayload) => {
    return updateProfile(payload);
};
