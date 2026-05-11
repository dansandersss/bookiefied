import { model, Schema, models } from "mongoose";

const ChatMessageSchema = new Schema({
    clerkId: { type: String, required: true, index: true },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true, index: true },
    role: { type: String, required: true, enum: ['user', 'assistant', 'system'] },
    content: { type: String, required: true },
}, { timestamps: true });

// Compound index for efficient fetching of chat history for a specific book and user
ChatMessageSchema.index({ clerkId: 1, bookId: 1, createdAt: 1 });

const ChatMessage = models.ChatMessage || model('ChatMessage', ChatMessageSchema);

export default ChatMessage;
