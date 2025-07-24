"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const client_1 = __importDefault(require("react-dom/client"));
const react_router_dom_1 = require("react-router-dom");
const Dashboard_js_1 = __importDefault(require("./components/Dashboard.js"));
const MainPanel_js_1 = __importDefault(require("./components/MainPanel.js")); // tu vista final
const root = client_1.default.createRoot(document.getElementById('root'));
root.render(<react_1.default.StrictMode>
    <react_router_dom_1.BrowserRouter>
      <react_router_dom_1.Routes>
        <react_router_dom_1.Route path="/" element={<Dashboard_js_1.default />}/>
        <react_router_dom_1.Route path="/panel" element={<MainPanel_js_1.default />}/>
      </react_router_dom_1.Routes>
    </react_router_dom_1.BrowserRouter>
  </react_1.default.StrictMode>);
