import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// No StrictMode: double effect invoke breaks Webflow IX2 destroy/init.
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
