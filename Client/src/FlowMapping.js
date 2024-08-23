// import React, { useState, useEffect } from 'react';
// import ReactFlow, {
//   addEdge,
//   Background,
//   Controls,
//   MiniMap,
//   useNodesState,
//   useEdgesState,
//   Handle,
// } from 'react-flow-renderer';
// import './FlowMapping.css'; // Import any custom CSS if needed

// const generateHandles = (keys, isSource) => {
//   return keys.map((key, index) => (
//     <div key={key} style={{ position: 'relative', height: 30 }}>
//       <div style={{ paddingLeft: isSource ? 0 : 30, paddingRight: isSource ? 30 : 0 }}>
//         {key}
//       </div>
//       <Handle
//         type={isSource ? 'source' : 'target'}
//         position={isSource ? 'right' : 'left'}
//         id={key}
//         style={{ background: '#555', border: '1px solid #222', width: 10, height: 10 }}
//       />
//     </div>
//   ));
// };

// const CustomNode = ({ data, isSource }) => {
//   return (
//     <div>
//       {generateHandles(data.keys, isSource)}
//     </div>
//   );
// };

// const nodeTypes = {
//   sourceNode: (props) => <CustomNode {...props} isSource />,
//   targetNode: (props) => <CustomNode {...props} isSource={false} />,
// };

// const FlowMapping = ({ extractedKeys, mobiusKeys }) => {
//   const initialNodes = [
//     {
//       id: '1',
//       data: { label: 'Extracted Keys', keys: extractedKeys },
//       position: { x: 100, y: 50 },
//       type: 'sourceNode',
//     },
//     {
//       id: '2',
//       data: { label: 'Mobius Keys', keys: mobiusKeys },
//       position: { x: 400, y: 50 },
//       type: 'targetNode',
//     },
//   ];

//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);

//   // Update nodes when keys change
//   useEffect(() => {
//     setNodes((nds) =>
//       nds.map((node) => {
//         if (node.id === '1') {
//           return { ...node, data: { ...node.data, keys: extractedKeys } };
//         }
//         if (node.id === '2') {
//           return { ...node, data: { ...node.data, keys: mobiusKeys } };
//         }
//         return node;
//       })
//     );
//   }, [extractedKeys, mobiusKeys, setNodes]);

//   const onConnect = (params) =>
//     setEdges((eds) =>
//       addEdge(
//         {
//           ...params,
//           style: {
//             stroke: '#0000ff',
//             strokeDasharray: '5, 5',
//             animation: 'dash 1.5s linear infinite',
//           },
//         },
//         eds
//       )
//     );

//   return (
//     <div style={{ height: 600, width: '100%', marginTop: '20px' }}>
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         nodeTypes={nodeTypes}
//         fitView
//       >
//         <Background />
//         <Controls />
//         <MiniMap />
//       </ReactFlow>
//       <div className="mapping-output">
//         <h3>Key Mappings:</h3>
//         <ul>
//           {edges.map((edge, index) => (
//             <li key={index}>
//               {edge.sourceHandle ? edge.sourceHandle : edge.source} {'→'}{' '}
//               {edge.targetHandle ? edge.targetHandle : edge.target}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default FlowMapping;


import React, { useState, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Handle,
} from 'react-flow-renderer';
import './FlowMapping.css'; // Import any custom CSS if needed

const generateHandles = (keys, isSource) => {
  return keys.map((key, index) => (
    <div key={key} style={{ position: 'relative', height: 30 }}>
      <div style={{ paddingLeft: isSource ? 0 : 30, paddingRight: isSource ? 30 : 0 }}>
        {key}
      </div>
      <Handle
        type={isSource ? 'source' : 'target'}
        position={isSource ? 'right' : 'left'}
        id={key}
        style={{ background: '#555', border: '1px solid #222', width: 10, height: 10 }}
      />
    </div>
  ));
};

const CustomNode = ({ data, isSource }) => {
  return (
    <div>
      {generateHandles(data.keys, isSource)}
    </div>
  );
};

const nodeTypes = {
  sourceNode: (props) => <CustomNode {...props} isSource />,
  targetNode: (props) => <CustomNode {...props} isSource={false} />,
};

const FlowMapping = ({ extractedKeys, mobiusKeys, onMappingsChange }) => {
  const initialNodes = [
    {
      id: '1',
      data: { label: 'Extracted Keys', keys: extractedKeys },
      position: { x: 100, y: 50 },
      type: 'sourceNode',
    },
    {
      id: '2',
      data: { label: 'Mobius Keys', keys: mobiusKeys },
      position: { x: 400, y: 50 },
      type: 'targetNode',
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Update nodes when keys change
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === '1') {
          return { ...node, data: { ...node.data, keys: extractedKeys } };
        }
        if (node.id === '2') {
          return { ...node, data: { ...node.data, keys: mobiusKeys } };
        }
        return node;
      })
    );
  }, [extractedKeys, mobiusKeys, setNodes]);

  const onConnect = (params) => {
    const newEdge = {
      ...params,
      style: {
        stroke: '#0000ff',
        strokeDasharray: '5, 5',
        animation: 'dash 1.5s linear infinite',
      },
    };
    setEdges((eds) => addEdge(newEdge, eds));
    
    // Notify about the change in mappings
    const updatedMappings = [...edges, newEdge].map(edge => ({
      source: edge.sourceHandle,
      target: edge.targetHandle,
    }));
    onMappingsChange(updatedMappings);
  };

  return (
    <div style={{ height: 600, width: '100%', marginTop: '20px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      <div className="mapping-output">
        <h3>Key Mappings:</h3>
        <ul>
          {edges.map((edge, index) => (
            <li key={index}>
              {edge.sourceHandle ? edge.sourceHandle : edge.source} {'→'}{' '}
              {edge.targetHandle ? edge.targetHandle : edge.target}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FlowMapping;
