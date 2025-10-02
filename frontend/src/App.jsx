import { Routes, Route } from "react-router-dom";
import TeamBuilder from "./pages/TeamBuilder";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TeamBuilder />} />
    </Routes>
  );
}

export default App;
