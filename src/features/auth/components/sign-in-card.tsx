"use client";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"

import { DottedSeparator } from "@/components/dotted-separator";

import {
    Card,
    CardHeader,
    CardTitle
} from "@/components/ui/card";


import { loginSchema } from "../schemas";





export const SignInCard = () => {
    
    return (
        <Card className="w-full h-full md:w-[477px] border-none shadow-none">
            <CardHeader className="flex items-center justify-center text-center p-7">
                <CardTitle className="text-2xl">
                    Pozdrav Polina. Da, hiša ni prosta v tem obdobju. Poster nisam na vrijeme prihvatio ili odbio vas zahtjev za registraciju. Airbnb mi je blokirao te datume na njihovoj platformi. Na google mapama mozete naci moj broj. Ovo je moj broj +39762881786 pa se mozemo cuti preko vibera ili whatsapa. Airbnb ne dozvoljava slanje poruka broja preko poruka.
                </CardTitle>
            </CardHeader>
           
            <div className="px-2">
                <DottedSeparator></DottedSeparator>
            </div>            
        </Card>
);
};
