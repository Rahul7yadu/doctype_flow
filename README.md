# Doctype ER Diagram 

An interactive Entity-Relationship (ER) diagram visualizer for Frappe Framework, built using React, React Flow, and `frappe-react-sdk`.

This application dynamically fetches Doctypes from your Frappe backend and maps their structural relationships (Links, Tables, MultiSelect Tables) into a fully interactive, draggable visual network graph.

## Features

- **Dynamic Module-Wise Fetching**: Explore your application structure cleanly by selecting a specific app and module. 
- **Intelligent Layout Grid**: Doctypes are automatically laid out in an organized grid spacing to prevent overlap.
- **Smart Edge Detection**: Standard `Link` fields display as elegant lines, while Child Tables (`Table`, `Table MultiSelect`) show bolded blue 1:N connections.
- **Node Highlighting**: 
  - Standard Doctypes are bordered in gray.
  - Child Tables are clearly styled with a blue background and border.
  - Isolated Doctypes (those with zero links/connections to other doctypes in the module) are safely grouped at the bottom in a red warning theme.
- **1st-Degree Connection Search**: Use the real-time search bar to look up specific Doctypes. The graph will instantly filter to show *only* the matching node and its immediate, first-degree connected neighbors, clearing out all visual clutter.

## Tech Stack

- **Backend**: Python (Frappe), exposing a custom API endpoint (`doctype_erd.api`).
- **Frontend**: React 19, Vite, TypeScript.
- **Graph UI Library**: `@xyflow/react` (React Flow).
- **Frappe Integration**: `frappe-react-sdk`.

## Installation

Assuming you have a standard Frappe Bench setup:

1. **Get the app**:
   ```bash
   bench get-app https://github.com/yourusername/doctype_erd.git
   ```

2. **Install to your site**:
   ```bash
   bench --site [your-site-name] install-app doctype_erd
   ```

3. **Install Frontend Dependencies & Run**:
   Navigate into the dashboard module and run Vite:
   ```bash
   cd apps/doctype_erd/dashboard
   npm install
   npm run dev
   ```

## Development

Currently, the backend API is whitelisted under `doctype_erd/api.py`. It fetches the modules and fields securely using `frappe.get_all()` and `frappe.get_meta()`. 

The frontend uses Vite strictly in the `/dashboard` folder and proxies Frappe SDK API calls via standard port combinations (e.g. localhost:8000/8001).

## License

MIT