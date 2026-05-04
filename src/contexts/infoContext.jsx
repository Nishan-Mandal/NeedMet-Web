import { useContext, createContext, useState } from "react";

export const infoContext = createContext({
    contactNo: "", 
    setContactNo: () => {}
});

export const InfoProvider = ({children}) => {
    const [contactNo, setContactNo] = useState("");
    
    return (
        <infoContext.Provider value={{contactNo, setContactNo}}>
            {children}
        </infoContext.Provider>
    );
}

export default function useInfo() {
  return useContext(infoContext);
}