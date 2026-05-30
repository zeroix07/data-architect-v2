import { memo, useState } from 'react';
import { BaseEdge, EdgeProps, getBezierPath, EdgeLabelRenderer } from 'reactflow';
import { cn } from '@/lib/utils';

const ConnectionEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  data,
  selected,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const label = data?.label || '';
  const edgeType = data?.edgeType || 'standard';

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className={cn(
              'px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border backdrop-blur-sm',
              edgeType === 'replication'
                ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                : 'bg-brand/10 border-brand/30 text-brand'
            )}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default memo(ConnectionEdge);
