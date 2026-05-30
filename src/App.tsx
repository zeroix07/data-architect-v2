/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useMemo, useRef } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls, 
  Connection, 
  Edge, 
  Node, 
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  ChevronRight, 
  Play, 
  Code, 
  Settings, 
  Trash2, 
  RefreshCw,
  Search,
  Maximize2,
  Box,
  Terminal,
  Cpu,
  Activity,
  Globe,
  Power,
  Sparkles,
  DollarSign,
  Info,
  Layers,
  Upload,
  Plus,
  ArrowRight,
  Database,
  Workflow,
  X,
  FileText,
  Clock,
  User,
  History,
  GraduationCap,
  Trophy,
  Target,
  Eye,
  ShieldCheck,
  Zap,
  Camera,
  Layers3,
  Cloud,
  CheckCircle2,
  FolderOpen,
  Keyboard
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { NODE_TEMPLATES, NodeType, NodeTemplate } from '@/src/constants';
import ArchitectureNode from '@/src/components/ArchitectureNode';
import BoundaryNode from '@/src/components/BoundaryNode';

const nodeTypes = {
  architectureNode: ArchitectureNode,
  boundaryNode: BoundaryNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export default function App() {
  return (
    <ReactFlowProvider>
      <IDEContent />
    </ReactFlowProvider>
  );
}

function IDEContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [activeTab, setActiveTab] = useState<'config' | 'script'>('config');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Cloud Platforms', 'Google Cloud Platform', 'AWS', 'Microsoft Azure', 'Open-Source Stack', 'Search & Discovery', 'Network Boundaries']);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [isFailoverActive, setIsFailoverActive] = useState(false);
  const [connectionType, setConnectionType] = useState<'default' | 'replication'>('default');
  const [showAICopilot, setShowAICopilot] = useState(false);

  const estimatedCost = useMemo(() => {
    return nodes.reduce((acc, node) => {
      // Basic cost estimation logic
      if (node.data.isDisabled) return acc;
      const type = node.data.type;
      if (type === 'cloud') return acc + 45.20;
      if (type === 'on-premise') return acc + 12.50;
      return acc + 5.00;
    }, 0);
  }, [nodes]);

  const deleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  const toggleNodeActive = useCallback((id: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              isDisabled: !node.data.isDisabled,
            },
          };
        }
        return node;
      })
    );
    // Sync selected node
    setSelectedNode(prev => prev && prev.id === id ? { ...prev, data: { ...prev.data, isDisabled: !prev.data.isDisabled } } : prev);
  }, [setNodes]);

  const updateNodeLabel = useCallback((id: string, label: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              label,
            },
          };
        }
        return node;
      })
    );
    // Also update selected node for immediate UI feedback in inspector
    setSelectedNode(prev => prev && prev.id === id ? { ...prev, data: { ...prev.data, label } } : prev);
  }, [setNodes]);

  const updateNodeData = useCallback((id: string, key: string, value: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              [key]: value,
            },
          };
        }
        return node;
      })
    );
    setSelectedNode(prev => prev && prev.id === id ? { ...prev, data: { ...prev.data, [key]: value } } : prev);
  }, [setNodes]);

  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{ status: 'success' | 'warning' | 'error', message: string } | null>(null);
  const [showToR, setShowToR] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(1);
  const [academyMode, setAcademyMode] = useState(false);
  const [showQuestLog, setShowQuestLog] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('Untitled Architecture');
  const [isEditingProjectName, setIsEditingProjectName] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  const accentColor = academyMode ? '#fbbf24' : '#3b82f6';
  const brandClass = academyMode ? 'bg-[#fbbf24]' : 'bg-brand';
  const textBrandClass = academyMode ? 'text-[#fbbf24]' : 'text-brand';
  const borderBrandClass = academyMode ? 'border-[#fbbf24]/50' : 'border-brand/50';

  // Keyboard shortcut to open project options (Ctrl/Cmd + O or Ctrl/Cmd + 0)
  React.useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      const isOKey = e.key.toLowerCase() === 'o';
      const isZeroKey = e.key === '0';
      if ((e.ctrlKey || e.metaKey) && (isOKey || isZeroKey)) {
        e.preventDefault();
        setShowWelcomeModal(true);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const handleSave = () => {
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(null), 3000);
  };

  const handleValidate = () => {
    if (nodes.length === 0) {
      setValidationResult({ status: 'warning', message: 'Canvas is empty. Drag nodes to start.' });
      return;
    }
    
    setIsValidating(true);
    // Simulate validation
    setTimeout(() => {
      setIsValidating(false);
      setValidationResult({ status: 'success', message: 'Architecture validated. Configuration is ready for deployment.' });
      
      // Auto-hide result after 3 seconds
      setTimeout(() => setValidationResult(null), 4000);
    }, 1500);
  };

  const loadTemplate = (type: 'blank' | 'kafka' | 'airflow' | 'complex' | 'gcp-enterprise') => {
    setShowWelcomeModal(false);
    if (type === 'blank') {
      setNodes([]);
      setEdges([]);
      return;
    }

    if (type === 'kafka') {
      const templateNodes: Node[] = [
        { id: 'node-1', type: 'architectureNode', position: { x: 100, y: 150 }, data: { label: 'Kafka Broker', type: 'open-source', templateId: 'kafka', onDelete: deleteNode, onToggleActive: toggleNodeActive, isDisabled: false } },
        { id: 'node-2', type: 'architectureNode', position: { x: 400, y: 150 }, data: { label: 'BigQuery', type: 'cloud', templateId: 'gcp-bq', onDelete: deleteNode, onToggleActive: toggleNodeActive, isDisabled: false } },
      ];
      const templateEdges: Edge[] = [
        { 
          id: 'e-1-2', 
          source: 'node-1', 
          target: 'node-2', 
          type: 'smoothstep', 
          animated: true,
          style: { stroke: '#3b82f6', strokeWidth: 2, transition: 'all 0.5s ease' },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }
        },
      ];
      setNodes(templateNodes);
      setEdges(templateEdges);
    }

    if (type === 'airflow') {
       const templateNodes: Node[] = [
        { id: 'node-1', type: 'architectureNode', position: { x: 100, y: 150 }, data: { label: 'Cloud Composer', type: 'cloud', templateId: 'gcp-composer', onDelete: deleteNode, onToggleActive: toggleNodeActive, isDisabled: false } },
        { id: 'node-2', type: 'architectureNode', position: { x: 400, y: 150 }, data: { label: 'Cloud Storage', type: 'cloud', templateId: 'gcp-gcs', onDelete: deleteNode, onToggleActive: toggleNodeActive, isDisabled: false } },
      ];
      setNodes(templateNodes);
      setEdges([]);
    }

    if (type === 'complex') {
      const templateNodes: Node[] = [
        { id: 'c-1', type: 'architectureNode', position: { x: 50, y: 100 }, data: { label: 'Ingress API', type: 'cloud', templateId: 'gcp-functions', onDelete: deleteNode, onToggleActive: toggleNodeActive, isDisabled: false } },
        { id: 'c-2', type: 'architectureNode', position: { x: 300, y: 100 }, data: { label: 'Event Stream', type: 'open-source', templateId: 'kafka', onDelete: deleteNode, onToggleActive: toggleNodeActive, isDisabled: false } },
        { id: 'c-3', type: 'architectureNode', position: { x: 550, y: 50 }, data: { label: 'Stream Analytics', type: 'cloud', templateId: 'gcp-dataflow', onDelete: deleteNode, onToggleActive: toggleNodeActive, isDisabled: false } },
        { id: 'c-4', type: 'architectureNode', position: { x: 550, y: 200 }, data: { label: 'Batch Processor', type: 'cloud', templateId: 'gcp-composer', onDelete: deleteNode, onToggleActive: toggleNodeActive, isDisabled: false } },
        { id: 'c-5', type: 'architectureNode', position: { x: 800, y: 125 }, data: { label: 'Global SQL', type: 'cloud', templateId: 'gcp-spanner', onDelete: deleteNode, onToggleActive: toggleNodeActive, isDisabled: false } },
        { id: 'c-6', type: 'architectureNode', position: { x: 800, y: 300 }, data: { label: 'ML Training', type: 'cloud', templateId: 'gcp-vertex', onDelete: deleteNode, onToggleActive: toggleNodeActive, isDisabled: false } },
        { id: 'c-7', type: 'architectureNode', position: { x: 50, y: 300 }, data: { label: 'Local Cache', type: 'on-premise', templateId: 'db-redis', onDelete: deleteNode, onToggleActive: toggleNodeActive, isDisabled: false } },
      ];
      
      const templateEdges: Edge[] = [
        { id: 'ec-1-2', source: 'c-1', target: 'c-2', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
        { id: 'ec-2-3', source: 'c-2', target: 'c-3', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
        { id: 'ec-2-4', source: 'c-2', target: 'c-4', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
        { id: 'ec-3-5', source: 'c-3', target: 'c-5', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
        { id: 'ec-4-5', source: 'c-4', target: 'c-5', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
        { id: 'ec-5-6', source: 'c-5', target: 'c-6', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
        { id: 'ec-1-7', source: 'c-1', target: 'c-7', type: 'smoothstep', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
      ];
      
      setNodes(templateNodes);
      setEdges(templateEdges);
    }

    if (type === 'gcp-enterprise') {
      const templateNodes: Node[] = [
        { id: 'gcp-1', type: 'architectureNode', position: { x: 50, y: 200 }, data: { label: 'Data Lake (GCS)', type: 'cloud', templateId: 'gcp-gcs', onDelete: deleteNode, onToggleActive: toggleNodeActive, isDisabled: false } },
        { id: 'gcp-2', type: 'architectureNode', position: { x: 300, y: 200 }, data: { label: 'Dataflow', type: 'cloud', templateId: 'gcp-dataflow', onDelete: deleteNode, onToggleActive: toggleNodeActive, isDisabled: false } },
        { id: 'gcp-3', type: 'architectureNode', position: { x: 550, y: 200 }, data: { label: 'BigQuery', type: 'cloud', templateId: 'gcp-bq', onDelete: deleteNode, onToggleActive: toggleNodeActive, isDisabled: false } },
        { id: 'gcp-4', type: 'architectureNode', position: { x: 800, y: 200 }, data: { label: 'Vertex AI', type: 'cloud', templateId: 'gcp-vertex', onDelete: deleteNode, onToggleActive: toggleNodeActive, isDisabled: false } },
        { id: 'gcp-5', type: 'architectureNode', position: { x: 1050, y: 200 }, data: { label: 'Looker', type: 'cloud', templateId: 'gcp-looker', onDelete: deleteNode, onToggleActive: toggleNodeActive, isDisabled: false } },
        { id: 'gcp-6', type: 'architectureNode', position: { x: 550, y: 50 }, data: { label: 'Cloud Composer', type: 'cloud', templateId: 'gcp-composer', onDelete: deleteNode, onToggleActive: toggleNodeActive, isDisabled: false } },
      ];
      
      const templateEdges: Edge[] = [
        { id: 'eg-1-2', source: 'gcp-1', target: 'gcp-2', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
        { id: 'eg-2-3', source: 'gcp-2', target: 'gcp-3', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
        { id: 'eg-3-4', source: 'gcp-3', target: 'gcp-4', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
        { id: 'eg-4-5', source: 'gcp-4', target: 'gcp-5', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
        { id: 'eg-6-1', source: 'gcp-6', target: 'gcp-1', type: 'smoothstep', animated: false, style: { stroke: '#fbbf24', strokeWidth: 1, strokeDasharray: '4 4' } },
        { id: 'eg-6-2', source: 'gcp-6', target: 'gcp-2', type: 'smoothstep', animated: false, style: { stroke: '#fbbf24', strokeWidth: 1, strokeDasharray: '4 4' } },
        { id: 'eg-6-3', source: 'gcp-6', target: 'gcp-3', type: 'smoothstep', animated: false, style: { stroke: '#fbbf24', strokeWidth: 1, strokeDasharray: '4 4' } },
      ];
      
      setNodes(templateNodes);
      setEdges(templateEdges);
    }
  };

  const categories = useMemo(() => {
    const map: Record<string, NodeTemplate[]> = {};
    NODE_TEMPLATES.forEach(node => {
      if (searchQuery && !node.name.toLowerCase().includes(searchQuery.toLowerCase()) && !node.category.toLowerCase().includes(searchQuery.toLowerCase())) {
        return;
      }
      if (!map[node.category]) map[node.category] = [];
      map[node.category].push(node);
    });
    return map;
  }, [searchQuery]);

  React.useEffect(() => {
    if (searchQuery) {
      const matchingCats = Object.keys(categories);
      const providersInCloud = ['Google Cloud Platform', 'AWS', 'Microsoft Azure', 'Alibaba Cloud', 'Tencent Cloud'];
      const hasCloudMatch = matchingCats.some(cat => providersInCloud.includes(cat));
      
      setExpandedCategories(prev => {
        const next = [...new Set([...prev, ...matchingCats])];
        if (hasCloudMatch && !next.includes('Cloud Platforms')) {
          next.push('Cloud Platforms');
        }
        return next;
      });
    }
  }, [categories, searchQuery]);

  const cloudProviders = ['Google Cloud Platform', 'AWS', 'Microsoft Azure', 'Alibaba Cloud', 'Tencent Cloud'];
  const onPremCategories = ['On-Premise', 'Databases', 'Edge AI & Audit'];
  const openSourceCategories = ['Open-Source Stack'];

  const onConnect = useCallback(
    (params: Connection) => {
      const sourceNode = nodes.find(n => n.id === params.source);
      const isSourceCloud = sourceNode?.data.type === 'cloud';
      const isReplication = connectionType === 'replication';

      const newEdge: Edge = {
        ...params,
        id: `e-${params.source}-${params.target}`,
        type: 'smoothstep',
        animated: true,
        data: {
          edgeType: isReplication ? 'replication' : 'standard',
        },
        style: {
          stroke: isReplication ? '#f97316' : (isSimulationMode ? '#10b981' : (isSourceCloud ? '#3b82f6' : '#475569')),
          strokeWidth: isReplication ? 3 : (isSimulationMode ? 3 : 2),
          strokeDasharray: isReplication ? '5,5' : (isSimulationMode ? '0' : (isSourceCloud ? '5,5' : 'none')),
          transition: 'all 0.5s ease',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isReplication ? '#f97316' : (isSimulationMode ? '#10b981' : (isSourceCloud ? '#3b82f6' : '#475569')),
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [nodes, setEdges, isSimulationMode, connectionType]
  );

  // Update existing edges when simulation mode, failover, or nodes change
  React.useEffect(() => {
    setEdges((eds) => 
      eds.map((edge) => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const isSourceCloud = sourceNode?.data.type === 'cloud';
        const isReplication = edge.data?.edgeType === 'replication';

        let strokeColor = isReplication ? '#f97316' : (isSimulationMode ? '#10b981' : (isSourceCloud ? '#3b82f6' : '#475569'));
        let strokeWidth = isReplication ? 3 : (isSimulationMode ? 3 : 2);
        let strokeDash = isReplication ? '5,5' : (isSimulationMode ? '0' : (isSourceCloud ? '5,5' : 'none'));

        if (isFailoverActive && isReplication) {
          strokeColor = '#f59e0b';
          strokeWidth = 4;
        }

        return {
          ...edge,
          style: {
            ...edge.style,
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            strokeDasharray: strokeDash,
            transition: 'all 0.5s ease',
          },
          markerEnd: {
            ...edge.markerEnd,
            color: strokeColor,
          },
        };
      })
    );
  }, [isSimulationMode, isFailoverActive, nodes, setEdges]);

  // Synchronize boundaries, containers, and failover status on nodes change
  React.useEffect(() => {
    setNodes((nds) => {
      const boundaries = nds.filter((b) => b.type === 'boundaryNode');
      
      const updated = nds.map((n) => {
        // Sync boundary node's failover state
        if (n.type === 'boundaryNode') {
          // Skip updating if it already has the same status and functions to avoid loop
          if (n.data.isFailoverActive === isFailoverActive) {
            return n;
          }
          return {
            ...n,
            data: {
              ...n.data,
              isFailoverActive,
              onDelete: deleteNode,
              onChangeLabel: updateNodeLabel,
            },
          };
        }

        // For regular architecture nodes:
        let labelName = n.data.label || '';
        let isInsidePrimary = false;
        let isInsideDR = false;

        boundaries.forEach((b) => {
          const px = b.position.x;
          const py = b.position.y;
          const pw = b.data.width || 460;
          const ph = b.data.height || 320;
          
          const nx = n.position.x;
          const ny = n.position.y;
          
          const inside = nx >= px && nx <= px + pw && ny >= py && ny <= py + ph;
          
          if (inside) {
            const bLabel = (b.data.label || '').toLowerCase();
            const bRole = b.data.role || 'none';
            if (bRole === 'primary' || bLabel.includes('primary')) {
              isInsidePrimary = true;
            } else if (bRole === 'dr' || bLabel.includes('dr') || bLabel.includes('disaster') || bLabel.includes('recovery')) {
              isInsideDR = true;
            }
          }
        });

        if (
          n.data.isFailoverActive === isFailoverActive &&
          n.data.isInsidePrimary === isInsidePrimary &&
          n.data.isInsideDR === isInsideDR
        ) {
          return n;
        }

        return {
          ...n,
          data: {
            ...n.data,
            isFailoverActive,
            isInsidePrimary,
            isInsideDR,
          },
        };
      });

      // Simple optimization: only set if values actually changed
      const anyChanged = updated.some((node, i) => {
        const orig = nds[i];
        return (
          node.data.isFailoverActive !== orig.data.isFailoverActive ||
          node.data.isInsidePrimary !== orig.data.isInsidePrimary ||
          node.data.isInsideDR !== orig.data.isInsideDR
        );
      });

      return anyChanged ? updated : nds;
    });
  }, [isFailoverActive, deleteNode, updateNodeLabel, setNodes]);

  const draggedChildrenRef = useRef<string[]>([]);
  const draggedParentPrevPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const onNodeDragStart = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.type === 'boundaryNode') {
      const parentX = node.position.x;
      const parentY = node.position.y;
      const parentWidth = node.data.width || 460;
      const parentHeight = node.data.height || 320;

      const enclosedNodeIds = nodes
        .filter(n => n.id !== node.id && n.type === 'architectureNode' && !n.data.isDisabled)
        .filter(n => {
          const nx = n.position.x;
          const ny = n.position.y;
          return (
            nx >= parentX &&
            nx <= parentX + parentWidth &&
            ny >= parentY &&
            ny <= parentY + parentHeight
          );
        })
        .map(n => n.id);

      draggedChildrenRef.current = enclosedNodeIds;
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

      setNodes((nds) =>
        nds.map((n) => {
          if (draggedChildrenRef.current.includes(n.id)) {
            return {
              ...n,
              position: {
                x: n.position.x + dx,
                y: n.position.y + dy,
              },
            };
          }
          return n;
        })
      );
    }
  }, [setNodes]);

  const onNodeDragStop = useCallback(() => {
    draggedChildrenRef.current = [];
  }, []);

  const onDragStart = (event: React.DragEvent, nodeType: string, templateId: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('templateId', templateId);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const templateId = event.dataTransfer.getData('templateId');

      if (typeof type === 'undefined' || !type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const template = NODE_TEMPLATES.find(t => t.id === templateId);
      const isBoundary = type === 'boundaryNode' || template?.category === 'Network Boundaries';

      const newNode: Node = {
        id: `node-${Date.now()}`,
        type: isBoundary ? 'boundaryNode' : 'architectureNode',
        position,
        data: isBoundary 
          ? {
              label: template?.name || 'New Zone',
              type: 'boundary',
              templateId: templateId,
              onDelete: deleteNode,
              onChangeLabel: updateNodeLabel,
              isFailoverActive: isFailoverActive,
              role: templateId === 'region-box' ? 'primary' : 'none',
              width: 480,
              height: 340,
            }
          : { 
              label: template?.name || 'New Node',
              type: template?.type || 'cloud',
              templateId: templateId,
              onDelete: deleteNode,
              onToggleActive: toggleNodeActive,
              isDisabled: false,
            },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes, deleteNode, toggleNodeActive, updateNodeLabel, isFailoverActive]
  );

  const onNodeClick = (_: any, node: Node) => {
    setSelectedNode(node);
  };

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedNode && (event.key === 'Delete' || event.key === 'Backspace')) {
        // Prevent deletion if focus is in an input or textarea
        if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
        deleteNode(selectedNode.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode, deleteNode]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const generatedScript = useMemo(() => {
    if (nodes.length === 0) return "# Drag nodes to canvas to generate script";
    
    let script = "terraform {\n  required_providers {\n    google = {\n      source  = \"hashicorp/google\"\n      version = \"~> 4.0\"\n    }\n  }\n}\n\nprovider \"google\" {\n  project = \"project-id\"\n  region  = \"us-central1\"\n}\n\n";
    
    nodes.forEach(node => {
      const template = NODE_TEMPLATES.find(t => t.id === node.data.templateId);
      const isGCP = entry => entry[0].startsWith('gcp-');
      const safeId = node.id.replace(/-/g, '_');
      
      if (template?.id.startsWith('gcp-')) {
        const resourceMap: Record<string, string> = {
          'gcp-bq': 'google_bigquery_dataset',
          'gcp-gcs': 'google_storage_bucket',
          'gcp-pubsub': 'google_pubsub_topic',
          'gcp-dataflow': 'google_dataflow_job',
          'gcp-functions': 'google_cloudfunctions_function',
          'gcp-sql': 'google_sql_database_instance',
          'gcp-composer': 'google_composer_environment',
          'gcp-spanner': 'google_spanner_instance',
          'gcp-vertex': 'google_vertex_ai_dataset',
        };
        
        const resource = resourceMap[template.id] || 'google_cloud_resource';
        script += `resource \"${resource}\" \"${safeId}\" {\n`;
        script += `  name     = \"${node.data.label.toLowerCase().replace(/\s+/g, '-')}\"\n`;
        if (template.id === 'gcp-bq') script += `  dataset_id = \"ds_${safeId}\"\n`;
        if (template.id === 'gcp-gcs') script += `  location   = \"US\"\n`;
        script += `}\n\n`;
      } else {
        script += `resource \"null_resource\" \"${safeId}\" {\n`;
        script += `  provisioner \"local-exec\" {\n`;
        script += `    command = \"echo Deployment for ${template?.name || 'Unknown'}\"\n`;
        script += `  }\n}\n\n`;
      }
    });
    
    script += "# Infrastructure generated by Ultimate IDE (GCP Focused)\n";
    script += "# " + new Date().toISOString() + "\n";
    
    return script;
  }, [nodes]);

  return (
    <div className="flex flex-col h-screen w-full bg-surface text-slate-300 select-none font-sans overflow-hidden">
      <AnimatePresence>
        {!isLoggedIn && (
          <motion.div 
            key="login-land"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-[#020617] flex flex-col items-center justify-center p-6 text-center"
          >
             {/* Background Decoration */}
             <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 blur-[150px] rounded-full" />
                <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
             </div>

             <motion.div 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="relative z-10 max-w-3xl"
             >
                <div className="flex items-center justify-center gap-4 mb-8">
                   <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center shadow-2xl shadow-brand/40">
                      <div className="w-6 h-6 border-2 border-white rotate-45" />
                   </div>
                   <h2 className="text-sm font-black text-white/40 uppercase tracking-[0.4em]">Ultimate Architect</h2>
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-none">
                   The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-emerald-400">Data Engineering</span>
                </h1>
                
                <p className="text-lg text-white/40 mb-12 max-w-xl mx-auto leading-relaxed">
                   Design, simulate, and deploy enterprise-grade data architectures with precision. Built for systems that never sleep.
                </p>

                <div className="flex items-center justify-center gap-6">
                   <button 
                     onClick={() => setIsLoginModalOpen(true)}
                     className="px-8 py-4 bg-brand text-white font-bold text-sm tracking-widest uppercase rounded-full shadow-2xl shadow-brand/20 hover:scale-105 transition-all group active:scale-95"
                   >
                     Go to Workspace
                   </button>
                   <button className="px-8 py-4 bg-white/5 border border-white/10 text-white/60 font-bold text-sm tracking-widest uppercase rounded-full hover:bg-white/10 transition-all">
                      Documentation
                   </button>
                </div>

                <div className="mt-20 grid grid-cols-3 gap-12 text-left">
                   <div>
                      <h4 className="text-white font-bold text-sm mb-2 uppercase tracking-wider">Visual IDE</h4>
                      <p className="text-xs text-white/30 leading-relaxed">Low-code canvas for cloud orchestration.</p>
                   </div>
                   <div>
                      <h4 className="text-white font-bold text-sm mb-2 uppercase tracking-wider">IaC Generation</h4>
                      <p className="text-xs text-white/30 leading-relaxed">Instant Terraform and K8s manifests.</p>
                   </div>
                   <div>
                      <h4 className="text-white font-bold text-sm mb-2 uppercase tracking-wider">Edge-Ready</h4>
                      <p className="text-xs text-white/30 leading-relaxed">First-class support for Edge AI and IoT.</p>
                   </div>
                </div>
             </motion.div>
          </motion.div>
        )}

        {isLoginModalOpen && (
          <motion.div 
            key="login-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[600] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="bg-surface-brighter border border-white/10 w-full max-w-md rounded-2xl p-8 shadow-2xl"
             >
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-xl font-bold text-white tracking-tight uppercase tracking-widest">Sign In</h3>
                   <button onClick={() => setIsLoginModalOpen(false)} className="text-white/40 hover:text-white">
                      <X size={20} />
                   </button>
                </div>

                <p className="text-sm text-white/40 mb-8 leading-relaxed">
                   Unlock enterprise features and cloud synchronization by signing in to your account.
                </p>

                <div className="space-y-4">
                   <button 
                     onClick={() => {
                        setIsLoggedIn(true);
                        setIsLoginModalOpen(false);
                     }}
                     className="w-full flex items-center justify-center gap-4 py-3 bg-white text-[#020617] font-bold text-sm rounded-xl hover:bg-white/90 transition-all"
                   >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Continue with Google
                   </button>
                   <button className="w-full py-3 bg-white/5 border border-white/10 text-white font-bold text-sm rounded-xl hover:bg-white/10 transition-all">
                      Continue with SSO
                   </button>
                </div>

                <div className="mt-8 flex items-center gap-4">
                   <div className="h-px flex-1 bg-white/5" />
                   <span className="text-[10px] text-white/20 uppercase font-black">Enterprise Access Only</span>
                   <div className="h-px flex-1 bg-white/5" />
                </div>
             </motion.div>
          </motion.div>
        )}

        {showSaveToast && (
          <motion.div 
            key="save-toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-32 left-10 z-[300] px-4 py-3 bg-emerald-500 text-white rounded-xl shadow-2xl flex items-center gap-3 font-bold text-xs uppercase"
          >
             <CheckCircle2 size={16} />
             Architecture Saved to Cloud
          </motion.div>
        )}
        {validationResult && (
          <motion.div 
            key="validation-toast"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "absolute top-20 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-lg border shadow-2xl flex items-center gap-3 backdrop-blur-md",
              validationResult.status === 'success' ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
              validationResult.status === 'warning' ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
              "bg-red-500/10 border-red-500/30 text-red-400"
            )}
          >
            <CheckCircle2 size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">{validationResult.message}</span>
          </motion.div>
        )}

        {showWelcomeModal && (
          <motion.div 
            key="welcome-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-surface-brighter border border-white/10 w-full max-w-4xl h-[600px] rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex"
            >
              {/* Left Column: Side Menu */}
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
                    { label: 'Import File', icon: Upload }
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button 
                        key={item.label}
                        className={cn(
                          "w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-3",
                          idx === 0 ? "bg-brand/10 text-brand border border-brand/20" : "text-white/40 hover:text-white/60 hover:bg-white/5"
                        )}
                      >
                        <Icon size={14} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                <button 
                  onClick={() => setShowWelcomeModal(false)}
                  className="mt-auto flex items-center gap-2 text-[10px] items-center uppercase font-black tracking-widest text-white/30 hover:text-white transition-colors"
                >
                  <Upload size={12} />
                  Import .darch / .yaml file
                </button>
              </div>

              {/* Right Column: Template Grid */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-8 pb-4 flex items-center justify-between">
                   <h2 className="text-xl font-bold text-white uppercase tracking-tight">Create New Workspace</h2>
                   <button onClick={() => setShowWelcomeModal(false)} className="text-white/20 hover:text-white">
                      <X size={20} />
                   </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 pt-4 custom-scrollbar">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Blank Card */}
                    <button 
                      onClick={() => loadTemplate('blank')}
                      className="group border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-brand/50 hover:bg-brand/5 transition-all h-[180px]"
                    >
                      <div className="w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center mb-4 group-hover:border-brand/40 group-hover:bg-brand/10 transition-all">
                        <Plus size={24} className="text-white/20 group-hover:text-brand" />
                      </div>
                      <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">Create Blank Workspace</span>
                    </button>

                    {/* Kafka Template */}
                    <button 
                      onClick={() => loadTemplate('kafka')}
                      className="group border border-white/10 bg-surface rounded-xl p-6 flex flex-col text-left hover:border-brand/50 transition-all h-[180px] relative overflow-hidden"
                    >
                      <div className="flex items-center gap-2 mb-3">
                         <Activity size={16} className="text-emerald-500" />
                         <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Streaming</span>
                      </div>
                      <span className="text-sm font-bold text-white group-hover:text-brand transition-colors mb-2">Kafka Streaming Pipeline</span>
                      <p className="text-[11px] text-white/40 leading-relaxed mb-4">Ingest real-time events from Kafka to BigQuery with schema validation.</p>
                      
                      <div className="absolute bottom-0 right-0 w-32 h-20 opacity-20 group-hover:opacity-40 transition-opacity">
                         <div className="absolute top-1/2 left-0 w-full h-[1px] bg-brand" />
                         <div className="absolute top-1/2 left-4 w-2 h-2 rounded-full bg-brand animate-ping" />
                         <div className="absolute top-1/2 right-4 w-2 h-2 rounded-full bg-brand" />
                      </div>
                    </button>

                    {/* Airflow Template */}
                    <button 
                      onClick={() => loadTemplate('airflow')}
                      className="group border border-white/10 bg-surface rounded-xl p-6 flex flex-col text-left hover:border-brand/50 transition-all h-[180px] relative overflow-hidden"
                    >
                      <div className="flex items-center gap-2 mb-3">
                         <Workflow size={16} className="text-sky-500" />
                         <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest">Batch</span>
                      </div>
                      <span className="text-sm font-bold text-white group-hover:text-brand transition-colors mb-2">Airflow ETL Workflow</span>
                      <p className="text-[11px] text-white/40 leading-relaxed mb-4">Orchestrate batch ETL jobs with Cloud Composer and GCS buckets.</p>
                      
                      <div className="absolute bottom-4 right-4 flex items-center gap-1">
                         <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                         <div className="w-1.5 h-px bg-sky-500/30 w-4" />
                         <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                      </div>
                    </button>

                    {/* Complex Data Mesh Template */}
                    <button 
                      onClick={() => loadTemplate('complex')}
                      className="group border border-white/10 bg-surface rounded-xl p-6 flex flex-col text-left hover:border-brand/50 transition-all h-[180px] relative overflow-hidden"
                    >
                      <div className="flex items-center gap-2 mb-3">
                         <Sparkles size={16} className="text-brand" />
                         <span className="text-[10px] font-black text-brand uppercase tracking-widest">Enterprise</span>
                      </div>
                      <span className="text-sm font-bold text-white group-hover:text-brand transition-colors mb-2">Data Mesh Architecture</span>
                      <p className="text-[11px] text-white/40 leading-relaxed mb-4">Complex multi-cloud topology with real-time analytics and global state.</p>
                      
                      <div className="absolute top-2 right-2 flex gap-0.5">
                         {[1,2,3].map(i => <div key={`sparkle-${i}`} className="w-1 h-3 bg-brand/40 group-hover:bg-brand transition-colors rounded-full" />)}
                      </div>
                    </button>

                    {/* Hybrid Template */}
                    <button 
                      onClick={() => loadTemplate('gcp-enterprise')}
                      className="group border border-white/10 bg-surface rounded-xl p-6 flex flex-col text-left hover:border-brand/50 transition-all h-[180px] relative overflow-hidden"
                    >
                      <div className="flex items-center gap-2 mb-3">
                         <Cloud size={16} className="text-brand" />
                         <span className="text-[10px] font-black text-brand uppercase tracking-widest">Enterprise</span>
                      </div>
                      <span className="text-sm font-bold text-white group-hover:text-brand transition-colors mb-2">GCP Enterprise Analytics</span>
                      <p className="text-[11px] text-white/40 leading-relaxed mb-4">Complete Big Data pipeline: GCS to Looker with Vertex AI integration.</p>
                      
                      <div className="absolute bottom-4 right-4 flex -space-x-1">
                         {[1,2,3,4].map(i => <div key={`circle-${i}`} className="w-4 h-4 rounded-full border border-surface bg-brand/20" />)}
                      </div>
                    </button>
                  </div>
                </div>

                <div className="p-8 pt-0 border-t border-white/5 flex items-center justify-between bg-black/5 mt-auto">
                   <div className="flex items-center gap-4 text-[10px] text-white/30 uppercase font-black tracking-widest">
                      <span>Recent: prod-v2-deployment.darch</span>
                      <div className="w-1 h-1 rounded-full bg-white/20" />
                      <span>7 mins ago</span>
                      <div className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="text-brand">Shortcut: Ctrl+O or ⌘+O</span>
                   </div>
                   <button 
                      onClick={() => setShowWelcomeModal(false)}
                      className="flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-full transition-all border border-white/10"
                    >
                      Quick Start
                      <ArrowRight size={12} />
                    </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ToR Slide-over Panel */}
      <AnimatePresence>
        {showToR && (
          <>
            <motion.div 
              key="tor-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowToR(false)}
              className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              key="tor-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[500px] z-[160] bg-surface-brighter border-l border-white/10 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand/20 flex items-center justify-center text-brand">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Technical Specification</h3>
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Generated ToR Document</p>
                  </div>
                </div>
                <button onClick={() => setShowToR(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X size={20} className="text-white/40" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                <section className="space-y-4">
                  <h4 className="text-brand font-bold text-xs uppercase tracking-[0.2em]">1. Overview</h4>
                  <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      This document outlines the technical architecture for the "Global Analytics Platform" mesh. It synchronizes multiple cloud vendors with on-premise cache layers to provide sub-100ms query latency.
                    </p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h4 className="text-brand font-bold text-xs uppercase tracking-[0.2em]">2. Infrastructure Components</h4>
                  <div className="overflow-hidden border border-white/5 rounded-xl">
                    <table className="w-full text-[10px]">
                      <thead className="bg-white/5 text-white/40 uppercase font-black tracking-widest">
                        <tr>
                          <th className="px-4 py-2 text-left">Entity</th>
                          <th className="px-4 py-2 text-left">Type</th>
                          <th className="px-4 py-2 text-left">Policy</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 bg-black/10">
                        {nodes.map(node => (
                          <tr key={node.id}>
                            <td className="px-4 py-2 font-mono text-brand">{node.data.label}</td>
                            <td className="px-4 py-2 opacity-60 uppercase">{node.data.type}</td>
                            <td className="px-4 py-2 text-emerald-500 font-bold">Encrypted</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="space-y-4">
                  <h4 className="text-brand font-bold text-xs uppercase tracking-[0.2em]">3. Data Flow Logic</h4>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-4">
                    {edges.length > 0 ? (
                      <div className="space-y-3">
                        {edges.map((edge, i) => {
                          const src = nodes.find(n => n.id === edge.source);
                          const trg = nodes.find(n => n.id === edge.target);
                          return (
                            <div key={edge.id} className="flex items-center gap-3">
                               <div className="w-4 h-4 rounded bg-brand/20 flex items-center justify-center text-[8px] font-bold text-brand">{i+1}</div>
                               <span className="text-[11px] text-white/60">{src?.data.label}</span>
                               <ArrowRight size={10} className="text-white/20" />
                               <span className="text-[11px] text-white/60 font-bold">{trg?.data.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-[10px] text-white/20 italic">No node connections detected in current architecture.</p>
                    )}
                  </div>
                </section>

                <section className="space-y-4">
                  <h4 className="text-brand font-bold text-xs uppercase tracking-[0.2em]">4. Deployment Strategy</h4>
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                    <p className="text-[11px] text-emerald-400/80 leading-relaxed font-mono">
                      $ terraform plan -out=main.tfplan<br/>
                      $ terraform apply "main.tfplan"<br/>
                      ...<br/>
                      Deployment Successful: 0 Errors, {nodes.length} Resources Created.
                    </p>
                  </div>
                </section>
              </div>

              <div className="p-6 border-t border-white/5 flex gap-4">
                 <button 
                   onClick={() => window.print()}
                   className="flex-1 py-2.5 bg-brand text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:shadow-lg hover:shadow-brand/20 transition-all"
                 >
                   Download PDF Case
                 </button>
                 <button className="flex-1 py-1 px-4 bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:text-white transition-all">
                   Share Link
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {academyMode && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed bottom-32 right-6 z-[200] w-64 bg-[#fbbf24]/5 backdrop-blur-xl border border-[#fbbf24]/30 rounded-xl shadow-2xl p-4 overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-8 -mr-10 -mt-10 opacity-10 pointer-events-none">
                <Trophy size={80} className="text-[#fbbf24]" />
             </div>
             
             <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#fbbf24]/20 flex items-center justify-center text-[#fbbf24]">
                   <GraduationCap size={18} />
                </div>
                <div>
                   <h3 className="text-xs font-black text-white uppercase tracking-widest">Academy Quest</h3>
                   <p className="text-[9px] text-[#fbbf24] font-bold uppercase tracking-wider">Level 1: Edge Sync</p>
                </div>
             </div>

             <div className="space-y-3">
                <div className="space-y-1.5">
                   <div className="flex justify-between text-[10px]">
                      <span className="text-white/60">Module Progress</span>
                      <span className="text-[#fbbf24] font-bold">2 / 3</span>
                   </div>
                   <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '66%' }} className="h-full bg-[#fbbf24]" />
                   </div>
                </div>

                <div className="space-y-2">
                    {[
                      { task: 'Connect Edge Vision to GCP', done: true },
                      { task: 'Deploy local cache node', done: true },
                      { task: 'Enable end-to-end security', done: false },
                    ].map((item) => (
                      <div key={item.task} className="flex items-center gap-2">
                        <div className={cn(
                          "w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors",
                          item.done ? "bg-[#fbbf24] border-[#fbbf24] text-black" : "border-white/20 text-transparent"
                        )}>
                           <CheckCircle2 size={10} strokeWidth={4} />
                        </div>
                        <span className={cn("text-[10px] tracking-tight transition-colors", item.done ? "text-white/60 line-through" : "text-white")}>
                           {item.task}
                        </span>
                     </div>
                   ))}
                </div>
                
                <button className="w-full mt-2 py-2 bg-[#fbbf24] text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#fbbf24]/20">
                   Claim Rewards
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-surface-brighter z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className={cn("w-8 h-8 rounded flex items-center justify-center transition-all", academyMode ? "bg-[#fbbf24] shadow-[0_0_15px_rgba(251,191,36,0.4)]" : "bg-brand shadow-[0_0_15px_rgba(37,99,235,0.4)]")}>
              <div className="w-4 h-4 border-2 border-white rotate-45"></div>
            </div>
            <div className="absolute top-0 right-0 -mr-1 -mt-1 w-3 h-3 bg-red-500 rounded-full border-2 border-surface-brighter" />
          </div>
          
          <div className="flex flex-col">
            <h1 className="font-bold tracking-tight text-white uppercase text-sm leading-none mb-1">
              Ultimate <span className={cn("font-medium transition-colors", textBrandClass)}>Architect</span>
            </h1>
            <div className="flex items-center gap-2">
               <div className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] text-white/40 font-black uppercase tracking-widest">v2.4.0 stable</div>
               <div className="h-2 w-px bg-white/10" />
               {isEditingProjectName ? (
                 <input 
                   autoFocus
                   value={projectName}
                   onChange={(e) => setProjectName(e.target.value)}
                   onBlur={() => setIsEditingProjectName(false)}
                   onKeyDown={(e) => e.key === 'Enter' && setIsEditingProjectName(false)}
                   className="bg-brand/10 text-[10px] text-white font-bold uppercase tracking-widest focus:outline-none border-b border-brand w-32"
                 />
               ) : (
                 <button 
                   onClick={() => setIsEditingProjectName(true)}
                   className="text-[10px] text-white/60 font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1 group"
                 >
                   {projectName}
                   <Plus size={8} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                 </button>
               )}
            </div>
          </div>
          
          <div className="h-6 w-px bg-white/10 mx-2" />
          
          <div className="flex items-center gap-3">
             <span className={cn("text-[10px] font-black uppercase tracking-widest transition-colors", academyMode ? "text-[#fbbf24]" : "text-white/30")}>Academy Mode</span>
             <button 
               onClick={() => setAcademyMode(!academyMode)}
               className={cn(
                 "w-10 h-5 rounded-full p-1 transition-all duration-300 relative border",
                 academyMode ? "bg-[#fbbf24]/20 border-[#fbbf24]/50" : "bg-white/5 border-white/10"
               )}
             >
               <motion.div 
                 animate={{ x: academyMode ? 20 : 0 }}
                 className={cn("w-3 h-3 rounded-full shadow-lg", academyMode ? "bg-[#fbbf24]" : "bg-white/40")}
               />
             </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs opacity-60" title="Target execution environment Cluster-01 is online and reachable">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>cluster-01</span>
          </div>

          <div className="h-6 w-px bg-white/10" />

          <button 
            title="Open project template chooser (Shortcut: Ctrl+O / Cmd+O / Ctrl+0)"
            onClick={() => setShowWelcomeModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-brand/10 text-[#fbbf24] hover:text-white border border-[#fbbf24]/30 hover:border-brand/45 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all"
          >
            <FolderOpen size={12} className="animate-pulse" />
            Open (Ctrl+O)
          </button>

          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all"
          >
            Save
          </button>

          <button 
            onClick={() => setShowToR(true)}
            className="flex items-center gap-2 px-4 py-1.5 bg-brand/10 hover:bg-brand/20 text-brand border border-brand/30 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all"
          >
            <FileText size={14} className="animate-pulse" />
            ToR
          </button>

          <button 
            title="Validate current architecture configuration"
            onClick={handleValidate}
            disabled={isValidating}
            className={cn(
              "flex items-center gap-2 px-5 py-2 text-white text-xs font-semibold shadow-lg rounded-md transition-all active:scale-95 disabled:opacity-50",
              brandClass,
              !academyMode && "shadow-brand/20",
              academyMode && "shadow-[#fbbf24]/20",
              isValidating && "animate-pulse"
            )}
          >
            Validate
            <CheckCircle2 size={12} strokeWidth={2.5} />
          </button>


        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className={cn(
          "w-64 border-r border-white/10 bg-surface-brighter/50 flex flex-col transition-all duration-700",
          isSimulationMode && "opacity-20 pointer-events-none grayscale blur-[1px]"
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
                  <RefreshCw size={10} />
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
                <ChevronDown size={12} className={cn("transition-transform duration-200", !expandedCategories.includes('Cloud Platforms') && "-rotate-90")} />
              </button>

              <AnimatePresence>
                {expandedCategories.includes('Cloud Platforms') && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-1"
                  >
                    {cloudProviders.map(provider => (
                      <div key={provider} className="mb-2">
                        <button 
                          onClick={() => toggleCategory(provider)}
                          className="w-full flex items-center justify-between text-[11px] font-bold text-white/60 uppercase tracking-wider py-2 hover:text-white transition-colors group pl-2"
                        >
                          <span className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-brand rounded-full" />
                            {provider}
                          </span>
                          <ChevronDown size={12} className={cn("transition-transform duration-200", !expandedCategories.includes(provider) && "-rotate-90")} />
                        </button>
                        
                        <AnimatePresence>
                          {expandedCategories.includes(provider) && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden space-y-1.5 ml-5"
                            >
                              {categories[provider]?.map((node) => (
                                <div
                                  key={node.id}
                                  draggable
                                  title={`Drag to add ${node.name}: ${node.description}`}
                                  onDragStart={(e) => onDragStart(e, 'architectureNode', node.id)}
                                  className="p-2 bg-surface-card border border-white/10 rounded flex items-center gap-3 cursor-grab hover:border-brand/40 transition-colors group"
                                >
                                  <div className={cn(
                                    "w-5 h-5 rounded flex items-center justify-center font-bold text-[8px]",
                                    node.category === 'Google Cloud Platform' ? "bg-blue-500/20 text-blue-400" :
                                    node.category === 'AWS' ? "bg-orange-500/20 text-orange-400" :
                                    node.category === 'Microsoft Azure' ? "bg-sky-500/20 text-sky-400" :
                                    "bg-slate-500/20 text-slate-400"
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
            {[...onPremCategories, ...openSourceCategories, 'Search & Discovery', 'Network Boundaries'].map((category) => (
              <div key={category} className="px-4 py-3 border-b border-white/5">
                <button 
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between text-[11px] font-bold text-white/40 uppercase tracking-wider mb-3 hover:text-white/60 transition-colors group"
                >
                  {category}
                  <ChevronDown size={12} className={cn("transition-transform duration-200", !expandedCategories.includes(category) && "-rotate-90")} />
                </button>
                
                <AnimatePresence>
                  {expandedCategories.includes(category) && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-2"
                    >
                      {categories[category]?.map((node) => (
                        <div
                          key={node.id}
                          draggable
                          title={`Drag to add ${node.name}: ${node.description}`}
                          onDragStart={(e) => onDragStart(e, category === 'Network Boundaries' ? 'boundaryNode' : 'architectureNode', node.id)}
                          className="p-2 bg-surface-card border border-white/10 rounded flex items-center gap-3 cursor-grab hover:border-brand/40 transition-colors group"
                        >
                          <div className={cn(
                            "w-6 h-6 rounded flex items-center justify-center font-bold text-[10px]",
                            node.type === 'on-premise' ? "bg-slate-500/10 text-slate-400" : 
                            node.type === 'boundary' ? "bg-violet-500/15 text-violet-400 border border-violet-500/10" :
                            "bg-emerald-500/10 text-emerald-500"
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

        {/* Canvas Area */}
        <div className="flex-1 relative bg-[#080b10]" ref={reactFlowWrapper}>
          {/* Glassmorphism Header Bar */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[95%] h-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-full z-20 flex items-center justify-between px-6 shadow-2xl">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center text-brand">
                  <DollarSign size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-white/40 uppercase font-black tracking-widest leading-none">FinOps Tracker</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#10b981] shadow-[#10b981]/20 drop-shadow-sm">
                      $<motion.span
                        key={estimatedCost}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block"
                      >
                        {estimatedCost.toFixed(2)}
                      </motion.span>/mo
                    </span>
                    <div className="flex items-center text-[9px] text-emerald-500 font-bold">
                       <Activity size={10} className="mr-1" /> LIVE
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="h-6 w-px bg-white/10" />

              <div className="flex items-center gap-3">
                <label className="text-[9px] text-white/40 uppercase font-black tracking-widest cursor-pointer select-none" htmlFor="sim-mode">Data Flow Simulation</label>
                <button 
                  id="sim-mode"
                  onClick={() => setIsSimulationMode(!isSimulationMode)}
                  className={cn(
                    "w-10 h-5 rounded-full p-1 transition-all duration-300 relative",
                    isSimulationMode ? "bg-emerald-500" : "bg-white/10"
                  )}
                >
                  <motion.div 
                    animate={{ x: isSimulationMode ? 20 : 0 }}
                    className="w-3 h-3 bg-white rounded-full shadow-lg"
                  />
                </button>
              </div>

              <div className="h-6 w-px bg-white/10" />

              {/* Connection Type Selektor */}
              <div className="flex items-center gap-3">
                <span className="text-[9px] text-white/40 uppercase font-black tracking-widest leading-none select-none">Connection Tool</span>
                <div className="flex bg-white/5 border border-white/10 rounded-full p-0.5">
                  <button 
                    onClick={() => setConnectionType('default')}
                    className={cn(
                      "px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded-full transition-all", 
                      connectionType === 'default' ? (academyMode ? "bg-[#fbbf24] text-black" : "bg-brand text-white") : "text-white/40 hover:text-white"
                    )}
                  >
                    Standard
                  </button>
                  <button 
                    onClick={() => setConnectionType('replication')}
                    className={cn(
                      "px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded-full transition-all flex items-center gap-1", 
                      connectionType === 'replication' ? "bg-orange-500 text-black shadow-lg" : "text-white/40 hover:text-white"
                    )}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-200 inline-block animate-ping animate-duration-1000" />
                    Replication Sync
                  </button>
                </div>
              </div>

              <div className="h-6 w-px bg-white/10" />

              {/* Failover Switch */}
              <div className="flex items-center gap-3">
                <label className="text-[9px] text-white/40 uppercase font-black tracking-widest cursor-pointer select-none" htmlFor="failover-mode">Simulate Failover</label>
                <button 
                  id="failover-mode"
                  onClick={() => setIsFailoverActive(!isFailoverActive)}
                  className={cn(
                    "w-10 h-5 rounded-full p-1 transition-all duration-300 relative",
                    isFailoverActive ? "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)] animate-pulse" : "bg-white/10"
                  )}
                  title="Simulate primary zone failure & standby replication routing"
                >
                  <motion.div 
                    animate={{ x: isFailoverActive ? 20 : 0 }}
                    className="w-3 h-3 bg-white rounded-full shadow-lg"
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-[10px] text-white/40 font-mono italic">
                {nodes.length} Nodes Synchronized
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 transition-colors cursor-help">
                <Info size={14} />
              </div>
            </div>
          </div>

          {/* Version History Slider */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[60%] z-20 px-6 py-3 bg-surface-brighter/90 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest shrink-0">
               <History size={12} />
               Version History
            </div>
            <div className="flex-1 flex items-center gap-4">
               <input 
                 type="range" 
                 min="1" 
                 max="10" 
                 value={currentVersion} 
                 onChange={(e) => setCurrentVersion(parseInt(e.target.value))}
                 className="flex-1 accent-brand h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
               />
               <div className="text-[10px] font-mono text-brand font-bold bg-brand/10 px-2 py-0.5 rounded border border-brand/20">
                 v{currentVersion}.0.0-{currentVersion > 5 ? 'STABLE' : 'ALPHA'}
               </div>
            </div>
          </div>



          <div className="absolute top-20 left-6 z-10 flex flex-col gap-2">
            <button 
              onClick={() => reactFlowInstance?.zoomIn()}
              title="Zoom In"
              className="w-10 h-10 bg-surface-brighter border border-white/10 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all shadow-xl"
            >
              <Plus size={18} />
            </button>
            <button 
              onClick={() => reactFlowInstance?.zoomOut()}
              title="Zoom Out"
              className="w-10 h-10 bg-surface-brighter border border-white/10 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all shadow-xl"
            >
              <div className="w-4 h-0.5 bg-current rounded-full" />
            </button>
            <button 
              onClick={() => reactFlowInstance?.fitView()}
              title="Fit View"
              className="w-10 h-10 bg-surface-brighter border border-white/10 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all shadow-xl"
            >
              <Maximize2 size={16} />
            </button>
            <div className="h-px w-full bg-white/5 my-1" />
            <button 
              onClick={() => {
                if (window.confirm('Are you sure you want to clear the canvas?')) {
                  setNodes([]);
                  setEdges([]);
                }
              }}
              title="Clear Canvas"
              className="w-10 h-10 bg-surface-brighter border border-white/10 rounded-lg flex items-center justify-center text-red-400/40 hover:text-red-400 hover:bg-red-400/5 transition-all shadow-xl"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onNodeDragStart={onNodeDragStart}
            onNodeDrag={onNodeDrag}
            onNodeDragStop={onNodeDragStop}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            fitView
          >
            <Background color="#fff" gap={24} size={1} />
            <Controls />
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-6 z-10">
              <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-widest font-bold">
                <div className="w-4 h-0.5 border-t-2 border-dashed border-brand" />
                Cloud Connection
              </div>
              <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-widest font-bold">
                <div className="w-4 h-0.5 border-t-2 border-slate-500" />
                On-Prem Connection
              </div>
            </div>
          </ReactFlow>

          {/* AI Copilot Floating Button */}
          <div className="absolute bottom-16 right-6 z-30 flex flex-col items-end gap-4">
            <AnimatePresence>
              {showAICopilot && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="w-72 bg-surface-brighter border border-white/10 rounded-xl shadow-2xl overflow-hidden mb-2"
                >
                  <div className="p-4 border-b border-white/5 bg-brand/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Sparkles size={16} className="text-brand" />
                       <span className="text-xs font-bold text-white uppercase tracking-wider">AI Copilot Analysis</span>
                    </div>
                    <button onClick={() => setShowAICopilot(false)} className="text-white/20 hover:text-white">
                       <RefreshCw size={12} className="rotate-45" />
                    </button>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5 space-y-2">
                       <div className="text-[10px] font-bold text-emerald-500 uppercase">Recommendation #1</div>
                       <p className="text-[11px] text-slate-300 leading-relaxed italic">
                         "Detected high latency path between GCP Pub/Sub and On-Prem PostgreSQL. Consider utilizing **Cloud Dataflow** for streaming aggregation to reduce bandwidth costs."
                       </p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5 space-y-2">
                       <div className="text-[10px] font-bold text-emerald-500 uppercase">Recommendation #2</div>
                       <p className="text-[11px] text-slate-300 leading-relaxed italic">
                         "Redshift cluster is currently over-provisioned for the current workload. Switching to **ra3.xlplus** could save $120/mo."
                       </p>
                    </div>
                    <button className="w-full py-2 bg-brand/10 hover:bg-brand/20 border border-brand/20 text-brand text-[10px] font-bold uppercase tracking-widest rounded transition-all">
                       Apply Optimizations
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              onClick={() => setShowAICopilot(!showAICopilot)}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90",
                showAICopilot ? "bg-surface-brighter text-brand border border-brand/50" : "bg-brand text-white"
              )}
              title="AI Copilot Recommendations"
            >
              <Sparkles size={20} className={cn(showAICopilot && "animate-pulse")} />
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <aside className="w-80 border-l border-white/10 bg-surface-brighter flex flex-col">
          <div className="flex border-b border-white/10 shrink-0">
            <button 
              onClick={() => setActiveTab('config')}
              className={cn(
                "flex-1 py-3 text-xs font-bold transition-all border-b-2",
                activeTab === 'config' ? (academyMode ? "border-[#fbbf24] text-white" : "border-brand text-white") : "border-transparent text-white/40 hover:text-white/60"
              )}
            >
              Config
            </button>
            <button 
              onClick={() => setActiveTab('script')}
              className={cn(
                "flex-1 py-3 text-xs font-bold transition-all border-b-2",
                activeTab === 'script' ? (academyMode ? "border-[#fbbf24] text-white" : "border-brand text-white") : "border-transparent text-white/40 hover:text-white/60"
              )}
            >
              Script
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {activeTab === 'config' ? (
              <div className="p-5 space-y-6">
                {selectedNode ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-[10px] uppercase text-white/40 font-bold mb-3 tracking-widest">Entity Configuration</label>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1">
                             <div className={cn("w-1.5 h-1.5 rounded-full transition-colors", brandClass)} />
                             <input 
                               value={selectedNode.data.label}
                               onChange={(e) => updateNodeLabel(selectedNode.id, e.target.value)}
                               className={cn("bg-transparent border-none text-[11px] font-bold text-white uppercase tracking-wider focus:outline-none focus:ring-1 rounded px-1 w-full", academyMode ? "focus:ring-[#fbbf24]/30" : "focus:ring-brand/30")}
                             />
                          </div>
                          <button 
                            onClick={() => deleteNode(selectedNode.id)}
                            className="text-white/20 hover:text-red-500 transition-colors ml-2"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div>
                          <div className="text-[11px] mb-1.5 opacity-60">Status</div>
                          <div className="flex gap-2">
                             <button 
                               onClick={() => toggleNodeActive(selectedNode.id)}
                               className={cn(
                                 "flex-1 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider border transition-all",
                                 selectedNode.data.isDisabled ? "bg-white/5 border-white/10 text-white/40" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                               )}
                             >
                               {selectedNode.data.isDisabled ? "Disabled" : "Active"}
                             </button>
                             <button 
                               onClick={() => toggleNodeActive(selectedNode.id)}
                               className={cn(
                                 "px-3 py-1.5 rounded border transition-all",
                                 selectedNode.data.isDisabled ? "bg-emerald-500 hover:bg-emerald-600 text-white border-transparent" : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                               )}
                             >
                               <Power size={12} />
                             </button>
                          </div>
                        </div>

                        {selectedNode.type === 'boundaryNode' ? (
                          <>
                            {/* Disaster Recovery (DR) role configuration */}
                            <div>
                              <div className="text-[11px] mb-1.5 opacity-60">Simulated DR Role</div>
                              <select 
                                value={selectedNode.data.role || 'none'}
                                onChange={(e) => updateNodeData(selectedNode.id, 'role', e.target.value)}
                                className="w-full bg-surface-card border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-brand/50 transition-colors appearance-none"
                              >
                                <option value="none">Standard Boundary Area</option>
                                <option value="primary">Primary Zone (Fails under Failover)</option>
                                <option value="dr">DR Zone (Active Recovery Zone)</option>
                              </select>
                            </div>

                            {/* Boundary height/width controls */}
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <div className="text-[11px] mb-1.5 opacity-60">Width (px)</div>
                                <input 
                                  type="number"
                                  value={selectedNode.data.width || 480}
                                  onChange={(e) => updateNodeData(selectedNode.id, 'width', parseInt(e.target.value) || 480)}
                                  className="w-full bg-surface-card border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand/50"
                                />
                              </div>
                              <div>
                                <div className="text-[11px] mb-1.5 opacity-60">Height (px)</div>
                                <input 
                                  type="number"
                                  value={selectedNode.data.height || 340}
                                  onChange={(e) => updateNodeData(selectedNode.id, 'height', parseInt(e.target.value) || 340)}
                                  className="w-full bg-surface-card border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand/50"
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <div className="text-[11px] mb-1.5 opacity-60">Memory Limit</div>
                              <select 
                                title="Resource limit for this node"
                                className="w-full bg-surface-card border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-brand/50 transition-colors appearance-none"
                              >
                                <option>512MB</option>
                                <option>1Gi (Recommended)</option>
                                <option>2Gi</option>
                                <option>4Gi</option>
                              </select>
                            </div>

                            {selectedNode.data.type === 'cloud' ? (
                              <div>
                                <div className="text-[11px] mb-1.5 opacity-60" title="Geographic location of the cloud resource">Cloud Region</div>
                                <select className="w-full bg-surface-card border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-brand/50 transition-colors appearance-none">
                                  <option>us-central1 (Iowa)</option>
                                  <option>europe-west1 (Belgium)</option>
                                  <option>asia-southeast1 (Singapore)</option>
                                  <option>australia-southeast1 (Sydney)</option>
                                </select>
                              </div>
                            ) : (
                              <div>
                                <div className="text-[11px] mb-1.5 opacity-60" title="Physical network segment for on-premise components">Environment VLAN</div>
                                <select className="w-full bg-surface-card border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-brand/50 transition-colors appearance-none">
                                  <option>VLAN-100 (DMZ)</option>
                                  <option>VLAN-200 (Internal)</option>
                                  <option>VLAN-300 (Database)</option>
                                  <option>VLAN-400 (Management)</option>
                                </select>
                              </div>
                            )}
                          </>
                        )}

                        {selectedNode.data.type === 'on-premise' && (
                          <div>
                             <div className="text-[11px] mb-1.5 opacity-60" title="IP Address of the bare metal or local server">Server IP / Hostname</div>
                             <input type="text" defaultValue="192.168.1.10" className="w-full bg-surface-card border border-white/10 rounded px-3 py-2 text-xs text-shite focus:outline-none focus:border-brand/50 transition-colors" />
                          </div>
                        )}

                        {selectedNode.data.templateId === 'edge-vision' && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-4 pt-4 border-t border-white/5"
                          >
                             <div className="text-[10px] uppercase text-white/40 font-bold mb-1 tracking-widest">Vision Simulation</div>
                             <div className="relative aspect-video bg-black rounded-lg border border-white/10 overflow-hidden group/vision">
                               <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10" />
                               {/* Simulated video feed with bounding boxes */}
                               <div className="absolute inset-0 flex flex-col p-2">
                                  <div className="text-[8px] font-mono text-emerald-400">FEED_01: RUNNING</div>
                                  <motion.div 
                                    animate={{ 
                                      x: [20, 100, 40, 120, 20],
                                      y: [30, 10, 50, 20, 30]
                                    }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    className="w-16 h-12 border-2 border-emerald-500 rounded relative"
                                  >
                                    <div className="absolute -top-3 left-0 bg-emerald-500 text-[6px] px-1 font-bold text-black uppercase">Person 98%</div>
                                  </motion.div>
                                  <motion.div 
                                    animate={{ 
                                      x: [120, 40, 100, 20, 120],
                                      y: [10, 40, 20, 50, 10]
                                    }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="w-12 h-10 border-2 border-amber-500 rounded relative"
                                  >
                                    <div className="absolute -top-3 left-0 bg-amber-500 text-[6px] px-1 font-bold text-black uppercase">Package 82%</div>
                                  </motion.div>
                               </div>
                               <Camera size={14} className="absolute bottom-2 right-2 text-white/20 group-hover/vision:text-white/60 transition-colors" />
                             </div>

                             <div className="space-y-3">
                                <div>
                                   <div className="flex justify-between mb-1">
                                      <span className="text-[10px] text-white/40 uppercase font-black">Confidence Threshold</span>
                                      <span className={cn("text-[10px] font-bold", textBrandClass)}>85%</span>
                                   </div>
                                   <input type="range" className={cn("w-full h-1 bg-white/5 rounded-full appearance-none", academyMode ? "accent-[#fbbf24]" : "accent-brand")} defaultValue={85} />
                                </div>
                                <div>
                                   <div className="text-[11px] mb-1.5 opacity-60">Inference Engine</div>
                                   <select className={cn("w-full bg-surface-card border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none transition-colors appearance-none", academyMode ? "focus:border-[#fbbf24]/50" : "focus:border-brand/50")}>
                                     <option>TensorRT (Optimized)</option>
                                     <option>OpenVINO</option>
                                     <option>Edge TPU</option>
                                   </select>
                                </div>
                             </div>
                          </motion.div>
                        )}

                        {selectedNode.data.templateId?.startsWith('gcp-') && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-4 pt-4 border-t border-white/5"
                          >
                            <div>
                              <div className="text-[11px] mb-1.5 opacity-60">GCP Project ID</div>
                              <input type="text" defaultValue="my-gcp-project-123" className="w-full bg-surface-card border border-white/10 rounded px-3 py-2 text-xs text-shite focus:outline-none focus:border-brand/50 transition-colors" />
                            </div>
                            {selectedNode.data.templateId === 'gcp-bq' && (
                              <div>
                                <div className="text-[11px] mb-1.5 opacity-60">Dataset Expiration</div>
                                <input type="number" defaultValue="3600" className="w-full bg-surface-card border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-brand/50 transition-colors" />
                              </div>
                            )}
                            {selectedNode.data.templateId === 'gcp-functions' && (
                              <div>
                                <div className="text-[11px] mb-1.5 opacity-60">Runtime</div>
                                <select className="w-full bg-surface-card border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-brand/50 transition-colors appearance-none">
                                  <option>Node.js 20</option>
                                  <option>Python 3.11</option>
                                  <option>Go 1.21</option>
                                </select>
                              </div>
                            )}
                          </motion.div>
                        )}

                        <div className="pt-4 border-t border-white/5">
                           <div className="text-[10px] uppercase text-white/40 font-bold mb-2 tracking-widest">Access Policy (IAM)</div>
                           <div className="p-3 bg-brand/5 border border-brand/20 rounded">
                             <div className="flex items-start gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5"></div>
                               <div className="text-[11px] text-blue-100/70 italic leading-relaxed">
                                  Validating connections... All required policies found for {selectedNode.data.label} bridge.
                               </div>
                             </div>
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                      <label className="block text-[10px] uppercase text-white/40 font-bold mb-2 tracking-widest">Infrastructure Snapshot</label>
                      <div className={cn("bg-surface rounded p-3 font-mono text-[10px] leading-relaxed border border-white/5 overflow-hidden", academyMode ? "text-[#fbbf24]/80" : "text-brand/80")}>
                        <span className="text-purple-400">resource</span> "infra_node" "{selectedNode.id.replace(/-/g, '_')}" {'{'}<br/>
                        &nbsp;&nbsp;type = <span className="text-green-400">"{selectedNode.data.type}"</span><br/>
                        &nbsp;&nbsp;name = <span className="text-green-400">"{selectedNode.data.label}"</span><br/>
                        {'}'}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-center opacity-30">
                    <Settings id="settings-icon" size={32} className="mb-4 text-white animate-spin-slow" />
                    <p className="text-[11px] text-white max-w-[180px] uppercase font-bold tracking-widest leading-loose">Select a point in the mesh to synchronize node data</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative h-full font-mono text-[11px] leading-relaxed flex flex-col">
                <div className="p-4 bg-surface-brighter border-b border-white/10 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-brand" />
                    <span className="text-white/60 font-bold uppercase tracking-wider text-[10px]" title="Terraform Main Configuration Stack">main-stack.tf</span>
                  </div>
                  <button className="text-white/40 hover:text-white transition-colors" title="Copy configuration to clipboard">
                    <Code size={14} />
                  </button>
                </div>
                <div className="flex-1 p-6 overflow-auto bg-surface selection:bg-brand/30 scrollbar-thin">
                  <pre className="text-brand/90">
                    <code>{generatedScript}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </aside>
      </main>

      {/* Footer Status Bar */}
      <footer className="h-8 border-t border-white/10 bg-surface-brighter px-6 flex items-center justify-between shrink-0">
        <div className="flex gap-6">
          <div className="flex items-center gap-2 text-[10px] opacity-50 font-mono" title="Line:Column position indicator">
            <span className="text-brand">L{nodes.length}:C{edges.length}</span> | UTF-8 | TypeScript
          </div>
          <div className="flex items-center gap-2 text-[10px] opacity-50 uppercase tracking-widest font-bold cursor-help" title="Data persistence and transient communication is encrypted via AES-256 standards">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
             System Secure: AES-256 Enabled
          </div>
        </div>
        <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]" title="Platform Revision Information">Arch. v2.4.0 Deployment Hub</div>
      </footer>
    </div>
  );
}
