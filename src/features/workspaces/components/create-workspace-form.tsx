"use client"

import {z} from "zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import Image from "next/image";

import { Avatar,AvatarFallback } from "@/components/ui/avatar";
import { createWorkspacesSchema } from "../schema";
import { DottedSeparator } from "@/components/dotted-separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { ImageIcon } from "lucide-react";

interface CreateWorkspaceFormProp {
    onCancel?: () => void;
};

export const CreateWorkspaceForm = ( {onCancel}: CreateWorkspaceFormProp) => {
    const { mutate, isPending } = useCreateWorkspace();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file){
            form.setValue("image",file);
        }
    }
    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof createWorkspacesSchema>>({
        resolver: zodResolver(createWorkspacesSchema),
        defaultValues: {
            name:"",
        },
    });

    const onSubmit = (values: z.infer<typeof createWorkspacesSchema>) => {
        const finalValues= { 
            ...values,
            image: values.image instanceof File ? values.image : "",
        };
        mutate({form: finalValues},{
            onSuccess: () =>{
                form.reset();

                //TODO: REDIRECT TO WORKSPACE
            }
        });
    }

    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex p-7">
                <CardTitle>
                    Create a new workspace
                </CardTitle>
            </CardHeader>
            <div className="px-7">
                <DottedSeparator/>
            </div>

            <CardContent className="p-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field}) => (
                                    <FormItem>
                                        <FormLabel>
                                            Workspace name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter workspace name"/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="image"
                                render={({field}) => (
                                    <div className="flex flex-col gap-y-2">
                                        <div className="flex items-center gap-x-5">
                                            {
                                                field.value ? (
                                                    <div className="size-[72px] relative rounded-md overflow-hidden">
                                                        <Image
                                                            alt="Logo"
                                                            fill
                                                            className="object-cover"
                                                            src={
                                                                field.value instanceof File
                                                                ? URL.createObjectURL(field.value)
                                                                : field.value
                                                            }/>
                                                    </div>
                                                ) : (
                                                    <Avatar className="size-[72px]">
                                                        <AvatarFallback>
                                                            <ImageIcon className="size-[34px]"/>
                                                        </AvatarFallback>
                                                    </Avatar>
                                                )
                                            }
                                            <div className="flex flex-col">
                                            <p className="text-sm">Workspace icon</p>
                                            <p className="text-sm text-muted-foreground">JPG, JPEG, PNG or SVG, max 1mb</p>
                                            <input
                                                className="hidden"
                                                type="file"
                                                accept=".jpg,.png,.jpeg,.svg"
                                                ref={inputRef}
                                                onChange={handleImageChange}
                                                disabled={isPending}
                                            />
                                            <Button
                                                type="button"
                                                disabled={isPending}
                                                variant="teritrary"
                                                size="xs"
                                                className="w-fit mt-2"
                                                onClick={()=> inputRef.current?.click()}
                                            >
                                                Upload Image
                                            </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />
                        </div>
                        <DottedSeparator className="py-7" />
                        <div className="flex items-center justify-between">
                            <Button
                                type="button" 
                                size="lg"
                                variant="secondary"
                                onClick={onCancel}
                                disabled={isPending}
                                >
                                Cancle
                            </Button>
                            <Button
                                type="submit" 
                                size="lg"
                                disabled={isPending}
                            >
                                Create workspace
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};