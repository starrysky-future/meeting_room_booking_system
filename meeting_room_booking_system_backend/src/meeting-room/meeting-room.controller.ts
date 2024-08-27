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
  HttpStatus,
} from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { generateParseIntPipe } from 'src/utils';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RequireLogin } from 'src/decorator/custom.decorator';
import { MeetingRoomListVo } from './vo/meeting-room-list.vo';
import { MeetingRoomVo } from './vo/meeting-room.vo';

@ApiTags('会议室模块')
@RequireLogin()
@ApiBearerAuth()
@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

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
    name: 'name',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'capacity',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'equipment',
    type: String,
    required: false,
  })
  @ApiResponse({
    type: MeetingRoomListVo,
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

  @ApiQuery({
    name: 'id',
    type: Number,
  })
  @ApiResponse({
    type: MeetingRoomVo,
  })
  @Get(':id')
  async find(@Param('id') id: number) {
    return await this.meetingRoomService.findById(id);
  }

  @ApiBody({
    type: CreateMeetingRoomDto,
  })
  @ApiResponse({
    type: String,
    status: HttpStatus.BAD_REQUEST,
    description: '会议室名字已存在',
  })
  @ApiResponse({
    type: String,
    status: HttpStatus.OK,
    description: '创建成功',
  })
  @Post('create')
  async create(@Body() createMeetingRoomDto: CreateMeetingRoomDto) {
    return await this.meetingRoomService.create(createMeetingRoomDto);
  }

  @ApiBody({
    type: UpdateMeetingRoomDto,
  })
  @ApiResponse({
    type: String,
    status: HttpStatus.BAD_REQUEST,
    description: '会议室不存在',
  })
  @ApiResponse({
    type: String,
    status: HttpStatus.OK,
    description: '更新成功',
  })
  @Post('update')
  async update(@Body() updateMeetingRoomDto: UpdateMeetingRoomDto) {
    return await this.meetingRoomService.update(updateMeetingRoomDto);
  }

  @ApiBody({
    type: UpdateMeetingRoomDto,
  })
  @ApiResponse({
    type: String,
    status: HttpStatus.OK,
    description: '删除成功',
  })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.meetingRoomService.delete(id);
  }
}
