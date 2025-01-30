import { useState } from "react";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <p> count is {count}</p>
        <button onClick={() => setCount((count) => count + 1)}>+ 1</button>
        <button onClick={() => setCount((count) => count - 1)}>- 1</button>
        <p>Кликер для чайников</p>
      </div>
    </>
  );
}

export default App;
