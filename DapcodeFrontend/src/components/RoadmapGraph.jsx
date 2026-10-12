import React from 'react';
import { ROADMAP_NODES, ROADMAP_EDGES } from '../data/roadmapData';
import { useTheme } from '../context/ThemeContext';

export default function RoadmapGraph({
  problems = [],
  completedSlugs = new Set(),
  onSelectNode,
}) {
  const { isDark } = useTheme();

  const NODE_WIDTH = 180;
  const NODE_HEIGHT = 60;
  const CANVAS_WIDTH = 1480;
  const CANVAS_HEIGHT = 1150;

  // Node lookup map
  const nodeMap = new Map();
  ROADMAP_NODES.forEach((node) => {
    nodeMap.set(node.id, node);
  });

  // Calculate completion count per node
  const getNodeStats = (node) => {
    const topicProblems = problems.filter(
      (p) =>
        p.category?.toLowerCase() === node.name?.toLowerCase() ||
        p.category?.toLowerCase() === node.categoryKey?.toLowerCase()
    );
    const count = topicProblems.filter((p) => completedSlugs.has(p.slug)).length;
    const total = topicProblems.length || node.total || 1;
    const percent = Math.min(100, Math.round((count / total) * 100));
    return { count, total, percent };
  };

  const gridDotColor = isDark ? 'rgba(245, 242, 235, 0.05)' : 'rgba(28, 25, 23, 0.06)';
  const arrowColor = isDark ? '#6B6B6B' : '#9A9A9A';
  const edgeShadowColor = isDark ? '#333333' : '#F7F8FA';
  const edgeStrokeColor = isDark ? '#595959' : '#D1D1D1';

  return (
    <div className="relative w-full overflow-x-auto overflow-y-visible rounded-2xl border border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#FFFFFF] dark:bg-[#282828] p-6 transition-colors duration-150">
      {/* Subtle Dot Grid Background */}
      <div 
        className="relative mx-auto"
        style={{
          width: `${CANVAS_WIDTH}px`,
          height: `${CANVAS_HEIGHT}px`,
          backgroundImage: `radial-gradient(${gridDotColor} 1.2px, transparent 1.2px)`,
          backgroundSize: '24px 24px',
        }}
      >
        {/* SVG Bezier Edges */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={arrowColor} />
            </marker>
          </defs>

          {ROADMAP_EDGES.map((edge, index) => {
            const fromNode = nodeMap.get(edge.from);
            const toNode = nodeMap.get(edge.to);
            if (!fromNode || !toNode) return null;

            // Connection coordinates
            const x1 = fromNode.x;
            const y1 = fromNode.y + NODE_HEIGHT / 2;
            const x2 = toNode.x;
            const y2 = toNode.y - NODE_HEIGHT / 2;

            // Vertical cubic bezier curve
            const dy = y2 - y1;
            const curve = dy * 0.5;
            const pathData = `M ${x1} ${y1} C ${x1} ${y1 + curve}, ${x2} ${y2 - curve}, ${x2} ${y2}`;

            return (
              <g key={`${edge.from}-${edge.to}-${index}`}>
                {/* Background line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={edgeShadowColor}
                  strokeWidth="5"
                />
                {/* Main Edge line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={edgeStrokeColor}
                  strokeWidth="1.5"
                  markerEnd="url(#arrow)"
                />
              </g>
            );
          })}
        </svg>

        {/* Interactive Roadmap Nodes */}
        {ROADMAP_NODES.map((node) => {
          const stats = getNodeStats(node);
          const isCompletedAll = stats.count > 0 && stats.count === stats.total;

          return (
            <div
              key={node.id}
              onClick={() => onSelectNode(node)}
              style={{
                position: 'absolute',
                left: `${node.x - NODE_WIDTH / 2}px`,
                top: `${node.y - NODE_HEIGHT / 2}px`,
                width: `${NODE_WIDTH}px`,
                height: `${NODE_HEIGHT}px`,
              }}
              className={`group flex flex-col justify-between rounded-xl border bg-white dark:bg-[#333333] p-2.5 cursor-pointer transition-colors ${
                isCompletedAll
                  ? 'border-[#B7E4C7] dark:border-[#166534] bg-[#E8F7EE]/40 dark:bg-[#14532D]/15'
                  : 'border-[#E6E6E6] dark:border-[#3E3E3E] hover:border-neutral-500 dark:hover:border-neutral-400'
              }`}
            >
              {/* Node Title & Counter */}
              <div className="flex items-center justify-between space-x-1">
                <span className="truncate text-xs font-semibold text-neutral-800 dark:text-neutral-100 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors">
                  {node.name}
                </span>
                <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 flex-shrink-0">
                  {stats.count}/{stats.total}
                </span>
              </div>

              {/* Node Mini Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-[#F7F8FA] dark:bg-[#282828] border border-[#E6E6E6] dark:border-[#3E3E3E] overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isCompletedAll ? 'bg-[#2CBB5D] dark:bg-[#2CBB5D]' : 'bg-neutral-800 dark:bg-neutral-200'
                  }`}
                  style={{ width: `${stats.percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
