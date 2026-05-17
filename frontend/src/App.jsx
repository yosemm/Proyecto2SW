import { useState, useEffect } from 'react'

function App() {
  const [items, setItems] = useState(
    () => JSON.parse(localStorage.getItem('items') || '[]')
  );
  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  return (
    <>
      <div>
        <h1>Backlog de Videojuegos</h1>
        <span>Total de juegos: {items.length}</span>
      </div>
    </>
  )
}

export default App
