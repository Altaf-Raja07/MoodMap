import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import authService from '@/services/authService';
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setEmailSent(true);
      toast({
        title: 'Email Sent!',
        description: 'Check your email for password reset instructions',
      });
    } catch (error: any) {
      console.error('Error sending reset email:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to send reset email',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link
          to="/login"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Link>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Forgot Password?</CardTitle>
            <CardDescription>
              No worries, we'll send you reset instructions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emailSent ? (
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Check your email</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We've sent password reset instructions to <strong>{email}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the email? Check your spam folder or{' '}
                    <button
                      onClick={() => setEmailSent(false)}
                      className="text-primary hover:underline"
                    >
                      try again
                    </button>
                  </p>
                </div>
                <Button onClick={() => window.location.href = '/login'} className="w-full">
                  Back to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter the email associated with your account
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Reset Link
                </Button>

                <div className="text-center text-sm">
                  <Link to="/login" className="text-primary hover:underline">
                    Remember your password? Login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
