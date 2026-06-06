import { InfoProvider } from "./infoContext.jsx";
import { AuthProvider } from "./authContext.jsx";

export const AppProvider = ({children}) => {
    return (
        <InfoProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </InfoProvider>
    )
}