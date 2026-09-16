import { motion } from 'framer-motion';

interface LoadingProps {
  message?: string;
}

export default function Loading({ message }: LoadingProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-amber-500 rounded-full animate-spin" />
        </div>
        {message && (
          <p className="text-gray-600 font-medium">{message}</p>
        )}
      </motion.div>
    </div>
  );
}