"use client"

import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AuthLayoutProps{
    children : React.ReactNode;
};

const AuthLayout = ({children} : AuthLayoutProps) =>{

    const pathname = usePathname();
    const isSignIn = pathname === "/sign-in";
    
    return (
        
        <main className="bg-neutral-100 min-h-screen">
            <div className="mx-auto max-w-screen-2xl p-4">
                <nav className="flex justify-between items-center">
                    <Image src="/logo.svg" alt="logo" height={152} width={56}/>
                    <Button asChild variant="secondary">
                        <Link href={pathname === "/sign-in" ? "/sign-up" : "/sign-in"}>
                            {pathname === "/sign-in" ? "Sign Up" : "Login"}
                        </Link>
                    </Button>
                </nav>
            </div>
            <div className="flex flex-col items-center justify-center p-4  md:pt-14"> 
                {children}
            </div>
        </main>
    );
};

export default AuthLayout;