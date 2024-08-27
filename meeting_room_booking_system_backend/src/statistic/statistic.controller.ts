import { Controller, Get, Query } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequireLogin } from 'src/decorator/custom.decorator';
import { UserBookingCountVo } from './vo/user-booking-count.vo';
import { MeetingRoomUsedCountVo } from './vo/meeting-room-used-count.vo';

@ApiTags('统计模块')
@ApiBearerAuth()
@RequireLogin()
@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @ApiQuery({
    type: String,
    name: 'startTime',
  })
  @ApiQuery({
    type: String,
    name: 'endTime',
  })
  @ApiResponse({
    type: UserBookingCountVo,
  })
  @Get('userBookingCount')
  async userBookingCount(
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
  ) {
    return await this.statisticService.userBookingCount(startTime, endTime);
  }

  @ApiQuery({
    type: String,
    name: 'startTime',
  })
  @ApiQuery({
    type: String,
    name: 'endTime',
  })
  @ApiResponse({
    type: MeetingRoomUsedCountVo,
  })
  @Get('meetingRoomUsedCount')
  async meetingRoomUsedCount(
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
  ) {
    return await this.statisticService.meetingRoomUsedCount(startTime, endTime);
  }
}
