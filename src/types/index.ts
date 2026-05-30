import type { ElementType } from 'react';

export type NodeType = 'cloud' | 'on-premise' | 'open-source' | 'boundary';

export interface NodeTemplate {
  id: string;
  name: string;
  type: NodeType;
  icon: ElementType;
  category: string;
  description: string;
}

export interface ValidationResult {
  status: 'success' | 'warning' | 'error';
  message: string;
  issues?: ValidationIssue[];
}

export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  nodeId?: string;
  message: string;
}

export type TemplateType =
  | 'blank'
  | 'kafka'
  | 'airflow'
  | 'complex'
  | 'gcp-enterprise'
  | 'gcp-ml-pipeline'
  | 'gcp-event-driven'
  | 'gcp-data-lakehouse'
  | 'gcp-multi-region-dr'
  | 'aws-analytics'
  | 'azure-data-factory'
  | 'hybrid-cloud';

export interface ProjectData {
  version: string;
  name: string;
  nodes: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
    data: Record<string, any>;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    type?: string;
    animated?: boolean;
    style?: Record<string, any>;
    markerEnd?: Record<string, any>;
    data?: Record<string, any>;
  }>;
  savedAt: string;
}
