JSON Tree Visualizer 🌳
An interactive web app to visualize, explore, and search JSON data structures with a beautiful tree diagram. Built using React and React Flow.
✨ Features
Paste or type any valid JSON (object or array).
Visualize objects, arrays, and primitive values as nodes.
Clean, responsive, and modern UI—with glassmorphism and gradients.
Search by JSON path (e.g., $.products[0].name), key, or value.
Matching nodes are highlighted and auto-focused.
Clear/reset, copy-path-on-click, and download-image features.
Works great on both desktop and mobile.
🚀 Getting Started
1. Clone the repository
git clone https://github.com/Dasari-Yashwant-Kumar/JSON-Tree-Visualizer.gitcd JSON-Tree-Visualizer
2. Install dependencies
npm install
3. Start the development server
npm run dev
Visit http://localhost:5173 (or as shown in your terminal).
🛠️ Build for production
npm run build
📈 Example JSON
Paste this or your own:
{  "products": [    { "id": 1, "name": "Pen", "category": "stationery", "price": 10 },    { "id": 2, "name": "Notebook", "category": "stationery", "price": 50 }  ],  "store": {    "name": "MiniMart",    "open": true  }}
🔍 How search works
Path: Use JSONPath ($.products[0].name), or just products[0].name
Key: Try keys like store
Value: Any value, like Notebook or MiniMart
Matching nodes are automatically highlighted and brought into view.
🖼️ Features
Responsive Design: Looks great on all devices.
Visual feedback: Success and error messages for search.
Node info: Hover to reveal extra node info.
Glass effect: Modern UI with subtle shadows.
