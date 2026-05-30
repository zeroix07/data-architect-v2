import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  addEdge,
  Connection,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import { NODE_TEMPLATES } from '@/constants/nodes';
import type { TemplateType, ValidationIssue, ProjectData } from '@/types';

const STORAGE_KEY = 'ultimate-architect-autosave';
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const makeEdge = (source: string, target: string, opts?: Partial<Edge>): Edge => ({
  id: `e-${source}-${target}`,
  source,
  target,
  type: 'smoothstep',
  animated: true,
  style: { stroke: '#3b82f6', strokeWidth: 2, transition: 'all 0.5s ease' },
  markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
  ...opts,
});

const makeNode = (
  id: string,
  label: string,
  type: 'cloud' | 'on-premise' | 'open-source',
  templateId: string,
  position: { x: number; y: number },
  callbacks: { onDelete: (id: string) => void; onToggleActive: (id: string) => void }
): Node => ({
  id,
  type: 'architectureNode',
  position,
  data: { label, type, templateId, onDelete: callbacks.onDelete, onToggleActive: callbacks.onToggleActive, isDisabled: false },
});

const COST_MAP: Record<string, number> = {
  'gcp-bq': 52.0, 'gcp-gcs': 23.0, 'gcp-pubsub': 30.0, 'gcp-dataflow': 78.0,
  'gcp-compute': 45.0, 'gcp-gke': 65.0, 'gcp-functions': 18.0, 'gcp-sql': 55.0,
  'gcp-composer': 85.0, 'gcp-spanner': 120.0, 'gcp-looker': 40.0, 'gcp-vertex': 95.0,
  'aws-s3': 21.0, 'aws-ec2': 42.0, 'aws-rds': 50.0, 'aws-lambda': 15.0,
  'aws-dynamodb': 35.0, 'aws-redshift': 90.0,
  'azure-blob': 20.0, 'azure-vm': 40.0, 'azure-sql': 48.0, 'azure-functions': 16.0, 'azure-cosmos': 55.0,
  'ali-oss': 18.0, 'ali-ecs': 38.0, 'ali-rds': 42.0, 'ali-sls': 25.0,
  'ten-cos': 19.0, 'ten-cvm': 36.0, 'ten-cdb': 40.0,
  'kafka': 8.0, 'polars': 5.0, 'airflow': 7.0, 'docker': 5.0, 'spark': 10.0,
  'db-mysql': 12.0, 'db-postgres': 12.0, 'db-clickhouse': 15.0, 'db-mongodb': 14.0, 'db-redis': 10.0,
  'bare-metal': 25.0, 'hdfs': 20.0, 'local-db': 12.0,
  'edge-vision': 18.0, 'edge-audit': 15.0, 'edge-iot': 12.0,
  'opensearch': 14.0, 'typesense': 8.0,
};

export function useFlowGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [isFailoverActive, setIsFailoverActive] = useState(false);
  const [connectionType, setConnectionType] = useState<'default' | 'replication'>('default');

  // Undo/Redo history
  const historyRef = useRef<Array<{ nodes: Node[]; edges: Edge[] }>>([]);
  const historyIndexRef = useRef<number>(-1);
  const isUndoRedoRef = useRef(false);

  const pushHistory = useCallback((nodes: Node[], edges: Edge[]) => {
    if (isUndoRedoRef.current) { isUndoRedoRef.current = false; return; }
    const snapshot = {
      nodes: nodes.map((n) => ({ ...n, data: { ...n.data, onDelete: undefined, onToggleActive: undefined, onChangeLabel: undefined } })),
      edges: [...edges],
    };
    const history = historyRef.current;
    const idx = historyIndexRef.current;
    historyRef.current = history.slice(0, idx + 1);
    historyRef.current.push(snapshot);
    if (historyRef.current.length > 50) historyRef.current.shift();
    historyIndexRef.current = historyRef.current.length - 1;
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data: ProjectData = JSON.parse(saved);
        if (data.nodes && data.nodes.length > 0) {
          const restoredNodes = data.nodes.map((n) => ({
            ...n,
            data: { ...n.data, onDelete: deleteNode, onToggleActive: toggleNodeActive, onChangeLabel: updateNodeLabel },
          }));
          setNodes(restoredNodes as Node[]);
          if (data.edges) setEdges(data.edges as Edge[]);
        }
      }
    } catch {}
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      if (nodes.length > 0) {
        const data: ProjectData = {
          version: '2.4.0',
          name: 'Untitled Architecture',
          nodes: nodes.map((n) => ({ id: n.id, type: n.type || 'architectureNode', position: n.position, data: { ...n.data, onDelete: undefined, onToggleActive: undefined, onChangeLabel: undefined } })),
          edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target, type: e.type, animated: e.animated, style: e.style as any, markerEnd: e.markerEnd as any, data: e.data })),
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [nodes, edges]);

  const deleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  const toggleNodeActive = useCallback((id: string) => {
    setNodes((nds) => nds.map((node) => node.id === id ? { ...node, data: { ...node.data, isDisabled: !node.data.isDisabled } } : node));
    setSelectedNode((prev) => prev && prev.id === id ? { ...prev, data: { ...prev.data, isDisabled: !prev.data.isDisabled } } : prev);
  }, [setNodes]);

  const updateNodeLabel = useCallback((id: string, label: string) => {
    setNodes((nds) => nds.map((node) => node.id === id ? { ...node, data: { ...node.data, label } } : node));
    setSelectedNode((prev) => prev && prev.id === id ? { ...prev, data: { ...prev.data, label } } : prev);
  }, [setNodes]);

  const updateNodeData = useCallback((id: string, key: string, value: any) => {
    setNodes((nds) => nds.map((node) => node.id === id ? { ...node, data: { ...node.data, [key]: value } } : node));
    setSelectedNode((prev) => prev && prev.id === id ? { ...prev, data: { ...prev.data, [key]: value } } : prev);
  }, [setNodes]);

  const onConnect = useCallback((params: Connection) => {
    // Prevent self-connections
    if (params.source === params.target) return;
    // Prevent duplicate connections
    const exists = edges.some((e) => e.source === params.source && e.target === params.target);
    if (exists) return;

    const sourceNode = nodes.find((n) => n.id === params.source);
    const isSourceCloud = sourceNode?.data.type === 'cloud';
    const isReplication = connectionType === 'replication';
    const newEdge: Edge = {
      ...params,
      id: `e-${params.source}-${params.target}`,
      type: 'smoothstep',
      animated: true,
      data: { edgeType: isReplication ? 'replication' : 'standard' },
      style: {
        stroke: isReplication ? '#f97316' : isSimulationMode ? '#10b981' : isSourceCloud ? '#3b82f6' : '#475569',
        strokeWidth: isReplication ? 3 : isSimulationMode ? 3 : 2,
        strokeDasharray: isReplication ? '5,5' : isSimulationMode ? '0' : isSourceCloud ? '5,5' : 'none',
        transition: 'all 0.5s ease',
      },
      markerEnd: { type: MarkerType.ArrowClosed, color: isReplication ? '#f97316' : isSimulationMode ? '#10b981' : isSourceCloud ? '#3b82f6' : '#475569' },
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [nodes, edges, setEdges, isSimulationMode, connectionType]);

  // Sync edges with simulation/failover state
  useEffect(() => {
    setEdges((eds) =>
      eds.map((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        const isSourceCloud = sourceNode?.data.type === 'cloud';
        const isReplication = edge.data?.edgeType === 'replication';
        let strokeColor = isReplication ? '#f97316' : isSimulationMode ? '#10b981' : isSourceCloud ? '#3b82f6' : '#475569';
        let strokeWidth = isReplication ? 3 : isSimulationMode ? 3 : 2;
        let strokeDash = isReplication ? '5,5' : isSimulationMode ? '0' : isSourceCloud ? '5,5' : 'none';
        if (isFailoverActive && isReplication) { strokeColor = '#f59e0b'; strokeWidth = 4; }
        const newMarkerEnd = edge.markerEnd && typeof edge.markerEnd === 'object' && 'type' in edge.markerEnd
          ? { ...edge.markerEnd, color: strokeColor }
          : { type: MarkerType.ArrowClosed, color: strokeColor };
        return { ...edge, style: { ...edge.style, stroke: strokeColor, strokeWidth, strokeDasharray: strokeDash, transition: 'all 0.5s ease' }, markerEnd: newMarkerEnd };
      })
    );
  }, [isSimulationMode, isFailoverActive, nodes, setEdges]);

  // Sync boundary nodes with failover state
  useEffect(() => {
    setNodes((nds) => {
      const boundaries = nds.filter((b) => b.type === 'boundaryNode');
      const updated = nds.map((n) => {
        if (n.type === 'boundaryNode') {
          if (n.data.isFailoverActive === isFailoverActive) return n;
          return { ...n, data: { ...n.data, isFailoverActive, onDelete: deleteNode, onChangeLabel: updateNodeLabel } };
        }
        let isInsidePrimary = false;
        let isInsideDR = false;
        boundaries.forEach((b) => {
          const px = b.position.x, py = b.position.y;
          const pw = b.data.width || 460, ph = b.data.height || 320;
          const inside = n.position.x >= px && n.position.x <= px + pw && n.position.y >= py && n.position.y <= py + ph;
          if (inside) {
            const bRole = b.data.role || 'none';
            if (bRole === 'primary' || (b.data.label || '').toLowerCase().includes('primary')) isInsidePrimary = true;
            else if (bRole === 'dr' || (b.data.label || '').toLowerCase().includes('dr')) isInsideDR = true;
          }
        });
        if (n.data.isFailoverActive === isFailoverActive && n.data.isInsidePrimary === isInsidePrimary && n.data.isInsideDR === isInsideDR) return n;
        return { ...n, data: { ...n.data, isFailoverActive, isInsidePrimary, isInsideDR } };
      });
      const anyChanged = updated.some((node, i) => node.data.isFailoverActive !== nds[i].data.isFailoverActive || node.data.isInsidePrimary !== nds[i].data.isInsidePrimary || node.data.isInsideDR !== nds[i].data.isInsideDR);
      return anyChanged ? updated : nds;
    });
  }, [isFailoverActive, deleteNode, updateNodeLabel, setNodes]);

  // Drag boundary children
  const draggedChildrenRef = useRef<string[]>([]);
  const draggedParentPrevPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const onNodeDragStart = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.type === 'boundaryNode') {
      const pw = node.data.width || 460, ph = node.data.height || 320;
      draggedChildrenRef.current = nodes
        .filter((n) => n.id !== node.id && n.type === 'architectureNode' && !n.data.isDisabled)
        .filter((n) => n.position.x >= node.position.x && n.position.x <= node.position.x + pw && n.position.y >= node.position.y && n.position.y <= node.position.y + ph)
        .map((n) => n.id);
      draggedParentPrevPosRef.current = { x: node.position.x, y: node.position.y };
    } else {
      draggedChildrenRef.current = [];
    }
  }, [nodes]);

  const onNodeDrag = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.type === 'boundaryNode' && draggedChildrenRef.current.length > 0) {
      const dx = node.position.x - draggedParentPrevPosRef.current.x;
      const dy = node.position.y - draggedParentPrevPosRef.current.y;
      draggedParentPrevPosRef.current = { x: node.position.x, y: node.position.y };
      setNodes((nds) => nds.map((n) => draggedChildrenRef.current.includes(n.id) ? { ...n, position: { x: n.position.x + dx, y: n.position.y + dy } } : n));
    }
  }, [setNodes]);

  const onNodeDragStop = useCallback(() => { draggedChildrenRef.current = []; }, []);

  const onDragStart = (event: React.DragEvent, nodeType: string, templateId: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('templateId', templateId);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent) => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    const templateId = event.dataTransfer.getData('templateId');
    if (!type) return;
    const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const template = NODE_TEMPLATES.find((t) => t.id === templateId);
    const isBoundary = type === 'boundaryNode' || template?.category === 'Network Boundaries';
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: isBoundary ? 'boundaryNode' : 'architectureNode',
      position,
      data: isBoundary
        ? { label: template?.name || 'New Zone', type: 'boundary', templateId, onDelete: deleteNode, onChangeLabel: updateNodeLabel, isFailoverActive, role: templateId === 'region-box' ? 'primary' : 'none', width: 480, height: 340 }
        : { label: template?.name || 'New Node', type: template?.type || 'cloud', templateId, onDelete: deleteNode, onToggleActive: toggleNodeActive, isDisabled: false },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [reactFlowInstance, setNodes, deleteNode, toggleNodeActive, updateNodeLabel, isFailoverActive]);

  const onNodeClick = useCallback((_: any, node: Node) => { setSelectedNode(node); }, []);

  // Undo/Redo functions
  const undo = useCallback(() => {
    const idx = historyIndexRef.current;
    if (idx <= 0) return;
    isUndoRedoRef.current = true;
    historyIndexRef.current = idx - 1;
    const snapshot = historyRef.current[idx - 1];
    const restoredNodes = snapshot.nodes.map((n) => ({
      ...n,
      data: { ...n.data, onDelete: deleteNode, onToggleActive: toggleNodeActive, onChangeLabel: updateNodeLabel },
    }));
    setNodes(restoredNodes as Node[]);
    setEdges(snapshot.edges as Edge[]);
  }, [setNodes, setEdges, deleteNode, toggleNodeActive, updateNodeLabel]);

  const redo = useCallback(() => {
    const idx = historyIndexRef.current;
    if (idx >= historyRef.current.length - 1) return;
    isUndoRedoRef.current = true;
    historyIndexRef.current = idx + 1;
    const snapshot = historyRef.current[idx + 1];
    const restoredNodes = snapshot.nodes.map((n) => ({
      ...n,
      data: { ...n.data, onDelete: deleteNode, onToggleActive: toggleNodeActive, onChangeLabel: updateNodeLabel },
    }));
    setNodes(restoredNodes as Node[]);
    setEdges(snapshot.edges as Edge[]);
  }, [setNodes, setEdges, deleteNode, toggleNodeActive, updateNodeLabel]);

  // Push to history on nodes/edges change
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      pushHistory(nodes, edges);
    }
  }, [nodes, edges]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') return;

      if (selectedNode && (event.key === 'Delete' || event.key === 'Backspace')) {
        deleteNode(selectedNode.id);
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        undo();
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && event.shiftKey) {
        event.preventDefault();
        redo();
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
        event.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode, deleteNode, undo, redo]);

  // Cost estimation (per-service)
  const estimatedCost = useMemo(() => {
    return nodes.reduce((acc, node) => {
      if (node.data.isDisabled) return acc;
      return acc + (COST_MAP[node.data.templateId] || (node.data.type === 'cloud' ? 45 : node.data.type === 'on-premise' ? 12 : 5));
    }, 0);
  }, [nodes]);

  // Architecture validation
  const validateArchitecture = useCallback(() => {
    const issues: ValidationIssue[] = [];
    if (nodes.length === 0) {
      issues.push({ type: 'warning', message: 'Canvas is empty. Drag nodes to start.' });
      return { status: 'warning' as const, message: 'Canvas is empty.', issues };
    }

    // Orphan nodes (no connections)
    const connectedIds = new Set<string>();
    edges.forEach((e) => { connectedIds.add(e.source); connectedIds.add(e.target); });
    const orphans = nodes.filter((n) => n.type === 'architectureNode' && !connectedIds.has(n.id));
    orphans.forEach((n) => issues.push({ type: 'warning', nodeId: n.id, message: `"${n.data.label}" has no connections.` }));

    // Circular dependency detection
    const adj = new Map<string, string[]>();
    edges.forEach((e) => { if (!adj.has(e.source)) adj.set(e.source, []); adj.get(e.source)!.push(e.target); });
    const visited = new Set<string>();
    const inStack = new Set<string>();
    let hasCycle = false;
    const dfs = (nodeId: string) => {
      if (inStack.has(nodeId)) { hasCycle = true; return; }
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      inStack.add(nodeId);
      (adj.get(nodeId) || []).forEach(dfs);
      inStack.delete(nodeId);
    };
    nodes.forEach((n) => { if (!visited.has(n.id)) dfs(n.id); });
    if (hasCycle) issues.push({ type: 'error', message: 'Circular dependency detected in architecture.' });

    // Boundary zones with no enclosed nodes
    const boundaries = nodes.filter((n) => n.type === 'boundaryNode');
    boundaries.forEach((b) => {
      const pw = b.data.width || 460, ph = b.data.height || 320;
      const hasChildren = nodes.some((n) => n.type === 'architectureNode' && n.position.x >= b.position.x && n.position.x <= b.position.x + pw && n.position.y >= b.position.y && n.position.y <= b.position.y + ph);
      if (!hasChildren) issues.push({ type: 'info', nodeId: b.id, message: `Boundary "${b.data.label}" contains no nodes.` });
    });

    // Budget warning
    if (estimatedCost > 500) issues.push({ type: 'warning', message: `Monthly cost $${estimatedCost.toFixed(2)} exceeds $500 budget threshold.` });

    const hasErrors = issues.some((i) => i.type === 'error');
    const hasWarnings = issues.some((i) => i.type === 'warning');
    return {
      status: hasErrors ? 'error' as const : hasWarnings ? 'warning' as const : 'success' as const,
      message: hasErrors ? 'Architecture has errors.' : hasWarnings ? `${issues.length} issue(s) found.` : `Architecture valid. ${nodes.length} nodes, $${estimatedCost.toFixed(2)}/mo.`,
      issues,
    };
  }, [nodes, edges, estimatedCost]);

  // Export project as JSON
  const exportProject = useCallback((): string => {
    const data: ProjectData = {
      version: '2.4.0',
      name: 'Untitled Architecture',
      nodes: nodes.map((n) => ({ id: n.id, type: n.type || 'architectureNode', position: n.position, data: { ...n.data, onDelete: undefined, onToggleActive: undefined, onChangeLabel: undefined } })),
      edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target, type: e.type, animated: e.animated, style: e.style as any, markerEnd: e.markerEnd as any, data: e.data })),
      savedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }, [nodes, edges]);

  // Import project from JSON
  const importProject = useCallback((json: string) => {
    try {
      const data: ProjectData = JSON.parse(json);
      const restoredNodes = data.nodes.map((n) => ({
        ...n,
        data: { ...n.data, onDelete: deleteNode, onToggleActive: toggleNodeActive, onChangeLabel: updateNodeLabel },
      }));
      setNodes(restoredNodes as Node[]);
      setEdges(data.edges as Edge[]);
    } catch (e) {
      console.error('Failed to import project:', e);
    }
  }, [deleteNode, toggleNodeActive, updateNodeLabel, setNodes, setEdges]);

  // Download as .darch file
  const downloadProject = useCallback(() => {
    const json = exportProject();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `architecture-${Date.now()}.darch`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportProject]);

  // Enhanced Terraform generation (multi-cloud)
  const generatedScript = useMemo(() => {
    if (nodes.length === 0) return '# Drag nodes to canvas to generate script';

    const hasGCP = nodes.some((n) => n.data.templateId?.startsWith('gcp-'));
    const hasAWS = nodes.some((n) => n.data.templateId?.startsWith('aws-'));
    const hasAzure = nodes.some((n) => n.data.templateId?.startsWith('azure-'));

    let script = 'terraform {\n  required_providers {\n';
    if (hasGCP) script += '    google = {\n      source  = "hashicorp/google"\n      version = "~> 5.0"\n    }\n';
    if (hasAWS) script += '    aws = {\n      source  = "hashicorp/aws"\n      version = "~> 5.0"\n    }\n';
    if (hasAzure) script += '    azurerm = {\n      source  = "hashicorp/azurerm"\n      version = "~> 3.0"\n    }\n';
    script += '  }\n}\n\n';
    if (hasGCP) script += 'provider "google" {\n  project = var.project_id\n  region  = "us-central1"\n}\n\n';
    if (hasAWS) script += 'provider "aws" {\n  region = "us-east-1"\n}\n\n';
    if (hasAzure) script += 'provider "azurerm" {\n  features {}\n}\n\n';

    // Build depends_on from edges
    const edgeMap = new Map<string, string[]>();
    edges.forEach((e) => { if (!edgeMap.has(e.target)) edgeMap.set(e.target, []); edgeMap.get(e.target)!.push(e.source); });

    nodes.forEach((node) => {
      const tpl = node.data.templateId;
      const safeId = node.id.replace(/-/g, '_');
      const name = node.data.label.toLowerCase().replace(/\s+/g, '-');
      const deps = edgeMap.get(node.id)?.map((id) => `    ${id.replace(/-/g, '_')}`).join(',\n');

      if (tpl?.startsWith('gcp-')) {
        const gcpMap: Record<string, () => string> = {
          'gcp-bq': () => `resource "google_bigquery_dataset" "${safeId}" {\n  dataset_id = "ds_${safeId}"\n  location   = "US"\n  delete_contents_on_destroy = false\n}`,
          'gcp-gcs': () => `resource "google_storage_bucket" "${safeId}" {\n  name     = "${name}-\${var.project_id}"\n  location = "US"\n  storage_class = "STANDARD"\n  uniform_bucket_level_access = true\n}`,
          'gcp-pubsub': () => `resource "google_pubsub_topic" "${safeId}" {\n  name = "${name}"\n  message_retention_duration = "86400s"\n}`,
          'gcp-dataflow': () => `resource "google_dataflow_job" "${safeId}" {\n  name              = "${name}"\n  template_gcs_path = "gs://dataflow-templates/latest/Word_Count"\n  temp_gcs_location = "gs://\${var.project_id}-temp/dataflow"\n}`,
          'gcp-functions': () => `resource "google_cloudfunctions2_function" "${safeId}" {\n  name     = "${name}"\n  location = "us-central1"\n  build_config {\n    runtime = "nodejs20"\n  }\n}`,
          'gcp-sql': () => `resource "google_sql_database_instance" "${safeId}" {\n  name             = "${name}"\n  database_version = "POSTGRES_15"\n  settings {\n    tier = "db-f1-micro"\n  }\n  deletion_protection = false\n}`,
          'gcp-composer': () => `resource "google_composer_environment" "${safeId}" {\n  name   = "${name}"\n  region = "us-central1"\n  config {\n    software_config {\n      image_version = "composer-2-airflow-2"\n    }\n  }\n}`,
          'gcp-spanner': () => `resource "google_spanner_instance" "${safeId}" {\n  name         = "${name}"\n  config       = "regional-us-central1"\n  display_name = "${name}"\n  num_processing_units = 100\n}`,
          'gcp-vertex': () => `resource "google_vertex_ai_dataset" "${safeId}" {\n  display_name = "${name}"\n  metadata_schema_uri = "gs://google-cloud-aiplatform/schema/dataset/metadata/image/v1.0.0"\n}`,
          'gcp-looker': () => `# Looker (Google Cloud)\n# Requires manual provisioning or Looker API\nresource "null_resource" "${safeId}" {\n  provisioner "local-exec" {\n    command = "echo Looker instance: ${name}"\n  }\n}`,
        };
        const gen = gcpMap[tpl];
        script += gen ? gen() : `resource "null_resource" "${safeId}" {\n  # Unsupported GCP service: ${tpl}\n}`;
      } else if (tpl?.startsWith('aws-')) {
        const awsMap: Record<string, () => string> = {
          'aws-s3': () => `resource "aws_s3_bucket" "${safeId}" {\n  bucket = "${name}-\${var.project_id}"\n}\nresource "aws_s3_bucket_versioning" "${safeId}_v" {\n  bucket = aws_s3_bucket.${safeId}.id\n  versioning_configuration { status = "Enabled" }\n}`,
          'aws-ec2': () => `resource "aws_instance" "${safeId}" {\n  ami           = "ami-0c55b159cbfafe1f0"\n  instance_type = "t3.micro"\n  tags = { Name = "${name}" }\n}`,
          'aws-rds': () => `resource "aws_db_instance" "${safeId}" {\n  identifier         = "${name}"\n  engine             = "postgres"\n  engine_version     = "15"\n  instance_class     = "db.t3.micro"\n  allocated_storage  = 20\n  skip_final_snapshot = true\n}`,
          'aws-lambda': () => `resource "aws_lambda_function" "${safeId}" {\n  function_name = "${name}"\n  runtime       = "nodejs20.x"\n  handler       = "index.handler"\n  filename      = "lambda.zip"\n}`,
          'aws-dynamodb': () => `resource "aws_dynamodb_table" "${safeId}" {\n  name         = "${name}"\n  billing_mode = "PAY_PER_REQUEST"\n  hash_key     = "id"\n  attribute { name = "id" type = "S" }\n}`,
          'aws-redshift': () => `resource "aws_redshift_cluster" "${safeId}" {\n  cluster_identifier = "${name}"\n  node_type          = "ra3.xlplus"\n  number_of_nodes    = 1\n  master_username    = "admin"\n  master_password    = var.db_password\n}`,
        };
        const gen = awsMap[tpl];
        script += gen ? gen() : `resource "null_resource" "${safeId}" {\n  # Unsupported AWS service: ${tpl}\n}`;
      } else if (tpl?.startsWith('azure-')) {
        const azMap: Record<string, () => string> = {
          'azure-blob': () => `resource "azurerm_storage_account" "${safeId}" {\n  name                     = "${name.replace(/-/g, '').slice(0, 24)}"\n  resource_group_name      = azurerm_resource_group.rg.name\n  location                 = "East US"\n  account_tier             = "Standard"\n  account_replication_type = "LRS"\n}\nresource "azurerm_storage_container" "${safeId}_c" {\n  name                  = "data"\n  storage_account_name  = azurerm_storage_account.${safeId}.name\n}`,
          'azure-vm': () => `resource "azurerm_linux_virtual_machine" "${safeId}" {\n  name                = "${name}"\n  resource_group_name = azurerm_resource_group.rg.name\n  location            = "East US"\n  size                = "Standard_B1s"\n  admin_username      = "adminuser"\n  network_interface_ids = []\n}`,
          'azure-sql': () => `resource "azurerm_mssql_server" "${safeId}" {\n  name                         = "${name}"\n  resource_group_name          = azurerm_resource_group.rg.name\n  location                     = "East US"\n  version                      = "12.0"\n  administrator_login          = "sqladmin"\n  administrator_login_password = var.db_password\n}`,
          'azure-functions': () => `resource "azurerm_linux_function_app" "${safeId}" {\n  name                = "${name}"\n  resource_group_name = azurerm_resource_group.rg.name\n  location            = "East US"\n  service_plan_id     = azurerm_service_plan.sp.id\n}`,
          'azure-cosmos': () => `resource "azurerm_cosmosdb_account" "${safeId}" {\n  name                = "${name}"\n  resource_group_name = azurerm_resource_group.rg.name\n  location            = "East US"\n  offer_type          = "Standard"\n  kind                = "GlobalDocumentDB"\n}`,
        };
        const gen = azMap[tpl];
        script += gen ? gen() : `resource "null_resource" "${safeId}" {\n  # Unsupported Azure service: ${tpl}\n}`;
      } else {
        script += `resource "null_resource" "${safeId}" {\n  provisioner "local-exec" {\n    command = "echo ${node.data.label}"\n  }\n}`;
      }

      if (deps) {
        // Insert depends_on before closing brace
        const lines = script.split('\n');
        const lastBrace = lines.lastIndexOf(lines.find((l, i) => i > lines.length - 5 && l.trim() === '}')!);
        lines.splice(lastBrace, 0, `\n  depends_on = [\n${deps}\n  ]`);
        script = lines.join('\n');
      }
      script += '\n\n';
    });

    script += '# Generated by Ultimate Architect v2.4.0\n';
    script += `# ${new Date().toISOString()}\n`;
    return script;
  }, [nodes, edges]);

  // Template loader
  const cb = { onDelete: deleteNode, onToggleActive: toggleNodeActive };

  const loadTemplate = useCallback((type: TemplateType) => {
    const templates: Record<TemplateType, () => { n: Node[]; e: Edge[] }> = {
      blank: () => ({ n: [], e: [] }),
      kafka: () => ({
        n: [
          makeNode('node-1', 'Kafka Broker', 'open-source', 'kafka', { x: 100, y: 150 }, cb),
          makeNode('node-2', 'BigQuery', 'cloud', 'gcp-bq', { x: 400, y: 150 }, cb),
        ],
        e: [makeEdge('node-1', 'node-2')],
      }),
      airflow: () => ({
        n: [
          makeNode('node-1', 'Cloud Composer', 'cloud', 'gcp-composer', { x: 100, y: 150 }, cb),
          makeNode('node-2', 'Cloud Storage', 'cloud', 'gcp-gcs', { x: 400, y: 150 }, cb),
        ],
        e: [makeEdge('node-1', 'node-2')],
      }),
      complex: () => ({
        n: [
          makeNode('c-1', 'Ingress API', 'cloud', 'gcp-functions', { x: 50, y: 100 }, cb),
          makeNode('c-2', 'Event Stream', 'open-source', 'kafka', { x: 300, y: 100 }, cb),
          makeNode('c-3', 'Stream Analytics', 'cloud', 'gcp-dataflow', { x: 550, y: 50 }, cb),
          makeNode('c-4', 'Batch Processor', 'cloud', 'gcp-composer', { x: 550, y: 200 }, cb),
          makeNode('c-5', 'Global SQL', 'cloud', 'gcp-spanner', { x: 800, y: 125 }, cb),
          makeNode('c-6', 'ML Training', 'cloud', 'gcp-vertex', { x: 800, y: 300 }, cb),
          makeNode('c-7', 'Local Cache', 'on-premise', 'db-redis', { x: 50, y: 300 }, cb),
        ],
        e: [
          makeEdge('c-1', 'c-2'), makeEdge('c-2', 'c-3'), makeEdge('c-2', 'c-4'),
          makeEdge('c-3', 'c-5'), makeEdge('c-4', 'c-5'), makeEdge('c-5', 'c-6'),
          makeEdge('c-1', 'c-7', { style: { stroke: '#f59e0b', strokeWidth: 2 } }),
        ],
      }),
      'gcp-enterprise': () => ({
        n: [
          makeNode('gcp-1', 'Data Lake (GCS)', 'cloud', 'gcp-gcs', { x: 50, y: 200 }, cb),
          makeNode('gcp-2', 'Dataflow', 'cloud', 'gcp-dataflow', { x: 300, y: 200 }, cb),
          makeNode('gcp-3', 'BigQuery', 'cloud', 'gcp-bq', { x: 550, y: 200 }, cb),
          makeNode('gcp-4', 'Vertex AI', 'cloud', 'gcp-vertex', { x: 800, y: 200 }, cb),
          makeNode('gcp-5', 'Looker', 'cloud', 'gcp-looker', { x: 1050, y: 200 }, cb),
          makeNode('gcp-6', 'Cloud Composer', 'cloud', 'gcp-composer', { x: 550, y: 50 }, cb),
        ],
        e: [
          makeEdge('gcp-1', 'gcp-2'), makeEdge('gcp-2', 'gcp-3'), makeEdge('gcp-3', 'gcp-4'), makeEdge('gcp-4', 'gcp-5'),
          makeEdge('gcp-6', 'gcp-1', { animated: false, style: { stroke: '#fbbf24', strokeWidth: 1, strokeDasharray: '4 4' } }),
          makeEdge('gcp-6', 'gcp-2', { animated: false, style: { stroke: '#fbbf24', strokeWidth: 1, strokeDasharray: '4 4' } }),
          makeEdge('gcp-6', 'gcp-3', { animated: false, style: { stroke: '#fbbf24', strokeWidth: 1, strokeDasharray: '4 4' } }),
        ],
      }),
      // NEW: GCP ML Pipeline
      'gcp-ml-pipeline': () => ({
        n: [
          makeNode('ml-1', 'Pub/Sub Ingest', 'cloud', 'gcp-pubsub', { x: 50, y: 150 }, cb),
          makeNode('ml-2', 'Dataflow Transform', 'cloud', 'gcp-dataflow', { x: 300, y: 150 }, cb),
          makeNode('ml-3', 'GCS Feature Store', 'cloud', 'gcp-gcs', { x: 550, y: 100 }, cb),
          makeNode('ml-4', 'Vertex AI Train', 'cloud', 'gcp-vertex', { x: 800, y: 100 }, cb),
          makeNode('ml-5', 'Vertex AI Endpoint', 'cloud', 'gcp-vertex', { x: 1050, y: 100 }, cb),
          makeNode('ml-6', 'BigQuery Analytics', 'cloud', 'gcp-bq', { x: 550, y: 250 }, cb),
          makeNode('ml-7', 'Looker Dashboard', 'cloud', 'gcp-looker', { x: 800, y: 250 }, cb),
        ],
        e: [
          makeEdge('ml-1', 'ml-2'), makeEdge('ml-2', 'ml-3'), makeEdge('ml-2', 'ml-6'),
          makeEdge('ml-3', 'ml-4'), makeEdge('ml-4', 'ml-5'),
          makeEdge('ml-6', 'ml-7'),
        ],
      }),
      // NEW: GCP Event-Driven
      'gcp-event-driven': () => ({
        n: [
          makeNode('ev-1', 'API Gateway', 'cloud', 'gcp-functions', { x: 50, y: 150 }, cb),
          makeNode('ev-2', 'Pub/Sub Events', 'cloud', 'gcp-pubsub', { x: 300, y: 100 }, cb),
          makeNode('ev-3', 'Cloud Functions (Auth)', 'cloud', 'gcp-functions', { x: 550, y: 50 }, cb),
          makeNode('ev-4', 'Cloud Functions (Process)', 'cloud', 'gcp-functions', { x: 550, y: 200 }, cb),
          makeNode('ev-5', 'Cloud SQL Orders', 'cloud', 'gcp-sql', { x: 800, y: 100 }, cb),
          makeNode('ev-6', 'Redis Cache', 'open-source', 'db-redis', { x: 800, y: 250 }, cb),
        ],
        e: [
          makeEdge('ev-1', 'ev-2'), makeEdge('ev-2', 'ev-3'), makeEdge('ev-2', 'ev-4'),
          makeEdge('ev-3', 'ev-5'), makeEdge('ev-4', 'ev-5'), makeEdge('ev-4', 'ev-6'),
        ],
      }),
      // NEW: GCP Data Lakehouse
      'gcp-data-lakehouse': () => ({
        n: [
          makeNode('lh-1', 'GCS Raw Zone', 'cloud', 'gcp-gcs', { x: 50, y: 150 }, cb),
          makeNode('lh-2', 'Dataproc Spark', 'cloud', 'gcp-compute', { x: 300, y: 150 }, cb),
          makeNode('lh-3', 'GCS Curated Zone', 'cloud', 'gcp-gcs', { x: 550, y: 150 }, cb),
          makeNode('lh-4', 'BigQuery DW', 'cloud', 'gcp-bq', { x: 800, y: 100 }, cb),
          makeNode('lh-5', 'Looker BI', 'cloud', 'gcp-looker', { x: 1050, y: 100 }, cb),
          makeNode('lh-6', 'Cloud Composer', 'cloud', 'gcp-composer', { x: 550, y: 300 }, cb),
        ],
        e: [
          makeEdge('lh-1', 'lh-2'), makeEdge('lh-2', 'lh-3'), makeEdge('lh-3', 'lh-4'), makeEdge('lh-4', 'lh-5'),
          makeEdge('lh-6', 'lh-1', { animated: false, style: { stroke: '#fbbf24', strokeWidth: 1, strokeDasharray: '4 4' } }),
          makeEdge('lh-6', 'lh-2', { animated: false, style: { stroke: '#fbbf24', strokeWidth: 1, strokeDasharray: '4 4' } }),
        ],
      }),
      // NEW: GCP Multi-Region DR
      'gcp-multi-region-dr': () => ({
        n: [
          makeNode('dr-1', 'Spanner Primary', 'cloud', 'gcp-spanner', { x: 100, y: 200 }, cb),
          makeNode('dr-2', 'Spanner DR', 'cloud', 'gcp-spanner', { x: 700, y: 200 }, cb),
          makeNode('dr-3', 'GCS Primary', 'cloud', 'gcp-gcs', { x: 100, y: 350 }, cb),
          makeNode('dr-4', 'GCS DR', 'cloud', 'gcp-gcs', { x: 700, y: 350 }, cb),
          makeNode('dr-5', 'Global LB', 'cloud', 'gcp-functions', { x: 400, y: 50 }, cb),
        ],
        e: [
          makeEdge('dr-5', 'dr-1'), makeEdge('dr-5', 'dr-2'),
          makeEdge('dr-1', 'dr-2', { animated: true, style: { stroke: '#f97316', strokeWidth: 3, strokeDasharray: '5,5' } }),
          makeEdge('dr-3', 'dr-4', { animated: true, style: { stroke: '#f97316', strokeWidth: 3, strokeDasharray: '5,5' } }),
        ],
      }),
      // NEW: AWS Analytics Pipeline
      'aws-analytics': () => ({
        n: [
          makeNode('aw-1', 'S3 Data Lake', 'cloud', 'aws-s3', { x: 50, y: 150 }, cb),
          makeNode('aw-2', 'Glue ETL', 'cloud', 'aws-lambda', { x: 300, y: 150 }, cb),
          makeNode('aw-3', 'Redshift DW', 'cloud', 'aws-redshift', { x: 550, y: 150 }, cb),
          makeNode('aw-4', 'QuickSight', 'cloud', 'aws-ec2', { x: 800, y: 150 }, cb),
        ],
        e: [makeEdge('aw-1', 'aw-2'), makeEdge('aw-2', 'aw-3'), makeEdge('aw-3', 'aw-4')],
      }),
      // NEW: Azure Data Factory
      'azure-data-factory': () => ({
        n: [
          makeNode('az-1', 'Blob Storage', 'cloud', 'azure-blob', { x: 50, y: 150 }, cb),
          makeNode('az-2', 'Data Factory', 'cloud', 'azure-functions', { x: 300, y: 150 }, cb),
          makeNode('az-3', 'Synapse', 'cloud', 'azure-sql', { x: 550, y: 150 }, cb),
          makeNode('az-4', 'Power BI', 'cloud', 'azure-vm', { x: 800, y: 150 }, cb),
        ],
        e: [makeEdge('az-1', 'az-2'), makeEdge('az-2', 'az-3'), makeEdge('az-3', 'az-4')],
      }),
      // NEW: Hybrid Cloud
      'hybrid-cloud': () => ({
        n: [
          makeNode('hy-1', 'GCS Data Lake', 'cloud', 'gcp-gcs', { x: 50, y: 100 }, cb),
          makeNode('hy-2', 'BigQuery', 'cloud', 'gcp-bq', { x: 300, y: 100 }, cb),
          makeNode('hy-3', 'S3 Mirror', 'cloud', 'aws-s3', { x: 50, y: 250 }, cb),
          makeNode('hy-4', 'On-Prem PostgreSQL', 'on-premise', 'db-postgres', { x: 550, y: 175 }, cb),
          makeNode('hy-5', 'Redis Cache', 'open-source', 'db-redis', { x: 800, y: 175 }, cb),
        ],
        e: [
          makeEdge('hy-1', 'hy-2'), makeEdge('hy-3', 'hy-2'),
          makeEdge('hy-2', 'hy-4'), makeEdge('hy-4', 'hy-5'),
        ],
      }),
    };

    const builder = templates[type];
    if (!builder) return;
    const { n, e } = builder();
    setNodes(n);
    setEdges(e);
  }, [deleteNode, toggleNodeActive, setNodes, setEdges]);

  // Edge label update
  const updateEdgeLabel = useCallback((edgeId: string, label: string) => {
    setEdges((eds) =>
      eds.map((e) => e.id === edgeId ? { ...e, data: { ...e.data, label } } : e)
    );
  }, [setEdges]);

  // Version history snapshots
  const [snapshots, setSnapshots] = useState<Array<{ id: string; name: string; timestamp: string; nodes: Node[]; edges: Edge[] }>>([]);

  const saveSnapshot = useCallback((name: string) => {
    const snapshot = {
      id: `snap-${Date.now()}`,
      name,
      timestamp: new Date().toISOString(),
      nodes: nodes.map((n) => ({ ...n, data: { ...n.data, onDelete: undefined, onToggleActive: undefined, onChangeLabel: undefined } })),
      edges: [...edges],
    };
    setSnapshots((prev) => [snapshot, ...prev]);
  }, [nodes, edges]);

  const restoreSnapshot = useCallback((snapshot: { nodes: Node[]; edges: Edge[] }) => {
    const restoredNodes = snapshot.nodes.map((n) => ({
      ...n,
      data: { ...n.data, onDelete: deleteNode, onToggleActive: toggleNodeActive, onChangeLabel: updateNodeLabel },
    }));
    setNodes(restoredNodes as Node[]);
    setEdges(snapshot.edges as Edge[]);
  }, [deleteNode, toggleNodeActive, updateNodeLabel, setNodes, setEdges]);

  const deleteSnapshot = useCallback((id: string) => {
    setSnapshots((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return {
    nodes, edges, setNodes, setEdges,
    selectedNode, setSelectedNode,
    reactFlowInstance, setReactFlowInstance, reactFlowWrapper,
    onNodesChange, onEdgesChange, onConnect, onNodeClick,
    onNodeDragStart, onNodeDrag, onNodeDragStop,
    onDragStart, onDragOver, onDrop,
    deleteNode, toggleNodeActive, updateNodeLabel, updateNodeData,
    isSimulationMode, setIsSimulationMode,
    isFailoverActive, setIsFailoverActive,
    connectionType, setConnectionType,
    estimatedCost, generatedScript,
    loadTemplate,
    validateArchitecture,
    exportProject, importProject, downloadProject,
    undo, redo,
    updateEdgeLabel,
    snapshots, saveSnapshot, restoreSnapshot, deleteSnapshot,
  };
}
