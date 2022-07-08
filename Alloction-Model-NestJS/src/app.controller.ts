import { UseGuards } from '@nestjs/common';
import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { PttLdapAuthGuard } from './auth/guards/pttldap-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import * as passport from 'passport';
import { UserRequest } from './auth/models/user-request';
import { ApiOkResponse, ApiBody } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiBody({ type: UserRequest })
  @ApiOkResponse({ description: 'result Token' })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // // ('profile', req.user);
    return req.user;
  }
}
