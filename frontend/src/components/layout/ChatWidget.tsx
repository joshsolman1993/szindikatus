import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Send, Minimize2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

import { useChat } from '../../context/ChatContext';

export const ChatWidget = () => {
    const { messages, systemEvents, sendMessage, isConnected, lastPrivateMessage, sendPrivateMessage } = useSocket();
    const { user } = useAuth();
    const { isOpen, setIsOpen, activeTab, setActiveTab, activePartner, setActivePartner } = useChat();

    const [newMessage, setNewMessage] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const feedEndRef = useRef<HTMLDivElement>(null);
    const privateEndRef = useRef<HTMLDivElement>(null);

    const [conversations, setConversations] = useState<any[]>([]);
    const [privateMessages, setPrivateMessages] = useState<any[]>([]);
    const [newPrivateMessage, setNewPrivateMessage] = useState('');

    // Auto-scroll to bottom
    useEffect(() => {
        if (activeTab === 'chat') {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        } else if (activeTab === 'feed') {
            feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        } else if (activeTab === 'private' && activePartner) {
            privateEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, systemEvents, activeTab, isOpen, privateMessages, activePartner]);

    // Unread counter
    useEffect(() => {
        if (!isOpen) {
            setUnreadCount(prev => prev + 1);
        }
    }, [messages, systemEvents, lastPrivateMessage]);

    useEffect(() => {
        if (isOpen) {
            setUnreadCount(0);
        }
    }, [isOpen]);

    // Fetch conversations
    useEffect(() => {
        if (activeTab === 'private' && user) {
            fetchConversations();
        }
    }, [activeTab, user, isOpen]);

    const fetchConversations = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await fetch('http://localhost:3000/chat/conversations', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setConversations(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Fetch conversation history
    useEffect(() => {
        if (activePartner) {
            fetchConversation(activePartner.partnerId);
        }
    }, [activePartner]);

    const fetchConversation = async (partnerId: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await fetch(`http://localhost:3000/chat/conversation/${partnerId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPrivateMessages(data);
                // Mark as read
                await fetch(`http://localhost:3000/chat/read/${partnerId}`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchConversations(); // Update unread count in list
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Handle incoming private message
    useEffect(() => {
        if (lastPrivateMessage) {
            // If active partner matches, append message
            if (activePartner && (lastPrivateMessage.senderId === activePartner.partnerId || lastPrivateMessage.receiverId === activePartner.partnerId)) {
                setPrivateMessages(prev => {
                    // Avoid duplicates if already added by optimistic update or fetch
                    if (prev.some(m => m.id === lastPrivateMessage.id)) return prev;
                    return [...prev, lastPrivateMessage];
                });
            }
            // Refresh conversations list
            fetchConversations();
        }
    }, [lastPrivateMessage]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            sendMessage(newMessage);
            setNewMessage('');
        }
    };

    const handlePrivateSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPrivateMessage.trim() && activePartner) {
            sendPrivateMessage(activePartner.partnerId, newPrivateMessage);
            setNewPrivateMessage('');
        }
    };

    if (!user) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="relative bg-primary hover:bg-primary-dark text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-105"
                >
                    <MessageSquare className="w-6 h-6" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-surface border border-gray-800 rounded-lg shadow-2xl w-80 sm:w-96 flex flex-col h-[500px] animate-in slide-in-from-bottom-10 fade-in duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 border-b border-gray-800 bg-gray-900 rounded-t-lg">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('chat')}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${activeTab === 'chat' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Chat
                            </button>
                            <button
                                onClick={() => setActiveTab('feed')}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${activeTab === 'feed' ? 'bg-secondary text-black' : 'text-gray-400 hover:text-white'}`}
                            >
                                Hírek
                            </button>
                            <button
                                onClick={() => setActiveTab('private')}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${activeTab === 'private' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Privát
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} title={isConnected ? 'Kapcsolódva' : 'Szétkapcsolva'} />
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                                <Minimize2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-900/50">
                        {activeTab === 'chat' ? (
                            <div className="space-y-3">
                                {messages.length === 0 && (
                                    <div className="text-center text-gray-500 text-sm mt-10">
                                        Nincs üzenet. Kezdj el beszélgetni!
                                    </div>
                                )}
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex flex-col ${msg.sender === user.username ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[80%] rounded-lg p-2 text-sm ${msg.sender === user.username ? 'bg-primary/20 text-primary-light border border-primary/30' : 'bg-gray-800 text-gray-200 border border-gray-700'}`}>
                                            <div className="font-bold text-xs mb-1 opacity-70">{msg.sender}</div>
                                            {msg.message}
                                        </div>
                                        <span className="text-[10px] text-gray-600 mt-1">
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        ) : activeTab === 'feed' ? (
                            <div className="space-y-3">
                                {systemEvents.length === 0 && (
                                    <div className="text-center text-gray-500 text-sm mt-10">
                                        Nincsenek hírek.
                                    </div>
                                )}
                                {systemEvents.map((evt, idx) => (
                                    <div key={idx} className="bg-gray-800/50 border-l-2 border-secondary p-2 rounded text-sm">
                                        <div className="text-gray-300">{evt.message}</div>
                                        <div className="text-[10px] text-gray-600 mt-1 text-right">
                                            {evt.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                ))}
                                <div ref={feedEndRef} />
                            </div>
                        ) : (
                            // Private Tab
                            activePartner ? (
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center gap-2 p-2 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-10">
                                        <button onClick={() => setActivePartner(null)} className="text-gray-400 hover:text-white text-xs">
                                            ← Vissza
                                        </button>
                                        <div className="font-bold text-sm">{activePartner.partnerName}</div>
                                    </div>
                                    <div className="flex-1 space-y-3 pt-2">
                                        {privateMessages.map((msg, idx) => (
                                            <div key={idx} className={`flex flex-col ${msg.senderId === user.id ? 'items-end' : 'items-start'}`}>
                                                <div className={`max-w-[80%] rounded-lg p-2 text-sm ${msg.senderId === user.id ? 'bg-purple-600/20 text-purple-200 border border-purple-600/30' : 'bg-gray-800 text-gray-200 border border-gray-700'}`}>
                                                    {msg.content}
                                                </div>
                                                <span className="text-[10px] text-gray-600 mt-1">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        ))}
                                        <div ref={privateEndRef} />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {conversations.length === 0 && (
                                        <div className="text-center text-gray-500 text-sm mt-10">
                                            Nincs privát üzeneted.
                                        </div>
                                    )}
                                    {conversations.map((conv) => (
                                        <div
                                            key={conv.partnerId}
                                            onClick={() => setActivePartner(conv)}
                                            className="p-3 bg-gray-800/50 hover:bg-gray-800 rounded cursor-pointer transition-colors flex items-center justify-between"
                                        >
                                            <div>
                                                <div className="font-bold text-sm text-gray-200">{conv.partnerName}</div>
                                                <div className="text-xs text-gray-500 truncate max-w-[150px]">{conv.lastMessage}</div>
                                            </div>
                                            {conv.unreadCount > 0 && (
                                                <div className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                    {conv.unreadCount}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )
                        )}
                    </div>

                    {/* Input (only for Chat) */}
                    {activeTab === 'chat' && (
                        <form onSubmit={handleSend} className="p-3 border-t border-gray-800 bg-gray-900 rounded-b-lg">
                            <div className="flex gap-2">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Írj valamit..."
                                    className="flex-1 h-9 text-sm"
                                    disabled={!isConnected}
                                />
                                <Button type="submit" size="sm" disabled={!isConnected || !newMessage.trim()} className="px-3">
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'private' && activePartner && (
                        <form onSubmit={handlePrivateSend} className="p-3 border-t border-gray-800 bg-gray-900 rounded-b-lg">
                            <div className="flex gap-2">
                                <Input
                                    value={newPrivateMessage}
                                    onChange={(e) => setNewPrivateMessage(e.target.value)}
                                    placeholder="Írj valamit..."
                                    className="flex-1 h-9 text-sm"
                                    disabled={!isConnected}
                                />
                                <Button type="submit" size="sm" disabled={!isConnected || !newPrivateMessage.trim()} className="px-3">
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};
