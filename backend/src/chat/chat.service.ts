import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async saveMessage(
    senderId: string,
    receiverId: string,
    content: string,
  ): Promise<Message> {
    const message = this.messageRepository.create({
      senderId,
      receiverId,
      content,
    });
    return this.messageRepository.save(message);
  }

  async getConversation(userId: string, partnerId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: [
        { senderId: userId, receiverId: partnerId },
        { senderId: partnerId, receiverId: userId },
      ],
      order: { createdAt: 'ASC' },
      relations: ['sender', 'receiver'], // Load relations to display names/avatars if needed
    });
  }

  async getConversationsList(userId: string): Promise<any[]> {
    // Get all messages where user is sender or receiver
    const messages = await this.messageRepository.find({
      where: [{ senderId: userId }, { receiverId: userId }],
      order: { createdAt: 'DESC' },
      relations: ['sender', 'receiver'],
    });

    const partnersMap = new Map<string, any>();

    for (const msg of messages) {
      const isSender = msg.senderId === userId;
      const partnerId = isSender ? msg.receiverId : msg.senderId;
      const partner = isSender ? msg.receiver : msg.sender;

      if (!partnersMap.has(partnerId)) {
        partnersMap.set(partnerId, {
          partnerId,
          partnerName: partner.username, // Assuming User has username
          partnerAvatar: partner.avatarUrl, // Assuming User has avatarUrl
          lastMessage: msg.content,
          lastMessageDate: msg.createdAt,
          unreadCount: 0,
        });
      }

      if (!isSender && !msg.isRead) {
        const partnerData = partnersMap.get(partnerId);
        partnerData.unreadCount++;
      }
    }

    return Array.from(partnersMap.values());
  }

  async markAsRead(userId: string, senderId: string): Promise<void> {
    await this.messageRepository.update(
      { receiverId: userId, senderId: senderId, isRead: false },
      { isRead: true },
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.messageRepository.count({
      where: { receiverId: userId, isRead: false },
    });
  }
}
