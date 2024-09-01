import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { generateParseIntPipe } from 'src/utils';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RequireLogin, UserInfo } from 'src/decorator/custom.decorator';
import { BookingListvo } from './vo/booking-list.vo';
import { CreateBookingDto } from './dto/create-boking.dto';

@ApiTags('预定模块')
@ApiBearerAuth()
@RequireLogin()
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiBody({
    type: CreateBookingDto,
  })
  @ApiResponse({
    type: String,
    status: HttpStatus.OK,
    description: 'success',
  })
  @Post('add')
  async add(
    @Body() createBookingDto: CreateBookingDto,
    @UserInfo('userId') userId: number,
  ) {
    return await this.bookingService.add(createBookingDto, userId);
  }

  @ApiQuery({
    name: 'pageNo',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'pageSize',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'username',
    type: String,
    description: '用户名',
    required: false,
  })
  @ApiQuery({
    name: 'meetingRoomName',
    type: String,
    description: '会议室名字',
    required: false,
  })
  @ApiQuery({
    name: 'meetingRoomPosition',
    type: String,
    description: '会议室位置',
    required: false,
  })
  @ApiQuery({
    name: 'bookingTimeRangeStart',
    type: String,
    description: '会议室开始时间',
    required: false,
  })
  @ApiQuery({
    name: 'bookingTimeRangeEnd',
    type: String,
    description: '会议室结束时间',
    required: false,
  })
  @ApiResponse({
    type: BookingListvo,
  })
  @Get('list')
  async list(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo'))
    pageNo: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(10),
      generateParseIntPipe('pageSize'),
    )
    pageSize: number,
    @Query('username')
    username: string,
    @Query('meetingRoomName')
    meetingRoomName: string,
    @Query('meetingRoomPosition')
    meetingRoomPosition: string,
    @Query('bookingTimeRangeStart')
    bookingTimeRangeStart: number,
    @Query('bookingTimeRangeEnd')
    bookingTimeRangeEnd: number,
  ) {
    return this.bookingService.list(
      pageNo,
      pageSize,
      username,
      meetingRoomName,
      meetingRoomPosition,
      bookingTimeRangeStart,
      bookingTimeRangeEnd,
    );
  }

  @ApiQuery({
    type: Number,
    name: 'id',
  })
  @ApiResponse({
    type: String,
    status: HttpStatus.OK,
    description: 'success',
  })
  @Get('apply/:id')
  async apply(@Param('id') id: number) {
    return this.bookingService.apply(id);
  }

  @ApiQuery({
    type: Number,
    name: 'id',
  })
  @ApiResponse({
    type: String,
    status: HttpStatus.OK,
    description: 'success',
  })
  @Get('reject/:id')
  async reject(@Param('id') id: number) {
    return this.bookingService.reject(id);
  }

  @ApiQuery({
    type: Number,
    name: 'id',
  })
  @ApiResponse({
    type: String,
    status: HttpStatus.OK,
    description: 'success',
  })
  @Get('unbind/:id')
  async unbind(@Param('id') id: number) {
    return this.bookingService.unbind(id);
  }

  @ApiQuery({
    type: Number,
    name: 'id',
  })
  @ApiResponse({
    type: String,
    status: HttpStatus.OK,
    description: 'success/半小时内只能催办一次，请耐心等待',
  })
  @Get('urge/:id')
  async urge(@Param('id') id: number) {
    return this.bookingService.urge(id);
  }
}
