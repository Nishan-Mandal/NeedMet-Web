import { InfoProvider } from "./infoContext.jsx";
import { AuthProvider } from "./authContext.jsx";
import { ToastProvider } from "./toastContext.jsx";
import { ListingDraftProvider } from "./listingDraftContext.jsx";

export const AppProvider = ({children}) => {
    return (
        <InfoProvider>
            <AuthProvider>
                <ToastProvider>
                    <ListingDraftProvider>
                        {children}
                    </ListingDraftProvider>
                </ToastProvider>
            </AuthProvider>
        </InfoProvider>
    )
}