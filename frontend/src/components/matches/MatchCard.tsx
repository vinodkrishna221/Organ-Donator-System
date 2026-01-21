"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Check, X } from "lucide-react"
import { useState } from "react"

interface MatchProps {
    match: {
        id: string
        donor: {
            name: string
            organ: string
            bloodType: string
        }
        recipient: {
            name: string
            organ: string
            bloodType: string
            urgency: string
        }
        score: {
            total: number
            breakdown: {
                bloodCompatibility: number
                hlaMatch: number
                urgency: number
                proximity: number
                waitingTime: number
            }
        }
        status: string
    }
}

export function MatchCard({ match }: MatchProps) {
    const [status, setStatus] = useState(match.status)

    const handleAction = (action: "ACCEPTED" | "REJECTED") => {
        // Mock API call
        console.log(`Match ${match.id} ${action}`)
        setStatus(action)
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">Match Score: {match.score.total}%</CardTitle>
                    <Badge variant={status === "ACCEPTED" ? "default" : status === "REJECTED" ? "destructive" : "secondary"}>
                        {status}
                    </Badge>
                </div>
                <CardDescription>
                    {match.donor.organ} Match
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Donor & Recipient Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <h4 className="font-semibold mb-1">Donor</h4>
                        <p>{match.donor.name}</p>
                        <p className="text-muted-foreground">{match.donor.bloodType}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-1">Recipient</h4>
                        <p>{match.recipient.name}</p>
                        <p className="text-muted-foreground">{match.recipient.bloodType} • {match.recipient.urgency}</p>
                    </div>
                </div>

                <Separator />

                {/* Score Breakdown */}
                <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Score Breakdown</h4>

                    <div className="flex justify-between text-xs">
                        <span>Blood Compatibility</span>
                        <span>{match.score.breakdown.bloodCompatibility}%</span>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span>HLA Match</span>
                            <span>{match.score.breakdown.hlaMatch}/30</span>
                        </div>
                        <Progress value={(match.score.breakdown.hlaMatch / 30) * 100} className="h-1.5" />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span>Urgency</span>
                            <span>{match.score.breakdown.urgency}/30</span>
                        </div>
                        <Progress value={(match.score.breakdown.urgency / 30) * 100} className="h-1.5" />
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Proximity: {match.score.breakdown.proximity}/20</span>
                        <span>Wait Time: {match.score.breakdown.waitingTime}/20</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-2">
                {status === "PENDING" ? (
                    <>
                        <Button
                            variant="outline"
                            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleAction("REJECTED")}
                        >
                            <X className="mr-2 h-4 w-4" /> Reject
                        </Button>
                        <Button
                            className="w-full"
                            onClick={() => handleAction("ACCEPTED")}
                        >
                            <Check className="mr-2 h-4 w-4" /> Accept
                        </Button>
                    </>
                ) : (
                    <div className="w-full text-center text-sm text-muted-foreground italic">
                        Processed on {new Date().toLocaleDateString()}
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}
