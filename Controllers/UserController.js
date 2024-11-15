import UserService from '../Services/UserService.js';
import CloudinaryService from '../Services/CloudinaryService.js';

export const registerUser = async (req, res) => {
    try {
        const { userName, email, password, confirmPassword } = req.body;
        
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const user = await UserService.register(userName, email, password);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const { accessToken, refreshToken } = await UserService.loginUserName(userName, password);
        
        // Gửi refresh token qua cookie HttpOnly
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS trong môi trường sản xuất
            sameSite: 'Strict',
        });

        res.status(200).json({ accessToken });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const logoutUser = (req, res) => {
    try {
        // Xóa cookie refresh token
        res.clearCookie('refresh_token');

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const refreshUserToken = async (req, res) => {
    try {
        
        const token = req.cookies.refresh_token; // Lấy refresh token từ cookie
        const newAccessToken = await UserService.refreshToken(token);
        res.status(200).json(newAccessToken);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) return res.status(401).json({ message: 'User does not exist' });
        const user = await UserService.getUserProfile(userId);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const getUser = async (req, res) => {
    try {
        const users = await UserService.getUser();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const updateAvatar = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) return res.status(401).json({ message: 'User does not exist' });
        const avatarFile = req.file;
        
        const fileUrl = await CloudinaryService.uploadFile(avatarFile);
        await UserService.updateAvatar(userId, fileUrl);
        
        res.status(200).json({ avatarUrl: fileUrl });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await UserService.deleteUser(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) return res.status(401).json({ message: 'User does not exist' });

        const { name } = req.body;
        
        const updatedUser = await UserService.updateUserProfile(userId, { name });

        return res.status(200).json({updatedUser});
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const createAdmin = async (req, res) => {
    const { userName, email, password } = req.body;
    try {
        const newAdmin = await UserService.createAdmin(userName, email, password);
        res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
