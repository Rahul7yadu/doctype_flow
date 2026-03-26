export interface DoctypeField {
  fieldname: string;
  fieldtype: string;
  label: string;
  options?: string; // Often contains the target Doctype for Link fields
  reqd?: number;
}

export interface Doctype {
  name: string;
  module?: string;
  fields: DoctypeField[];
}

export interface DoctypeNodeData extends Record<string, unknown> {
  label: string;
  doctype: Doctype;
  isIsolated?: boolean;
  isChildTable?: boolean;
}
