import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePublicationCommand } from '../commands/create-publication.command';
import { CreatePublicationBody } from '../objects/create-publication.object';
import { Session } from '@/auth/decorators/session.decorator';
import { GetPublicationQuery } from '../queries/get-publication.query';
import { PaginationQuery } from '@/common/models/pagination';
import { ProfileContentQuery } from '../queries/profile-content.query';
import { RemovePublicationLikeCommand } from '../commands/remove-publication-like.command';
import { AddPublicationLikeCommand } from '../commands/add-publication-like.command';
import { CreateCommentCommand } from '../commands/create-comment.command';
import { DeleteCommentCommand } from '../commands/delete-comment.command';
import { CreateCommentBody } from '../objects/create-comment.object';
import { ListPublicationCommentsQuery } from '../queries/list-publication-comments.query';
import { DeletePublicationCommand } from '../commands/delete-publication.command';

@Controller('publications')
export class PublicationsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(
    @Session('profile_id') profile_id: string,
    @Body() body: CreatePublicationBody,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    if (files && files.length > 0) {
      body.assets = files.map((file) => file.filename);
    }

    return this.commandBus.execute(
      new CreatePublicationCommand(profile_id, body),
    );
  }

  @Get(':publication_id')
  get(
    @Session('profile_id') profile_id: string,
    @Param('publication_id') publication_id: string,
  ) {
    return this.queryBus.execute(
      new GetPublicationQuery(profile_id, publication_id),
    );
  }

  @Delete(':publication_id')
  delete(
    @Session('profile_id') profile_id: string,
    @Param('publication_id') publication_id: string,
  ) {
    return this.commandBus.execute(
      new DeletePublicationCommand(profile_id, publication_id),
    );
  }

  @Get('profile/:username')
  profileContent(
    @Session('profile_id') profile_id: string,
    @Param('username') username: string,
    @Query() pagination: PaginationQuery,
  ) {
    return this.queryBus.execute(
      new ProfileContentQuery(profile_id, username, pagination),
    );
  }

  @Post(':publication_id/like')
  like(
    @Session('profile_id') profile_id: string,
    @Param('publication_id') publication_id: string,
  ) {
    return this.commandBus.execute(
      new AddPublicationLikeCommand(profile_id, publication_id),
    );
  }

  @Delete(':publication_id/like')
  unlike(
    @Session('profile_id') profile_id: string,
    @Param('publication_id') publication_id: string,
  ) {
    return this.commandBus.execute(
      new RemovePublicationLikeCommand(profile_id, publication_id),
    );
  }

  @Post(':publication_id/comment')
  comment(
    @Session('profile_id') profile_id: string,
    @Param('publication_id') publication_id: string,
    @Body() body: CreateCommentBody,
  ) {
    return this.commandBus.execute(
      new CreateCommentCommand(profile_id, publication_id, body),
    );
  }

  @Delete(':publication_id/comment/:comment_id')
  deleteComment(
    @Session('profile_id') profile_id: string,
    @Param('publication_id') publication_id: string,
    @Param('comment_id') comment_id: string,
  ) {
    return this.commandBus.execute(
      new DeleteCommentCommand(profile_id, publication_id, comment_id),
    );
  }

  @Get(':publication_id/comments')
  comments(
    @Session('profile_id') profile_id: string,
    @Param('publication_id') publication_id: string,
    @Query() pagination: PaginationQuery,
  ) {
    return this.queryBus.execute(
      new ListPublicationCommentsQuery(profile_id, publication_id, pagination),
    );
  }
}
