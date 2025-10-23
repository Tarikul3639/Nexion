import mongoose, { Schema, Document, Model, Types } from "mongoose";

// --- 1. Sub-Document Interface for Participant Settings ---
// This holds all user-specific data related to the conversation
export interface IParticipantSettings {
    user: Types.ObjectId; // Reference to the User
    isPinned: boolean; // User-specific pin status (FIXED)
    isMuted: boolean; // User-specific mute status
    lastViewed: Date; // Used for Unread Count calculation (FIXED)
    // You can add more user-specific fields here (e.g., customGroupName, tags)
}

/**
 * Conversation Interface (TypeScript) - PRODUCTION READY
 */
export interface IConversation extends Document {
    _id: Types.ObjectId;
    name?: string;
    type: "direct" | "group" | "classroom";
    lastMessage?: Types.ObjectId;
    avatar?: string;

    // FIX: Participants is now an array of IParticipantSettings objects
    participants: IParticipantSettings[];

    inactiveParticipants?: Types.ObjectId[];

    // isPinned and unread removed from root schema
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Conversation Schema Definition
 */
const conversationSchema = new Schema<IConversation>(
    {
        name: {
            type: String,
            trim: true,
            maxlength: 100,
            default: "",
        },
        type: {
            type: String,
            enum: ["direct", "group", "classroom"],
            required: true,
            index: true,
        },
        lastMessage: {
            type: Schema.Types.ObjectId,
            ref: "Message",
        },
        avatar: {
            type: String,
            trim: true,
        },
        // FIX: Schema definition for the new Participant array
        participants: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                isPinned: { 
                    type: Boolean,
                    default: false,
                },
                isMuted: {
                    type: Boolean,
                    default: false,
                },
                lastViewed: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        inactiveParticipants: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    { timestamps: true }
);

/**
 * Indexes for performance
 */
// IMPORTANT: Indexing the nested user field for fast lookups (e.g., fetching a user's chats)
conversationSchema.index({ "participants.user": 1, updatedAt: -1 }); 
conversationSchema.index({ type: 1 });


/**
 * Pre-save validation (Adjusted for new participants structure)
 */
conversationSchema.pre<IConversation>("save", function (next) {
    
    // NEW: Extracting the actual user IDs from the sub-document structure
    const userIds = this.participants.map(p => p.user.toString());

    // Ensure participants are unique
    if (userIds.length > 0) {
        const uniqueIds = Array.from(new Set(userIds));

        if (uniqueIds.length !== userIds.length) {
            // Rebuild the participants array with unique IDs and default settings
            this.participants = uniqueIds.map(id => {
                const existing = this.participants.find(p => p.user.toString() === id);
                return {
                    user: new mongoose.Types.ObjectId(id),
                    isPinned: existing?.isPinned ?? false,
                    isMuted: existing?.isMuted ?? false,
                    lastViewed: existing?.lastViewed ?? new Date(),
                };
            });
        }
    }

    // Validate direct chat participant count
    if (this.type === "direct" && this.participants.length !== 2) {
        return next(
            new Error("Direct conversation must have exactly 2 participants.")
        );
    }
    
    // Initializing lastViewed for new participants
    this.participants = this.participants.map(p => ({
        ...p,
        lastViewed: p.lastViewed || new Date(),
    }));

    next();
});

/**
 * Soft delete filter (Unchanged)
 */
conversationSchema.pre<mongoose.Query<IConversation[], IConversation>>(
    /^find/,
    function (next) {
        this.where({ isDeleted: { $ne: true } });
        next();
    }
);

/**
 * Post-delete cleanup (Unchanged)
 */
conversationSchema.post(
    "findOneAndDelete",
    async function (doc: IConversation) {
        if (doc && doc._id) {
            try {
                // Ensure Message model is initialized before calling deleteMany
                await mongoose.model("Message").deleteMany({ conversationId: doc._id }); 
            } catch (err) {
                console.error(
                    "Error cleaning up messages for deleted conversation:",
                    err
                );
            }
        }
    }
);

/**
 * Create and export the model
 */
export const Conversation: Model<IConversation> = mongoose.model<IConversation>(
    "Conversation",
    conversationSchema
);

export default Conversation;
