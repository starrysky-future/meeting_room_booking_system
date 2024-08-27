import { ApiProperty } from '@nestjs/swagger';

export class UserBookingCountVo {
  @ApiProperty()
  userId: number;
  @ApiProperty()
  username: string;
  @ApiProperty()
  bookingCount: string;
}
