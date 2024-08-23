import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  Inject,
  UnauthorizedException,
  DefaultValuePipe,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RequireLogin, UserInfo } from 'src/decorator/custom.decorator';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { generateParseIntPipe, storage } from 'src/utils';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginUserVo } from './vo/login-user.vo';
import { RefreshTokenVo } from './vo/refresh-token.vo';
import { UserDetailVo, UserListVo } from './vo/user-info.vo';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';

@ApiTags('用户管理模块')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  @Get('init-data')
  async initData() {
    await this.userService.initData();
    return 'done';
  }

  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    type: String,
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/验证码不正确/用户已存在',
  })
  @ApiResponse({
    type: String,
    status: HttpStatus.OK,
    description: '注册成功/失败',
  })
  @Post('register')
  async register(@Body() registerUser: RegisterDto) {
    return await this.userService.register(registerUser);
  }

  @ApiQuery({
    type: String,
    name: 'address',
    description: '邮箱地址',
    required: true,
    example: 'xxxx@xx.com',
  })
  @ApiResponse({
    type: String,
    status: HttpStatus.OK,
    description: '发送成功',
  })
  @Get('register/captcha')
  async captcha(@Query('address') address: string) {
    return await this.userService.loginCaptcha(address);
  }

  @ApiQuery({
    type: String,
    name: 'address',
    description: '邮箱地址',
    required: true,
    example: 'xxxx@xx.com',
  })
  @ApiResponse({
    type: String,
    status: HttpStatus.OK,
    description: '发送成功',
  })
  @Get('updatePassword/captcha')
  async updatePasswordCaptcha(@Query('address') address: string) {
    return await this.userService.updatePasswordCaptcha(address);
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: String,
    status: HttpStatus.OK,
    description: '发送成功',
  })
  @Get('updateUserInfo/captcha')
  @RequireLogin()
  async updateUserInfoCaptcha(@UserInfo('email') address: string) {
    return await this.userService.updateUserInfoCaptcha(address);
  }

  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    type: String,
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在/密码错误',
  })
  @ApiResponse({
    type: LoginUserVo,
    status: HttpStatus.OK,
    description: '用户信息和token',
  })
  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    return await this.loginJwtSign(loginUser, false);
  }

  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    type: String,
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在/密码错误',
  })
  @ApiResponse({
    type: LoginUserVo,
    status: HttpStatus.OK,
    description: '用户信息和token',
  })
  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    return await this.loginJwtSign(loginUser, true);
  }

  @ApiQuery({
    type: String,
    name: 'refreshToken',
    description: '刷新 token',
  })
  @ApiResponse({
    type: String,
    status: HttpStatus.UNAUTHORIZED,
    description: 'token 已失效，请重新登录',
  })
  @ApiResponse({
    type: RefreshTokenVo,
    status: HttpStatus.OK,
    description: '刷新成功',
  })
  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    return await this.refreshJwtVerify(refreshToken, false);
  }

  @ApiQuery({
    type: String,
    name: 'refreshToken',
    description: '刷新 token',
  })
  @ApiResponse({
    type: String,
    status: HttpStatus.UNAUTHORIZED,
    description: 'token 已失效，请重新登录',
  })
  @ApiResponse({
    type: RefreshTokenVo,
    status: HttpStatus.OK,
    description: '刷新成功',
  })
  @Get('admin/refresh')
  async adminRefresh(@Query('refreshToken') refreshToken: string) {
    return await this.refreshJwtVerify(refreshToken, true);
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: UserDetailVo,
    status: HttpStatus.OK,
    description: 'success',
  })
  @Get('info')
  @RequireLogin()
  async info(@UserInfo('userId') userId: number) {
    return await this.userService.finduserDetailById(userId);
  }

  @ApiBody({
    type: UpdateUserPasswordDto,
  })
  @ApiResponse({
    type: String,
    status: HttpStatus.OK,
    description: '密码修改成功/失败',
  })
  @ApiResponse({
    type: String,
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/不正确',
  })
  @Post(['updatePassword', 'admin/updatePassword'])
  async updatePassword(@Body() passwordDto: UpdateUserPasswordDto) {
    return await this.userService.updatePassword(passwordDto);
  }

  @ApiBearerAuth()
  @ApiBody({
    type: UpdateUserInfoDto,
  })
  @ApiResponse({
    type: String,
    status: HttpStatus.OK,
    description: '用户信息修改成功/失败',
  })
  @ApiResponse({
    type: String,
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/不正确',
  })
  @Post(['updateUserInfo', 'admin/updateUserInfo'])
  @RequireLogin()
  async updateUserInfo(
    @UserInfo('userId') userId: number,
    @Body() UpdateUserInfoDto: UpdateUserInfoDto,
  ) {
    return await this.userService.updateUserInfo(userId, UpdateUserInfoDto);
  }

  @ApiBearerAuth()
  @ApiResponse({
    type: String,
    status: HttpStatus.OK,
    description: 'success',
  })
  @Get('freeze')
  @RequireLogin()
  async freeze(@Query('id') userId: number) {
    await this.userService.freezeUserById(userId);

    return 'success';
  }

  @ApiBearerAuth()
  @ApiQuery({
    type: Number,
    name: 'pageNo',
    description: '第几页',
    example: 1,
  })
  @ApiQuery({
    type: Number,
    name: 'pageSize',
    description: '每页多少条',
    example: 2,
  })
  @ApiQuery({
    type: String,
    name: 'username',
    description: '用户名',
    required: false,
  })
  @ApiQuery({
    type: String,
    name: 'nickName',
    description: '昵称',
    required: false,
  })
  @ApiQuery({
    type: String,
    name: 'email',
    description: '邮箱',
    required: false,
  })
  @ApiResponse({ type: UserListVo })
  @Get('list')
  @RequireLogin()
  async list(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo'))
    pageNo: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(2),
      generateParseIntPipe('pageSize'),
    )
    pageSize: number,
    @Query('username') username: string,
    @Query('nickName') nickName: string,
    @Query('email') email: string,
  ) {
    return await this.userService.findUserByPage(
      pageNo,
      pageSize,
      username,
      nickName,
      email,
    );
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storage,
      limits: {
        fileSize: 1024 * 1024 * 3,
      },
      fileFilter: (req, file, callback) => {
        const extname = path.extname(file.originalname);

        if (['.png', '.jpg', '.gif'].includes(extname)) {
          callback(null, true);
        } else {
          callback(new BadRequestException('只能上传图片'), false);
        }
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return file.path;
  }

  async refreshJwtVerify(refreshToken: string, isAdmin: boolean) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(data.userId, isAdmin);

      const vo = new RefreshTokenVo();

      return this.setToken(vo, user);
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }

  async loginJwtSign(loginUser: LoginUserDto, isAdmin: boolean) {
    const vo = await this.userService.login(loginUser, isAdmin);

    return this.setToken(vo, vo.userInfo);
  }

  setToken(res, user) {
    res.accessToken = this.jwtService.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        permissions: user.permissions,
      },
      {
        expiresIn:
          this.configService.get('jwt_access_token_expires_time') || '30m',
      },
    );

    res.refreshToken = this.jwtService.sign(
      {
        userId: user.id,
      },
      {
        expiresIn:
          this.configService.get('jwt_refresh_token_expires_time') || '7d',
      },
    );

    return res;
  }
}
