import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./member.entity";

@Entity()
export class Party{
    @PrimaryGeneratedColumn()
    partyId:number;
    @Column({unique:true})
    partyName:string;
    @Column({default:null})
    partyImage:string;
    @OneToMany(()=>Member,member=>member.party)
    members:Member[];
}