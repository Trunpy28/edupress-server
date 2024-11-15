import bcrypt from 'bcrypt';
import User from '../Models/User.js';
import { generateAccessToken, generateRefreshToken, validateRefreshToken } from './TokenService.js';

const register = async (userName, email, password) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
    }

    const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
    if (existingUser) {
        throw new Error('User already exists with this username or email');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            userName,
            email,
            passwordHash: hashedPassword
        });
        await user.save();
        return {
            userName,
            email,
        };
    } catch (error) {
        throw new Error('Registration failed: ' + error.message);
    }
};

const loginUserName = async (userName, password) => {
    try {
        const user = await User.findOne({ userName });
        if (!user) throw new Error('User not found');

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) throw new Error('Incorrect password');

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        
        return { accessToken, refreshToken, role: user.role };
    } catch (error) {
        throw new Error('Login failed: ' + error.message);
    }
};

const login = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!user) throw new Error('User not found');

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) throw new Error('Invalid password');

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        return { accessToken, refreshToken, role: user.role };
    } catch (error) {
        throw new Error('Login failed: ' + error.message);
    }
};

const refreshToken = async (refreshToken) => {
    try {
        const decoded = validateRefreshToken(refreshToken);
        if (!decoded) throw new Error('Invalid refresh token');

        const user = await User.findById(decoded.id);
        if (!user) throw new Error('User not found');

        const newAccessToken = generateAccessToken(user);

        return { accessToken: newAccessToken };
    } catch (error) {
        throw new Error('Token refresh failed: ' + error.message);
    }
};

const getUserProfile = async (id) => {
    try {
        const user = await User.findById(id);
        if (!user) throw new Error('User not found');
        return {
            userName: user.userName,
            email: user.email,
            name: user.name,
            role: user.role,
            avatarUrl: user.avatarUrl
        }
    }
    catch (error){
        throw new Error('Error retrieving user profile');
    }
}

const updateAvatar = async (id, avatarUrl) => {
    try {
        await User.findByIdAndUpdate(id, {
            avatarUrl
        })
    }
    catch(error){
        throw new Error('Error updating avatar');
    }
}

export const updateUserProfile = async (id, newInfo) => {
    try {      
        const updatedUser = await User.findByIdAndUpdate(id, newInfo, { new: true });
        return {
            userName: updatedUser.userName,
            email: updatedUser.email,
            name: updatedUser.name,
            role: updatedUser.role,
            avatarUrl: updatedUser.avatarUrl
        }
    }
    catch (error) {
        throw new Error('Error updating user info');
    }
}

const getUser = async () => {
    try {
        return await User.find();
    } catch (error) {
        throw new Error('Error retrieving users: ' + error.message);
    }
}

const deleteUser = async (id) => {
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            throw new Error('User not found');
        }
        return { message: 'User deleted successfully' };
    } catch (error) {
        throw new Error('Error deleting user: ' + error.message);
    }
}

const createAdmin = async (userName, email, password) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
    }

    const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
    if (existingUser) {
        throw new Error('User already exists with this username or email');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new User({
            userName,
            email,
            passwordHash: hashedPassword,
            role: 'Admin',
        });
        await admin.save();
        return {
            userName,
            email,
        };
    } catch (error) {
        throw new Error('Failed to create admin: ' + error.message);
    }
};

export default { register, login, loginUserName, refreshToken, getUserProfile, updateAvatar, updateUserProfile, getUser, deleteUser, createAdmin };
