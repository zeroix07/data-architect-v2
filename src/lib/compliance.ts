import { useMemo } from 'react';
import { AlertTriangle, ShieldCheck, ShieldAlert, Zap, DollarSign } from 'lucide-react';
import type { Node, Edge } from 'reactflow';

export interface ComplianceRule {
  id: string;
  name: string;
  category: 'security' | 'cost' | 'performance' | 'reliability';
  severity: 'error' | 'warning' | 'info';
  check: (nodes: Node[], edges: Edge[]) => ComplianceIssue[];
}

export interface ComplianceIssue {
  ruleId: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  nodeId?: string;
  suggestion?: string;
}

const rules: ComplianceRule[] = [
  {
    id: 'no-connections',
    name: 'Orphan Nodes',
    category: 'reliability',
    severity: 'warning',
    check: (nodes, edges) => {
      const connected = new Set(edges.flatMap((e) => [e.source, e.target]));
      return nodes
        .filter((n) => n.type === 'architectureNode' && !connected.has(n.id))
        .map((n) => ({
          ruleId: 'no-connections',
          severity: 'warning' as const,
          message: `"${n.data.label}" has no connections`,
          nodeId: n.id,
          suggestion: 'Connect this node to other components or remove it',
        }));
    },
  },
  {
    id: 'circular-deps',
    name: 'Circular Dependencies',
    category: 'performance',
    severity: 'error',
    check: (nodes, edges) => {
      const adj = new Map<string, string[]>();
      edges.forEach((e) => { if (!adj.has(e.source)) adj.set(e.source, []); adj.get(e.source)!.push(e.target); });
      const visited = new Set<string>();
      const inStack = new Set<string>();
      const issues: ComplianceIssue[] = [];
      const dfs = (id: string) => {
        if (inStack.has(id)) {
          const node = nodes.find((n) => n.id === id);
          issues.push({
            ruleId: 'circular-deps',
            severity: 'error',
            message: `Circular dependency involving "${node?.data.label || id}"`,
            nodeId: id,
            suggestion: 'Break the cycle by removing one connection',
          });
          return;
        }
        if (visited.has(id)) return;
        visited.add(id);
        inStack.add(id);
        (adj.get(id) || []).forEach(dfs);
        inStack.delete(id);
      };
      nodes.forEach((n) => { if (!visited.has(n.id)) dfs(n.id); });
      return issues;
    },
  },
  {
    id: 'empty-boundary',
    name: 'Empty Boundary Zones',
    category: 'reliability',
    severity: 'info',
    check: (nodes, edges) => {
      return nodes
        .filter((n) => n.type === 'boundaryNode')
        .filter((b) => {
          const pw = b.data.width || 460;
          const ph = b.data.height || 320;
          return !nodes.some((n) =>
            n.type === 'architectureNode' &&
            n.position.x >= b.position.x && n.position.x <= b.position.x + pw &&
            n.position.y >= b.position.y && n.position.y <= b.position.y + ph
          );
        })
        .map((b) => ({
          ruleId: 'empty-boundary',
          severity: 'info' as const,
          message: `Boundary "${b.data.label}" is empty`,
          nodeId: b.id,
          suggestion: 'Add nodes inside this boundary or remove it',
        }));
    },
  },
  {
    id: 'high-cost',
    name: 'Budget Threshold',
    category: 'cost',
    severity: 'warning',
    check: (nodes, edges) => {
      const COST_MAP: Record<string, number> = {
        'gcp-bq': 52, 'gcp-gcs': 23, 'gcp-pubsub': 30, 'gcp-dataflow': 78,
        'gcp-compute': 45, 'gcp-gke': 65, 'gcp-functions': 18, 'gcp-sql': 55,
        'gcp-composer': 85, 'gcp-spanner': 120, 'gcp-looker': 40, 'gcp-vertex': 95,
        'aws-s3': 21, 'aws-ec2': 42, 'aws-rds': 50, 'aws-lambda': 15,
        'aws-dynamodb': 35, 'aws-redshift': 90,
        'azure-blob': 20, 'azure-vm': 40, 'azure-sql': 48, 'azure-functions': 16, 'azure-cosmos': 55,
      };
      const total = nodes.reduce((acc, n) => {
        if (n.data.isDisabled) return acc;
        return acc + (COST_MAP[n.data.templateId] || (n.data.type === 'cloud' ? 45 : 12));
      }, 0);
      if (total > 500) {
        return [{
          ruleId: 'high-cost',
          severity: 'warning' as const,
          message: `Monthly cost $${total.toFixed(2)} exceeds $500 budget`,
          suggestion: 'Review cloud services or disable unused nodes',
        }];
      }
      return [];
    },
  },
  {
    id: 'redundant-storage',
    name: 'Redundant Storage',
    category: 'cost',
    severity: 'info',
    check: (nodes, edges) => {
      const hasBigQuery = nodes.some((n) => n.data.templateId === 'gcp-bq' && !n.data.isDisabled);
      const hasRedshift = nodes.some((n) => n.data.templateId === 'aws-redshift' && !n.data.isDisabled);
      if (hasBigQuery && hasRedshift) {
        return [{
          ruleId: 'redundant-storage',
          severity: 'info' as const,
          message: 'Both BigQuery and Redshift detected — potential cost overlap',
          suggestion: 'Consider using one data warehouse to reduce costs',
        }];
      }
      return [];
    },
  },
  {
    id: 'multi-region-single-db',
    name: 'Single Region Database',
    category: 'reliability',
    severity: 'warning',
    check: (nodes, edges) => {
      const boundaries = nodes.filter((n) => n.type === 'boundaryNode');
      const dbs = nodes.filter((n) =>
        n.data.templateId?.includes('sql') || n.data.templateId?.includes('spanner')
      );
      if (boundaries.length >= 2 && dbs.length > 0) {
        const singleRegionDbs = dbs.filter((db) => {
          const inBoundaries = boundaries.filter((b) => {
            const pw = b.data.width || 460;
            const ph = b.data.height || 320;
            return db.position.x >= b.position.x && db.position.x <= b.position.x + pw &&
                   db.position.y >= b.position.y && db.position.y <= b.position.y + ph;
          });
          return inBoundaries.length <= 1;
        });
        return singleRegionDbs.map((db) => ({
          ruleId: 'multi-region-single-db',
          severity: 'warning' as const,
          message: `"${db.data.label}" is in a single region — no failover`,
          nodeId: db.id,
          suggestion: 'Add a replica in another region for disaster recovery',
        }));
      }
      return [];
    },
  },
];

export function useCompliance(nodes: Node[], edges: Edge[]) {
  return useMemo(() => {
    const issues: ComplianceIssue[] = [];
    rules.forEach((rule) => {
      issues.push(...rule.check(nodes, edges));
    });
    return issues;
  }, [nodes, edges]);
}

export function getComplianceStats(issues: ComplianceIssue[]) {
  return {
    errors: issues.filter((i) => i.severity === 'error').length,
    warnings: issues.filter((i) => i.severity === 'warning').length,
    info: issues.filter((i) => i.severity === 'info').length,
    total: issues.length,
  };
}
