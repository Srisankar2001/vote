import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';
import { Role } from 'src/enum/role.enum';
import { ResponseDto } from '../dto/response.dto';

@Injectable()
export class IsAdminMiddleware implements NestMiddleware {
    constructor(private readonly userService: UserService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization || req.headers.Authorization;

        if (!authHeader || typeof authHeader !== 'string') {
            const response = new ResponseDto(400, "Token is missing", null);
            return res.status(400).json(response);
        }

        try {
            const { id }: any = verify(authHeader, process.env.SECRET_KEY);

            const user = await this.userService.getUserById(id);
            if (!user) {
                const response = new ResponseDto(400, "Invalid Token", null);
                return res.status(400).json(response);
            }

            if (user.userRole !== Role.ADMIN) {
                const response = new ResponseDto(401, "Unauthorized Request", null);
                return res.status(401).json(response);
            }

            (req as any).id = id;
            next();

        } catch (error) {
            const response = new ResponseDto(400, "Invalid Token", null);
            return res.status(400).json(response);
        }
    }
}
