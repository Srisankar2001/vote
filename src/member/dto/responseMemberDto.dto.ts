export class ResponseMemberDto {
    id: number;
    name: string;
    image: string;
    partyId:number;
    partyName:string;
    partyImage:string;
    constructor(id: number, name: string, image: string, partyId:number, partyName:string, partyImage:string) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.partyId = partyId;
        this.partyName = partyName;
        this.partyImage = partyImage;
    }
}