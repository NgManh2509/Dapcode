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

  const gridDotColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)';
  const arrowColor = isDark ? '#71717a' : '#94a3b8';
  const edgeShadowColor = isDark ? '#1e2029' : '#f1f5f9';
  const edgeStrokeColor = isDark ? '#3f3f46' : '#cbd5e1';

  return (
    <div className="relative w-full overflow-x-auto overflow-y-visible rounded-2xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-[#0d0e15] p-6 shadow-sm dark:shadow-2xl transition-colors duration-200">
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

            // Connection coordinates: bottom-center of source to top-center of target
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
                {/* Background Shadow line */}
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
                  strokeWidth="2"
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
              className={`group flex flex-col justify-between rounded-xl border bg-white dark:bg-[#161722] p-2.5 shadow-xs cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                isCompletedAll
                  ? 'border-emerald-400 dark:border-emerald-500/50 hover:border-emerald-500 hover:shadow-emerald-500/10'
                  : 'border-slate-200 dark:border-zinc-800/90 hover:border-indigo-500 dark:hover:border-indigo-500/70 hover:shadow-indigo-500/10'
              }`}
            >
              {/* Node Title & Counter */}
              <div className="flex items-center justify-between space-x-1">
                <span className="truncate text-xs font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {node.name}
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 flex-shrink-0">
                  {stats.count}/{stats.total}
                </span>
              </div>

              {/* Node Mini Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-zinc-800/90 overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isCompletedAll ? 'bg-emerald-500' : 'bg-indigo-600 dark:bg-indigo-500'
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

