"use client";


import { DottedSeparator } from "@/components/dotted-separator";

import {
    Card,
    CardHeader,
    CardTitle
} from "@/components/ui/card";







export const SignInCard = () => {
    
    return (
        <Card className="w-full h-full md:w-[477px] border-none shadow-none">
            <CardHeader className="flex items-center justify-center text-center p-7">
                <CardTitle className="text-2xl">
                Živjo Polina. Da, hiša ni prosta v tem obdobju. Ker nisem pravočasno sprejel ali zavrnil vaš zahtevek za registraciju. Airbnb je mi zablokiral te datume na njihovi platformi. Na Google Maps lahko najdete moje število. To je moje število +39762881786, pa se lahko pogovorimo preko Viberja ali WhatsAppa. Airbnb ne dovoli pošiljanja telefonskega števila preko sporočil.    
                </CardTitle>
            <br/>
                <CardTitle className="text-2xl">
                    Še enkrat se opravičim za to, lep dan Boris
                </CardTitle>
            </CardHeader>
           
            <div className="px-2">
                <DottedSeparator></DottedSeparator>
            </div>            
        </Card>
);
};
