import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwTGuard } from 'src/auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from 'src/auth/decorator';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwTGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmark: BookmarkService ) {
        
    }
    @Get()
    getBookmarks(@GetUser('id') userId: number) {
        return this.bookmark.getBookmarks(userId);
    }
    
    @Get('id')
    getBookmarkById(
        @GetUser('id') userId: number, 
        @Param('id', ParseIntPipe) bookmarkId: number
    ) {
        return this.bookmark.getBookmarkById(userId, bookmarkId);
    }
    
    @Post()
    @HttpCode(HttpStatus.CREATED) // 👈 this will make it 201
    createBookmark(@GetUser('id') userId: number, @Body() dto:CreateBookmarkDto) {
        return this.bookmark.createBookmark(userId, dto);
    } 
    
    @Patch(':id')
    editBookmarkById(
        @GetUser('id') userId: number, 
        @Param('id', ParseIntPipe) bookmarkId: number,
        @Body() dto:EditBookmarkDto) {
        return this.bookmark.editBookmarkById(userId, bookmarkId, dto);
    }
    
    
    @Delete(':id')  // NOT 'id'
    @HttpCode(204)
    deleteBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number
    ) {
        return this.bookmark.deleteBookmark(userId, bookmarkId);
    }

}