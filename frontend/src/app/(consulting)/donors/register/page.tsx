import { DonorForm } from "@/components/donors/DonorForm"

export default function RegisterDonorPage() {
    return (
        <div className="container mx-auto py-10 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Register New Donor</h1>
            <p className="text-muted-foreground mb-8">
                Register a new donor (Living or Deceased). Please ensure all consent forms are signed and verified before submission.
            </p>
            <div className="bg-card border rounded-lg p-6 shadow-sm">
                <DonorForm />
            </div>
        </div>
    )
}
