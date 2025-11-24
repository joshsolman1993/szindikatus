import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

interface Message {
    id: string;
    sender?: string;
    message: string;
    timestamp: Date;
    type: 'chat' | 'combat' | 'crime' | 'info';
}

export const useSocket = () => {
    const { token, isAuthenticated } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [systemEvents, setSystemEvents] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || !token) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        // Connect to backend
        const newSocket = io('http://localhost:3000', {
            auth: {
                token: token,
            },
        });

        newSocket.on('connect', () => {
            console.log('Socket connected');
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });

        newSocket.on('messageToClient', (data: Message) => {
            setMessages((prev) => [...prev, { ...data, timestamp: new Date(data.timestamp) }]);
        });

        newSocket.on('systemNotification', (data: Message) => {
            setSystemEvents((prev) => [...prev, { ...data, timestamp: new Date(data.timestamp) }]);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [isAuthenticated, token]);

    const sendMessage = (message: string) => {
        if (socket && isConnected) {
            socket.emit('sendMessage', { message });
        }
    };

    return {
        socket,
        isConnected,
        messages,
        systemEvents,
        sendMessage,
    };
};
