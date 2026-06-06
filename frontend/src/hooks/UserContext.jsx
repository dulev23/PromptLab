import { createContext, useContext, useState } from 'react'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [activeUserId, setActiveUserId] = useState(1)

  return (
    <UserContext.Provider value={{ activeUserId, setActiveUserId }}>
      {children}
    </UserContext.Provider>
  )
}

export function useActiveUser() {
  return useContext(UserContext)
}
