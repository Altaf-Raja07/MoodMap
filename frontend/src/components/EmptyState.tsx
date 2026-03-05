import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
        {icon || <Inbox className="h-10 w-10 text-muted-foreground" />}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground text-center mb-6 max-w-md">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="default">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
