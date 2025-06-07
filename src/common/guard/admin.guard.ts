import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { Role } from 'src/enum/role.enum';
import { ResponseDto } from '../dto/response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) { }

    async getUserById(id: number): Promise<User | null> {
        return this.userRepo.findOne({ where: { userId: id }, relations: ['district'] });
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();
        const authHeader = req.headers.authorization || req.headers.Authorization;

        if (!authHeader || typeof authHeader !== 'string') {
            throw new UnauthorizedException(new ResponseDto(400, 'Token is missing', null));
        }

        try {
            const { id }: any = verify(authHeader, process.env.SECRET_KEY);

            const user = await this.getUserById(id);
            if (!user) {
                throw new UnauthorizedException(new ResponseDto(400, 'Invalid Token', null));
            }

            if (user.userRole !== Role.ADMIN) {
                throw new ForbiddenException(new ResponseDto(401, 'Unauthorized Request', null));
            }

            (req as Request).id = id;
            return true;
        } catch (error) {
            throw new UnauthorizedException(new ResponseDto(400, 'Invalid Token', null));
        }
    }
}
