"use client"

import {z} from "zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import Image from "next/image";

import { Avatar,AvatarFallback } from "@/components/ui/avatar";
import { DottedSeparator } from "@/components/dotted-separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Project } from "../types";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import { useUpdateProject } from "../api/use-update-project";
import { updateProjectSchema } from "../schemas";
import { useDeleteProject } from "../api/use-delete-project";

interface EditProjectFormProp {
    onCancel?: () => void;
    initialValues: Project;
};

export const EditProjectForm = ( {onCancel, initialValues}: EditProjectFormProp) => {
    const router= useRouter();
    const { mutate, isPending } = useUpdateProject();
    const { 
        mutate: deleteProject, 
        isPending: isDeletingProject 
    } = useDeleteProject(); 

    const [DeleteDialog,confirmDelete]= useConfirm(
        "Delete project",
        "Canot be undone",
        "destructive"
    );

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file){
            form.setValue("image",file);
        }
    }
    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof updateProjectSchema>>({
        resolver: zodResolver(updateProjectSchema),
        defaultValues: {
            ...initialValues,
            image: initialValues.imageUrl ?? "",
        },
    });

    const handleDelete = async () => {
        const ok = await confirmDelete();
        
        if(!ok) return;
        
        deleteProject({
            param: { projectId: initialValues.$id}
        },{
            onSuccess: () => {
                window.location.href = `/workspaces/${initialValues.workspaceId}`;
            }   
        });
    }

    const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {
        const finalValues= { 
            ...values,
            image: values.image instanceof File ? values.image : "",
        };
        mutate({
            form: finalValues,
            param: { projectId: initialValues.$id }
        },{
            onSuccess: () => {
                form.reset();
                router.refresh();
            },
        });
    }
    
    return (
        <div className="flex flex-col gap-y-4">
            <DeleteDialog/>
            <Card className="w-full h-full border-none shadow-none">
                <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
                    <Button size="sm" variant="secondary" onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`)}>
                        <ArrowLeftIcon className="size-4 mr-2"/>
                        Back
                    </Button>
                    <CardTitle>
                        {initialValues.name}
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
                                                {initialValues.$id}
                                                <br/>Project name 
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Enter project name"/>
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
                                                <p className="text-sm">Project icon</p>
                                                <p className="text-sm text-muted-foreground">JPG, JPEG, PNG or SVG, max 1mb</p>
                                                <input
                                                    className="hidden"
                                                    type="file"
                                                    accept=".jpg,.png,.jpeg,.svg"
                                                    ref={inputRef}
                                                    onChange={handleImageChange}
                                                    disabled={isPending}
                                                />
                                                {field.value ? (
                                                    <Button
                                                    type="button"
                                                    disabled={isPending}
                                                    variant="destructive"
                                                    size="xs"
                                                    className="w-fit mt-2"
                                                    onClick={()=> {
                                                        field.onChange(null);
                                                        if(inputRef.current)    
                                                        {
                                                            inputRef.current.value = "";
                                                    }}}
                                                    >
                                                        Remove Image
                                                    </Button>
                                                ) : (
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
                                                )
                                                }
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
                                    className={cn(!onCancel && "invisible")}
                                    >
                                    Cancle
                                </Button>
                                <Button
                                    type="submit" 
                                    size="lg"
                                    disabled={isPending}
                                >
                                    Save changes
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card className="w-full h-full border-none shadow-none">
                <CardContent className="p-7">
                    <div className="flex flex-col">
                        <h3 className="font-bold">Danger</h3>
                        <p className="text-sm text-muted-foreground">Deleting data is permanent</p>
                        <DottedSeparator className="py-7"/>
                        <Button className="mt-2 w-fit ml-auto"
                            size="sm"
                            variant="destructive"
                            type="button"
                            disabled={isPending}
                            onClick={handleDelete}>
                            Delete project
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};