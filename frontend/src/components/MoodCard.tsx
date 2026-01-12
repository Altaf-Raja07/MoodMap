import { motion } from "framer-motion";

interface MoodCardProps {
  emoji: string;
  label: string;
  description: string;
  delay?: number;
  onClick?: () => void;
}

export const MoodCard = ({ emoji, label, description, delay = 0, onClick }: MoodCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      onClick={onClick}
      className="mood-card"
    >
      <div className="mood-icon">{emoji}</div>
      <div>
        <h3 className="font-semibold text-foreground mb-1">{label}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
};
