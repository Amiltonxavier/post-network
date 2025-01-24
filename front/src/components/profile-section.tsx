import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useUser } from "@/context/user.context"
import { useState } from "react";
import { EditDialog } from "./edit-user";


export function ProfileSection() {
    const {user}=useUser()
    const [open, setOpen] = useState(false);
  return (
    <Card className="overflow-hidden bg-zinc-900 text-zinc-100 border-zinc-800">
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-r from-emerald-900/20 to-zinc-900">
        <div className="absolute -bottom-12 left-8">
          <div className="h-24 w-24 overflow-hidden rounded-lg border-4 border-zinc-900 bg-zinc-800">
            <img
              src={user?.imgUrl}
              alt="Profile picture"
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-16 px-8 pb-8">
        <div className="flex flex-col gap-2 items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">{user?.fullName}</h1>
            <p className="text-sm text-zinc-400">{user?.bio}</p>
          </div>
          <Button onClick={() => setOpen(true)} variant="outline" size={"sm"} className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/10">
            <span className="mr-2">✏️</span>
            Edit Profile
          </Button>
        </div>
      </div>

      <EditDialog open={open} onOpenChange={setOpen} />
    </Card>
  )
}