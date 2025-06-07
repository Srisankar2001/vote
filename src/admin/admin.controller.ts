import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { AdminGuard } from 'src/common/guard/admin.guard';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }
    @Post("/")
    async create(@Body() createAdminDto: CreateAdminDto): Promise<ResponseDto<any>> {
        return this.adminService.create(createAdminDto);
    }
}
