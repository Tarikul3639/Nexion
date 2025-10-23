// src/sockets/handlers/readStatusHandler.ts

import { Server } from "socket.io";
import { AuthenticatedSocket } from "@/types/chat";
import Conversation from "@/models/Conversation";

export const handleReadStatus = (io: Server, socket: AuthenticatedSocket, userSockets: Map<string, Set<string>>) => {
    // 🔑 ইভেন্টের নাম: 'conversation:read' (অথবা 'mark_as_read')
    socket.on("conversation:read", async ({ conversationId }: { conversationId: string }) => {
        try {
            if (!socket.user || !conversationId) return;

            const currentUserId = socket.user._id;
            console.log("Read status update ID: ", currentUserId, "Name: ",socket.user.name);
            const now = new Date();

            // 1. ডেটাবেস আপডেট: ইউজারের lastViewed আপডেট করা
            await Conversation.updateOne(
                { 
                    _id: conversationId,
                    'participants.user': currentUserId // নিশ্চিত করে যে ইউজারটি অংশগ্রহণকারী
                },
                { 
                    // $set: array filtering ব্যবহার করে শুধুমাত্র বর্তমান ইউজারের lastViewed আপডেট
                    $set: { 
                        'participants.$.lastViewed': now,
                    }
                }
            );

            // 2. অপশনাল ব্রডকাস্ট: চ্যাটের বাকি অংশগ্রহণকারীদের জানানো
            // এটি দরকার যদি আপনি রিয়েল-টাইমে "Seen by..." স্ট্যাটাস দেখাতে চান।
            socket.to(conversationId).emit("conversation:marked_read", { 
                conversationId, 
                readerId: currentUserId,
                readAt: now.toISOString()
            });

        } catch (error) {
            console.error("Error updating lastViewed:", error);
        }
    });
};

// আপনার attachAllHandlers-এ এটিকে যুক্ত করুন।