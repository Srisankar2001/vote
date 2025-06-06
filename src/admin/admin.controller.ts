import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { ResponseDto } from 'src/common/dto/response.dto';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }
    @Post("/")
    async create(@Body() createAdminDto: CreateAdminDto): Promise<ResponseDto<any>> {
        return this.adminService.create(createAdminDto);
    }
}
