import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { ResponseDto } from 'src/commonDto/response.dto';
import { DistrictService } from 'src/district/district.service';
import { ResponseUserDto } from './dto/responseUserDto.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly districtService: DistrictService,
    ) { }

    async getUserById(id: number): Promise<User | null> {
        return this.userRepo.findOne({ where: { userId: id }, relations: ['district'] });
    }

    async isNICExists(nic: string): Promise<boolean> {
        return this.userRepo.existsBy({ userNIC: nic });
    }

    async isEmailExists(email: string): Promise<boolean> {
        return this.userRepo.existsBy({ userEmail: email })
    }

    async isOTPExists(code: string): Promise<boolean> {
        return this.userRepo.existsBy({ otp: code })
    }

    async generateCode(): Promise<string> {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';

        do {
            code = Array.from({ length: 6 }, () =>
                chars.charAt(Math.floor(Math.random() * chars.length))
            ).join('');
        } while (await this.isOTPExists(code));

        return code;
    }

    async create(createUserDto: CreateUserDto): Promise<ResponseDto<any>> {
        try {
            const existingNIC = await this.isNICExists(createUserDto.nic);
            if (existingNIC) {
                return new ResponseDto(400, 'NIC Already Exists', null);
            }

            const existingEmail = await this.isEmailExists(createUserDto.email);
            if (existingEmail) {
                return new ResponseDto(400, 'Email Already Exists', null);
            }

            const district = await this.districtService.getDistrictById(createUserDto.districtId);
            if (!district) {
                return new ResponseDto(400, 'District Not Found', null);
            }

            const code = await this.generateCode();

            const newUser = this.userRepo.create({
                userName: createUserDto.name,
                userNIC: createUserDto.nic,
                userEmail: createUserDto.email,
                district: district,
                otp: code
            });

            await this.userRepo.save(newUser);
            return new ResponseDto(201, 'User Created Successfully', null);
        } catch (error) {
            return new ResponseDto(500, 'Internal Server Error', null);
        }
    }

    async get(id: string): Promise<ResponseDto<any>> {
        try {
            if (isNaN(Number(id))) {
                return new ResponseDto(400, 'ID must be a number', null);
            }

            const user = await this.getUserById(Number(id));
            if (!user) {
                return new ResponseDto(404, 'User Not Found', null);
            }

            const response = new ResponseUserDto(user.userId, user.userName, user.userNIC, user.userEmail, user.district.districtId, user.district.districtName);
            return new ResponseDto(200, 'User Fetched Successfully', response);
        } catch (error) {
            return new ResponseDto(500, 'Internal Server Error', null);
        }
    }

    async getAll(): Promise<ResponseDto<any>> {
        try {
            const users = await this.userRepo.find({ relations: ['district'] });

            const response = users.map(
                (user) => new ResponseUserDto(user.userId, user.userName, user.userNIC, user.userEmail, user.district.districtId, user.district.districtName)
            );

            return new ResponseDto(200, 'Users Fetched Successfully', response);
        } catch (error) {
            return new ResponseDto(500, 'Internal Server Error', null);
        }
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<ResponseDto<any>> {
        try {
            if (isNaN(Number(id))) {
                return new ResponseDto(400, 'ID must be a number', null);
            }

            const user = await this.getUserById(Number(id));
            if (!user) {
                return new ResponseDto(404, 'User Not Found', null);
            }

            if (updateUserDto.name && updateUserDto.name !== user.userName) {
                user.userName = updateUserDto.name;
            }
            if (updateUserDto.nic && updateUserDto.nic !== user.userNIC) {
                const existingNIC = await this.isNICExists(updateUserDto.nic);
                if (existingNIC) {
                    return new ResponseDto(400, 'NIC Already Exists', null);
                }
                user.userNIC = updateUserDto.nic;
            }
            if (updateUserDto.email && updateUserDto.email !== user.userEmail) {
                const existingEmail = await this.isEmailExists(updateUserDto.email);
                if (existingEmail) {
                    return new ResponseDto(400, 'Email Already Exists', null);
                }
                user.userEmail = updateUserDto.email;
            }
            if (updateUserDto.districtId && updateUserDto.districtId !== user.district.districtId) {
                const district = await this.districtService.getDistrictById(updateUserDto.districtId);
                if (!district) {
                    return new ResponseDto(400, 'District Not Found', null);
                }
                user.district = district;
            }

            await this.userRepo.save(user);
            return new ResponseDto(200, 'User Updated Successfully', null);
        } catch (error) {
            return new ResponseDto(500, 'Internal Server Error', null);
        }
    }

    async delete(id: string): Promise<ResponseDto<any>> {
        try {
            if (isNaN(Number(id))) {
                return new ResponseDto(400, 'ID must be a number', null);
            }

            const user = await this.getUserById(Number(id));
            if (!user) {
                return new ResponseDto(404, 'User Not Found', null);
            }

            await this.userRepo.delete(user.userId);
            return new ResponseDto(200, 'User Deleted Successfully', null);
        } catch (error) {
            return new ResponseDto(500, 'Internal Server Error', null);
        }
    }
}
