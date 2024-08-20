import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserInfoDto {
  @ApiProperty()
  headPic: string;
  @ApiProperty()
  nickName: string;

  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsEmail(
    {},
    {
      message: '邮箱格式不对',
    },
  )
  @ApiProperty()
  email: string;

  @IsNotEmpty({
    message: '验证码不能为空',
  })
  @ApiProperty()
  captcha: string;
}
