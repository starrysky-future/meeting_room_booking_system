import { ApiProperty } from '@nestjs/swagger';

export class MeetingRoomUsedCountVo {
  @ApiProperty()
  meetingRoomId: number;
  @ApiProperty()
  meetingRoomName: string;
  @ApiProperty()
  usedCount: string;
}
