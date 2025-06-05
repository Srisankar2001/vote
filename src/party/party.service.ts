import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Party } from 'src/typeorm/entities/party.entity';
import { Repository } from 'typeorm';
import { CreatePartyDto } from './dto/createParty.dto';
import { ResponseDto } from 'src/commonDto/response.dto';
import { ResponsePartyDto } from './dto/responsePartyDto.dto';
import { UpdatePartyDto } from './dto/updateParty.dto';

@Injectable()
export class PartyService {
    constructor(
            @InjectRepository(Party)
            private readonly partyRepo: Repository<Party>,
        ) { }
    
        async getPartyById(id: number): Promise<Party | null> {
            return this.partyRepo.findOne({where:{ partyId: id }, relations:['members']});
        }
        
        async isPartyExists(name: string): Promise<boolean> {
            return this.partyRepo.existsBy({ partyName: name });
        }
    
        async create(createPartyDto: CreatePartyDto): Promise<ResponseDto<any>> {
            try {
                const existing = await this.isPartyExists(createPartyDto.name);
                if (existing) {
                    return new ResponseDto(400, 'Party Name Already Exists', null);
                }
    
                const newParty = this.partyRepo.create({ partyName: createPartyDto.name });
                await this.partyRepo.save(newParty);
    
                return new ResponseDto(201, 'Party Created Successfully', null);
            } catch (error) {
                return new ResponseDto(500, 'Internal Server Error', null);
            }
        }
    
        async get(id: string): Promise<ResponseDto<any>> {
            try {
                if (isNaN(Number(id))) {
                    return new ResponseDto(400, 'ID must be a number', null);
                }
    
                const party = await this.getPartyById(Number(id));
                if (!party) {
                    return new ResponseDto(404, 'Party Not Found', null);
                }
    
                const response = new ResponsePartyDto(party.partyId, party.partyName,party.partyImage);
                return new ResponseDto(200, 'Party Fetched Successfully', response);
            } catch (error) {
                return new ResponseDto(500, 'Internal Server Error', null);
            }
        }
    
        async getAll(): Promise<ResponseDto<any>> {
            try {
                const parties = await this.partyRepo.find();
    
                const response = parties.map(
                    (party) => new ResponsePartyDto(party.partyId, party.partyName,party.partyImage),
                );
    
                return new ResponseDto(200, 'Parties Fetched Successfully', response);
            } catch (error) {
                return new ResponseDto(500, 'Internal Server Error', null);
            }
        }
    
        async update(id: string, updatePartyDto: UpdatePartyDto): Promise<ResponseDto<any>> {
            try {
                if (isNaN(Number(id))) {
                    return new ResponseDto(400, 'ID must be a number', null);
                }
    
                const party = await this.getPartyById(Number(id));
                if (!party) {
                    return new ResponseDto(404, 'Party Not Found', null);
                }
    
                if (updatePartyDto.name && updatePartyDto.name !== party.partyName) {
                    const existing = await this.isPartyExists(updatePartyDto.name);
                    if (existing) {
                        return new ResponseDto(400, 'Party Name Already Exists', null);
                    }
                    party.partyName = updatePartyDto.name;
                }
    
                await this.partyRepo.save(party);
                return new ResponseDto(200, 'Party Updated Successfully', null);
            } catch (error) {
                return new ResponseDto(500, 'Internal Server Error', null);
            }
        }
    
        async delete(id: string): Promise<ResponseDto<any>> {
            try {
                if (isNaN(Number(id))) {
                    return new ResponseDto(400, 'ID must be a number', null);
                }
    
                const party = await this.getPartyById(Number(id));
                if (!party) {
                    return new ResponseDto(404, 'Party Not Found', null);
                }
    
                await this.partyRepo.delete(party.partyId);
                return new ResponseDto(200, 'Party Deleted Successfully', null);
            } catch (error) {
                return new ResponseDto(500, 'Internal Server Error', null);
            }
        }
}
