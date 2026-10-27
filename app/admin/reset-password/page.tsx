import { Suspense } from "react";
import ResetPasswordForm from "@/components/admin/reset-password-form";

export default function ResetPasswordPage() {

    return (
        <Suspense fallback={<div>Loading reset password...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
