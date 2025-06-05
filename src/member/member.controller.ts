import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { MemberService } from './member.service';
import { ResponseDto } from 'src/commonDto/response.dto';
import { CreateMemberDto } from './dto/createMember.dto';
import { UpdateMemberDto } from './dto/updateMember.dto';

@Controller('member')
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
            async create(@Body() createMemberDto: CreateMemberDto): Promise<ResponseDto<any>> {
                return this.memberService.create(createMemberDto);
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
