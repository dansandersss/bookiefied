'use client'

import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, X, ImageIcon, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { voiceCategories, voiceOptions, DEFAULT_VOICE, MAX_FILE_SIZE } from "@/lib/constants";
import LoadingOverlay from "@/components/LoadingOverlay";
import { toast } from "sonner";

const formSchema = z.object({
    pdf: z.instanceof(File, { message: "PDF file is required" }).refine((file) => file.size <= MAX_FILE_SIZE, "PDF file must be less than 50MB"),
    cover: z.instanceof(File).optional(),
    title: z.string().min(1, "Title is required"),
    author: z.string().min(1, "Author Name is required"),
    voice: z.string().min(1, "Please choose an assistant voice"),
});

type FormValues = z.infer<typeof formSchema>;

const UploadForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            author: "",
            voice: DEFAULT_VOICE,
        },
    });

    const onSubmit = async (values: FormValues) => {
        setIsSubmitting(true);
        try {
            console.log(values);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 3000));
            toast.success("Book uploaded successfully!");
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "pdf" | "cover") => {
        const file = e.target.files?.[0];
        if (file) {
            if (field === "pdf") {
                setPdfFile(file);
                form.setValue("pdf", file);
            } else {
                setCoverFile(file);
                form.setValue("cover", file);
            }
        }
    };

    const removeFile = (field: "pdf" | "cover") => {
        if (field === "pdf") {
            setPdfFile(null);
            form.setValue("pdf", undefined as any);
        } else {
            setCoverFile(null);
            form.setValue("cover", undefined);
        }
    };

    return (
        <div className="new-book-wrapper">
            {isSubmitting && <LoadingOverlay />}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* PDF Upload */}
                    <FormField
                        control={form.control}
                        name="pdf"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="form-label">Book PDF File</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        {pdfFile ? (
                                            <div className="upload-dropzone upload-dropzone-uploaded relative group">
                                                <FileText className="upload-dropzone-icon" />
                                                <p className="upload-dropzone-text">{pdfFile.name}</p>
                                                <p className="upload-dropzone-hint">
                                                    {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile("pdf")}
                                                    className="upload-dropzone-remove absolute top-4 right-4"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="upload-dropzone">
                                                <Upload className="upload-dropzone-icon" />
                                                <span className="upload-dropzone-text">Click to upload PDF</span>
                                                <span className="upload-dropzone-hint">PDF file (max 50MB)</span>
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    className="hidden"
                                                    onChange={(e) => handleFileChange(e, "pdf")}
                                                />
                                            </label>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Cover Image Upload */}
                    <FormField
                        control={form.control}
                        name="cover"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="form-label">Cover Image (Optional)</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        {coverFile ? (
                                            <div className="upload-dropzone upload-dropzone-uploaded relative">
                                                <ImageIcon className="upload-dropzone-icon" />
                                                <p className="upload-dropzone-text">{coverFile.name}</p>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile("cover")}
                                                    className="upload-dropzone-remove absolute top-4 right-4"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="upload-dropzone">
                                                <ImageIcon className="upload-dropzone-icon" />
                                                <span className="upload-dropzone-text">Click to upload cover image</span>
                                                <span className="upload-dropzone-hint">Leave empty to auto-generate from PDF</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => handleFileChange(e, "cover")}
                                                />
                                            </label>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Title */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="form-label">Title</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="ex: Rich Dad Poor Dad"
                                        className="form-input"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Author */}
                    <FormField
                        control={form.control}
                        name="author"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="form-label">Author Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="ex: Robert Kiyosaki"
                                        className="form-input"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Voice Selector */}
                    <FormField
                        control={form.control}
                        name="voice"
                        render={({ field }) => (
                            <FormItem className="space-y-4">
                                <FormLabel className="form-label">Choose Assistant Voice</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="space-y-6"
                                    >
                                        {Object.entries(voiceCategories).map(([gender, voices]) => (
                                            <div key={gender} className="space-y-3">
                                                <h3 className="text-sm font-medium text-[#777] capitalize">
                                                    {gender} Voices
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {voices.map((voiceKey) => {
                                                        const voice = voiceOptions[voiceKey as keyof typeof voiceOptions];
                                                        const isSelected = field.value === voiceKey;
                                                        return (
                                                            <FormItem key={voiceKey} className="space-y-0">
                                                                <FormControl>
                                                                    <RadioGroupItem
                                                                        value={voiceKey}
                                                                        className="sr-only"
                                                                    />
                                                                </FormControl>
                                                                <FormLabel
                                                                    className={cn(
                                                                        "voice-selector-option flex flex-col items-start text-left h-auto p-4",
                                                                        isSelected ? "voice-selector-option-selected" : "voice-selector-option-default"
                                                                    )}
                                                                >
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <div className={cn(
                                                                            "w-4 h-4 rounded-full border flex items-center justify-center",
                                                                            isSelected ? "border-[#663820] bg-[#663820]" : "border-gray-300"
                                                                        )}>
                                                                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                                        </div>
                                                                        <span className="font-bold text-[#222]">{voice.name}</span>
                                                                    </div>
                                                                    <p className="text-xs text-[#777] leading-relaxed">
                                                                        {voice.description}
                                                                    </p>
                                                                </FormLabel>
                                                            </FormItem>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="form-btn"
                    >
                        Begin Synthesis
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default UploadForm;
