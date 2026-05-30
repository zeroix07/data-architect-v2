import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image, FileImage, X } from 'lucide-react';
import { exportToPng, exportToSvg } from '@/lib/export';

interface ExportMenuProps {
  canvasRef: React.RefObject<HTMLElement | null>;
}

export default function ExportMenu({ canvasRef }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = async (format: 'png' | 'svg') => {
    if (!canvasRef.current) return;
    const timestamp = new Date().toISOString().slice(0, 10);
    if (format === 'png') {
      await exportToPng(canvasRef.current, `architecture-${timestamp}.png`);
    } else {
      await exportToSvg(canvasRef.current, `architecture-${timestamp}.svg`);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all"
        title="Export canvas as image"
      >
        <Image size={12} />
        Export
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full right-0 mt-2 w-48 bg-surface-brighter border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50"
          >
            <button
              onClick={() => handleExport('png')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
            >
              <Image size={14} className="text-brand" />
              <div>
                <div className="text-xs text-white font-medium">Export as PNG</div>
                <div className="text-[10px] text-white/40">High-res raster image</div>
              </div>
            </button>
            <button
              onClick={() => handleExport('svg')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
            >
              <FileImage size={14} className="text-brand" />
              <div>
                <div className="text-xs text-white font-medium">Export as SVG</div>
                <div className="text-[10px] text-white/40">Scalable vector image</div>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
