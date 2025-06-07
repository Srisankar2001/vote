import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberService } from 'src/member/member.service';
import { PartyService } from 'src/party/party.service';
import { Vote } from 'src/typeorm/entities/vote.entity';
import { Repository } from 'typeorm';
import { VoteDto } from './dto/vote.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { UserService } from 'src/user/user.service';
import { Member } from 'src/typeorm/entities/member.entity';
import { DistrictService } from 'src/district/district.service';

@Injectable()
export class VoteService {
    constructor(
        @InjectRepository(Vote)
        private readonly voteRepo: Repository<Vote>,
        private readonly userService: UserService,
        private readonly partyService: PartyService,
        private readonly memberService: MemberService,
        private readonly districtService: DistrictService
    ) { }

    async vote(userId: number, voteDto: VoteDto): Promise<ResponseDto<any>> {
        try {
            const user = await this.userService.getUserById(userId);
            if (!user) {
                return new ResponseDto(404, 'User Not Found', null);
            }

            if (user.isVoted) {
                return new ResponseDto(400, 'You Already Poll the Vote', null);
            }

            const party = await this.partyService.getPartyById(voteDto.partyId)
            if (!party) {
                return new ResponseDto(404, 'Party Not Found', null);
            }

            if (!voteDto.membersId || !Array.isArray(voteDto.membersId) || voteDto.membersId.length === 0) {
                return new ResponseDto(400, 'You must vote for at least one member', null);
            }

            if (voteDto.membersId.length > 3) {
                return new ResponseDto(400, 'You can only vote for 3 members from the party', null);
            }

            const memberArray: Member[] = [];

            for (const id of voteDto.membersId) {
                const member = await this.memberService.getMemberByIdAndParty(id, party);
                if (!member) {
                    return new ResponseDto(404, 'Member Not Found', null);
                }
                memberArray.push(member);
            }

            const newVote = this.voteRepo.create({
                user: user,
                district: user.district,
                party: party,
                members: memberArray
            })

            user.isVoted = true;
            await this.voteRepo.save(newVote);
            await this.userService.saveUser(user);
            return new ResponseDto(200, 'Vote casted Successfully', null);
        } catch (error) {
            return new ResponseDto(500, 'Internal Server Error', null);
        }
    }

    async getCountByParty(): Promise<ResponseDto<any>> {
        try {
            const topParties = await this.voteRepo
                .createQueryBuilder('vote')
                .select([
                    'vote.partyId AS partyId',
                    'party.partyName AS partyName',
                    'party.partyImage AS partyImage',
                    'COUNT(vote.voteId) AS voteCount'
                ])
                .leftJoin('vote.party', 'party')
                .groupBy('vote.partyId')
                .orderBy('voteCount', 'DESC')
                .getRawMany();

            return new ResponseDto(200, "Results Fetched Successfully", topParties);
        } catch (error) {
            return new ResponseDto(500, "Internal Server Error", null);
        }
    }

    async getCountByMember(): Promise<ResponseDto<any>> {
        try {
            const topMembers = await this.voteRepo
                .createQueryBuilder('vote')
                .select([
                    'member.memberId AS memberId',
                    'member.memberName AS memberName',
                    'member.memberImage AS memberImage',
                    'party.partyId AS partyId',
                    'party.partyName AS partyName',
                    'party.partyImage AS partyImage',
                    'COUNT(vote.voteId) AS voteCount'
                ])
                .leftJoin('vote.members', 'member')
                .leftJoin('member.party', 'party')
                .groupBy('member.memberId')
                .addGroupBy('member.memberName')
                .addGroupBy('member.memberImage')
                .addGroupBy('party.partyId')
                .addGroupBy('party.partyName')
                .addGroupBy('party.partyImage')
                .orderBy('voteCount', 'DESC')
                .getRawMany();

            return new ResponseDto(200, "Results Fetched Successfully", topMembers);
        } catch (error) {
            return new ResponseDto(500, "Internal Server Error", null);
        }
    }

    async getCountByDistrictForParty(id: string): Promise<ResponseDto<any>> {
        try {
            if (isNaN(Number(id))) {
                return new ResponseDto(400, 'ID must be a number', null);
            }

            const district = await this.districtService.getDistrictById(Number(id));
            if (!district) {
                return new ResponseDto(404, 'District Not Found', null);
            }

            const topPartiesByDistrict = await this.voteRepo
                .createQueryBuilder('vote')
                .select([
                    'party.partyId AS partyId',
                    'party.partyName AS partyName',
                    'party.partyImage AS partyImage',
                    'COUNT(vote.voteId) AS voteCount'
                ])
                .leftJoin('vote.party', 'party')
                .leftJoin('vote.district', 'district')
                .where('district.districtId = :id', { id })
                .groupBy('party.partyId')
                .orderBy('voteCount', 'DESC')
                .getRawMany();

            return new ResponseDto(200, "Results Fetched Successfully", topPartiesByDistrict);
        } catch (error) {
            return new ResponseDto(500, "Internal Server Error", null);
        }
    }


    async getCountByDistrictForMember(id: string): Promise<ResponseDto<any>> {
        try {
            if (isNaN(Number(id))) {
                return new ResponseDto(400, 'ID must be a number', null);
            }

            const district = await this.districtService.getDistrictById(Number(id));
            if (!district) {
                return new ResponseDto(404, 'District Not Found', null);
            }

            const topMembersByDistrict = await this.voteRepo
                .createQueryBuilder('vote')
                .select([
                    'member.memberId AS memberId',
                    'member.memberName AS memberName',
                    'member.memberImage AS memberImage',
                    'party.partyId AS partyId',
                    'party.partyName AS partyName',
                    'party.partyImage AS partyImage',
                    'COUNT(vote.voteId) AS voteCount'
                ])
                .leftJoin('vote.members', 'member')
                .leftJoin('member.party', 'party')
                .leftJoin('vote.district', 'district')
                .where('district.districtId = :id', { id })
                .groupBy('member.memberId')
                .addGroupBy('member.memberName')
                .addGroupBy('member.memberImage')
                .addGroupBy('party.partyId')
                .addGroupBy('party.partyName')
                .addGroupBy('party.partyImage')
                .orderBy('voteCount', 'DESC')
                .getRawMany();

            return new ResponseDto(200, "Results Fetched Successfully", topMembersByDistrict);
        } catch (error) {
            return new ResponseDto(500, "Internal Server Error", null);
        }
    }
}
