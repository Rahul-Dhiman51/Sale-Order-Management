import { useState, useContext, createContext } from 'react'
import { fetchCustomersByEmail } from '../api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null)

    const login = async (email, password) => {
        try {
            const user = await fetchCustomersByEmail(email)
            if (!user) return
            localStorage.setItem('user', JSON.stringify(user))
            setUser(user)
        } catch (err) {
            console.log(err)
        }
    };

    const logout = () => {
        localStorage.removeItem('user')
        setUser(null)
    }


    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);