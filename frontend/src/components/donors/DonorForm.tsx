"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { DonationTypeSelector } from "./DonationTypeSelector"
import { useState } from "react"
import { useRouter } from "next/navigation"

const donorSchema = z.object({
    fullName: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    phone: z.string().min(10, {
        message: "Phone number must be at least 10 digits.",
    }),
    bloodType: z.string().min(1, "Please select a blood type."),
    donationType: z.enum(["LIVING", "DECEASED"]),
    organs: z.array(z.string()).refine((value) => value.length > 0, {
        message: "You must select at least one organ.",
    }),
    healthConditions: z.string().optional(),
})

// Custom validation to enforce Step 11 logic: Living donor -> only Kidney
const refinedSchema = donorSchema.superRefine((data, ctx) => {
    if (data.donationType === "LIVING") {
        const invalidOrgans = data.organs.filter((organ) => organ !== "KIDNEY")
        if (invalidOrgans.length > 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Living donors can only donate a Kidney.",
                path: ["organs"],
            })
        }
        if (data.organs.length > 1) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Living donors can only donate one organ (Kidney).",
                path: ["organs"],
            })
        }
    }
})

type DonorFormValues = z.infer<typeof refinedSchema>

const ORGANS = [
    { value: "KIDNEY", label: "Kidney" },
    { value: "LIVER", label: "Liver" },
    { value: "HEART", label: "Heart" },
    { value: "LUNGS", label: "Lungs" },
    { value: "PANCREAS", label: "Pancreas" },
    { value: "INTESTINE", label: "Intestine" },
    { value: "CORNEA", label: "Cornea" },
]

export function DonorForm() {
    const router = useRouter()
    const [isSubmit, setIsSubmit] = useState(false)

    const defaultValues: Partial<DonorFormValues> = {
        fullName: "",
        email: "",
        phone: "",
        organs: [],
        healthConditions: "",
        donationType: "LIVING", // Default
    }

    const form = useForm<DonorFormValues>({
        resolver: zodResolver(refinedSchema),
        defaultValues,
        mode: "onChange",
    })

    const donationType = form.watch("donationType")

    function onSubmit(data: DonorFormValues) {
        setIsSubmit(true)
        // Mock API call
        console.log("Submitting donor data:", data)

        // Simulate successful submission
        setTimeout(() => {
            setIsSubmit(false)
            alert("Donor registered successfully! (Mock)")
            router.push("/donors")
        }, 1000)
    }

    // Handle organ selection logic
    const handleOrganChange = (organValue: string, isChecked: boolean) => {
        const currentOrgans = form.getValues("organs") || []
        let newOrgans: string[] = []

        if (isChecked) {
            newOrgans = [...currentOrgans, organValue]
        } else {
            newOrgans = currentOrgans.filter((o) => o !== organValue)
        }

        form.setValue("organs", newOrgans, { shouldValidate: true })
    }

    const currentOrgans = form.watch("organs")

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                <FormField
                    control={form.control}
                    name="donationType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-lg font-semibold">Donation Type</FormLabel>
                            <FormControl>
                                <DonationTypeSelector
                                    value={field.value}
                                    onChange={(val) => {
                                        field.onChange(val)
                                        // Reset organs when type changes to avoid invalid state
                                        form.setValue("organs", [])
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="john@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="+91 9876543210" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="bloodType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Blood Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select blood type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="organs"
                    render={() => (
                        <FormItem>
                            <div className="mb-4">
                                <FormLabel className="text-base">Organs to Donate</FormLabel>
                                <FormDescription>
                                    {donationType === "LIVING"
                                        ? "Living donors can only donate one kidney."
                                        : "Select all organs you wish to donate."}
                                </FormDescription>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {ORGANS.map((organ) => {
                                    const isDisabled = donationType === "LIVING" && organ.value !== "KIDNEY"
                                    const isChecked = currentOrgans.includes(organ.value)

                                    return (
                                        <div key={organ.value} className={`flex items-center space-x-2 border p-4 rounded-md ${isChecked ? "border-primary bg-primary/5" : ""} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}>
                                            <input
                                                type="checkbox"
                                                id={`organ-${organ.value}`}
                                                disabled={isDisabled}
                                                checked={isChecked}
                                                onChange={(e) => handleOrganChange(organ.value, e.target.checked)}
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <label htmlFor={`organ-${organ.value}`} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
                                                {organ.label}
                                            </label>
                                        </div>
                                    )
                                })}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="healthConditions"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Health Conditions / History (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Any existing conditions, surgeries, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isSubmit}>
                    {isSubmit ? "Registering..." : "Register Donor"}
                </Button>
            </form>
        </Form>
    )
}
