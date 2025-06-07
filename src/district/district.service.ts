import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { District } from 'src/typeorm/entities/district.entity';
import { CreateDistrictDto } from './dto/createDistrict.dto';
import { UpdateDistrictDto } from './dto/updateDistrict.dto';
import { ResponseDto } from '../common/dto/response.dto';
import { ResponseDistrictDto } from './dto/responseDistrictDto.dto';

@Injectable()
export class DistrictService {
    constructor(
        @InjectRepository(District)
        private readonly districtRepo: Repository<District>,
    ) { }

    async getDistrictById(id: number): Promise<District | null> {
        return this.districtRepo.findOneBy({ districtId: id });
    }

    async isDistrictExistsName(name: string): Promise<boolean> {
        return this.districtRepo.existsBy({ districtName: name });
    }

    async create(createDistrictDto: CreateDistrictDto): Promise<ResponseDto<any>> {
        try {
            const existing = await this.isDistrictExistsName(createDistrictDto.name);
            if (existing) {
                return new ResponseDto(400, 'District Name Already Exists', null);
            }

            const newDistrict = this.districtRepo.create({ districtName: createDistrictDto.name });
            await this.districtRepo.save(newDistrict);

            return new ResponseDto(201, 'District Created Successfully', null);
        } catch (error) {
            return new ResponseDto(500, 'Internal Server Error', null);
        }
    }

    async get(id: string): Promise<ResponseDto<any>> {
        try {
            if (isNaN(Number(id))) {
                return new ResponseDto(400, 'ID must be a number', null);
            }

            const district = await this.getDistrictById(Number(id));
            if (!district) {
                return new ResponseDto(404, 'District Not Found', null);
            }

            const response = new ResponseDistrictDto(district.districtId, district.districtName);
            return new ResponseDto(200, 'District Fetched Successfully', response);
        } catch (error) {
            return new ResponseDto(500, 'Internal Server Error', null);
        }
    }

    async getAll(): Promise<ResponseDto<any>> {
        try {
            const districts = await this.districtRepo.find();

            const response = districts.map(
                (district) => new ResponseDistrictDto(district.districtId, district.districtName),
            );

            return new ResponseDto(200, 'Districts Fetched Successfully', response);
        } catch (error) {
            return new ResponseDto(500, 'Internal Server Error', null);
        }
    }

    async update(id: string, updatePartyDto: UpdateDistrictDto): Promise<ResponseDto<any>> {
        try {
            if (isNaN(Number(id))) {
                return new ResponseDto(400, 'ID must be a number', null);
            }

            const district = await this.getDistrictById(Number(id));
            if (!district) {
                return new ResponseDto(404, 'District Not Found', null);
            }

            if (updatePartyDto.name && updatePartyDto.name !== district.districtName) {
                const existing = await this.isDistrictExistsName(updatePartyDto.name);
                if (existing) {
                    return new ResponseDto(400, 'District Name Already Exists', null);
                }
                district.districtName = updatePartyDto.name;
            }

            await this.districtRepo.save(district);
            return new ResponseDto(200, 'District Updated Successfully', null);
        } catch (error) {
            return new ResponseDto(500, 'Internal Server Error', null);
        }
    }

    async delete(id: string): Promise<ResponseDto<any>> {
        try {
            if (isNaN(Number(id))) {
                return new ResponseDto(400, 'ID must be a number', null);
            }

            const district = await this.getDistrictById(Number(id));
            if (!district) {
                return new ResponseDto(404, 'District Not Found', null);
            }

            await this.districtRepo.delete(district.districtId);
            return new ResponseDto(200, 'District Deleted Successfully', null);
        } catch (error) {
            return new ResponseDto(500, 'Internal Server Error', null);
        }
    }
}
