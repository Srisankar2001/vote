export class ResponseAuthDto {
    token: string;
    expireAt: Date;
    constructor(token: string, expireAt: Date) {
        this.token = token;
        this.expireAt = expireAt;
    }
}