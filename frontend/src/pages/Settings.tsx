import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import authService from '@/services/authService';
import { Loader2, User, Lock, Bell, Shield, Mail } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const Settings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: authService.getCurrentUser()?.name || '',
    email: authService.getCurrentUser()?.email || '',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    searchHistory: true,
    shareAnalytics: false,
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.updateProfile(profileForm);
      toast({
        title: 'Success!',
        description: 'Profile updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: 'Error',
        description: 'Password must be at least 8 characters long',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      await authService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast({
        title: 'Success!',
        description: 'Password changed successfully',
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to change password',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      const response = await authService.resendVerification();
      setVerificationSent(true);
      toast({
        title: 'Success!',
        description: response.message || 'Verification email sent',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to send verification email',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const user = authService.getCurrentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Manage your account settings and preferences
          </p>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 max-w-2xl">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your profile details and email address
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        placeholder="Enter your email"
                      />
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Update Profile
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Email Verification
                    </CardTitle>
                    <CardDescription>
                      {user?.isEmailVerified 
                        ? 'Your email address is verified' 
                        : 'Verify your email to access all features'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user?.isEmailVerified ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <Shield className="h-5 w-5" />
                        <span className="font-medium">Email Verified</span>
                      </div>
                    ) : (
                      <Button 
                        onClick={handleResendVerification} 
                        disabled={loading || verificationSent}
                        variant="outline"
                      >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {verificationSent ? 'Verification Email Sent' : 'Resend Verification Email'}
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Change Password
                    </CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          placeholder="Enter current password"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          placeholder="Enter new password (min 8 characters)"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          placeholder="Confirm new password"
                        />
                      </div>
                      <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Change Password
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Control how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive updates via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) => 
                        setPreferences({ ...preferences, emailNotifications: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-gray-500">Receive browser notifications</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={preferences.pushNotifications}
                      onCheckedChange={(checked) => 
                        setPreferences({ ...preferences, pushNotifications: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Privacy Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your data and privacy preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="search-history">Save Search History</Label>
                      <p className="text-sm text-gray-500">Keep track of your searches</p>
                    </div>
                    <Switch
                      id="search-history"
                      checked={preferences.searchHistory}
                      onCheckedChange={(checked) => 
                        setPreferences({ ...preferences, searchHistory: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="share-analytics">Share Analytics Data</Label>
                      <p className="text-sm text-gray-500">Help improve MoodMap</p>
                    </div>
                    <Switch
                      id="share-analytics"
                      checked={preferences.shareAnalytics}
                      onCheckedChange={(checked) => 
                        setPreferences({ ...preferences, shareAnalytics: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Settings;
