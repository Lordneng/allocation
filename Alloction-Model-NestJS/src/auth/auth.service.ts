import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../System/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.getOneByUsername(username);
        if (user) {
            let selectedUser = { username: user.userName, fullName: `${user.firstName} ${user.lastName}`, userId: user.id, password: user.password };
            const { password, ...result } = selectedUser;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.userId, fullName: user.fullName };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async loginAd(user:any){
        const payload = { username: user.username, sub: user.userId, fullName: user.fullName };
        
    }
}
