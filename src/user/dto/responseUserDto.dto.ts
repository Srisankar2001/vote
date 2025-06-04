export class ResponseUserDto {
    id: number;
    name: string;
    nic: string;
    email: string;
    districtId: number;
    districtName: string;
    constructor(id: number, name: string, nic: string, email: string, districtId: number, districtName: string) {
        this.id = id;
        this.name = name;
        this.nic = nic;
        this.email = email;
        this.districtId = districtId;
        this.districtName = districtName;
    }
}