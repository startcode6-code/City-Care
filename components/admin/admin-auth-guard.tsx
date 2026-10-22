"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentAdmin } from "@/lib/api/auth";
import { clearTokens } from "@/lib/api/client";
import { showRevokedSessionDialog } from "@/components/admin/auth-session-provider";

export function AdminAuthGuard({ children }: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function checkLogin() {
            const accessToken = sessionStorage.getItem("accessToken");
            const refreshToken = sessionStorage.getItem("refreshToken");

            if (!accessToken && !refreshToken) {
                router.replace("/admin/login");
                return;
            }

            try {
                // Step 2: Backend se actual session verify karo
                await getCurrentAdmin();

                if (!cancelled) {
                    setAuthenticated(true);
                }
            } catch (error: unknown) {
                if (cancelled) return;

                const responseData = (
                    error as {
                        response?: {
                            data?: { status?: string };
                        };
                    }
                ).response?.data;

                clearTokens();

                if (responseData?.status === "REVOKED") {
                    showRevokedSessionDialog();
                    return;
                }

                router.replace("/admin/login");
            } finally {
                if (!cancelled) {
                    setChecking(false);
                }
            }
        }

        checkLogin();

        return () => {
            cancelled = true;
        };
    }, [router]);

    if (checking || !authenticated) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <p className="text-sm text-muted-foreground">
                    Checking admin session...
                </p>
            </div>
        );
    }

    return <>{children}</>;
}
