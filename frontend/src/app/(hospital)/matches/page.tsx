"use client"

import { MatchCard } from "@/components/matches/MatchCard"

// Mock data for matching
const mockMatches = [
    {
        id: "m1",
        donor: {
            name: "John Doe (Deceased)",
            organ: "Kidney",
            bloodType: "O+",
        },
        recipient: {
            name: "Sarah Smith",
            organ: "Kidney",
            bloodType: "O+",
            urgency: "High",
        },
        score: {
            total: 85,
            breakdown: {
                bloodCompatibility: 100,
                hlaMatch: 25, // out of 30
                urgency: 20, // out of 30
                proximity: 15, // out of 20
                waitingTime: 10, // out of 20
            },
        },
        status: "PENDING",
    },
    {
        id: "m2",
        donor: {
            name: "Jane Roe (Living)",
            organ: "Liver",
            bloodType: "A-",
        },
        recipient: {
            name: "Mike Jones",
            organ: "Liver",
            bloodType: "A-",
            urgency: "Critical",
        },
        score: {
            total: 92,
            breakdown: {
                bloodCompatibility: 100,
                hlaMatch: 28,
                urgency: 30,
                proximity: 18,
                waitingTime: 15,
            },
        },
        status: "PENDING",
    },
]

export default function MatchesPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Generated Matches</h1>
            <p className="text-muted-foreground mb-8">
                Review generated matches between donors and recipients. High scores indicate better compatibility.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockMatches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                ))}
            </div>
        </div>
    )
}
