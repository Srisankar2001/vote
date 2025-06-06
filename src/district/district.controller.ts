import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { DistrictService } from './district.service';
import { ResponseDto } from 'src/common/dto/response.dto';
import { CreateDistrictDto } from './dto/createDistrict.dto';
import { UpdateDistrictDto } from './dto/updateDistrict.dto';

@Controller('district')
export class DistrictController {
    constructor(private readonly districtService: DistrictService) { }

    @Get("/")
    async getAll(): Promise<ResponseDto<any>> {
        return this.districtService.getAll();
    }

    @Get("/:id")
    async get(@Param('id') id: string): Promise<ResponseDto<any>> {
        return this.districtService.get(id);
    }

    @Post("/")
    async create(@Body() createDistrictDto: CreateDistrictDto): Promise<ResponseDto<any>> {
        return this.districtService.create(createDistrictDto);
    }

    @Put("/:id")
    async update(@Param('id') id: string, @Body() updateDistrictDto: UpdateDistrictDto): Promise<ResponseDto<any>> {
        return this.districtService.update(id, updateDistrictDto);
    }

    @Delete("/:id")
    async delete(@Param('id') id: string):Promise<ResponseDto<any>>{
        return this.districtService.delete(id);
    }
}
