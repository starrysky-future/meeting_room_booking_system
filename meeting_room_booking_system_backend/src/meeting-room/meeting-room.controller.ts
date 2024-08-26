import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { generateParseIntPipe } from 'src/utils';

@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

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
    @Query('name') name: string,
    @Query('capacity') capacity: number,
    @Query('location') location: string,
    @Query('equipment') equipment: string,
  ) {
    return await this.meetingRoomService.list(
      pageNo,
      pageSize,
      name,
      capacity,
      location,
      equipment,
    );
  }

  @Get(':id')
  async find(@Param('id') id: number) {
    return await this.meetingRoomService.findById(id);
  }

  @Post('create')
  async create(@Body() createMeetingRoomDto: CreateMeetingRoomDto) {
    return await this.meetingRoomService.create(createMeetingRoomDto);
  }

  @Post('update')
  async update(@Body() updateMeetingRoomDto: UpdateMeetingRoomDto) {
    return await this.meetingRoomService.update(updateMeetingRoomDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.meetingRoomService.delete(id);
  }

  @Get('init')
  async initDate() {
    await this.meetingRoomService.initData();
    return 'done';
  }
}
