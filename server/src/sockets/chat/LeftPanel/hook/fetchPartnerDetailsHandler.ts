// Example: userHandlers.ts (or where you manage socket events)

import { Server } from "socket.io";
import { AuthenticatedSocket } from "@/types/chat"; 
import User from "@/models/User"; 

export const fetchPartnerDetailsHandler = (io: Server, socket: AuthenticatedSocket) => {
    socket.on("fetchPartnerDetails", async ({ partnerId }) => {
        console.log("Partner ID: ",partnerId);
        try {
            if (!partnerId) return;

            // 1. MongoDB থেকে পার্টনারের ডেটা খুঁজে বের করা
            const partner = await User.findById(partnerId)
                .select("name username avatar status")
                .lean();

            if (!partner) {
                // ইউজার না পেলে কিছু একটা ফেরত পাঠানো 
                socket.emit("partnerDetailsFetched", { id: partnerId, error: "User not found" });
                return;
            }

            // 2. ফ্রন্টএন্ডে ডেটা ফেরত পাঠানো
            const responseData = {
                id: partner._id.toString(),
                name: partner.name,
                username: partner.username,
                avatar: partner.avatar,
                status: partner.status,
            };

            // সরাসরি যে সকেট রিকোয়েস্ট করেছে, তাকেই ফেরত পাঠানো
            socket.emit("partnerDetailsFetched", responseData); 

        } catch (err) {
            console.error("Error fetching partner details:", err);
            socket.emit("partnerDetailsFetched", { id: partnerId, error: "Server error" });
        }
    });
};