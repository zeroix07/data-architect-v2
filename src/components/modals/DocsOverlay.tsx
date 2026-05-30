import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Keyboard, Mouse, Layers, Cloud, Download } from 'lucide-react';

interface DocsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const sections = [
  {
    icon: Keyboard,
    title: 'Keyboard Shortcuts',
    items: [
      { keys: 'Ctrl + Z', desc: 'Undo last action' },
      { keys: 'Ctrl + Shift + Z', desc: 'Redo action' },
      { keys: 'Ctrl + O', desc: 'Open template chooser' },
      { keys: 'Ctrl + F', desc: 'Search nodes on canvas' },
      { keys: 'Ctrl + [', desc: 'Toggle left sidebar' },
      { keys: 'Ctrl + ]', desc: 'Toggle right sidebar' },
      { keys: 'Delete / Backspace', desc: 'Delete selected node' },
      { keys: '?', desc: 'Show keyboard shortcuts' },
    ],
  },
  {
    icon: Mouse,
    title: 'Canvas Controls',
    items: [
      { keys: 'Drag from sidebar', desc: 'Add node to canvas' },
      { keys: 'Click node', desc: 'Select and configure' },
      { keys: 'Drag node', desc: 'Move node position' },
      { keys: 'Drag from handle', desc: 'Create connection between nodes' },
      { keys: 'Scroll wheel', desc: 'Zoom in/out' },
      { keys: 'Drag canvas', desc: 'Pan view' },
      { keys: 'Swipe sidebar edge', desc: 'Collapse/expand sidebar' },
    ],
  },
  {
    icon: Layers,
    title: 'Architecture Templates',
    items: [
      { keys: 'GCP', desc: 'ML Pipeline, Event-Driven, Data Lakehouse, Multi-Region DR, Enterprise Analytics' },
      { keys: 'AWS', desc: 'Analytics Pipeline (S3 → Glue → Redshift → QuickSight)' },
      { keys: 'Azure', desc: 'Data Factory (Blob → ADF → Synapse → Power BI)' },
      { keys: 'Hybrid', desc: 'Multi-cloud with GCP + AWS + On-Prem' },
      { keys: 'Streaming', desc: 'Kafka → BigQuery real-time pipeline' },
      { keys: 'Batch', desc: 'Airflow ETL with Cloud Composer' },
    ],
  },
  {
    icon: Cloud,
    title: 'Cloud Services',
    items: [
      { keys: 'GCP', desc: 'BigQuery, GCS, Pub/Sub, Dataflow, Cloud Functions, Cloud SQL, Composer, Spanner, Vertex AI, Looker, GKE' },
      { keys: 'AWS', desc: 'S3, EC2, RDS, Lambda, DynamoDB, Redshift' },
      { keys: 'Azure', desc: 'Blob Storage, VM, SQL Database, Functions, Cosmos DB' },
      { keys: 'On-Prem', desc: 'MySQL, PostgreSQL, MongoDB, Redis, ClickHouse, HDFS, Bare Metal' },
      { keys: 'Open Source', desc: 'Kafka, Airflow, Spark, Docker, Polars, OpenSearch, Typesense' },
    ],
  },
  {
    icon: Download,
    title: 'Export & Import',
    items: [
      { keys: 'Export', desc: 'Download architecture as .darch JSON file' },
      { keys: 'Import', desc: 'Load .darch or .json file into canvas' },
      { keys: 'Auto-save', desc: 'Work is automatically saved to browser storage' },
      { keys: 'Terraform', desc: 'Generate Terraform configs for GCP, AWS, Azure' },
      { keys: 'Validate', desc: 'Check for orphan nodes, circular deps, budget limits' },
    ],
  },
];

export default function DocsOverlay({ isOpen, onClose }: DocsOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[500] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-surface-brighter border border-white/10 rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand/20 flex items-center justify-center text-brand">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Documentation</h2>
                  <p className="text-[10px] text-white/40">Ultimate Data Architect v2.4.0</p>
                </div>
              </div>
              <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <div key={section.title}>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon size={14} className="text-brand" />
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">{section.title}</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {section.items.map((item) => (
                        <div key={item.keys} className="flex items-start gap-3 px-3 py-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                          <span className="text-[10px] text-brand font-mono font-bold min-w-[140px] shrink-0">{item.keys}</span>
                          <span className="text-[11px] text-white/60">{item.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Press ? to toggle shortcuts overlay</span>
              <button onClick={onClose} className="px-4 py-2 bg-brand text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-brand/80 transition-all">
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
