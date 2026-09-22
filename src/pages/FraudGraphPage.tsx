import React, { useState } from 'react';
import {
  Network,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Ban,
  User,
  Laptop,
  Globe,
  Building2,
  FileText,
  Filter,
  Info,
} from 'lucide-react';
import { GraphNode, GraphEdge, EntityRiskStatus } from '../types';
import { FRAUD_GRAPH_INITIAL } from '../data/demoData';

export const FraudGraphPage: React.FC = () => {
  const [nodes, setNodes] = useState<GraphNode[]>(FRAUD_GRAPH_INITIAL.nodes);
  const [edges, setEdges] = useState<GraphEdge[]>(FRAUD_GRAPH_INITIAL.edges);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(FRAUD_GRAPH_INITIAL.nodes[4]); // default Device-DV204
  const [zoomLevel, setZoomLevel] = useState(1);
  const [filterType, setFilterType] = useState<string>('ALL');

  const getNodeIcon = (type: GraphNode['type']) => {
    switch (type) {
      case 'customer':
        return User;
      case 'device':
        return Laptop;
      case 'ip':
        return Globe;
      case 'beneficiary':
        return Building2;
      case 'transaction':
        return FileText;
      default:
        return Network;
    }
  };

  const getStatusColor = (status: EntityRiskStatus) => {
    switch (status) {
      case 'trusted':
        return {
          border: 'border-emerald-500',
          bg: 'bg-emerald-950/80',
          text: 'text-emerald-300',
          glow: 'shadow-emerald-950/50',
          dot: 'bg-emerald-400',
        };
      case 'suspicious':
        return {
          border: 'border-cyan-500',
          bg: 'bg-cyan-950/80',
          text: 'text-cyan-300',
          glow: 'shadow-cyan-950/50',
          dot: 'bg-cyan-400',
        };
      case 'high_risk':
        return {
          border: 'border-amber-500',
          bg: 'bg-amber-950/80',
          text: 'text-amber-300',
          glow: 'shadow-amber-950/50',
          dot: 'bg-amber-400',
        };
      case 'blocked':
        return {
          border: 'border-rose-500',
          bg: 'bg-rose-950/90',
          text: 'text-rose-300',
          glow: 'shadow-rose-950/50',
          dot: 'bg-rose-500',
        };
    }
  };

  const filteredNodes = nodes.filter((n) => filterType === 'ALL' || n.type === filterType);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Network className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-display font-bold text-white tracking-wide">
              Fraud Intelligence Graph
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time entity resolution linking customers, hardware fingerprints, IP addresses, proxy relays, and money mule clusters.
          </p>
        </div>

        {/* Filters and Zoom Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Node Type Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Entities</option>
              <option value="customer" className="bg-slate-900">Customers</option>
              <option value="device" className="bg-slate-900">Devices</option>
              <option value="ip" className="bg-slate-900">IP Addresses</option>
              <option value="beneficiary" className="bg-slate-900">Beneficiaries</option>
              <option value="transaction" className="bg-slate-900">Transactions</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono-cyber px-1 text-slate-400">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Graph Canvas & Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Canvas Area (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-[#060d19] border border-slate-800 shadow-xl overflow-hidden relative min-h-[580px]">
          {/* Legend Strip */}
          <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] font-mono-cyber">
            <span className="text-slate-500 uppercase">Threat Level:</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Trusted
            </span>
            <span className="flex items-center gap-1 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Suspicious
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              High Risk
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Blocked
            </span>
          </div>

          {/* Interactive Graph Canvas */}
          <div
            className="w-full h-[580px] overflow-auto p-8 relative flex items-center justify-center cursor-grab active:cursor-grabbing"
            style={{
              backgroundImage: 'radial-gradient(rgba(14, 165, 233, 0.07) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          >
            <div
              className="relative transition-transform duration-200"
              style={{
                width: '1100px',
                height: '560px',
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top left',
              }}
            >
              {/* SVG Edges */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <defs>
                  <marker
                    id="arrowhead-danger"
                    markerWidth="8"
                    markerHeight="6"
                    refX="7"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 8 3, 0 6" fill="#ef4444" />
                  </marker>
                  <marker
                    id="arrowhead-normal"
                    markerWidth="8"
                    markerHeight="6"
                    refX="7"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 8 3, 0 6" fill="#0ea5e9" />
                  </marker>
                </defs>

                {edges.map((edge) => {
                  const srcNode = nodes.find((n) => n.id === edge.source);
                  const tgtNode = nodes.find((n) => n.id === edge.target);
                  if (!srcNode || !tgtNode) return null;

                  const isBlocked = edge.status === 'blocked' || edge.status === 'high_risk';
                  const strokeColor = isBlocked ? '#ef4444' : edge.status === 'suspicious' ? '#06b6d4' : '#10b981';

                  return (
                    <g key={edge.id}>
                      <line
                        x1={(srcNode.x || 100) + 70}
                        y1={(srcNode.y || 100) + 25}
                        x2={(tgtNode.x || 300) + 70}
                        y2={(tgtNode.y || 300) + 25}
                        stroke={strokeColor}
                        strokeWidth={isBlocked ? 2.5 : 1.5}
                        strokeDasharray={isBlocked ? '4,4' : undefined}
                        opacity={0.7}
                      />
                      {edge.label && (
                        <text
                          x={((srcNode.x || 100) + (tgtNode.x || 300)) / 2 + 70}
                          y={((srcNode.y || 100) + (tgtNode.y || 300)) / 2 + 20}
                          fill="#94a3b8"
                          fontSize="9"
                          fontFamily="JetBrains Mono"
                          textAnchor="middle"
                        >
                          {edge.label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Render Nodes */}
              {filteredNodes.map((node) => {
                const Icon = getNodeIcon(node.type);
                const colors = getStatusColor(node.status);
                const isSelected = selectedNode?.id === node.id;

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    style={{
                      position: 'absolute',
                      left: `${node.x || 100}px`,
                      top: `${node.y || 100}px`,
                    }}
                    className={`z-10 w-44 p-2.5 rounded-xl border shadow-lg cursor-pointer transition-all ${colors.border} ${colors.bg} ${
                      isSelected ? 'ring-2 ring-cyan-400 scale-105 z-30' : 'hover:scale-102 hover:z-20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-slate-300" />
                        <span className="text-[9px] font-mono-cyber uppercase text-slate-400">
                          {node.type}
                        </span>
                      </div>
                      <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                    </div>

                    <div className="font-display font-bold text-xs text-white truncate">
                      {node.label}
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono-cyber mt-1 pt-1 border-t border-slate-800/80">
                      <span className="text-slate-400">Risk Score:</span>
                      <span className={`font-bold ${colors.text}`}>{node.riskScore}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Inspector Panel (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-mono-cyber font-bold tracking-wider text-slate-200 uppercase flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              GRAPH NODE INSPECTOR
            </h3>
            <span className="text-[10px] font-mono-cyber text-slate-500">ENTITY DETAILS</span>
          </div>

          {selectedNode ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono-cyber text-slate-400 uppercase">
                      Entity ID: {selectedNode.id}
                    </span>
                    <h4 className="text-base font-display font-bold text-white mt-0.5">
                      {selectedNode.label}
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] font-mono-cyber font-bold px-2 py-0.5 rounded uppercase ${
                      getStatusColor(selectedNode.status).bg
                    } ${getStatusColor(selectedNode.status).text} border ${
                      getStatusColor(selectedNode.status).border
                    }`}
                  >
                    {selectedNode.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono-cyber">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">RISK SCORE</span>
                    <span className="text-lg font-bold text-cyan-400">{selectedNode.riskScore} / 100</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">CONNECTED NODES</span>
                    <span className="text-lg font-bold text-white">{selectedNode.connectedCount} Links</span>
                  </div>
                </div>
              </div>

              {/* Node Metadata Attributes */}
              {selectedNode.details && (
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                  <span className="block text-[11px] font-mono-cyber text-slate-400 uppercase">
                    Forensic Telemetry Metadata
                  </span>
                  <div className="space-y-1.5 font-mono-cyber text-[11px]">
                    {Object.entries(selectedNode.details).map(([k, v]) => (
                      <div key={k} className="flex justify-between border-b border-slate-900 pb-1">
                        <span className="text-slate-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="text-slate-200 font-medium">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk Alert Insight */}
              {selectedNode.status === 'blocked' && (
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/80 text-xs text-rose-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Ban className="w-3.5 h-3.5 text-rose-400" />
                    BLACKLIST / SYNDICATE WARNING
                  </div>
                  <p className="text-[11px] text-rose-200/80 leading-relaxed">
                    This entity is recognized as a coordinated hub connecting multiple accounts in rapid fund funneling attempts. Automated policy prohibits transactions routing through this vector.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-500">
              Click any node on the graph to inspect connected relationships and risk telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
