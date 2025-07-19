import { useState } from 'react'
import EmployeeList from './components/EmployeeList'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>Staff Scheduler</h1>
        <EmployeeList />
      </div>
    </>
  )
}

export default App
