import { Route, Routes } from 'react-router-dom'
import Login from './Pages/Login/Login'
import AuthRoute from './components/AuthRoute/AuthRoute'
import HomePage from './Pages/HomePage/HomePage'

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AuthRoute><HomePage /></AuthRoute>} />
            <Route path="/login" element={<Login />} />
        </Routes>
    )
}

export default AppRoutes