import { useState } from 'react'
import { DogName, Slow } from "./colocation";

function App() {
  const [time, setTime] = useState(200)

  return (
    <div>
      <DogName time={time} />
      <Slow time={time} onChange={setTime} />
    </div>
  )
}

export default App
