import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Server, Socket } from 'socket.io';
import { SendMessageCommand } from './commands/send-message.command';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Message } from './entitites/message.entity';
import { MessageObject } from './objects/message.object';
import { CheckConversationMessagesQuery } from './queries/check-conversation-messages.query';
import { PaginationQuery } from '@/common/models/pagination';

interface JoinConversationPayload {
  conversation_id: string;
  page?: number;
  take?: number;
}

interface SendMessagePayload {
  conversation_id: string;
  content?: string;
}

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: true,
    credentials: true,
  },
})
export class ChatWebSocket {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  handleConnection(client: Socket) {
    try {
      this.resolveProfileId(client);
    } catch (error) {
      client.emit('error', 'unauthorized');
      client.disconnect(true);
    }
  }

  @SubscribeMessage('conversation.join')
  async handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinConversationPayload,
  ) {
    const profile_id = this.resolveProfileId(client);
    this.ensureConversationId(payload.conversation_id);

    client.join(payload.conversation_id);

    const pagination = this.buildPagination(payload);
    const history = await this.queryBus.execute(
      new CheckConversationMessagesQuery(
        profile_id,
        payload.conversation_id,
        pagination,
      ),
    );

    client.emit('conversation.history', history);
  }

  @SubscribeMessage('message.send')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendMessagePayload,
  ): Promise<MessageObject> {
    const profile_id = this.resolveProfileId(client);
    this.ensureConversationId(payload.conversation_id);

    const savedMessage = await this.commandBus.execute(
      new SendMessageCommand(
        profile_id,
        payload.conversation_id,
        payload.content,
      ),
    );

    const messageObject = this.mapper.map(savedMessage, Message, MessageObject);

    const senderMessage: MessageObject = { ...messageObject, is_owner: true };
    const participantMessage: MessageObject = {
      ...messageObject,
      is_owner: false,
    };

    client.emit('message.sent', senderMessage);
    client
      .to(payload.conversation_id)
      .emit('message.received', participantMessage);

    return senderMessage;
  }

  private ensureConversationId(conversation_id?: string) {
    if (!conversation_id) {
      throw new WsException('conversation_id_required');
    }
  }

  private resolveProfileId(client: Socket): string {
    const profile_id =
      (client.data?.profile_id as string | undefined) ||
      this.asString(client.handshake.auth?.profile_id) ||
      this.asString(client.handshake.query?.profile_id);

    if (!profile_id) throw new WsException('unauthorized');

    client.data.profile_id = profile_id;
    return profile_id;
  }

  private buildPagination(payload: JoinConversationPayload): PaginationQuery {
    const pagination = new PaginationQuery();
    if (payload.page) pagination.page = payload.page;
    if (payload.take) pagination.take = payload.take;
    return pagination;
  }

  private asString(value: unknown): string | null {
    if (typeof value === 'string' && value.trim().length > 0) return value;

    if (Array.isArray(value) && value.length > 0) {
      const head = value[0];
      return typeof head === 'string' && head.trim().length > 0 ? head : null;
    }

    return null;
  }
}
