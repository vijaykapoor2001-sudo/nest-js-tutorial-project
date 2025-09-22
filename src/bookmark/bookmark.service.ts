import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookmarkService {
     constructor(private prisma: PrismaService) {}
 
    getBookmarks(userId: number) {
        return this.prisma.bookmark.findMany({
            where: {
                userId,
            },
        });
   }

    getBookmarkById(userId: number, bookmarkId: number) {
         return this.prisma.bookmark.findFirst({
            where: {
                id: bookmarkId,
                userId,
            },
        });
    }

    async createBookmark(userId: number, dto: CreateBookmarkDto) {
        const bookmark = await this.prisma.bookmark.create({
            data: {
            userId, // the FK to User
            ...dto, // title, description, link etc.
            },
        });
        console.log('bkm: ', bookmark);
        return bookmark;
        }
    
 
    async editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId,
            },
        });
        if (!bookmark || bookmark.userId !== userId) {
            throw new ForbiddenException('Access to resources denied');
        }
        return this.prisma.bookmark.update({
            where: {
                id: bookmarkId,
            },
            data: {
                ...dto,
            },
        });
    }
 
    async deleteBookmark(userId: number, bookmarkId: number) {
        // ensure bookmark belongs to the user
        const bookmark = await this.prisma.bookmark.findUnique({
            where: { id: bookmarkId },
        });

        if (!bookmark || bookmark.userId !== userId) {
            throw new ForbiddenException('Access to resource denied');
        }

        await this.prisma.bookmark.delete({
            where: { id: bookmarkId },
        });
        return;
        }

}
