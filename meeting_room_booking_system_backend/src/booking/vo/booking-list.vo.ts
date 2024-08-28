import { ApiProperty } from '@nestjs/swagger';
import { BookingVo } from './booking.vo';

export class BookingListvo {
  @ApiProperty({
    type: [BookingVo],
  })
  list: Array<BookingVo>;

  @ApiProperty()
  totalCount: number;
}
