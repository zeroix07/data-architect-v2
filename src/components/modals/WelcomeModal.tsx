import { motion } from 'motion/react';
import {
  X, Plus, Activity, Workflow, Layers, Upload, ArrowRight,
  Cloud, Sparkles, Brain, Zap, Database, Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TemplateType } from '@/types';

interface WelcomeModalProps {
  onLoadTemplate: (type: TemplateType) => void;
  onClose: () => void;
}

const templates: Array<{
  type: TemplateType;
  label: string;
  tag: string;
  tagColor: string;
  description: string;
  icon: typeof Cloud;
  decorations?: 'streaming' | 'batch' | 'enterprise' | 'cloud' | 'ml' | 'dr' | 'aws' | 'azure' | 'hybrid';
}> = [
  { type: 'blank', label: 'Create Blank Workspace', tag: '', tagColor: '', description: '', icon: Plus },
  { type: 'kafka', label: 'Kafka Streaming Pipeline', tag: 'Streaming', tagColor: 'text-emerald-500', description: 'Ingest real-time events from Kafka to BigQuery with schema validation.', icon: Activity, decorations: 'streaming' },
  { type: 'airflow', label: 'Airflow ETL Workflow', tag: 'Batch', tagColor: 'text-sky-500', description: 'Orchestrate batch ETL jobs with Cloud Composer and GCS buckets.', icon: Workflow, decorations: 'batch' },
  { type: 'complex', label: 'Data Mesh Architecture', tag: 'Enterprise', tagColor: 'text-brand', description: 'Complex multi-cloud topology with real-time analytics and global state.', icon: Sparkles, decorations: 'enterprise' },
  { type: 'gcp-enterprise', label: 'GCP Enterprise Analytics', tag: 'GCP', tagColor: 'text-brand', description: 'Complete Big Data pipeline: GCS to Looker with Vertex AI integration.', icon: Cloud, decorations: 'cloud' },
  { type: 'gcp-ml-pipeline', label: 'Real-time ML Pipeline', tag: 'GCP + ML', tagColor: 'text-purple-400', description: 'Pub/Sub → Dataflow → Vertex AI → BigQuery for ML inference at scale.', icon: Brain, decorations: 'ml' },
  { type: 'gcp-event-driven', label: 'Event-Driven Microservices', tag: 'GCP', tagColor: 'text-emerald-400', description: 'API Gateway + Pub/Sub + Cloud Functions + Cloud SQL serverless events.', icon: Zap, decorations: 'streaming' },
  { type: 'gcp-data-lakehouse', label: 'Data Lakehouse', tag: 'GCP', tagColor: 'text-sky-400', description: 'GCS + Dataproc + BigQuery + Looker enterprise analytics lakehouse.', icon: Database, decorations: 'cloud' },
  { type: 'gcp-multi-region-dr', label: 'Multi-Region DR Setup', tag: 'GCP + DR', tagColor: 'text-amber-400', description: 'Spanner cross-region replication with GCS dual-region failover.', icon: Globe, decorations: 'dr' },
  { type: 'aws-analytics', label: 'AWS Analytics Pipeline', tag: 'AWS', tagColor: 'text-orange-400', description: 'S3 Data Lake → Glue ETL → Redshift → QuickSight analytics.', icon: Cloud, decorations: 'aws' },
  { type: 'azure-data-factory', label: 'Azure Data Factory', tag: 'Azure', tagColor: 'text-sky-300', description: 'Blob Storage → Data Factory → Synapse → Power BI pipeline.', icon: Cloud, decorations: 'azure' },
  { type: 'hybrid-cloud', label: 'Hybrid Multi-Cloud', tag: 'Multi-Cloud', tagColor: 'text-violet-400', description: 'GCP BigQuery + AWS S3 + On-Prem PostgreSQL hybrid topology.', icon: Layers, decorations: 'hybrid' },
];

function TemplateDecoration({ type }: { type?: string }) {
  if (type === 'streaming') return (
    <div className="absolute bottom-0 right-0 w-32 h-20 opacity-20 group-hover:opacity-40 transition-opacity">
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-brand" />
      <div className="absolute top-1/2 left-4 w-2 h-2 rounded-full bg-brand animate-ping" />
      <div className="absolute top-1/2 right-4 w-2 h-2 rounded-full bg-brand" />
    </div>
  );
  if (type === 'batch') return (
    <div className="absolute bottom-4 right-4 flex items-center gap-1">
      <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
      <div className="w-1.5 h-px bg-sky-500/30 w-4" />
      <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
    </div>
  );
  if (type === 'enterprise') return (
    <div className="absolute top-2 right-2 flex gap-0.5">
      {[1, 2, 3].map((i) => <div key={i} className="w-1 h-3 bg-brand/40 group-hover:bg-brand transition-colors rounded-full" />)}
    </div>
  );
  if (type === 'cloud') return (
    <div className="absolute bottom-4 right-4 flex -space-x-1">
      {[1, 2, 3, 4].map((i) => <div key={i} className="w-4 h-4 rounded-full border border-surface bg-brand/20" />)}
    </div>
  );
  if (type === 'ml') return (
    <div className="absolute top-2 right-2 flex gap-0.5">
      {[1, 2, 3].map((i) => <div key={i} className="w-1 h-3 bg-purple-400/40 group-hover:bg-purple-400 transition-colors rounded-full" />)}
    </div>
  );
  if (type === 'dr') return (
    <div className="absolute bottom-4 right-4 flex items-center gap-1">
      <div className="w-3 h-3 rounded-full border-2 border-amber-400/40" />
      <div className="w-6 h-px bg-amber-400/30" />
      <div className="w-3 h-3 rounded-full border-2 border-amber-400/40" />
    </div>
  );
  if (type === 'aws') return (
    <div className="absolute bottom-4 right-4 flex -space-x-1">
      {[1, 2, 3].map((i) => <div key={i} className="w-4 h-4 rounded-full border border-surface bg-orange-400/20" />)}
    </div>
  );
  if (type === 'azure') return (
    <div className="absolute bottom-4 right-4 flex -space-x-1">
      {[1, 2, 3].map((i) => <div key={i} className="w-4 h-4 rounded-full border border-surface bg-sky-300/20" />)}
    </div>
  );
  if (type === 'hybrid') return (
    <div className="absolute bottom-4 right-4 flex items-center gap-1">
      <div className="w-3 h-3 rounded-full bg-violet-400/20 border border-violet-400/40" />
      <div className="w-3 h-3 rounded-full bg-emerald-400/20 border border-emerald-400/40" />
      <div className="w-3 h-3 rounded-full bg-orange-400/20 border border-orange-400/40" />
    </div>
  );
  return null;
}

export default function WelcomeModal({ onLoadTemplate, onClose }: WelcomeModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-surface-brighter border border-white/10 w-full max-w-5xl h-[700px] rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex"
      >
        {/* Left Column */}
        <div className="w-64 border-r border-white/10 bg-black/20 flex flex-col p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-8 bg-brand rounded flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rotate-45" />
            </div>
            <span className="font-bold text-white text-sm tracking-widest uppercase">Ultimate Architect</span>
          </div>

          <div className="flex-1 space-y-2">
            {[
              { label: 'Blank Workspace', icon: Plus },
              { label: 'Streaming', icon: Activity },
              { label: 'Batch', icon: Workflow },
              { label: 'Hybrid', icon: Layers },
              { label: 'Import File', icon: Upload },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={cn(
                    'w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-3',
                    idx === 0 ? 'bg-brand/10 text-brand border border-brand/20' : 'text-white/40 hover:text-white/60 hover:bg-white/5'
                  )}
                >
                  <Icon size={14} />
                  {item.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={onClose}
            className="mt-auto flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-white/30 hover:text-white transition-colors"
          >
            <Upload size={12} />
            Import .darch / .yaml file
          </button>
        </div>

        {/* Right Column */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-8 pb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Create New Workspace</h2>
            <button onClick={onClose} className="text-white/20 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-3 gap-4 p-8 pt-4">
              {templates.map((tpl) => {
                const Icon = tpl.icon;
                if (tpl.type === 'blank') {
                  return (
                    <button
                      key={tpl.type}
                      onClick={() => onLoadTemplate(tpl.type)}
                      className="group border-2 border-dashed border-white/10 rounded-xl p-5 flex flex-col items-center justify-center text-center hover:border-brand/50 hover:bg-brand/5 transition-all h-[160px]"
                    >
                      <div className="w-10 h-10 rounded-full border-2 border-white/10 flex items-center justify-center mb-3 group-hover:border-brand/40 group-hover:bg-brand/10 transition-all">
                        <Plus size={20} className="text-white/20 group-hover:text-brand" />
                      </div>
                      <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">Blank Workspace</span>
                    </button>
                  );
                }

                return (
                  <button
                    key={tpl.type}
                    onClick={() => onLoadTemplate(tpl.type)}
                    className="group border border-white/10 bg-surface rounded-xl p-5 flex flex-col text-left hover:border-brand/50 transition-all h-[160px] relative overflow-hidden"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={14} className={tpl.tagColor} />
                      <span className={cn('text-[9px] font-black uppercase tracking-widest', tpl.tagColor)}>{tpl.tag}</span>
                    </div>
                    <span className="text-xs font-bold text-white group-hover:text-brand transition-colors mb-1.5 leading-tight">{tpl.label}</span>
                    <p className="text-[10px] text-white/40 leading-relaxed">{tpl.description}</p>
                    <TemplateDecoration type={tpl.decorations} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6 pt-0 border-t border-white/5 flex items-center justify-between bg-black/5 mt-auto">
            <div className="flex items-center gap-4 text-[10px] text-white/30 uppercase font-black tracking-widest">
              <span>12 templates available</span>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-brand">Ctrl+O to reopen</span>
            </div>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-full transition-all border border-white/10"
            >
              Quick Start
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
