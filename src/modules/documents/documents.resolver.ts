import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { Document } from './models/document.model';
import { DocumentComment } from './models/document-comment.model';
import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';
import { User } from '@/users/models/user.model';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/decorators/current-user.decorator';

@Resolver(() => Document)
export class DocumentsResolver {
  constructor(private readonly documentsService: DocumentsService) {}

  @Query(() => [Document])
  @UseGuards(GqlAuthGuard)
  listDocuments(
    @CurrentUser() user: AuthenticatedUser,
    @Args('orgId', { type: () => ID }) orgId: string,
  ): Promise<Document[]> {
    return this.documentsService.listDocuments(user.id, orgId) as Promise<Document[]>;
  }

  @Query(() => Document, { nullable: true })
  @UseGuards(GqlAuthGuard)
  findDocumentById(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Document> {
    return this.documentsService.findDocumentById(user.id, id) as Promise<Document>;
  }

  @Mutation(() => Document)
  @UseGuards(GqlAuthGuard)
  createDocument(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: CreateDocumentInput,
  ): Promise<Document> {
    return this.documentsService.createDocument(user.id, input) as Promise<Document>;
  }

  @Mutation(() => Document)
  @UseGuards(GqlAuthGuard)
  updateDocument(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: UpdateDocumentInput,
  ): Promise<Document> {
    return this.documentsService.updateDocument(user.id, input) as Promise<Document>;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  removeDocument(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.documentsService.removeDocument(user.id, id);
  }

  @Mutation(() => DocumentComment)
  @UseGuards(GqlAuthGuard)
  addCommentToDocument(
    @CurrentUser() user: AuthenticatedUser,
    @Args('documentId', { type: () => ID }) documentId: string,
    @Args('body') body: string,
  ): Promise<DocumentComment> {
    return this.documentsService.addCommentToDocument(
      user.id,
      documentId,
      body,
    ) as Promise<DocumentComment>;
  }

  @ResolveField(() => [DocumentComment])
  comments(@Parent() document: Document): Promise<DocumentComment[]> {
    return this.documentsService.listCommentsByDocument(document.id) as Promise<DocumentComment[]>;
  }
}

@Resolver(() => DocumentComment)
export class DocumentCommentResolver {
  constructor(private readonly documentsService: DocumentsService) {}

  @ResolveField(() => User)
  author(@Parent() comment: DocumentComment): Promise<User> {
    return this.documentsService.findCommentAuthor(comment.authorId) as Promise<User>;
  }
}
