import { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import type {
  NodeChange,
  EdgeChange,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useFrappeGetCall } from 'frappe-react-sdk';

import { DoctypeNode } from './components/DoctypeNode';
import './App.css'; 

const nodeTypes = {
  doctype: DoctypeNode,
};

function App() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedApp, setSelectedApp] = useState<string>('frappe');
  const [selectedModule, setSelectedModule] = useState<string>('Core');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: apps } = useFrappeGetCall<{ message: string[] }>('doctype_erd.api.get_installed_apps');
  
  const { data: modulesData, isLoading: isLoadingModules } = useFrappeGetCall<{ message: string[] }>(
    'doctype_erd.api.get_modules_for_app',
    { app_name: selectedApp },
    selectedApp ? undefined : null as any
  );

  useEffect(() => {
    if (modulesData?.message && modulesData.message.length > 0) {
      if (!modulesData.message.includes(selectedModule)) {
        setSelectedModule(modulesData.message[0]);
      }
    } else if (modulesData?.message && modulesData.message.length === 0) {
      setSelectedModule('');
      setNodes([]);
      setEdges([]);
    }
  }, [modulesData, selectedApp]);

  const { data: doctypesData, isLoading: isLoadingDoctypes } = useFrappeGetCall<{ message: any[] }>(
    'doctype_erd.api.get_doctypes_for_module',
    { module_name: selectedModule },
    selectedModule ? undefined : null as any
  );

  useEffect(() => {
    if (doctypesData?.message) {
      const doctypes = doctypesData.message;
      let rawEdges: Edge[] = [];
      const doctypeNames = new Set(doctypes.map((dt: any) => dt.name));
      const connectedNodes = new Set<string>();

      // Pass 1: Identify connections and build raw edges
      doctypes.forEach((dt: any) => {
        dt.fields.forEach((field: any) => {
          if ((field.fieldtype === 'Link' || field.fieldtype === 'Table' || field.fieldtype === 'Table MultiSelect') && field.options) {
            const targetDt = field.options;
            const isChildRelation = field.fieldtype.includes('Table');
            
            if (doctypeNames.has(targetDt)) {
              connectedNodes.add(dt.name);
              connectedNodes.add(targetDt);
              rawEdges.push({
                id: `e-${dt.name}-${targetDt}-${field.fieldname}`,
                source: dt.name,
                sourceHandle: field.fieldname,
                target: targetDt,
                animated: !isChildRelation,
                style: isChildRelation 
                  ? { stroke: '#3b82f6', strokeWidth: 2.5 } 
                  : { stroke: '#94a3b8', strokeWidth: 1.5 },
                label: isChildRelation ? '1:N' : undefined,
                labelStyle: isChildRelation ? { fill: '#1e3a8a', fontWeight: 'bold', fontSize: 10 } : undefined,
                labelBgStyle: isChildRelation ? { fill: '#eff6ff', fillOpacity: 0.9, stroke: '#bfdbfe' } : undefined,
                labelBgPadding: [4, 4],
                labelBgBorderRadius: 4
              });
            }
          }
        });
      });

      // Build raw node data without positions
      let rawNodesData = doctypes.map((dt: any) => ({
        id: dt.name,
        type: 'doctype',
        data: {
          label: dt.name,
          doctype: dt,
          isIsolated: !connectedNodes.has(dt.name),
          isChildTable: dt.istable === 1
        }
      }));

      // Filter nodes and edges based on searchQuery
      let finalEdges = rawEdges;
      let finalNodesData = rawNodesData;

      if (searchQuery.trim() !== '') {
        const queryLower = searchQuery.toLowerCase();
        const searchedNodeIds = new Set(
          rawNodesData.filter(n => n.id.toLowerCase().includes(queryLower)).map(n => n.id)
        );

        if (searchedNodeIds.size > 0) {
          finalEdges = rawEdges.filter(e => searchedNodeIds.has(e.source) || searchedNodeIds.has(e.target));
          
          const validNodeIds = new Set<string>();
          searchedNodeIds.forEach(id => validNodeIds.add(id));
          finalEdges.forEach(e => {
            validNodeIds.add(e.source);
            validNodeIds.add(e.target);
          });

          finalNodesData = rawNodesData.filter(n => validNodeIds.has(n.id));
        } else {
          finalNodesData = [];
          finalEdges = [];
        }
      }

      // Pass 2: Layout final nodes
      let connectedIdx = 0;
      let isolatedIdx = 0;
      let newNodes: Node[] = [];

      const filteredConnectedCount = finalNodesData.filter(n => connectedNodes.has(n.id)).length;
      const connectedRows = Math.max(Math.ceil(filteredConnectedCount / 4), 1);
      const isolatedStartY = connectedRows * 500 + 400;

      finalNodesData.forEach(nodeData => {
        let posX, posY;
        if (!nodeData.data.isIsolated) {
          posX = (connectedIdx % 4) * 600 + 100;
          posY = Math.floor(connectedIdx / 4) * 500 + 100;
          connectedIdx++;
        } else {
          posX = (isolatedIdx % 5) * 450 + 100;
          posY = Math.floor(isolatedIdx / 5) * 400 + isolatedStartY;
          isolatedIdx++;
        }
        
        newNodes.push({
          ...nodeData,
          position: { x: posX, y: posY }
        } as Node);
      });
      
      setNodes(newNodes);
      setEdges(finalEdges);
    } else if (!isLoadingDoctypes) {
      setNodes([]);
      setEdges([]);
    }
  }, [doctypesData, isLoadingDoctypes, searchQuery]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '15px 20px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', zIndex: 10, display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', gap: '15px', flexWrap: 'wrap' }}>
        <h2 style={{ margin: '0 10px 0 0', fontSize: '1.2rem', color: '#1e293b' }}>Doctype ER Diagram</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontWeight: '600', color: '#475569' }}>App:</label>
          <select 
            value={selectedApp} 
            onChange={(e) => setSelectedApp(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', background: '#f8fafc' }}
          >
            {apps?.message?.map((app: string) => (
              <option key={app} value={app}>{app}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontWeight: '600', color: '#475569' }}>Module:</label>
          <select 
            value={selectedModule} 
            onChange={(e) => setSelectedModule(e.target.value)}
            disabled={!modulesData?.message}
            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', background: '#f8fafc', minWidth: '150px' }}
          >
            {modulesData?.message?.map((mod: string) => (
              <option key={mod} value={mod}>{mod}</option>
            ))}
            {(!modulesData?.message || modulesData.message.length === 0) && (
              <option value="">No Modules</option>
            )}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
          <label style={{ fontWeight: '600', color: '#475569' }}>Search:</label>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find connections..."
            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', background: '#f8fafc', minWidth: '200px' }}
          />
        </div>

        {(isLoadingModules || isLoadingDoctypes) && (
          <span style={{ color: '#64748b', fontSize: '0.9rem', marginLeft: '10px' }}>Loading...</span>
        )}
      </div>
      
      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          minZoom={0.05}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default App;
