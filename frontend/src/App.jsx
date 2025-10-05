import { Routes, Route } from "react-router-dom";
import TeamBuilder from "./pages/TeamBuilder";
import TeamView from "./pages/TeamView";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TeamBuilder />} />
      <Route path="/t/:slug" element={<TeamView />} />
    </Routes>
  );
}

export default App;
