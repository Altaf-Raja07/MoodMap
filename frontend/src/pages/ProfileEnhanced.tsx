import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NavbarEnhanced from '@/components/NavbarEnhanced';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import authService from '@/services/authService';
import analyticsService from '@/services/analyticsService';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Heart, 
  Star,
  Settings,
  Loader2,
  Shield,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface LocalUserStats {
  totalSearches: number;
  totalFavorites: number;
  totalReviews: number;
  accountAge: string;
}

const ProfileEnhanced = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState<LocalUserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    fetchUserStats();
  }, [navigate]);

  const fetchUserStats = async () => {
    try {
      const data = await analyticsService.getMyStats();
      // Convert accountAge from number to string
      const convertedStats: LocalUserStats = {
        ...data,
        accountAge: String(data.accountAge),
      };
      setStats(convertedStats);
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch user stats',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <NavbarEnhanced />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            My Profile
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <div className="flex flex-col items-center">
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl">
                      {currentUser?.name ? getInitials(currentUser.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold">{currentUser?.name}</h2>
                  <p className="text-muted-foreground">{currentUser?.email}</p>
                  
                  {/* Email Verification Badge */}
                  <div className="mt-4">
                    {currentUser?.isEmailVerified ? (
                      <Badge className="bg-green-500/10 text-green-600 dark:text-green-400">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Email Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-orange-600">
                        <XCircle className="w-3 h-3 mr-1" />
                        Email Not Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => navigate('/settings')}
                  className="w-full"
                  variant="outline"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button
                  onClick={() => navigate('/analytics')}
                  className="w-full"
                  variant="default"
                >
                  <Star className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="lg:col-span-2">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Total Searches */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <MapPin className="h-5 w-5 text-blue-600" />
                        </div>
                        Total Searches
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold">{stats?.totalSearches || 0}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Places explored
                      </p>
                    </CardContent>
                  </Card>

                  {/* Total Favorites */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-red-500/10">
                          <Heart className="h-5 w-5 text-red-600" />
                        </div>
                        Favorites
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold">{stats?.totalFavorites || 0}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Saved places
                      </p>
                    </CardContent>
                  </Card>

                  {/* Total Reviews */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-yellow-500/10">
                          <Star className="h-5 w-5 text-yellow-600" />
                        </div>
                        Reviews
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold">{stats?.totalReviews || 0}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Reviews written
                      </p>
                    </CardContent>
                  </Card>

                  {/* Account Age */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-purple-500/10">
                          <Calendar className="h-5 w-5 text-purple-600" />
                        </div>
                        Member Since
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{stats?.accountAge || 'N/A'}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Account age
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Account Info Card */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Your account details and security status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
                      </div>
                    </div>
                    {currentUser?.isEmailVerified ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-orange-600" />
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Account Security</p>
                        <p className="text-sm text-muted-foreground">Password protected</p>
                      </div>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Profile Completion</p>
                        <p className="text-sm text-muted-foreground">Basic info added</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfileEnhanced;
