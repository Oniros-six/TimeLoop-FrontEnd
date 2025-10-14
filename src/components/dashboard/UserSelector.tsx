import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { IUser } from "@/interfaces/User";
import { User } from "lucide-react"
import { memo } from "react"

interface propsInterface {
    selectedUser: IUser | null;
    currentUser: IUser | null;
    setSelectedUser: (user: IUser | null) => void;
    users: IUser[]
}

const UserSelector = memo(function UserSelector({
    selectedUser,
    currentUser,
    setSelectedUser,
    users
}: propsInterface) {

    const onUserChange = (user: IUser) => {
        setSelectedUser(user)
    }

    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline">
                <User className="h-4 w-4" />
                {selectedUser && selectedUser.name}
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
            {users && users.map((u) => (
                <DropdownMenuItem key={u.id} onClick={() => onUserChange(u)} className={`${u.id === currentUser?.id ? "bg-accent/50" : ""}`}>
                    {u.name}
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    </DropdownMenu>
    )
})

export default UserSelector