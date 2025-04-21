interface chatMessage {
    user: string;
    message: string;
    timestamp: string;
}

export class ChatManager {

    private static instance: ChatManager;
    private chatHistory: chatMessage[];

    private constructor() {
        this.chatHistory = [];
    }

    static getInstance(): ChatManager {
        if (!ChatManager.instance) {
            ChatManager.instance = new ChatManager();
        }
        return ChatManager.instance;
    }

    addMessage(message:chatMessage): void{
        this.chatHistory.push(message);
    }

    getMessages(): chatMessage[] {
        return this.chatHistory;
    }

    clearHistory(): void{
        this.chatHistory = [];
    }
    
}