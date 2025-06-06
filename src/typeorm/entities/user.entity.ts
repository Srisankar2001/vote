import { Column, Entity, Generated, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { District } from "./district.entity";
import { Role } from "src/enum/role.enum";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId: number;
    @Column()
    userName: string;
    @Column({ unique: true })
    userNIC: string;
    @Column({ default: null })
    userPassword: string;
    @Column({ unique: false })
    userEmail: string;
    @Column({ type: "enum", enum: Role, default: Role.USER })
    userRole: Role;
    @ManyToOne(() => District, district => district.users)
    district: District;
    @Column({ default: false })
    isVoted: boolean;
    @Column({ default: false })
    isVerified: boolean;
    @Column({ default: null, nullable: true })
    otp: string;
}