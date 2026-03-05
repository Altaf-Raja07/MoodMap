import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
}

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'We encountered an error. Please try again.',
  onRetry,
  retryText = 'Try Again',
}: ErrorStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4"
    >
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
        <XCircle className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="default">
          {retryText}
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;
