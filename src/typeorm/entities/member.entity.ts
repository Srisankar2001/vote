import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Party } from "./party.entity";

@Entity()
export class Member{
    @PrimaryGeneratedColumn()
    memberId:number;
    @Column()
    memberName:string;
    @Column()
    memberImage:string;
    @ManyToOne(()=>Party,party=>party.members)
    party:Party;
}