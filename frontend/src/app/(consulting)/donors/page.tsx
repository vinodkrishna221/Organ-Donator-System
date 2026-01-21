import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

// Mock data
const mockDonors = [
    { id: 1, name: "Alice Johnson", type: "LIVING", organ: "Kidney", status: "Active" },
    { id: 2, name: "Bob Smith", type: "DECEASED", organ: "Multiple", status: "Registered" },
    { id: 3, name: "Charlie Brown", type: "LIVING", organ: "Kidney", status: "Pending Verification" },
]

export default function DonorsPage() {
    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Registered Donors</h1>
                <Link href="/donors/register">
                    <Button>Register New Donor</Button>
                </Link>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Organs</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockDonors.length > 0 ? (
                            mockDonors.map((donor) => (
                                <TableRow key={donor.id}>
                                    <TableCell>{donor.id}</TableCell>
                                    <TableCell>{donor.name}</TableCell>
                                    <TableCell>{donor.type}</TableCell>
                                    <TableCell>{donor.organ}</TableCell>
                                    <TableCell>{donor.status}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">View</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No donors registered.
                                </TableCell>
                            </TableRow>
                        )}

                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
