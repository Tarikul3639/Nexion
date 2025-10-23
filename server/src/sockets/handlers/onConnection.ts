import { Server } from "socket.io";
import { AuthenticatedSocket } from "@/types/chat";
import User from "@/models/User"; // Mongoose model import

// Import all handlers
import { attachAllHandlers } from "./attachAllHandlers";

// 🔥 Suggested Event Name
const USER_STATUS_EVENT = "user:online"; 

/**
 * 🤝 Socket Connection Handler
 * Handles actions when a user successfully connects via Socket.io.
 */
export const onConnection = async (
  io: Server,
  socket: AuthenticatedSocket,
  userSockets: Map<string, Set<string>> // Map to track all sockets per user
) => {
  const userId = socket.user!._id.toString();
  const now = new Date();

  // 1. 🔹 Map user socket to user ID
  // Track this specific socket ID under the user's ID.
  if (!userSockets.has(userId)) {
    userSockets.set(userId, new Set());
  }
  userSockets.get(userId)!.add(socket.id);

  // 2. 🔹 Update user status in DB
  // Set the user's status to 'online' and update last active time.
  const user = await User.findByIdAndUpdate(
    userId,
    {
      "tracking.status": "online",
      "tracking.lastActiveAt": now,
    },
    { new: true, select: "privacy social.friends" } // Get the updated user with privacy and friends data
  ).exec();

  // 3. 📢 Broadcast the 'online' status (with Privacy Check)
  if (user) {
    if (user.privacy.showStatus) {
      // The user has allowed their status to be shown.
      
      // 🔥 Currently broadcasting to EVERYONE as per request. 
      // This should ideally be restricted to Friends/Groups for better performance and security.
      io.emit(USER_STATUS_EVENT, { userId, status: "online" });

      /*
        // 🛡️ BEST PRACTICE: Restrict Broadcast to Relevant Users (Friends/Groups)
        // 
        // const friendIds = user.social.friends.map(friend => friend.toString());
        // 
        // // Get all socket IDs of the friends to notify
        // const relevantSockets = new Set<string>();
        // friendIds.forEach(friendId => {
        //   if (userSockets.has(friendId)) {
        //     userSockets.get(friendId)!.forEach(socketId => relevantSockets.add(socketId));
        //   }
        // });
        // 
        // // Broadcast to those specific sockets
        // relevantSockets.forEach(socketId => {
        //   io.to(socketId).emit(USER_STATUS_EVENT, { userId, status: "online" });
        // });
      */
      
    } else {
      // User has set status as private (showStatus: false).
      // In a real-world app, you might only send a 'lastSeen' update to friends, 
      // or send no status update, making them appear 'offline' to others.
      console.log(`User ${userId} is connected but status is hidden.`);
    }
  } else {
    console.error(`User document not found for ID: ${userId} after connection update.`);
    // You might want to disconnect the socket if the user is invalid
    // socket.disconnect(true);
  }

  console.log(
    `✅ User Connected: ${socket.id}, ID: ${userId}, Name: ${socket.user?.name}`
  );

  // 4. 🔹 Attach all handlers (Chat, Notifications, etc.)
  attachAllHandlers(io, socket, userSockets);
};