import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { FindOperator, Like, Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { RedisService } from 'src/redis/redis.service';
import { md5 } from 'src/utils';
import { EmailService } from 'src/email/email.service';
import { RoleEntity } from './entities/role.entity';
import { PermissionEntity } from './entities/permission.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserVo } from './vo/login-user.vo';
import { UserDetailVo } from './vo/user-info.vo';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectRepository(UserEntity)
  private userRepository: Repository<UserEntity>;

  @InjectRepository(RoleEntity)
  private roleRepository: Repository<RoleEntity>;

  @InjectRepository(PermissionEntity)
  private permissionRepository: Repository<PermissionEntity>;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(EmailService)
  private emailService: EmailService;

  async register(user: RegisterDto) {
    try {
      await this.verifyCaptcha(user.captcha, `captcha_${user.email}`);
    } catch (e) {
      throw new BadRequestException(e.response.message);
    }

    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (foundUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = new UserEntity();
    newUser.username = user.username;
    newUser.nick_name = user.nickName;
    newUser.password = md5(user.password);
    newUser.email = user.email;

    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (error) {
      this.logger.error(error, UserService);
      return '注册失败';
    }
  }

  async loginCaptcha(address: string) {
    const code = await this.Captcha(`captcha_${address}`);
    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是：${code}</p>`,
    });

    return '发送成功';
  }

  async updatePasswordCaptcha(address: string) {
    const code = await this.Captcha(`update_password_captcha_${address}`);
    await this.emailService.sendMail({
      to: address,
      subject: '更改密码验证码',
      html: `<p>你的更改密码验证码是：${code}</p>`,
    });

    return '发送成功';
  }

  async updateUserInfoCaptcha(address: string) {
    const code = await this.Captcha(`update_user_info_captcha_${address}`);
    await this.emailService.sendMail({
      to: address,
      subject: '修改用户信息验证码',
      html: `<p>你的修改用户信息验证码是：${code}</p>`,
    });

    return '发送成功';
  }

  async Captcha(key: string) {
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(key, code, 5 * 60);

    return code;
  }

  async login(loginUser: LoginUserDto, isAdmin: boolean) {
    const user = await this.userRepository.findOne({
      where: {
        username: loginUser.username,
        isAdmin,
      },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    if (md5(loginUser.password) !== user.password) {
      throw new BadRequestException('密码错误');
    }

    const vo = new LoginUserVo();
    vo.userInfo = {
      id: user.id,
      username: user.username,
      nickName: user.nick_name,
      email: user.email,
      phoneNumber: user.phone_number,
      headPic: user.head_pic,
      createTime: user.createTime.getTime(),
      isFrozen: user.isFrozen,
      isAdmin: user.isAdmin,
      roles: user.roles.map((item) => item.name),
      permissions: user.roles.reduce((arr, item) => {
        item.permissions.forEach((permission) => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission);
          }
        });

        return arr;
      }, []),
    };

    return vo;
  }
  async findUserById(userId: number, isAdmin: boolean) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        isAdmin,
      },
      relations: ['roles', 'roles.permissions'],
    });

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      roles: user.roles.map((item) => item.name),
      permissions: user.roles.reduce((arr, item) => {
        item.permissions.forEach((permission) => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission);
          }
        });
        return arr;
      }, []),
    };
  }

  async finduserDetailById(userId: number) {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });

    const vo = new UserDetailVo();
    vo.id = user.id;
    vo.username = user.username;
    vo.nickName = user.nick_name;
    vo.email = user.email;
    vo.headPic = user.head_pic;
    vo.phoneNumber = user.phone_number;
    vo.isFrozen = user.isFrozen;
    vo.createTime = user.createTime.getTime();

    return vo;
  }

  async updatePassword(passwordDto: UpdateUserPasswordDto) {
    try {
      await this.verifyCaptcha(
        passwordDto.captcha,
        `update_password_captcha_${passwordDto.email}`,
      );
    } catch (e) {
      throw new BadRequestException(e.response.message);
    }

    const foundUser = await this.userRepository.findOneBy({
      username: passwordDto.username,
    });

    if (passwordDto.email !== foundUser.email) {
      throw new BadRequestException('邮箱地址不正确');
    }

    foundUser.password = md5(passwordDto.password);

    try {
      await this.userRepository.save(foundUser);
      return '密码修改成功';
    } catch (e) {
      this.logger.error(e, UserService);
      return '密码修改失败';
    }
  }

  async updateUserInfo(userId: number, UpdateUserInfoDto: UpdateUserInfoDto) {
    try {
      await this.verifyCaptcha(
        UpdateUserInfoDto.captcha,
        `update_user_info_captcha_${UpdateUserInfoDto.email}`,
      );
    } catch (e) {
      throw new BadRequestException(e.response.message);
    }

    const foundUser = await this.userRepository.findOneBy({
      id: userId,
    });

    if (UpdateUserInfoDto.headPic) {
      foundUser.head_pic = UpdateUserInfoDto.headPic;
    }
    if (UpdateUserInfoDto.nickName) {
      foundUser.nick_name = UpdateUserInfoDto.nickName;
    }

    try {
      await this.userRepository.save(foundUser);
      return '用户信息修改成功';
    } catch (e) {
      this.logger.error(e, UserService);
      return '用户信息修改失败';
    }
  }

  async freezeUserById(userId: number, isFrozen: boolean) {
    const foundUser = await this.userRepository.findOneBy({
      id: userId,
    });

    foundUser.isFrozen = isFrozen;
    await this.userRepository.save(foundUser);
  }

  async findUserByPage(
    pageNo: number,
    pageSize: number,
    username: string,
    nickName: string,
    email: string,
  ) {
    const skipPage = (pageNo - 1) * pageSize;

    const condition: Record<string, FindOperator<string>> = {};

    if (username) {
      condition.username = Like(`%${username}%`);
    }
    if (nickName) {
      condition.nick_name = Like(`%${nickName}%`);
    }
    if (email) {
      condition.email = Like(`%${email}%`);
    }

    const [users, totalCount] = await this.userRepository.findAndCount({
      // select: [
      //   'id',
      //   'username',
      //   'nick_name',
      //   'email',
      //   'phone_number',
      //   'isFrozen',
      //   'head_pic',
      //   'createTime',
      // ],
      skip: skipPage,
      take: pageSize,
      where: condition,
    });

    const list = users.map((user) => {
      const vo = new UserDetailVo();
      vo.id = user.id;
      vo.username = user.username;
      vo.nickName = user.nick_name;
      vo.email = user.email;
      vo.headPic = user.head_pic;
      vo.phoneNumber = user.phone_number;
      vo.isFrozen = user.isFrozen;
      vo.createTime = user.createTime.getTime();

      return vo;
    });

    return {
      list,
      totalCount,
    };
  }

  async verifyCaptcha(frontCaptcha, key: string) {
    const captcha = await this.redisService.get(key);

    if (!captcha) {
      throw new BadRequestException('验证码已失效');
    }

    if (frontCaptcha !== captcha) {
      throw new BadRequestException('验证码不正确');
    }
  }

  async initData() {
    const user1 = new UserEntity();
    user1.username = 'zhangsan';
    user1.password = md5('111111');
    user1.email = 'xxx@xx.com';
    user1.isAdmin = true;
    user1.nick_name = '张三';
    user1.phone_number = '13233323333';

    const user2 = new UserEntity();
    user2.username = 'lisi';
    user2.password = md5('222222');
    user2.email = 'yy@yy.com';
    user2.nick_name = '李四';

    const role1 = new RoleEntity();
    role1.name = '管理员';

    const role2 = new RoleEntity();
    role2.name = '普通用户';

    const permission1 = new PermissionEntity();
    permission1.code = 'ccc';
    permission1.description = '访问 ccc 接口';

    const permission2 = new PermissionEntity();
    permission2.code = 'ddd';
    permission2.description = '访问 ddd 接口';

    user1.roles = [role1];
    user2.roles = [role2];

    role1.permissions = [permission1, permission2];
    role2.permissions = [permission1];

    await this.permissionRepository.save([permission1, permission2]);
    await this.roleRepository.save([role1, role2]);
    await this.userRepository.save([user1, user2]);
  }
}
