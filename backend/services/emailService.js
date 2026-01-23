// ============================================
// EMAIL SERVICE - Handle email notifications
// ============================================
// NOTE: This is a basic implementation using console.log for development
// For production, integrate with services like SendGrid, AWS SES, or Nodemailer with SMTP

class EmailService {
    /**
     * Send email verification email
     */
    async sendVerificationEmail(email, name, token) {
        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
        
        // In development, log to console
        if (process.env.NODE_ENV === 'development') {
            console.log('\n' + '='.repeat(60));
            console.log('📧 EMAIL VERIFICATION');
            console.log('='.repeat(60));
            console.log(`To: ${email}`);
            console.log(`Name: ${name}`);
            console.log(`Verification URL: ${verificationUrl}`);
            console.log('='.repeat(60) + '\n');
            return true;
        }
        
        // TODO: Implement actual email sending for production
        // Example with SendGrid:
        // const msg = {
        //     to: email,
        //     from: process.env.FROM_EMAIL,
        //     subject: 'Verify Your MoodMap Email',
        //     html: `
        //         <h1>Welcome to MoodMap, ${name}!</h1>
        //         <p>Please verify your email by clicking the link below:</p>
        //         <a href="${verificationUrl}">Verify Email</a>
        //         <p>This link will expire in 24 hours.</p>
        //     `
        // };
        // await sgMail.send(msg);
        
        return true;
    }
    
    /**
     * Send password reset email
     */
    async sendPasswordResetEmail(email, name, token) {
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
        
        // In development, log to console
        if (process.env.NODE_ENV === 'development') {
            console.log('\n' + '='.repeat(60));
            console.log('🔐 PASSWORD RESET');
            console.log('='.repeat(60));
            console.log(`To: ${email}`);
            console.log(`Name: ${name}`);
            console.log(`Reset URL: ${resetUrl}`);
            console.log('='.repeat(60) + '\n');
            return true;
        }
        
        // TODO: Implement actual email sending for production
        return true;
    }
    
    /**
     * Send welcome email
     */
    async sendWelcomeEmail(email, name) {
        if (process.env.NODE_ENV === 'development') {
            console.log('\n' + '='.repeat(60));
            console.log('👋 WELCOME EMAIL');
            console.log('='.repeat(60));
            console.log(`To: ${email}`);
            console.log(`Name: ${name}`);
            console.log('='.repeat(60) + '\n');
            return true;
        }
        
        return true;
    }
}

export default new EmailService();
