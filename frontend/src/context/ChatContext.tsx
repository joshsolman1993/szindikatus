import { createContext, useContext, useState, type ReactNode } from 'react';

interface ChatContextType {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    activeTab: 'chat' | 'feed' | 'private';
    setActiveTab: (tab: 'chat' | 'feed' | 'private') => void;
    activePartner: any;
    setActivePartner: (partner: any) => void;
    openPrivateChat: (partnerId: string, partnerName: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'chat' | 'feed' | 'private'>('chat');
    const [activePartner, setActivePartner] = useState<any>(null);

    const openPrivateChat = (partnerId: string, partnerName: string) => {
        setIsOpen(true);
        setActiveTab('private');
        setActivePartner({ partnerId, partnerName, unreadCount: 0 });
    };

    return (
        <ChatContext.Provider value={{
            isOpen,
            setIsOpen,
            activeTab,
            setActiveTab,
            activePartner,
            setActivePartner,
            openPrivateChat
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
