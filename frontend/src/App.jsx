import { useEffect } from 'react'
import AppRoutes from './routes/AppRoutes'
import { initializeSocket } from './config/socket'


const App = () => {
  useEffect(() => {
    initializeSocket()
  }, [])
  
  return (
    <div>
      <AppRoutes/>
    </div>
  )
}

export default App
