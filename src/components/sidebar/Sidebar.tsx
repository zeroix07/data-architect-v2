import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NODE_TEMPLATES, CLOUD_PROVIDERS, ON_PREM_CATEGORIES, OPEN_SOURCE_CATEGORIES } from '@/constants/nodes';

interface SidebarProps {
  isSimulationMode: boolean;
  onDragStart: (event: React.DragEvent, nodeType: string, templateId: string) => void;
}

export default function Sidebar({ isSimulationMode, onDragStart }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    'Cloud Platforms', 'Google Cloud Platform', 'AWS', 'Microsoft Azure', 'Open-Source Stack', 'Search & Discovery', 'Network Boundaries',
  ]);

  const categories = useMemo(() => {
    const map: Record<string, typeof NODE_TEMPLATES> = {};
    NODE_TEMPLATES.forEach((node) => {
      if (searchQuery && !node.name.toLowerCase().includes(searchQuery.toLowerCase()) && !node.category.toLowerCase().includes(searchQuery.toLowerCase())) {
        return;
      }
      if (!map[node.category]) map[node.category] = [];
      map[node.category].push(node);
    });
    return map;
  }, [searchQuery]);

  // Auto-expand matching categories on search
  useMemo(() => {
    if (searchQuery) {
      const matchingCats = Object.keys(categories);
      const hasCloudMatch = matchingCats.some((cat) => CLOUD_PROVIDERS.includes(cat));
      setExpandedCategories((prev) => {
        const next = [...new Set([...prev, ...matchingCats])];
        if (hasCloudMatch && !next.includes('Cloud Platforms')) {
          next.push('Cloud Platforms');
        }
        return next;
      });
    }
  }, [categories, searchQuery]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  };

  return (
    <aside className={cn(
      'h-full bg-surface-brighter/50 flex flex-col transition-all duration-700',
      isSimulationMode && 'opacity-20 pointer-events-none grayscale blur-[1px]'
    )}>
      <div className="p-4 border-b border-white/5">
        <div className="relative">
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            title="Search by product name or category"
            className="w-full bg-surface-card border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              title="Clear search query"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <ChevronDown size={10} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Cloud Platforms Section */}
        <div className="px-4 py-3 border-b border-white/5">
          <button
            onClick={() => toggleCategory('Cloud Platforms')}
            className="w-full flex items-center justify-between text-[11px] font-bold text-white/40 uppercase tracking-wider mb-3 hover:text-white/60 transition-colors group"
          >
            Cloud Platforms
            <ChevronDown size={12} className={cn('transition-transform duration-200', !expandedCategories.includes('Cloud Platforms') && '-rotate-90')} />
          </button>

          <AnimatePresence>
            {expandedCategories.includes('Cloud Platforms') && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-1">
                {CLOUD_PROVIDERS.map((provider) => (
                  <div key={provider} className="mb-2">
                    <button
                      onClick={() => toggleCategory(provider)}
                      className="w-full flex items-center justify-between text-[11px] font-bold text-white/60 uppercase tracking-wider py-2 hover:text-white transition-colors group pl-2"
                    >
                      <span className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-brand rounded-full" />
                        {provider}
                      </span>
                      <ChevronDown size={12} className={cn('transition-transform duration-200', !expandedCategories.includes(provider) && '-rotate-90')} />
                    </button>

                    <AnimatePresence>
                      {expandedCategories.includes(provider) && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-1.5 ml-5">
                          {categories[provider]?.map((node) => (
                            <div
                              key={node.id}
                              draggable
                              title={`Drag to add ${node.name}: ${node.description}`}
                              onDragStart={(e) => onDragStart(e, 'architectureNode', node.id)}
                              className="p-2 bg-surface-card border border-white/10 rounded flex items-center gap-3 cursor-grab hover:border-brand/40 transition-colors group"
                            >
                              <div className={cn(
                                'w-5 h-5 rounded flex items-center justify-center font-bold text-[8px]',
                                node.category === 'Google Cloud Platform' ? 'bg-blue-500/20 text-blue-400' :
                                node.category === 'AWS' ? 'bg-orange-500/20 text-orange-400' :
                                node.category === 'Microsoft Azure' ? 'bg-sky-500/20 text-sky-400' :
                                'bg-slate-500/20 text-slate-400'
                              )}>
                                {node.name.slice(0, 1)}
                              </div>
                              <span className="text-[10px] font-medium text-slate-400 group-hover:text-white transition-colors">{node.name}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Other Sections */}
        {[...ON_PREM_CATEGORIES, ...OPEN_SOURCE_CATEGORIES, 'Search & Discovery', 'Network Boundaries'].map((category) => (
          <div key={category} className="px-4 py-3 border-b border-white/5">
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center justify-between text-[11px] font-bold text-white/40 uppercase tracking-wider mb-3 hover:text-white/60 transition-colors group"
            >
              {category}
              <ChevronDown size={12} className={cn('transition-transform duration-200', !expandedCategories.includes(category) && '-rotate-90')} />
            </button>

            <AnimatePresence>
              {expandedCategories.includes(category) && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-2">
                  {categories[category]?.map((node) => (
                    <div
                      key={node.id}
                      draggable
                      title={`Drag to add ${node.name}: ${node.description}`}
                      onDragStart={(e) => onDragStart(e, category === 'Network Boundaries' ? 'boundaryNode' : 'architectureNode', node.id)}
                      className="p-2 bg-surface-card border border-white/10 rounded flex items-center gap-3 cursor-grab hover:border-brand/40 transition-colors group"
                    >
                      <div className={cn(
                        'w-6 h-6 rounded flex items-center justify-center font-bold text-[10px]',
                        node.type === 'on-premise' ? 'bg-slate-500/10 text-slate-400' :
                        node.type === 'boundary' ? 'bg-violet-500/15 text-violet-400 border border-violet-500/10' :
                        'bg-emerald-500/10 text-emerald-500'
                      )}>
                        {node.name.slice(0, 1)}
                      </div>
                      <span className="text-[11px] font-medium text-slate-300 group-hover:text-white transition-colors">{node.name}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </aside>
  );
}
