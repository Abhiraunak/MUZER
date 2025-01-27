"use client"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function Redirect() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return; // Avoid running logic during loading state
        if (status === "authenticated" && session?.user) {
            router.replace("/dashboard"); // Redirect to dashboard
        } else if (status === "unauthenticated") {
            router.replace("/"); // Redirect to home page
        }
    }, [session, status, router]);
    return null;
}



