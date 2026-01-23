// ============================================
// USER/AUTH CONTROLLER
// ============================================
import User from '../models/User.js';
import authService from '../services/authService.js';
import emailService from '../services/emailService.js';
import crypto from 'crypto';

/**
 * Register new user
 * @route POST /api/auth/register
 * @access Public
 */
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password // Will be hashed by pre-save middleware
        });

        // Generate email verification token
        const verificationToken = user.getEmailVerificationToken();
        await user.save({ validateBeforeSave: false });

        // Send verification email
        try {
            await emailService.sendVerificationEmail(email, name, verificationToken);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Continue with registration even if email fails
        }

        // Generate auth token
        const token = authService.generateToken(user._id);

        res.status(201).json({
            ...authService.createTokenResponse(user, token),
            message: 'Registration successful. Please check your email to verify your account.'
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
};

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Get user with password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if account is locked
        if (user.isLocked) {
            return res.status(423).json({
                success: false,
                message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.'
            });
        }

        // Check if account is suspended
        if (user.accountStatus === 'suspended') {
            return res.status(403).json({
                success: false,
                message: 'Your account has been suspended. Please contact support.'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            // Increment login attempts
            await user.incLoginAttempts();
            
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Reset login attempts on successful login
        if (user.loginAttempts > 0 || user.lockUntil) {
            await user.resetLoginAttempts();
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        // Generate token
        const token = authService.generateToken(user._id);

        res.json(authService.createTokenResponse(user, token));
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 * @access Private
 */
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                preferences: user.preferences,
                favorites: user.favorites,
                searchHistory: user.searchHistory.slice(-10), // Last 10 searches
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('GetMe error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user profile',
            error: error.message
        });
    }
};

/**
 * Update user preferences
 * @route PUT /api/auth/preferences
 * @access Private
 */
export const updatePreferences = async (req, res) => {
    try {
        const { favoriteMoods, dietaryRestrictions, budgetRange } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    'preferences.favoriteMoods': favoriteMoods,
                    'preferences.dietaryRestrictions': dietaryRestrictions,
                    'preferences.budgetRange': budgetRange
                }
            },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Preferences updated successfully',
            data: user.preferences
        });
    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating preferences',
            error: error.message
        });
    }
};

/**
 * Get user search history
 * @route GET /api/auth/history
 * @access Private
 */
export const getSearchHistory = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.json({
            success: true,
            count: user.searchHistory.length,
            data: user.searchHistory.reverse() // Most recent first
        });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching search history',
            error: error.message
        });
    }
};

/**
 * Verify email
 * @route POST /api/auth/verify-email/:token
 * @access Public
 */
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        // Hash the token to compare with stored hash
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
            });
        }

        // Update user
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpire = undefined;
        await user.save();

        // Send welcome email
        try {
            await emailService.sendWelcomeEmail(user.email, user.name);
        } catch (emailError) {
            console.error('Welcome email failed:', emailError);
        }

        res.json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying email',
            error: error.message
        });
    }
};

/**
 * Forgot password - Send reset email
 * @route POST /api/auth/forgot-password
 * @access Public
 */
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            // Don't reveal if user exists for security
            return res.json({
                success: true,
                message: 'If that email exists, a password reset link has been sent'
            });
        }

        // Generate reset token
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        // Send reset email
        try {
            await emailService.sendPasswordResetEmail(user.email, user.name, resetToken);
        } catch (emailError) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            
            return res.status(500).json({
                success: false,
                message: 'Email could not be sent'
            });
        }

        res.json({
            success: true,
            message: 'If that email exists, a password reset link has been sent'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing request',
            error: error.message
        });
    }
};

/**
 * Reset password
 * @route POST /api/auth/reset-password/:token
 * @access Public
 */
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Hash the token to compare with stored hash
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        // Generate new auth token
        const authToken = authService.generateToken(user._id);

        res.json({
            ...authService.createTokenResponse(user, authToken),
            message: 'Password reset successful'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resetting password',
            error: error.message
        });
    }
};

/**
 * Update user profile
 * @route PUT /api/auth/profile
 * @access Private
 */
export const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.user._id);

        // Check if email is being changed and if it already exists
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already in use'
                });
            }
            user.email = email;
            user.isEmailVerified = false; // Require re-verification
            
            // Generate new verification token
            const verificationToken = user.getEmailVerificationToken();
            await emailService.sendVerificationEmail(email, name || user.name, verificationToken);
        }

        if (name) user.name = name;
        
        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

/**
 * Change password
 * @route PUT /api/auth/change-password
 * @access Private
 */
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id).select('+password');

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Set new password
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error changing password',
            error: error.message
        });
    }
};
