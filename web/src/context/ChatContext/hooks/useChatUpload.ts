import { useState } from "react";

export function useChatUpload() {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  return { uploadProgress, setUploadProgress };
}
