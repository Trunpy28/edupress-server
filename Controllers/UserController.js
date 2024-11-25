import UserService from '../Services/UserService.js';
import CloudinaryService from '../Services/CloudinaryService.js';

const registerUser = async (req, res) => {
    try {
        const { userName, email, password, confirmPassword } = req.body;
        
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const user = await UserService.register(userName, email, password);
        return res.status(201).json(user);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const { accessToken, refreshToken } = await UserService.loginUserName(userName, password);
        
        // Gửi refresh token qua cookie HttpOnly
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS trong môi trường sản xuất
            sameSite: 'Strict',
        });

        return res.status(200).json({ accessToken });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const logoutUser = (req, res) => {
    try {
        // Xóa cookie refresh token
        res.clearCookie('refresh_token');

        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const refreshUserToken = async (req, res) => {
    try {
        
        const token = req.cookies.refresh_token; // Lấy refresh token từ cookie
        const newAccessToken = await UserService.refreshToken(token);
        return res.status(200).json(newAccessToken);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) return res.status(401).json({ message: 'User does not exist' });
        const user = await UserService.getUserProfile(userId);
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await UserService.getUsers();
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const updateAvatar = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) return res.status(401).json({ message: 'User does not exist' });
        const avatarFile = req.file;
        
        const fileUrl = await CloudinaryService.uploadFile(avatarFile);
        await UserService.updateAvatar(userId, fileUrl);
        
        return res.status(200).json({ avatarUrl: fileUrl });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await UserService.deleteUser(id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) return res.status(401).json({ message: 'User does not exist' });

        const { name } = req.body;
        
        const updatedUser = await UserService.updateUserProfile(userId, { name });

        return res.status(200).json({updatedUser});
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const createUser = async (req, res) => {
    const { userName, email, name, password, role } = req.body;
    try {
        const newUser = await UserService.createUser(userName, email, name, password, role);
        return res.status(201).json({ message: 'User created successfully', newUser });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const editUserProfile = async (req, res) => {
    const userId = req.params.userId;
    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    const { name, role } = req.body;

    try {
        const updatedUser = await UserService.editUserProfile(userId, {name, role});
        return res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser
        }); 
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export default {
    registerUser,
    loginUser,
    logoutUser,
    refreshUserToken,
    getUserProfile,
    getUsers,
    updateAvatar,
    deleteUser,
    updateUserProfile,
    createUser,
    editUserProfile
}
