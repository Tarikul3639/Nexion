import { Server } from "socket.io";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message/Message";
import { AuthenticatedSocket } from "@/types/chat";
import mongoose from "mongoose";

export const messageReadHandler = (
  io: Server,
  socket: AuthenticatedSocket,
  userSockets: Map<string, Set<string>>
) => {
  socket.on(
    "messageRead",
    async ({ messageId, userId }: { messageId: string; userId: string }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) throw new Error("Message not found");

        if (!message.readBy?.includes(new mongoose.Types.ObjectId(userId))) {
          message.readBy = [
            ...(message.readBy || []),
            new mongoose.Types.ObjectId(userId),
          ];
        }

        message.status = "seen";
        await message.save();

        const conversation = await Conversation.findById(
          message.conversation
        ).lean();
        if (conversation?.participants) {
          conversation.participants.forEach((participantId: any) => {
            const sockets = userSockets.get(participantId.toString());
            sockets?.forEach((sId) => {
              io.to(sId).emit("messageRead", {
                messageId: messageId,
                userId: userId,
                conversationId: conversation._id.toString(),
              });
            });
          });
        }
      } catch (err) {
        console.error("messageRead error:", err);
        socket.emit("messageReadError", "Failed to mark message as read");
      }
    }
  );
};