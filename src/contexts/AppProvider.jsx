import { InfoProvider } from "./infoContext.jsx";

export const AppProvider = ({children}) => {
    return (
        <InfoProvider>
            {children}
        </InfoProvider>
    )
}