import { Entity, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { District } from "./district.entity";
import { Party } from "./party.entity";
import { Member } from "./member.entity";
import { User } from "./user.entity";

@Entity()
export class Vote{
    @PrimaryGeneratedColumn()
    voteId:number;
    @OneToOne(()=>User,{eager:false})
    user:User;
    @ManyToOne(()=>District,{eager:true})
    district:District;
    @ManyToOne(()=>Party,{eager:true})
    party:Party;
    @ManyToMany(()=>Member,{eager:true})
    @JoinTable()
    members:Member[];
}