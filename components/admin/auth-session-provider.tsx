"use client";

import {
    createContext,
    useCallback,
    useContext,
    useState,
} from "react";
import { useRouter } from "next/navigation";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type AuthSessionContextType = {
    showSessionExpired: () => void;
};

const AuthSessionContext =
    createContext<AuthSessionContextType | null>(null);

let globalShowSessionExpired: (() => void) | null = null;

export function showRevokedSessionDialog() {
    globalShowSessionExpired?.();
}

export function AuthSessionProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const showSessionExpired = useCallback(() => {
        setOpen(true);
    }, []);

    // Global callback ko current provider state se connect karein.
    globalShowSessionExpired = showSessionExpired;

    function handleLoginAgain() {
        setOpen(false);
        router.replace("/admin/login");
    }

    return (
        <AuthSessionContext.Provider value={{ showSessionExpired }}>
            {children}

            <AlertDialog open={open}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Session Expired
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            Your account was signed in on another device.
                            For your security, this session has ended.
                            Please log in again to continue.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogAction onClick={handleLoginAgain}>
                            Login Again
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AuthSessionContext.Provider>
    );
}

export function useAuthSession() {
    const context = useContext(AuthSessionContext);

    if (!context) {
        throw new Error(
            "useAuthSession must be used within AuthSessionProvider",
        );
    }

    return context;
}