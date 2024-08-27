import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { FindOperator, Like, Repository } from 'typeorm';
import { MeetingRoomEntity } from './entities/meeting-room.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MeetingRoomService {
  @InjectRepository(MeetingRoomEntity)
  private meetingRoomReposition: Repository<MeetingRoomEntity>;

  async create(createMeetingRoomDto: CreateMeetingRoomDto) {
    const room = await this.meetingRoomReposition.findOneBy({
      name: createMeetingRoomDto.name,
    });

    if (room) {
      throw new BadRequestException('会议室名字已存在！');
    }

    await this.meetingRoomReposition.insert(createMeetingRoomDto);

    return '创建成功';
  }

  async update(updateMeetingRoomDto: UpdateMeetingRoomDto) {
    const room = await this.meetingRoomReposition.findOneBy({
      id: updateMeetingRoomDto.id,
    });

    if (!room) {
      throw new BadRequestException('会议室不存在！');
    }

    room.capacity = updateMeetingRoomDto.capacity;
    room.location = updateMeetingRoomDto.location;
    room.name = updateMeetingRoomDto.name;
    room.description = updateMeetingRoomDto.description || '';
    room.equipment = updateMeetingRoomDto.equipment || '';

    try {
      await this.meetingRoomReposition.update(
        { id: updateMeetingRoomDto.id },
        room,
      );
      return '更新成功';
    } catch (error) {}
  }

  async delete(id: number) {
    await this.meetingRoomReposition.delete({ id });
    return '删除成功';
  }

  async findById(id: number) {
    return await this.meetingRoomReposition.findOneBy({ id });
  }

  async list(
    pageNo: number,
    pageSize: number,
    name: string,
    capacity: number,
    location: string,
    equipment: string,
  ) {
    if (pageNo < 1) {
      throw new BadRequestException('页码最小为 1');
    }

    const skip = (pageNo - 1) * pageSize;

    const condition: Record<string, FindOperator<string> | number> = {};
    if (name) {
      condition.name = Like(`%${name}%`);
    }
    if (capacity) {
      condition.capacity = capacity;
    }
    if (location) {
      condition.location = Like(`%${location}%`);
    }
    if (equipment) {
      condition.equipment = Like(`%${equipment}%`);
    }

    const [list, totalCount] = await this.meetingRoomReposition.findAndCount({
      where: condition,
      skip: skip,
      take: pageSize,
    });

    return {
      list,
      totalCount,
    };
  }

  initData() {
    const room1 = new MeetingRoomEntity();
    room1.name = '木星';
    room1.capacity = 10;
    room1.equipment = '白板';
    room1.location = '一层西';

    const room2 = new MeetingRoomEntity();
    room2.name = '金星';
    room2.capacity = 5;
    room2.equipment = '';
    room2.location = '二层东';

    const room3 = new MeetingRoomEntity();
    room3.name = '天王星';
    room3.capacity = 30;
    room3.equipment = '白板，电视';
    room3.location = '三层东';

    this.meetingRoomReposition.insert([room1, room2, room3]);
  }
}
