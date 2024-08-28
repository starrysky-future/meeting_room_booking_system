import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateMeetingRoomDto {
  @ApiProperty()
  @IsNotEmpty({ message: '会议室名字不能为空' })
  @MaxLength(10, { message: '会议室名字最长为10个字符' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: '会议室容量不能为空' })
  capacity: number;

  @ApiProperty()
  @IsNotEmpty({ message: '会议室位置信息不能为空' })
  @MaxLength(50, { message: '会议室位置信息最长为50个字符' })
  location: string;

  @ApiProperty({
    required: false,
  })
  @MaxLength(50, {
    message: '设备最长为 50 字符',
  })
  equipment: string;

  @ApiProperty({
    required: false,
  })
  @MaxLength(100, {
    message: '描述最长为 100 字符',
  })
  description: string;
}
