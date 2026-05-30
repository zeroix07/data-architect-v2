import {
  Database,
  Cpu,
  Server,
  HardDrive,
  Box,
  Layers,
  Workflow,
  Terminal,
  Activity,
  Globe,
  BarChart3,
  Eye,
  ShieldCheck,
  Zap,
  Sparkles,
  Search,
} from 'lucide-react';
import type { NodeTemplate } from '@/types';

export const NODE_TEMPLATES: NodeTemplate[] = [
  // Google Cloud Platform
  { id: 'gcp-bq', name: 'BigQuery', type: 'cloud', icon: Database, category: 'Google Cloud Platform', description: 'Serverless data warehouse' },
  { id: 'gcp-gcs', name: 'Cloud Storage', type: 'cloud', icon: HardDrive, category: 'Google Cloud Platform', description: 'Object storage' },
  { id: 'gcp-pubsub', name: 'Pub/Sub', type: 'cloud', icon: Activity, category: 'Google Cloud Platform', description: 'Messaging service' },
  { id: 'gcp-dataflow', name: 'Dataflow', type: 'cloud', icon: Workflow, category: 'Google Cloud Platform', description: 'Stream/batch processing' },
  { id: 'gcp-compute', name: 'Compute Engine', type: 'cloud', icon: Cpu, category: 'Google Cloud Platform', description: 'Virtual machines' },
  { id: 'gcp-gke', name: 'Kubernetes Engine', type: 'cloud', icon: Box, category: 'Google Cloud Platform', description: 'Managed Kubernetes' },
  { id: 'gcp-functions', name: 'Cloud Functions', type: 'cloud', icon: Terminal, category: 'Google Cloud Platform', description: 'Serverless functions' },
  { id: 'gcp-sql', name: 'Cloud SQL', type: 'cloud', icon: Database, category: 'Google Cloud Platform', description: 'Managed MySQL/PostgreSQL' },
  { id: 'gcp-composer', name: 'Cloud Composer', type: 'cloud', icon: Layers, category: 'Google Cloud Platform', description: 'Managed Airflow' },
  { id: 'gcp-spanner', name: 'Cloud Spanner', type: 'cloud', icon: Database, category: 'Google Cloud Platform', description: 'Global SQL database' },
  { id: 'gcp-looker', name: 'Looker', type: 'cloud', icon: BarChart3, category: 'Google Cloud Platform', description: 'BI & Analytics' },
  { id: 'gcp-vertex', name: 'Vertex AI', type: 'cloud', icon: Sparkles, category: 'Google Cloud Platform', description: 'ML Platform' },

  // AWS
  { id: 'aws-s3', name: 'S3', type: 'cloud', icon: HardDrive, category: 'AWS', description: 'Object storage' },
  { id: 'aws-ec2', name: 'EC2', type: 'cloud', icon: Cpu, category: 'AWS', description: 'Virtual servers' },
  { id: 'aws-rds', name: 'RDS', type: 'cloud', icon: Database, category: 'AWS', description: 'Relational database' },
  { id: 'aws-lambda', name: 'Lambda', type: 'cloud', icon: Terminal, category: 'AWS', description: 'Serverless compute' },
  { id: 'aws-dynamodb', name: 'DynamoDB', type: 'cloud', icon: Database, category: 'AWS', description: 'NoSQL database' },
  { id: 'aws-redshift', name: 'Redshift', type: 'cloud', icon: Layers, category: 'AWS', description: 'Data warehouse' },

  // Microsoft Azure
  { id: 'azure-blob', name: 'Blob Storage', type: 'cloud', icon: HardDrive, category: 'Microsoft Azure', description: 'Object storage' },
  { id: 'azure-vm', name: 'Virtual Machines', type: 'cloud', icon: Cpu, category: 'Microsoft Azure', description: 'Scalable compute' },
  { id: 'azure-sql', name: 'SQL Database', type: 'cloud', icon: Database, category: 'Microsoft Azure', description: 'Managed SQL' },
  { id: 'azure-functions', name: 'Functions', type: 'cloud', icon: Terminal, category: 'Microsoft Azure', description: 'Serverless compute' },
  { id: 'azure-cosmos', name: 'Cosmos DB', type: 'cloud', icon: Database, category: 'Microsoft Azure', description: 'Multi-model database' },

  // Alibaba Cloud
  { id: 'ali-oss', name: 'OSS', type: 'cloud', icon: HardDrive, category: 'Alibaba Cloud', description: 'Object storage' },
  { id: 'ali-ecs', name: 'ECS', type: 'cloud', icon: Cpu, category: 'Alibaba Cloud', description: 'Elastic compute' },
  { id: 'ali-rds', name: 'RDS', type: 'cloud', icon: Database, category: 'Alibaba Cloud', description: 'Relational database' },
  { id: 'ali-sls', name: 'SLS', type: 'cloud', icon: Activity, category: 'Alibaba Cloud', description: 'Log service' },

  // Tencent Cloud
  { id: 'ten-cos', name: 'COS', type: 'cloud', icon: HardDrive, category: 'Tencent Cloud', description: 'Object storage' },
  { id: 'ten-cvm', name: 'CVM', type: 'cloud', icon: Cpu, category: 'Tencent Cloud', description: 'Virtual cloud servers' },
  { id: 'ten-cdb', name: 'CDB', type: 'cloud', icon: Database, category: 'Tencent Cloud', description: 'Relational database' },

  // Databases
  { id: 'db-mysql', name: 'MySQL', type: 'on-premise', icon: Database, category: 'Databases', description: 'Open-source relational database' },
  { id: 'db-postgres', name: 'PostgreSQL', type: 'on-premise', icon: Database, category: 'Databases', description: 'Advanced relational database' },
  { id: 'db-clickhouse', name: 'ClickHouse', type: 'open-source', icon: BarChart3, category: 'Databases', description: 'Columnar OLAP database' },
  { id: 'db-mongodb', name: 'MongoDB', type: 'on-premise', icon: Database, category: 'Databases', description: 'NoSQL document database' },
  { id: 'db-redis', name: 'Redis', type: 'open-source', icon: Activity, category: 'Databases', description: 'In-memory data store' },

  // On-Premise
  { id: 'bare-metal', name: 'Bare Metal', type: 'on-premise', icon: Server, category: 'On-Premise', description: 'Physical server hardware' },
  { id: 'hdfs', name: 'Hadoop/HDFS', type: 'on-premise', icon: Box, category: 'On-Premise', description: 'Distributed file system' },
  { id: 'local-db', name: 'Local DB', type: 'on-premise', icon: Database, category: 'On-Premise', description: 'SQL/NoSQL database' },

  // Open-Source Stack
  { id: 'kafka', name: 'Kafka', type: 'open-source', icon: Activity, category: 'Open-Source Stack', description: 'Streaming platform' },
  { id: 'polars', name: 'Polars', type: 'open-source', icon: Cpu, category: 'Open-Source Stack', description: 'Fast DataFrame library' },
  { id: 'airflow', name: 'Airflow', type: 'open-source', icon: Workflow, category: 'Open-Source Stack', description: 'Orchestration tool' },
  { id: 'docker', name: 'Docker', type: 'open-source', icon: Box, category: 'Open-Source Stack', description: 'Containerization' },
  { id: 'spark', name: 'Spark', type: 'open-source', icon: Layers, category: 'Open-Source Stack', description: 'Analytics engine' },

  // Edge AI & Audit
  { id: 'edge-vision', name: 'Vision Processing', type: 'on-premise', icon: Eye, category: 'Edge AI & Audit', description: 'Edge computer vision engine' },
  { id: 'edge-audit', name: 'Reconciliation Engine', type: 'on-premise', icon: ShieldCheck, category: 'Edge AI & Audit', description: 'Automated data audit & reconciliation' },
  { id: 'edge-iot', name: 'IoT Gateway', type: 'on-premise', icon: Zap, category: 'Edge AI & Audit', description: 'Real-time device ingestion' },

  // Search & Discovery
  { id: 'opensearch', name: 'OpenSearch', type: 'open-source', icon: Search, category: 'Search & Discovery', description: 'Distributed search and analytics suite' },
  { id: 'typesense', name: 'Typesense', type: 'open-source', icon: Search, category: 'Search & Discovery', description: 'Fast, typo-tolerant search engine' },

  // Network Boundaries
  { id: 'vpc-zone', name: 'VPC Zone', type: 'boundary', icon: Box, category: 'Network Boundaries', description: 'Isolated virtual network zone' },
  { id: 'region-box', name: 'Region Box', type: 'boundary', icon: Globe, category: 'Network Boundaries', description: 'Geographical region zone' },
];

export const CLOUD_PROVIDERS = ['Google Cloud Platform', 'AWS', 'Microsoft Azure', 'Alibaba Cloud', 'Tencent Cloud'];
export const ON_PREM_CATEGORIES = ['On-Premise', 'Databases', 'Edge AI & Audit'];
export const OPEN_SOURCE_CATEGORIES = ['Open-Source Stack'];
