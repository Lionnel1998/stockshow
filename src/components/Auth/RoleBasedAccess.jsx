import React from 'react'
import { useAuth } from '../../contexts/AuthContext'

const RoleBasedAccess = ({ children, requiredRole, fallback = null }) => {
  const { user } = useAuth()

  if (!user) return fallback

  // Mapping des rôles avec hiérarchie (valeurs backend = role.nomRole)
  // On normalise pour éviter les soucis de casse / nom.
  const normalize = (r) => (r || '').toString().trim().toLowerCase()

  const roleHierarchy = {
    // Backend
    'administrateur': 3,
    'gestionnaire': 2,
    'gerant': 1,

    // Compatibilité avec éventuels anciens noms
    'gestionnaire_stock': 2
  }

  const userLevel = roleHierarchy[normalize(user.role)] || 0
  const requiredLevel = roleHierarchy[normalize(requiredRole)] || 0


  if (userLevel >= requiredLevel) {
    return children
  }

  return fallback || <div className="text-center py-8">
    <p className="text-gray-500">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
  </div>
}

export default RoleBasedAccess
