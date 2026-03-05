import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, X, TrendingUp } from 'lucide-react';

interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: Date;
  mood?: string;
  location?: string;
}

const STORAGE_KEY = 'moodmap_search_history';
const MAX_HISTORY = 10;

export const SearchHistory = () => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const addToHistory = (query: string, mood?: string, location?: string) => {
    const newItem: SearchHistoryItem = {
      id: Date.now().toString(),
      query,
      mood,
      location,
      timestamp: new Date(),
    };

    const updatedHistory = [newItem, ...history.filter(item => item.query !== query)]
      .slice(0, MAX_HISTORY);
    
    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  };

  const removeFromHistory = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!showHistory || history.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Searches
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHistory(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {history.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm">{item.query}</p>
                  {item.mood && (
                    <Badge variant="secondary" className="text-xs">
                      {item.mood}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {getRelativeTime(item.timestamp)}
                  {item.location && ` • ${item.location}`}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFromHistory(item.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>
        
        {history.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearHistory}
            className="w-full mt-4"
          >
            Clear All History
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchHistory;

// Export utility function for adding to history from other components
export const useSearchHistory = () => {
  const addToHistory = (query: string, mood?: string, location?: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const history: SearchHistoryItem[] = stored ? JSON.parse(stored) : [];
      
      const newItem: SearchHistoryItem = {
        id: Date.now().toString(),
        query,
        mood,
        location,
        timestamp: new Date(),
      };

      const updatedHistory = [newItem, ...history.filter(item => item.query !== query)]
        .slice(0, MAX_HISTORY);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error adding to search history:', error);
    }
  };

  return { addToHistory };
};
