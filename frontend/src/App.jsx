import { useState } from "react";
import "./App.css";
import { testApiConnection } from "./test/apiTest";

function App() {
  const [message, setMessage] = useState("");

  return (
    <>
      <button onClick={testApiConnection}>Test API</button>
    </>
  );
}

export default App;
