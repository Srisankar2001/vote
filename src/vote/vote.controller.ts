import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { VoteService } from './vote.service';
import { ResponseDto } from 'src/common/dto/response.dto';
import { VoteDto } from './dto/vote.dto';
import { UserGuard } from 'src/common/guard/user.guard';
import { Request } from 'express';
import { AdminGuard } from 'src/common/guard/admin.guard';

@Controller('vote')
export class VoteController {
    constructor(private readonly voteService: VoteService) { }

    @Get("/party")
    @UseGuards(AdminGuard)
    async getCountByParty():Promise<ResponseDto<any>>{
        return this.voteService.getCountByParty();
    }

    @Get("/member")
    @UseGuards(AdminGuard)
    async getCountByMember():Promise<ResponseDto<any>>{
        return this.voteService.getCountByMember();
    }

    @Get("/district/party/:id")
    @UseGuards(AdminGuard)
    async getCountByDistrictForParty(@Param('id') id:string):Promise<ResponseDto<any>>{
        return this.voteService.getCountByDistrictForParty(id);
    }

    @Get("/district/member/:id")
    @UseGuards(AdminGuard)
    async getCountByDistrictForMember(@Param('id') id:string):Promise<ResponseDto<any>>{
        return this.voteService.getCountByDistrictForMember(id);
    }

    @Post("/")
    @UseGuards(UserGuard)
    async vote(@Req() req: Request, @Body() voteDto: VoteDto): Promise<ResponseDto<any>> {
        const userId :number = req.id!;
        return this.voteService.vote(userId,voteDto);
    }

}
