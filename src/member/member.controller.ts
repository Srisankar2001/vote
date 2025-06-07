import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards } from '@nestjs/common';
import { Express } from 'express';
import { MemberService } from './member.service';
import { ResponseDto } from 'src/common/dto/response.dto';
import { CreateMemberDto } from './dto/createMember.dto';
import { UpdateMemberDto } from './dto/updateMember.dto';
import { UploadImageInterceptor } from 'src/common/interceptor/imageupload.interceptor';
import { AdminGuard } from 'src/common/guard/admin.guard';

@Controller('member')
@UseGuards(AdminGuard)
export class MemberController {
     constructor(private readonly memberService : MemberService) { }
        
            @Get("/")
            async getAll(): Promise<ResponseDto<any>> {
                return this.memberService.getAll();
            }
        
            @Get("/:id")
            async get(@Param('id') id: string): Promise<ResponseDto<any>> {
                return this.memberService.get(id);
            }
        
            @Post("/")
            @UploadImageInterceptor()
            async create(
                @UploadedFile() file: Express.Multer.File,
                @Body() createMemberDto: CreateMemberDto
            ): Promise<ResponseDto<any>> {
                const image = file.filename;
                return this.memberService.create(createMemberDto,image);
            }
        
            @Put("/:id")
            async update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto): Promise<ResponseDto<any>> {
                return this.memberService.update(id, updateMemberDto);
            }
        
            @Delete("/:id")
            async delete(@Param('id') id: string):Promise<ResponseDto<any>>{
                return this.memberService.delete(id);
            }
}
