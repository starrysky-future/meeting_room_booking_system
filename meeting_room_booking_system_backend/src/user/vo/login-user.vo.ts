import { ApiProperty } from '@nestjs/swagger';

class UserInfo {
  @ApiProperty()
  id: number;
  @ApiProperty()
  username: string;
  @ApiProperty()
  nickName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  headPic: string;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  isFrozen: boolean;
  @ApiProperty()
  isAdmin: boolean;
  @ApiProperty()
  createTime: number;
  @ApiProperty()
  roles: string[];
  @ApiProperty()
  permissions: string[];
}

export class LoginUserVo {
  @ApiProperty()
  userInfo: UserInfo;
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;
}
