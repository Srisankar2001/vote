import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PartyService } from './party.service';
import { ResponseDto } from 'src/commonDto/response.dto';
import { CreatePartyDto } from './dto/createParty.dto';
import { UpdatePartyDto } from './dto/updateParty.dto';

@Controller('party')
export class PartyController {
    constructor(private readonly partyService : PartyService) { }
    
        @Get("/")
        async getAll(): Promise<ResponseDto<any>> {
            return this.partyService.getAll();
        }
    
        @Get("/:id")
        async get(@Param('id') id: string): Promise<ResponseDto<any>> {
            return this.partyService.get(id);
        }
    
        @Post("/")
        async create(@Body() createPartyDto: CreatePartyDto): Promise<ResponseDto<any>> {
            return this.partyService.create(createPartyDto);
        }
    
        @Put("/:id")
        async update(@Param('id') id: string, @Body() updatePartyDto: UpdatePartyDto): Promise<ResponseDto<any>> {
            return this.partyService.update(id, updatePartyDto);
        }
    
        @Delete("/:id")
        async delete(@Param('id') id: string):Promise<ResponseDto<any>>{
            return this.partyService.delete(id);
        }
}
