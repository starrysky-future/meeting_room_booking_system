import { ApiProperty } from '@nestjs/swagger';
import { MeetingRoomVo } from 'src/meeting-room/vo/meeting-room.vo';
import { UserDetailVo } from 'src/user/vo/user-info.vo';

export class BookingVo {
  @ApiProperty()
  id: number;

  @ApiProperty()
  startTime: Date;

  @ApiProperty()
  endTime: Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  note: string;

  @ApiProperty()
  createTime: Date;

  @ApiProperty()
  updateTime: Date;

  @ApiProperty({
    type: UserDetailVo,
  })
  userId: UserDetailVo;

  @ApiProperty({
    type: MeetingRoomVo,
  })
  roomId: MeetingRoomVo;
}
