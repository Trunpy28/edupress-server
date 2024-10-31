import jwt from 'jsonwebtoken';

// Generate access token
export const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '1h' }
    );
};

// Generate refresh token
export const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '30d' }
    );
};

// Validate refresh token
export const validateRefreshToken = (refreshToken) => {
    try {
        return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
        return null;
    }
};
