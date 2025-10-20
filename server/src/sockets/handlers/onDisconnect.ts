import { Server } from "socket.io";
import { AuthenticatedSocket } from "@/types/chat";
import User from "@/models/User";

// 🔥 Must match the event name used in onConnection.ts
const USER_STATUS_EVENT = "user:status_update"; 

/**
 * ❌ Socket Disconnect Handler
 * If user disconnects, then status update and cleanup are performed.
 */
export const onDisconnect = async ( // 👈 Note: Made it async to use await
  io: Server,
  socket: AuthenticatedSocket,
  userSockets: Map<string, Set<string>>
) => {
  const userId = socket.user!._id.toString();

  // 1. 🔹 Remove socket from map
  userSockets.get(userId)?.delete(socket.id);

  // 2. 🛡️ Check if the user is truly offline (no other active sockets)
  if (userSockets.get(userId)?.size === 0) {
    // The user has no more active connections.
    userSockets.delete(userId);

    // 3. 🔹 Update user status in DB and get privacy setting
    const now = new Date();
    const user = await User.findByIdAndUpdate(
      userId,
      {
        "tracking.status": "offline",
        "tracking.lastSeen": now,        // Set lastSeen on complete disconnection
        "tracking.lastActiveAt": now,   // Update lastActiveAt as well
      },
      { new: true, select: "privacy" } // Get the updated user with privacy data
    ).exec();
    
    // 4. 📢 Broadcast the 'offline' status (with Privacy Check)
    if (user && user.privacy.showStatus) {
      // The user has allowed their status to be shown, so broadcast the 'offline' update.
      
      // 🔥 Currently broadcasting to EVERYONE as per request.
      io.emit(USER_STATUS_EVENT, { userId, status: "offline" });

      /*
        // 🛡️ BEST PRACTICE: Restrict Broadcast to Relevant Users (Friends/Groups)
        // This is where you would send the update only to the user's friends/groups.
      */
      
    } else {
        // User has set status as private (showStatus: false). No broadcast needed.
        console.log(`User ${userId} disconnected, status is offline but hidden.`);
    }
  }

  console.log(`❌ Disconnected: ${socket.id} (${socket.user?.name})`);
};