"use client"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

export function RecentActivity() {
    const activities = [
        {
            user: "Dr. Alice Smith",
            action: "registered a new donor",
            time: "2 hours ago",
            initials: "AS",
        },
        {
            user: "System",
            action: "generated 5 new matches",
            time: "3 hours ago",
            initials: "SY",
        },
        {
            user: "Admin User",
            action: "approved hospital registration",
            time: "5 hours ago",
            initials: "AU",
        },
        {
            user: "Dr. Bob Jones",
            action: "updated recipient status",
            time: "1 day ago",
            initials: "BJ",
        },
        {
            user: "System",
            action: "sent 3 notification emails",
            time: "1 day ago",
            initials: "SY",
        },
    ]

    return (
        <div className="space-y-8">
            {activities.map((activity, index) => (
                <div key={index} className="flex items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src="/avatars/01.png" alt="Avatar" />
                        <AvatarFallback>{activity.initials}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {activity.user}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {activity.action}
                        </p>
                    </div>
                    <div className="ml-auto font-medium text-xs text-muted-foreground">
                        {activity.time}
                    </div>
                </div>
            ))}
        </div>
    )
}
