import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile} from '@nestjs/common';
import { Express } from 'express';
import { PartyService } from './party.service';
import { ResponseDto } from 'src/common/dto/response.dto';
import { CreatePartyDto } from './dto/createParty.dto';
import { UpdatePartyDto } from './dto/updateParty.dto';
import { UploadImageInterceptor } from 'src/common/interceptor/imageupload.interceptor';

@Controller('party')
export class PartyController {
    constructor(private readonly partyService: PartyService) { }

    @Get("/")
    async getAll(): Promise<ResponseDto<any>> {
        return this.partyService.getAll();
    }

    @Get("/:id")
    async get(@Param('id') id: string): Promise<ResponseDto<any>> {
        return this.partyService.get(id);
    }

    @Post("/")
    @UploadImageInterceptor()
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() createPartyDto: CreatePartyDto
    ): Promise<ResponseDto<any>> {
        const image = file.filename;
        return this.partyService.create(createPartyDto,image);
    }

    @Put("/:id")
    async update(@Param('id') id: string, @Body() updatePartyDto: UpdatePartyDto): Promise<ResponseDto<any>> {
        return this.partyService.update(id, updatePartyDto);
    }

    @Delete("/:id")
    async delete(@Param('id') id: string): Promise<ResponseDto<any>> {
        return this.partyService.delete(id);
    }
}
