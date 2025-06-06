export class ResponseAuthDto {
    token: string;
    expireAt: string;
    constructor(token: string, expireAt: string) {
        this.token = token;
        this.expireAt = expireAt;
    }
}