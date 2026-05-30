import { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Settings, Terminal, Code, Trash2, Power, Camera, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import CollapsibleSection from '@/components/ui/CollapsibleSection';
import type { Node } from 'reactflow';

interface InspectorPanelProps {
  selectedNode: Node | null;
  updateNodeLabel: (id: string, label: string) => void;
  updateNodeData: (id: string, key: string, value: any) => void;
  toggleNodeActive: (id: string) => void;
  deleteNode: (id: string) => void;
  generatedScript: string;
  activeTab: 'config' | 'script';
  setActiveTab: (tab: 'config' | 'script') => void;
}

export default function InspectorPanel({
  selectedNode,
  updateNodeLabel,
  updateNodeData,
  toggleNodeActive,
  deleteNode,
  generatedScript,
  activeTab,
  setActiveTab,
}: InspectorPanelProps) {
  const [copiedScript, setCopiedScript] = useState(false);

  const handleCopyScript = useCallback(() => {
    navigator.clipboard.writeText(generatedScript).then(() => {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    });
  }, [generatedScript]);

  return (
    <aside className="h-full bg-surface-brighter flex flex-col">
      <div className="flex border-b border-white/10 shrink-0">
        <button onClick={() => setActiveTab('config')} className={cn('flex-1 py-3 text-xs font-bold transition-all border-b-2', activeTab === 'config' ? 'border-brand text-white' : 'border-transparent text-white/40 hover:text-white/60')}>
          Config
        </button>
        <button onClick={() => setActiveTab('script')} className={cn('flex-1 py-3 text-xs font-bold transition-all border-b-2', activeTab === 'script' ? 'border-brand text-white' : 'border-transparent text-white/40 hover:text-white/60')}>
          Script
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'config' ? (
          <div className="p-3 space-y-3">
            {selectedNode ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                {/* Entity Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                    <input
                      value={selectedNode.data.label}
                      onChange={(e) => updateNodeLabel(selectedNode.id, e.target.value)}
                      className="bg-transparent border-none text-[11px] font-bold text-white uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-brand/30 rounded px-1 w-full"
                    />
                  </div>
                  <button onClick={() => deleteNode(selectedNode.id)} className="text-white/20 hover:text-red-500 transition-colors ml-2">
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Status */}
                <CollapsibleSection title="Status" defaultOpen={true}>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleNodeActive(selectedNode.id)}
                      className={cn(
                        'flex-1 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider border transition-all',
                        selectedNode.data.isDisabled ? 'bg-white/5 border-white/10 text-white/40' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                      )}
                    >
                      {selectedNode.data.isDisabled ? 'Disabled' : 'Active'}
                    </button>
                    <button
                      onClick={() => toggleNodeActive(selectedNode.id)}
                      className={cn(
                        'px-3 py-1.5 rounded border transition-all',
                        selectedNode.data.isDisabled ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-transparent' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                      )}
                    >
                      <Power size={12} />
                    </button>
                  </div>
                </CollapsibleSection>

                {/* Boundary Config */}
                {selectedNode.type === 'boundaryNode' && (
                  <CollapsibleSection title="Boundary Zone" defaultOpen={true}>
                    <FieldSelect label="DR Role" value={selectedNode.data.role || 'none'} onChange={(v) => updateNodeData(selectedNode.id, 'role', v)}
                      options={[['none', 'Standard Boundary'], ['primary', 'Primary Zone (Fails)'], ['dr', 'DR Zone (Recovery)']]} />
                    <div className="grid grid-cols-2 gap-2">
                      <FieldNumber label="Width (px)" value={selectedNode.data.width || 480} onChange={(v) => updateNodeData(selectedNode.id, 'width', v)} />
                      <FieldNumber label="Height (px)" value={selectedNode.data.height || 340} onChange={(v) => updateNodeData(selectedNode.id, 'height', v)} />
                    </div>
                  </CollapsibleSection>
                )}

                {/* Generic Resource Config */}
                {selectedNode.type !== 'boundaryNode' && (
                  <CollapsibleSection title="Resource Config" defaultOpen={false}>
                    <FieldSelect label="Memory Limit" value={selectedNode.data.memory || '1Gi'} onChange={(v) => updateNodeData(selectedNode.id, 'memory', v)}
                      options={[['512MB', '512MB'], ['1Gi', '1Gi (Recommended)'], ['2Gi', '2Gi'], ['4Gi', '4Gi']]} />
                    {selectedNode.data.type === 'cloud' ? (
                      <FieldSelect label="Cloud Region" value={selectedNode.data.region || 'us-central1'} onChange={(v) => updateNodeData(selectedNode.id, 'region', v)}
                        options={[['us-central1', 'us-central1 (Iowa)'], ['europe-west1', 'europe-west1 (Belgium)'], ['asia-southeast1', 'asia-southeast1 (Singapore)'], ['australia-southeast1', 'australia-southeast1 (Sydney)']]} />
                    ) : (
                      <FieldSelect label="Environment VLAN" value={selectedNode.data.vlan || 'VLAN-100'} onChange={(v) => updateNodeData(selectedNode.id, 'vlan', v)}
                        options={[['VLAN-100', 'VLAN-100 (DMZ)'], ['VLAN-200', 'VLAN-200 (Internal)'], ['VLAN-300', 'VLAN-300 (Database)'], ['VLAN-400', 'VLAN-400 (Management)']]} />
                    )}
                    {selectedNode.data.type === 'on-premise' && (
                      <FieldText label="Server IP / Hostname" value={selectedNode.data.serverIp || '192.168.1.10'} onChange={(v) => updateNodeData(selectedNode.id, 'serverIp', v)} />
                    )}
                  </CollapsibleSection>
                )}

                {/* Edge Vision Simulation */}
                {selectedNode.data.templateId === 'edge-vision' && (
                  <CollapsibleSection title="Vision Simulation" defaultOpen={false}>
                    <div className="relative aspect-video bg-black rounded-lg border border-white/10 overflow-hidden group/vision">
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10" />
                      <div className="absolute inset-0 flex flex-col p-2">
                        <div className="text-[8px] font-mono text-emerald-400">FEED_01: RUNNING</div>
                        <motion.div animate={{ x: [20, 100, 40, 120, 20], y: [30, 10, 50, 20, 30] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} className="w-16 h-12 border-2 border-emerald-500 rounded relative">
                          <div className="absolute -top-3 left-0 bg-emerald-500 text-[6px] px-1 font-bold text-black uppercase">Person 98%</div>
                        </motion.div>
                        <motion.div animate={{ x: [120, 40, 100, 20, 120], y: [10, 40, 20, 50, 10] }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} className="w-12 h-10 border-2 border-amber-500 rounded relative">
                          <div className="absolute -top-3 left-0 bg-amber-500 text-[6px] px-1 font-bold text-black uppercase">Package 82%</div>
                        </motion.div>
                      </div>
                      <Camera size={14} className="absolute bottom-2 right-2 text-white/20 group-hover/vision:text-white/60 transition-colors" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-[10px] text-white/40 uppercase font-black">Confidence Threshold</span>
                        <span className="text-[10px] font-bold text-brand">{selectedNode.data.confidence || 85}%</span>
                      </div>
                      <input type="range" min={50} max={99} value={selectedNode.data.confidence || 85}
                        onChange={(e) => updateNodeData(selectedNode.id, 'confidence', parseInt(e.target.value))}
                        className="w-full h-1 bg-white/5 rounded-full appearance-none accent-brand" />
                    </div>
                    <FieldSelect label="Inference Engine" value={selectedNode.data.engine || 'TensorRT'} onChange={(v) => updateNodeData(selectedNode.id, 'engine', v)}
                      options={[['TensorRT', 'TensorRT (Optimized)'], ['OpenVINO', 'OpenVINO'], ['EdgeTPU', 'Edge TPU']]} />
                  </CollapsibleSection>
                )}

                {/* GCP Service Config */}
                {selectedNode.data.templateId?.startsWith('gcp-') && (
                  <GcpServiceConfig templateId={selectedNode.data.templateId} nodeId={selectedNode.id} updateNodeData={updateNodeData} nodeData={selectedNode.data} />
                )}

                {/* AWS Service Config */}
                {selectedNode.data.templateId?.startsWith('aws-') && (
                  <AwsServiceConfig templateId={selectedNode.data.templateId} nodeId={selectedNode.id} updateNodeData={updateNodeData} nodeData={selectedNode.data} />
                )}

                {/* Azure Service Config */}
                {selectedNode.data.templateId?.startsWith('azure-') && (
                  <AzureServiceConfig templateId={selectedNode.data.templateId} nodeId={selectedNode.id} updateNodeData={updateNodeData} nodeData={selectedNode.data} />
                )}

                {/* IAM Policy */}
                <CollapsibleSection title="Access Policy (IAM)" defaultOpen={false}>
                  <div className="p-2 bg-brand/5 border border-brand/20 rounded">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5" />
                      <div className="text-[10px] text-blue-100/70 italic leading-relaxed">
                        All required policies found for {selectedNode.data.label}.
                      </div>
                    </div>
                  </div>
                </CollapsibleSection>

                {/* Infrastructure Snapshot */}
                <CollapsibleSection title="Infrastructure Snapshot" defaultOpen={false}>
                  <div className="bg-surface rounded p-2 font-mono text-[10px] leading-relaxed border border-white/5 overflow-hidden text-brand/80">
                    <span className="text-purple-400">resource</span> "infra_node" "{selectedNode.id.replace(/-/g, '_')}" {'{'}<br />
                    &nbsp;&nbsp;type = <span className="text-green-400">"{selectedNode.data.type}"</span><br />
                    &nbsp;&nbsp;name = <span className="text-green-400">"{selectedNode.data.label}"</span><br />
                    {'}'}
                  </div>
                </CollapsibleSection>
              </motion.div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center opacity-30">
                <Settings size={28} className="mb-3 text-white animate-spin-slow" />
                <p className="text-[10px] text-white max-w-[160px] uppercase font-bold tracking-widest leading-loose">Select a node to configure</p>
              </div>
            )}
          </div>
        ) : (
          <div className="relative h-full font-mono text-[11px] leading-relaxed flex flex-col">
            <div className="p-3 bg-surface-brighter border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-brand" />
                <span className="text-white/60 font-bold uppercase tracking-wider text-[10px]">main-stack.tf</span>
              </div>
              <button onClick={handleCopyScript} className={cn('text-white/40 hover:text-white transition-colors', copiedScript && 'text-emerald-500')} title="Copy to clipboard">
                {copiedScript ? <Check size={14} /> : <Code size={14} />}
              </button>
            </div>
            <div className="flex-1 p-4 overflow-auto bg-surface selection:bg-brand/30">
              <pre className="text-brand/90 whitespace-pre-wrap break-all">
                <code>{generatedScript}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function FieldText({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="text-[11px] mb-1 opacity-60">{label}</div>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface-card border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand/50 transition-colors" />
    </div>
  );
}

function FieldNumber({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="text-[11px] mb-1 opacity-60">{label}</div>
      <input type="number" value={value} onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="w-full bg-surface-card border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand/50 transition-colors" />
    </div>
  );
}

function FieldSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <div>
      <div className="text-[11px] mb-1 opacity-60">{label}</div>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface-card border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand/50 transition-colors appearance-none">
        {options.map(([val, display]) => <option key={val} value={val}>{display}</option>)}
      </select>
    </div>
  );
}

function GcpServiceConfig({ templateId, nodeId, updateNodeData, nodeData }: { templateId: string; nodeId: string; updateNodeData: (id: string, key: string, value: any) => void; nodeData: Record<string, any> }) {
  const configs: Record<string, Array<{ label: string; key: string; type: 'text' | 'select' | 'number'; options?: [string, string][]; fallback?: string }>> = {
    'gcp-bq': [
      { label: 'Dataset ID', key: 'datasetId', type: 'text', fallback: 'analytics_dataset' },
      { label: 'Location', key: 'location', type: 'select', options: [['US', 'US'], ['EU', 'EU'], ['us-central1', 'us-central1'], ['europe-west1', 'europe-west1']] },
      { label: 'Partitioning', key: 'partitioning', type: 'select', options: [['none', 'None'], ['daily', 'Daily'], ['hourly', 'Hourly'], ['monthly', 'Monthly']] },
    ],
    'gcp-gcs': [
      { label: 'Storage Class', key: 'storageClass', type: 'select', options: [['STANDARD', 'Standard'], ['NEARLINE', 'Nearline'], ['COLDLINE', 'Coldline'], ['ARCHIVE', 'Archive']] },
      { label: 'Versioning', key: 'versioning', type: 'select', options: [['enabled', 'Enabled'], ['disabled', 'Disabled']] },
    ],
    'gcp-pubsub': [
      { label: 'Message Retention', key: 'retention', type: 'select', options: [['1h', '1 hour'], ['24h', '24 hours'], ['7d', '7 days']] },
      { label: 'Ordering', key: 'ordering', type: 'select', options: [['disabled', 'Disabled'], ['enabled', 'Enabled']] },
    ],
    'gcp-dataflow': [
      { label: 'Template', key: 'template', type: 'select', options: [['custom', 'Custom'], ['pubsub-bq', 'Pub/Sub → BigQuery'], ['wordcount', 'Word Count']] },
      { label: 'Max Workers', key: 'maxWorkers', type: 'number', fallback: '3' },
      { label: 'Streaming Engine', key: 'streamingEngine', type: 'select', options: [['enabled', 'Enabled'], ['disabled', 'Disabled']] },
    ],
    'gcp-functions': [
      { label: 'Runtime', key: 'runtime', type: 'select', options: [['nodejs20', 'Node.js 20'], ['python312', 'Python 3.12'], ['go122', 'Go 1.22'], ['java21', 'Java 21']] },
      { label: 'Memory (MB)', key: 'memory', type: 'select', options: [['256', '256'], ['512', '512'], ['1024', '1024'], ['2048', '2048']] },
      { label: 'Timeout (s)', key: 'timeout', type: 'number', fallback: '60' },
      { label: 'Trigger', key: 'trigger', type: 'select', options: [['http', 'HTTP'], ['pubsub', 'Pub/Sub'], ['storage', 'Cloud Storage']] },
    ],
    'gcp-sql': [
      { label: 'DB Version', key: 'dbVersion', type: 'select', options: [['POSTGRES_16', 'PostgreSQL 16'], ['POSTGRES_15', 'PostgreSQL 15'], ['MYSQL_8_0', 'MySQL 8.0']] },
      { label: 'Tier', key: 'tier', type: 'select', options: [['db-f1-micro', 'f1-micro'], ['db-g1-small', 'g1-small'], ['db-custom-2-7680', 'Custom 2 vCPU']] },
      { label: 'High Availability', key: 'ha', type: 'select', options: [['disabled', 'Disabled'], ['regional', 'Regional']] },
    ],
    'gcp-composer': [
      { label: 'Image Version', key: 'imageVersion', type: 'select', options: [['composer-2-airflow-2.9', 'Airflow 2.9'], ['composer-2-airflow-2.8', 'Airflow 2.8']] },
      { label: 'Environment Size', key: 'envSize', type: 'select', options: [['small', 'Small'], ['medium', 'Medium'], ['large', 'Large']] },
    ],
    'gcp-spanner': [
      { label: 'Config', key: 'config', type: 'select', options: [['regional-us-central1', 'US Central'], ['nam3', 'North America 3'], ['nam-eur-asia1', 'Global']] },
      { label: 'Processing Units', key: 'pu', type: 'number', fallback: '100' },
    ],
    'gcp-vertex': [
      { label: 'Dataset Type', key: 'datasetType', type: 'select', options: [['image', 'Image'], ['tabular', 'Tabular'], ['text', 'Text'], ['video', 'Video']] },
      { label: 'Model Type', key: 'modelType', type: 'select', options: [['automl', 'AutoML'], ['custom', 'Custom Training']] },
    ],
    'gcp-looker': [
      { label: 'Edition', key: 'edition', type: 'select', options: [['standard', 'Standard'], ['enterprise', 'Enterprise'], ['embed', 'Embed']] },
    ],
    'gcp-compute': [
      { label: 'Machine Type', key: 'machineType', type: 'select', options: [['e2-micro', 'e2-micro'], ['e2-small', 'e2-small'], ['n1-standard-1', 'n1-standard-1'], ['n1-standard-2', 'n1-standard-2']] },
      { label: 'Preemptible', key: 'preemptible', type: 'select', options: [['no', 'No'], ['yes', 'Yes']] },
    ],
    'gcp-gke': [
      { label: 'Machine Type', key: 'machineType', type: 'select', options: [['e2-medium', 'e2-medium'], ['e2-standard-2', 'e2-standard-2'], ['n1-standard-2', 'n1-standard-2']] },
      { label: 'Autopilot', key: 'autopilot', type: 'select', options: [['disabled', 'Disabled'], ['enabled', 'Enabled']] },
    ],
  };

  const fields = configs[templateId] || [{ label: 'Region', key: 'region', type: 'select' as const, options: [['us-central1', 'US Central'], ['europe-west1', 'Europe West']] }];

  return (
    <CollapsibleSection title="GCP Configuration" defaultOpen={true} badge={templateId.replace('gcp-', '').toUpperCase()}>
      <FieldText label="Project ID" value={nodeData.projectId || 'my-gcp-project-123'} onChange={(v) => updateNodeData(nodeId, 'projectId', v)} />
      {fields.map((field) => {
        const val = nodeData[field.key] ?? field.fallback ?? '';
        return field.type === 'select' ? (
          <FieldSelect key={field.key} label={field.label} value={val} onChange={(v) => updateNodeData(nodeId, field.key, v)} options={field.options || []} />
        ) : field.type === 'number' ? (
          <FieldNumber key={field.key} label={field.label} value={parseInt(val) || 0} onChange={(v) => updateNodeData(nodeId, field.key, v)} />
        ) : (
          <FieldText key={field.key} label={field.label} value={val} onChange={(v) => updateNodeData(nodeId, field.key, v)} />
        );
      })}
    </CollapsibleSection>
  );
}

function AwsServiceConfig({ templateId, nodeId, updateNodeData, nodeData }: { templateId: string; nodeId: string; updateNodeData: (id: string, key: string, value: any) => void; nodeData: Record<string, any> }) {
  const configs: Record<string, Array<{ label: string; key: string; type: 'text' | 'select' | 'number'; options?: [string, string][]; fallback?: string }>> = {
    'aws-s3': [
      { label: 'Storage Class', key: 'storageClass', type: 'select', options: [['standard', 'Standard'], ['ia', 'Intelligent-Tiering'], ['glacier', 'Glacier']] },
      { label: 'Versioning', key: 'versioning', type: 'select', options: [['enabled', 'Enabled'], ['suspended', 'Suspended']] },
    ],
    'aws-ec2': [
      { label: 'Instance Type', key: 'instanceType', type: 'select', options: [['t3.micro', 't3.micro'], ['t3.small', 't3.small'], ['m5.large', 'm5.large']] },
    ],
    'aws-rds': [
      { label: 'Engine', key: 'engine', type: 'select', options: [['postgres', 'PostgreSQL'], ['mysql', 'MySQL'], ['aurora-postgresql', 'Aurora PostgreSQL']] },
      { label: 'Instance Class', key: 'instanceClass', type: 'select', options: [['db.t3.micro', 't3.micro'], ['db.t3.small', 't3.small'], ['db.r5.large', 'r5.large']] },
      { label: 'Multi-AZ', key: 'multiAz', type: 'select', options: [['no', 'No'], ['yes', 'Yes']] },
    ],
    'aws-lambda': [
      { label: 'Runtime', key: 'runtime', type: 'select', options: [['nodejs20.x', 'Node.js 20'], ['python3.12', 'Python 3.12'], ['go1.x', 'Go']] },
      { label: 'Memory (MB)', key: 'memory', type: 'select', options: [['128', '128'], ['256', '256'], ['512', '512'], ['1024', '1024']] },
    ],
    'aws-dynamodb': [
      { label: 'Billing Mode', key: 'billing', type: 'select', options: [['pay_per_request', 'On-Demand'], ['provisioned', 'Provisioned']] },
    ],
    'aws-redshift': [
      { label: 'Node Type', key: 'nodeType', type: 'select', options: [['ra3.xlplus', 'ra3.xlplus'], ['ra3.4xlarge', 'ra3.4xlarge']] },
      { label: 'Nodes', key: 'nodes', type: 'number', fallback: '2' },
    ],
  };

  const fields = configs[templateId] || [];

  return (
    <CollapsibleSection title="AWS Configuration" defaultOpen={true} badge="AWS">
      <FieldSelect label="Region" value={nodeData.region || 'us-east-1'} onChange={(v) => updateNodeData(nodeId, 'region', v)} options={[['us-east-1', 'N. Virginia'], ['us-west-2', 'Oregon'], ['eu-west-1', 'Ireland']]} />
      {fields.map((field) => {
        const val = nodeData[field.key] ?? field.fallback ?? '';
        return field.type === 'select' ? (
          <FieldSelect key={field.key} label={field.label} value={val} onChange={(v) => updateNodeData(nodeId, field.key, v)} options={field.options || []} />
        ) : (
          <FieldNumber key={field.key} label={field.label} value={parseInt(val) || 0} onChange={(v) => updateNodeData(nodeId, field.key, v)} />
        );
      })}
    </CollapsibleSection>
  );
}

function AzureServiceConfig({ templateId, nodeId, updateNodeData, nodeData }: { templateId: string; nodeId: string; updateNodeData: (id: string, key: string, value: any) => void; nodeData: Record<string, any> }) {
  const configs: Record<string, Array<{ label: string; key: string; type: 'text' | 'select' | 'number'; options?: [string, string][]; fallback?: string }>> = {
    'azure-blob': [
      { label: 'Replication', key: 'replication', type: 'select', options: [['LRS', 'LRS'], ['GRS', 'GRS'], ['ZRS', 'ZRS']] },
      { label: 'Access Tier', key: 'tier', type: 'select', options: [['hot', 'Hot'], ['cool', 'Cool'], ['cold', 'Cold']] },
    ],
    'azure-vm': [
      { label: 'Size', key: 'size', type: 'select', options: [['Standard_B1s', 'B1s'], ['Standard_B2s', 'B2s'], ['Standard_D2s_v3', 'D2s v3']] },
    ],
    'azure-sql': [
      { label: 'Compute Tier', key: 'tier', type: 'select', options: [['general', 'General Purpose'], ['business', 'Business Critical'], ['hyperscale', 'Hyperscale']] },
      { label: 'DTU', key: 'dtu', type: 'select', options: [['basic', 'Basic (5 DTU)'], ['s0', 'S0 (10 DTU)'], ['s1', 'S1 (20 DTU)'], ['p1', 'P1 (125 DTU)']] },
    ],
    'azure-functions': [
      { label: 'Runtime', key: 'runtime', type: 'select', options: [['nodejs20', 'Node.js 20'], ['python311', 'Python 3.11'], ['dotnet8', '.NET 8']] },
      { label: 'Plan', key: 'plan', type: 'select', options: [['consumption', 'Consumption'], ['premium', 'Premium'], ['dedicated', 'Dedicated']] },
    ],
    'azure-cosmos': [
      { label: 'API', key: 'api', type: 'select', options: [['sql', 'SQL (Core)'], ['mongodb', 'MongoDB'], ['cassandra', 'Cassandra']] },
      { label: 'Consistency', key: 'consistency', type: 'select', options: [['strong', 'Strong'], ['session', 'Session'], ['eventual', 'Eventual']] },
    ],
  };

  const fields = configs[templateId] || [];

  return (
    <CollapsibleSection title="Azure Configuration" defaultOpen={true} badge="Azure">
      <FieldText label="Resource Group" value={nodeData.resourceGroup || 'rg-analytics'} onChange={(v) => updateNodeData(nodeId, 'resourceGroup', v)} />
      <FieldSelect label="Location" value={nodeData.location || 'eastus'} onChange={(v) => updateNodeData(nodeId, 'location', v)} options={[['eastus', 'East US'], ['westeurope', 'West Europe'], ['southeastasia', 'SE Asia']]} />
      {fields.map((field) => {
        const val = nodeData[field.key] ?? field.fallback ?? '';
        return field.type === 'select' ? (
          <FieldSelect key={field.key} label={field.label} value={val} onChange={(v) => updateNodeData(nodeId, field.key, v)} options={field.options || []} />
        ) : (
          <FieldNumber key={field.key} label={field.label} value={parseInt(val) || 0} onChange={(v) => updateNodeData(nodeId, field.key, v)} />
        );
      })}
    </CollapsibleSection>
  );
}
