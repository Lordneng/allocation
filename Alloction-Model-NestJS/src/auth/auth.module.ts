import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../System/users/users.module';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    PassportModule.register({ defaultStrategy: 'ldap' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, PassportModule.register({ defaultStrategy: 'ldap' }),]
})
export class AuthModule { }
