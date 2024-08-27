import { ApiProperty } from '@nestjs/swagger';
import { BookingVo } from './booking.vo';

export class BookingListvo {
  @ApiProperty({
    type: [BookingVo],
  })
  users: Array<BookingVo>;

  @ApiProperty()
  totalCount: number;
}
