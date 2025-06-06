import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PartyService } from 'src/party/party.service';
import { Member } from 'src/typeorm/entities/member.entity';
import { Repository } from 'typeorm';
import { CreateMemberDto } from './dto/createMember.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { ResponseMemberDto } from './dto/responseMemberDto.dto';
import { UpdateMemberDto } from './dto/updateMember.dto';

@Injectable()
export class MemberService {
    constructor(
        @InjectRepository(Member)
        private readonly memberRepo: Repository<Member>,
        private readonly partyService: PartyService
    ) { }

    async getMemberById(id: number): Promise<Member | null> {
        return this.memberRepo.findOne({ where: { memberId: id }, relations: ['party'] });
    }

    async create(createMemberDto: CreateMemberDto, image: string): Promise<ResponseDto<any>> {
        try {
            const party = await this.partyService.getPartyById(createMemberDto.partyId);
            if (!party) {
                return new ResponseDto(400, 'Party Not Found', null);
            }

            if (party.members.length === 5) {
                return new ResponseDto(400, 'One Party have only 5 members', null);
            }

            const newMember = this.memberRepo.create({ memberName: createMemberDto.name, memberImage: image, party: party });
            await this.memberRepo.save(newMember);

            return new ResponseDto(201, 'Member Created Successfully', null);
        } catch (error) {
            return new ResponseDto(500, 'Internal Server Error', null);
        }
    }

    async get(id: string): Promise<ResponseDto<any>> {
        try {
            if (isNaN(Number(id))) {
                return new ResponseDto(400, 'ID must be a number', null);
            }

            const member = await this.getMemberById(Number(id));
            if (!member) {
                return new ResponseDto(404, 'Member Not Found', null);
            }

            const response = new ResponseMemberDto(member.memberId, member.memberName, member.memberImage, member.party.partyId, member.party.partyName, member.party.partyImage);
            return new ResponseDto(200, 'Member Fetched Successfully', response);
        } catch (error) {
            return new ResponseDto(500, 'Internal Server Error', null);
        }
    }

    async getAll(): Promise<ResponseDto<any>> {
        try {
            const members = await this.memberRepo.find({ relations: ['party'] });

            const response = members.map(
                (member) => new ResponseMemberDto(member.memberId, member.memberName, member.memberImage, member.party.partyId, member.party.partyName, member.party.partyImage),
            );

            return new ResponseDto(200, 'Members Fetched Successfully', response);
        } catch (error) {
            return new ResponseDto(500, 'Internal Server Error', null);
        }
    }

    async update(id: string, updateMemberDto: UpdateMemberDto): Promise<ResponseDto<any>> {
        try {
            if (isNaN(Number(id))) {
                return new ResponseDto(400, 'ID must be a number', null);
            }

            const member = await this.getMemberById(Number(id));
            if (!member) {
                return new ResponseDto(404, 'Member Not Found', null);
            }

            if (updateMemberDto.name && updateMemberDto.name !== member.memberName) {
                member.memberName = updateMemberDto.name;
            }

            if (updateMemberDto.partyId && updateMemberDto.partyId !== member.party.partyId) {
                const party = await this.partyService.getPartyById(updateMemberDto.partyId);
                if (!party) {
                    return new ResponseDto(400, 'Party Not Found', null);
                }

                if (party.members.length === 5) {
                    return new ResponseDto(400, 'One Party have only 5 members', null);
                }
                member.party = party;
            }

            await this.memberRepo.save(member);
            return new ResponseDto(200, 'Member Updated Successfully', null);
        } catch (error) {
            return new ResponseDto(500, 'Internal Server Error', null);
        }
    }

    async delete(id: string): Promise<ResponseDto<any>> {
        try {
            if (isNaN(Number(id))) {
                return new ResponseDto(400, 'ID must be a number', null);
            }

            const member = await this.getMemberById(Number(id));
            if (!member) {
                return new ResponseDto(404, 'Member Not Found', null);
            }

            await this.memberRepo.delete(member.memberId);
            return new ResponseDto(200, 'Member Deleted Successfully', null);
        } catch (error) {
            return new ResponseDto(500, 'Internal Server Error', null);
        }
    }
}
