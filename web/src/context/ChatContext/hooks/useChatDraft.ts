import { useState } from "react";
import { DraftMessage } from "@/types/message/indexs";

const defaultDraft: DraftMessage = { text: "", attachments: [] };

export function useChatDraft() {
  const [draftMessage, setDraftMessage] = useState<DraftMessage>(defaultDraft);
  const [replyToId, setReplyToId] = useState<string | null>(null);

  return { draftMessage, setDraftMessage, replyToId, setReplyToId };
}
