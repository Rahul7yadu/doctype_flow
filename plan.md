# Project: Doctype ER Diagram

## End Goal
Create an interactive Entity-Relationship (ER) diagram visualization for Frappe Doctypes. The application will fetch all Doctypes for the apps installed in the current site and represent them using the `reactflow` library. Doctypes will be rendered as entities (nodes) containing their specific fields, and Link fields will be visualized as edges connecting different Doctypes, forming a comprehensive ER graph. 

**Note on API Calls:** We will use `frappe-react-sdk` to make API calls to the Frappe backend as much as possible to ensure standardization and simplicity in data fetching.

## Tasks

### 1. Representing a single Doctype with a node in React Flow (Current)
- Define the initial React Flow setup.
- Create a custom React Flow node component representing a Doctype entity.
- The node should cleanly display the Doctype's name as a header.
- List the fields of the Doctype inside the node, differentiating field types (e.g., standard fields vs. link fields).
- Test this with mock or single API-fetched data using `frappe-react-sdk`.

### 2. Fetching Site Doctypes & Defining Connections
- Fetch a list of installed apps and their Doctypes.
- Extract Link fields from the Doctypes to determine relationships.
- Generate edges (connections) linking source Doctype nodes to target Doctype nodes.

### 3. Rendering the Interactive ER Diagram
- Integrate the dynamically generated nodes and edges into the React Flow canvas.
- Implement layout algorithms (e.g., explicitly or via libraries like `dagre`) to neatly arrange nodes.
- Polish the UI/UX for zooming, panning, and interacting with the schema.
