import { AuthenticatedSocket } from "@/types/chat";
import Message from "@/models/Message";

export const deleteMessageHandler = (socket: AuthenticatedSocket) => {
  socket.on("deleteMessage", async ({ messageId }: { messageId: string }) => {
    try {
      const msg = await Message.findById(messageId);
      if (!msg) throw new Error("Message not found");

      await Message.deleteOne({ _id: messageId });
      socket.emit("messageDeleted", { messageId });
    } catch (err) {
      console.error("deleteMessage error:", err);
      socket.emit("deleteMessageError", "Failed to delete message");
    }
  });
};