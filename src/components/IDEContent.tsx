import { useState, useCallback, useEffect, useRef } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { AnimatePresence } from 'motion/react';
import ArchitectureNode from '@/components/nodes/ArchitectureNode';
import BoundaryNode from '@/components/nodes/BoundaryNode';
import ConnectionEdge from '@/components/nodes/ConnectionEdge';
import { useFlowGraph } from '@/hooks/useFlowGraph';
import { useCompliance } from '@/lib/compliance';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/sidebar/Sidebar';
import FlowCanvas from '@/components/canvas/FlowCanvas';
import InspectorPanel from '@/components/inspector/InspectorPanel';
import WelcomeModal from '@/components/modals/WelcomeModal';
import ToRPanel from '@/components/modals/ToRPanel';
import LoginLanding from '@/components/modals/LoginLanding';
import AcademyMode from '@/components/academy/AcademyMode';
import CollapsibleSidebar from '@/components/ui/CollapsibleSidebar';
import NodeSearch from '@/components/canvas/NodeSearch';
import ShortcutsOverlay from '@/components/ui/ShortcutsOverlay';
import ExportMenu from '@/components/ui/ExportMenu';
import CompliancePanel from '@/components/modals/CompliancePanel';
import VersionHistory from '@/components/modals/VersionHistory';
import { CheckCircle2, AlertTriangle, XCircle, Download, Upload, Shield, Clock } from 'lucide-react';

const nodeTypes = {
  architectureNode: ArchitectureNode,
  boundaryNode: BoundaryNode,
};

const edgeTypes = {
  default: ConnectionEdge,
  smoothstep: ConnectionEdge,
};

export default function IDEContent() {
  return (
    <ReactFlowProvider>
      <IDEInner />
    </ReactFlowProvider>
  );
}

function IDEInner() {
  const flow = useFlowGraph();
  const complianceIssues = useCompliance(flow.nodes, flow.edges);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showToR, setShowToR] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{ status: 'success' | 'warning' | 'error'; message: string; issues?: Array<{ type: string; message: string; nodeId?: string }> } | null>(null);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [academyMode, setAcademyMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'script'>('config');

  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [leftWidth, setLeftWidth] = useState(256);
  const [rightWidth, setRightWidth] = useState(320);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showSearch, setShowSearch] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showCompliance, setShowCompliance] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  const handleSave = useCallback(() => {
    flow.downloadProject();
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  }, [flow.downloadProject]);

  const handleValidate = useCallback(() => {
    setIsValidating(true);
    setTimeout(() => {
      const result = flow.validateArchitecture();
      setIsValidating(false);
      setValidationResult(result);
      setTimeout(() => setValidationResult(null), 6000);
    }, 800);
  }, [flow.validateArchitecture]);

  const handleClearCanvas = useCallback(() => {
    if (window.confirm('Are you sure you want to clear the canvas?')) {
      flow.setNodes([]);
      flow.setEdges([]);
    }
  }, [flow.setNodes, flow.setEdges]);

  const handleLoadTemplate = useCallback((type: any) => {
    setShowWelcomeModal(false);
    flow.loadTemplate(type);
  }, [flow.loadTemplate]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.darch,.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          flow.importProject(ev.target?.result as string);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [flow.importProject]);

  const handleToggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }, []);

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';

      if (e.key === '[' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setLeftCollapsed((v) => !v);
      }
      if (e.key === ']' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setRightCollapsed((v) => !v);
      }
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'o' || e.key === '0')) {
        e.preventDefault();
        setShowWelcomeModal(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setShowSearch((v) => !v);
      }
      if (e.key === '?' && !isInput) {
        e.preventDefault();
        setShowShortcuts((v) => !v);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-surface text-slate-300 select-none font-sans overflow-hidden">
      <AnimatePresence>
        {!isLoggedIn && <LoginLanding key="login-landing" onLogin={() => setIsLoggedIn(true)} />}

        {showSaveToast && (
          <div key="save-toast" className="fixed bottom-32 left-10 z-[300] px-4 py-3 bg-emerald-500 text-white rounded-xl shadow-2xl flex items-center gap-3 font-bold text-xs uppercase">
            <CheckCircle2 size={16} />
            Project Downloaded as .darch
          </div>
        )}

        {validationResult && (
          <div key="validation-toast" className={`absolute top-20 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-lg border shadow-2xl backdrop-blur-md max-w-lg ${
            validationResult.status === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
            validationResult.status === 'warning' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
            'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            <div className="flex items-center gap-3 mb-2">
              {validationResult.status === 'success' && <CheckCircle2 size={18} />}
              {validationResult.status === 'warning' && <AlertTriangle size={18} />}
              {validationResult.status === 'error' && <XCircle size={18} />}
              <span className="text-xs font-bold uppercase tracking-wider">{validationResult.message}</span>
            </div>
            {validationResult.issues && validationResult.issues.length > 0 && (
              <div className="space-y-1 mt-2 border-t border-white/10 pt-2">
                {validationResult.issues.slice(0, 5).map((issue, i) => (
                  <div key={i} className="text-[10px] opacity-80 flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${issue.type === 'error' ? 'bg-red-500' : issue.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                    {issue.message}
                  </div>
                ))}
                {validationResult.issues.length > 5 && (
                  <div className="text-[10px] opacity-60">+{validationResult.issues.length - 5} more issues</div>
                )}
              </div>
            )}
          </div>
        )}

        {showWelcomeModal && (
          <WelcomeModal key="welcome-modal" onLoadTemplate={handleLoadTemplate} onClose={() => setShowWelcomeModal(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showToR && <ToRPanel key="tor-panel" nodes={flow.nodes} edges={flow.edges} onClose={() => setShowToR(false)} />}
      </AnimatePresence>

      <AcademyMode isActive={academyMode} />
      <ShortcutsOverlay isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
      <CompliancePanel isOpen={showCompliance} onClose={() => setShowCompliance(false)} issues={complianceIssues} onHighlightNode={(id) => flow.setSelectedNode(flow.nodes.find((n) => n.id === id) || null)} />
      <VersionHistory
        isOpen={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
        snapshots={flow.snapshots}
        currentNodes={flow.nodes}
        currentEdges={flow.edges}
        onSaveSnapshot={flow.saveSnapshot}
        onRestoreSnapshot={(snap) => { flow.restoreSnapshot(snap); setShowVersionHistory(false); }}
        onDeleteSnapshot={flow.deleteSnapshot}
      />

      <Header
        isSimulationMode={flow.isSimulationMode}
        setIsSimulationMode={flow.setIsSimulationMode}
        isFailoverActive={flow.isFailoverActive}
        setIsFailoverActive={flow.setIsFailoverActive}
        connectionType={flow.connectionType}
        setConnectionType={flow.setConnectionType}
        nodesCount={flow.nodes.length}
        onOpenWelcome={() => setShowWelcomeModal(true)}
        onShowToR={() => setShowToR(true)}
        onSave={handleSave}
        onValidate={handleValidate}
        isValidating={isValidating}
        estimatedCost={flow.estimatedCost}
        leftCollapsed={leftCollapsed}
        rightCollapsed={rightCollapsed}
        onToggleLeft={() => setLeftCollapsed((v) => !v)}
        onToggleRight={() => setRightCollapsed((v) => !v)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main className="flex flex-1 overflow-hidden">
        <CollapsibleSidebar
          side="left"
          width={leftWidth}
          onResize={setLeftWidth}
          isCollapsed={leftCollapsed}
          onToggle={() => setLeftCollapsed((v) => !v)}
          className="z-20"
          collapsedContent={
            <div className="flex flex-col items-center py-4 gap-3">
              <button onClick={() => setLeftCollapsed(false)} className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all" title="Expand components">
                <span className="text-[10px] font-bold">C</span>
              </button>
            </div>
          }
        >
          <Sidebar
            isSimulationMode={flow.isSimulationMode}
            onDragStart={flow.onDragStart}
          />
        </CollapsibleSidebar>

        <FlowCanvas
          nodes={flow.nodes}
          edges={flow.edges}
          onNodesChange={flow.onNodesChange}
          onEdgesChange={flow.onEdgesChange}
          onConnect={flow.onConnect}
          onInit={flow.setReactFlowInstance}
          onDrop={flow.onDrop}
          onDragOver={flow.onDragOver}
          onNodeClick={flow.onNodeClick}
          onNodeDragStart={flow.onNodeDragStart}
          onNodeDrag={flow.onNodeDrag}
          onNodeDragStop={flow.onNodeDragStop}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          updateEdgeLabel={flow.updateEdgeLabel}
          canvasRef={canvasRef}
          isSimulationMode={flow.isSimulationMode}
          setIsSimulationMode={flow.setIsSimulationMode}
          isFailoverActive={flow.isFailoverActive}
          setIsFailoverActive={flow.setIsFailoverActive}
          connectionType={flow.connectionType}
          setConnectionType={flow.setConnectionType}
          estimatedCost={flow.estimatedCost}
          reactFlowInstance={flow.reactFlowInstance}
          reactFlowWrapper={flow.reactFlowWrapper as React.RefObject<HTMLDivElement>}
          onClearCanvas={handleClearCanvas}
        />

        <NodeSearch
          nodes={flow.nodes}
          onSelectNode={(node) => flow.setSelectedNode(node)}
          isOpen={showSearch}
          onClose={() => setShowSearch(false)}
        />

        <CollapsibleSidebar
          side="right"
          width={rightWidth}
          onResize={setRightWidth}
          isCollapsed={rightCollapsed}
          onToggle={() => setRightCollapsed((v) => !v)}
          className="z-20"
          collapsedContent={
            <div className="flex flex-col items-center py-4 gap-3">
              <button onClick={() => setRightCollapsed(false)} className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all" title="Expand inspector">
                <span className="text-[10px] font-bold">I</span>
              </button>
            </div>
          }
        >
          <InspectorPanel
            selectedNode={flow.selectedNode}
            updateNodeLabel={flow.updateNodeLabel}
            updateNodeData={flow.updateNodeData}
            toggleNodeActive={flow.toggleNodeActive}
            deleteNode={flow.deleteNode}
            generatedScript={flow.generatedScript}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </CollapsibleSidebar>
      </main>

      <footer className="h-8 border-t border-white/10 bg-surface-brighter px-6 flex items-center justify-between shrink-0">
        <div className="flex gap-6">
          <div className="flex items-center gap-2 text-[10px] opacity-50 font-mono">
            <span className="text-brand">L{flow.nodes.length}:C{flow.edges.length}</span> | UTF-8 | TypeScript
          </div>
          <div className="flex items-center gap-2 text-[10px] opacity-50 uppercase tracking-widest font-bold">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            System Secure: AES-256 Enabled
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowCompliance(true)} className="text-[10px] text-white/30 hover:text-white/60 transition-colors flex items-center gap-1 uppercase font-bold tracking-widest" title="Compliance check">
            <Shield size={10} />
            {complianceIssues.length > 0 && <span className="text-amber-400">{complianceIssues.length}</span>}
          </button>
          <button onClick={() => setShowVersionHistory(true)} className="text-[10px] text-white/30 hover:text-white/60 transition-colors flex items-center gap-1 uppercase font-bold tracking-widest" title="Version history">
            <Clock size={10} />
          </button>
          <ExportMenu canvasRef={canvasRef} />
          <button onClick={handleImport} className="text-[10px] text-white/30 hover:text-white/60 transition-colors flex items-center gap-1 uppercase font-bold tracking-widest">
            <Upload size={10} /> Import
          </button>
          <button onClick={handleSave} className="text-[10px] text-white/30 hover:text-white/60 transition-colors flex items-center gap-1 uppercase font-bold tracking-widest">
            <Download size={10} /> .darch
          </button>
          <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">v2.4.0</div>
        </div>
      </footer>
    </div>
  );
}
