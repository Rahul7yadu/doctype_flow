import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import type { DoctypeNodeData } from '../types/doctype';
import './DoctypeNode.css';

export type DoctypeNodeType = Node<DoctypeNodeData, 'doctype'>;

export const DoctypeNode = ({ data }: NodeProps<DoctypeNodeType>) => {
  const { label, doctype, isIsolated, isChildTable } = data;

  let classes = 'doctype-node';
  if (isIsolated) classes += ' isolated';
  if (isChildTable) classes += ' child-table';

  return (
    <div className={classes}>
      {/* Target Handle for incoming links */}
      <Handle type="target" position={Position.Top} className="node-handle" />
      
      <div className="doctype-header">
        <strong>{label}</strong>
      </div>
      
      <div className="doctype-fields">
        {doctype.fields && doctype.fields.map((field: any) => (
          <div key={field.fieldname} className="doctype-field">
            <span className="field-name">{field.label || field.fieldname}</span>
            <span className="field-type">{field.fieldtype}</span>
            {(field.fieldtype === 'Link' || field.fieldtype === 'Table' || field.fieldtype === 'Table MultiSelect') && (
              <Handle 
                type="source" 
                position={Position.Right} 
                id={field.fieldname}
                className="field-handle"
                style={{ top: 'auto' }} // Positioned relative to the row via CSS
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
