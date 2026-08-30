import React, { createContext, useContext, useState, useEffect } from 'react'
import apiService from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
      apiService.setToken(token)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password)
      const userResponse = response.user || response.utilisateur;
      
      if (response.token && userResponse) {
        const userData = {
          idUser: userResponse.idUser,
          nom: userResponse.nom,
          email: userResponse.email,
          role: userResponse.role?.nomRole || userResponse.role || 'Utilisateur',
          niveau_acces: userResponse.role?.niveau_acces || 1,
          idRole: userResponse.idRole,
          idEntreprise: userResponse.idEntreprise,
          est_actif: userResponse.est_actif
        }
        
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', response.token)
        apiService.setToken(response.token)
        
        return { success: true }
      }

      return { success: false, error: response.message || 'Identifiants incorrects' }
    } catch (error) {
      return { success: false, error: 'Erreur de connexion au serveur' }
    }
  }

  const register = async (userData) => {
    try {
      const response = await apiService.register(userData)
      
      if (response.success || response.message) {
        return { success: true, message: response.message || 'Inscription réussie' }
      }

      return { success: false, error: response.message || 'Erreur lors de l\'inscription' }
    } catch (error) {
      return { success: false, error: 'Erreur de connexion au serveur' }
    }
  }

  const logout = async () => {
    try {
      await apiService.logout()
    } catch (error) {
      console.error('Erreur logout:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      apiService.setToken(null)
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
