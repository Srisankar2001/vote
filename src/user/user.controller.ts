import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseDto } from 'src/commonDto/response.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('user')
export class UserController {
     constructor(private readonly userService: UserService) { }
    
        @Get("/")
        async getAll(): Promise<ResponseDto<any>> {
            return this.userService.getAll();
        }
    
        @Get("/:id")
        async get(@Param('id') id: string): Promise<ResponseDto<any>> {
            return this.userService.get(id);
        }
    
        @Post("/")
        async create(@Body() createUserDto: CreateUserDto): Promise<ResponseDto<any>> {
            return this.userService.create(createUserDto);
        }
    
        @Put("/:id")
        async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<ResponseDto<any>> {
            return this.userService.update(id, updateUserDto);
        }
    
        @Delete("/:id")
        async delete(@Param('id') id: string):Promise<ResponseDto<any>>{
            return this.userService.delete(id);
        }
}
