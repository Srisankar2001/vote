import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User} from "./user.entity";

@Entity()
export class District{
    @PrimaryGeneratedColumn()
    districtId:number;
    @Column({unique:true})
    districtName:string;
    @OneToMany(()=>User,user=>user.district)
    users:User[];
}