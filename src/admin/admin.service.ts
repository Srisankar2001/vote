import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { Role } from 'src/enum/role.enum';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async isEmailExists(email: string): Promise<boolean> {
        return this.userRepo.existsBy({ userEmail: email })
    }

    async create(createAdminDto: CreateAdminDto): Promise<ResponseDto<any>> {
        try {
            const existingEmail = await this.isEmailExists(createAdminDto.email);
            if (existingEmail) {
                return new ResponseDto(400, 'Email Already Exists', null);
            }

            const hashed = await hash(createAdminDto.password, 10)

            const newAdmin = this.userRepo.create({
                userName: createAdminDto.name,
                userEmail: createAdminDto.email,
                userPassword: hashed,
                userRole: Role.ADMIN,
                isVerified: true
            });

            await this.userRepo.save(newAdmin);
            return new ResponseDto(201, 'Admin Created Successfully', null);
        } catch (error) {
            return new ResponseDto(500, 'Internal Server Error', null);
        }
    }

}
