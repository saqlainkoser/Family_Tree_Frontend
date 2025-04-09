import React, { useState } from 'react'
import { createContext } from 'react'

export const TreeContext = createContext();


const TreeContextProvider = ({ children }) => {

    const [flag, setFlag] = useState(false);

  return (
    <div>
      <TreeContext.Provider value={{flag, setFlag}}>
        {children}
      </TreeContext.Provider>
    </div>
  )
}

export default TreeContextProvider; // export the provider
