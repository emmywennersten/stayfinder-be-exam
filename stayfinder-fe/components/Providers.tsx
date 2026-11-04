"use client"

import { AuthProvider } from "@/contexts/auth";
import type { PropsWithChildren } from "react";

export default function Providers({children}:PropsWithChildren) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    )
}