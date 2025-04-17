import { createRoot } from "react-dom/client";
import Root from "./routes/Root"; // Root handles routing
import "./index.css";

createRoot(document.getElementById("root")!).render(<Root />);