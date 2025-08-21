export interface ChatHeaderProps {
  selectedChat: {
    id: number;
    name: string;
    type: string;
    avatar: string;
    online: boolean;
    members?: number;
  };
  onBack: () => void;
}
