import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
// Icon import removed as component doesn't exist


// Note: If Icons is not available, we can remove it or use lucide-react directly. 
// For now I will assume standard usage or just text.

export function DonationTypeSelector({ value, onChange }: { value: string, onChange: (val: string) => void }) {
    return (
        <RadioGroup defaultValue={value} onValueChange={onChange} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <RadioGroupItem value="LIVING" id="living" className="peer sr-only" />
                <Label
                    htmlFor="living"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                    <div className="mb-2 text-primary">
                        {/* Icon placeholder */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-pulse"><path d="M19 14c1.49-1.28 3.6-2.34 4.81-4.25a5.91 5.91 0 0 0-1.65-8.15 5.93 5.93 0 0 0-8.31 1.05l-.85.96-.85-.96a5.93 5.93 0 0 0-8.31-1.05 5.91 5.91 0 0 0-1.65 8.15c1.21 1.91 3.32 2.97 4.81 4.25L12 21.35z" /><path d="M3.22 12H9.5l.5-1 2 4.5 2-4.5.5 1h6.28" /></svg>
                    </div>
                    <span className="text-xl font-bold">Living Donor</span>
                    <span className="text-sm text-center text-muted-foreground mt-2">
                        Donate one kidney while alive.
                    </span>
                </Label>
            </div>
            <div>
                <RadioGroupItem value="DECEASED" id="deceased" className="peer sr-only" />
                <Label
                    htmlFor="deceased"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                    <div className="mb-2 text-primary">
                        {/* Icon placeholder */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ghost"><path d="M9 10h.01" /><path d="M15 10h.01" /><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z" /></svg>
                    </div>
                    <span className="text-xl font-bold">Deceased Donor</span>
                    <span className="text-sm text-center text-muted-foreground mt-2">
                        Donate multiple organs after death.
                    </span>
                </Label>
            </div>
        </RadioGroup>
    )
}
