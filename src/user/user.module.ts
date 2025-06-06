import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import { DistrictModule } from 'src/district/district.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), DistrictModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }
