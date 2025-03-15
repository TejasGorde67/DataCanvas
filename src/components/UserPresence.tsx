import { useState } from "react";
import { Users, ChevronUp, ChevronDown } from "lucide-react";

interface User {
  id: string;
  name: string;
  color: string;
  activeCell?: string | null;
}

interface UserPresenceProps {
  users: User[];
}

export function UserPresence({ users }: UserPresenceProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (users.length <= 1) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-canvas-50 border border-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div
          className="flex items-center justify-between px-4 py-2 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-300">
              {users.length} {users.length === 1 ? "user" : "users"} online
            </span>
          </div>
          <button className="text-gray-500 hover:text-gray-300">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
        </div>

        {isExpanded && (
          <div className="px-4 py-2 max-h-[200px] overflow-y-auto">
            <ul className="space-y-2">
              {users.map((user) => (
                <li key={user.id} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: user.color }}
                  />
                  <span className="text-sm text-gray-300">{user.name}</span>
                  {user.activeCell && (
                    <span className="text-xs text-gray-500">
                      (editing cell {user.activeCell.slice(0, 4)})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
