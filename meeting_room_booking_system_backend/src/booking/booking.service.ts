import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from './entity/booking.entity';
import { Between, FindOperator, Like, Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { MeetingRoomEntity } from 'src/meeting-room/entities/meeting-room.entity';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';

interface ConditionType {
  user?: {
    username?: FindOperator<string>;
  };
  room?: {
    name?: FindOperator<string>;
    location?: FindOperator<string>;
  };
  startTime?: FindOperator<Date>;
}

@Injectable()
export class BookingService {
  @InjectRepository(BookingEntity)
  private bookingRepository: Repository<BookingEntity>;

  @InjectRepository(UserEntity)
  private userRepository: Repository<UserEntity>;

  @InjectRepository(MeetingRoomEntity)
  private meetingRoomRepository: Repository<MeetingRoomEntity>;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(EmailService)
  private emailService: EmailService;

  async list(
    pageNo: number,
    pageSize: number,
    username: string,
    meetingRoomName: string,
    meetingRoomPosition: string,
    bookingTimeRangeStart: number,
    bookingTimeRangeEnd: number,
  ) {
    const skip = (pageNo - 1) * pageSize;

    const condition: ConditionType = {};

    if (username) {
      condition.user = { username: Like(`%${username}%`) };
    }

    if (meetingRoomName) {
      condition.room = {
        name: Like(`%${meetingRoomName}%`),
      };
    }

    if (meetingRoomPosition) {
      if (!condition.room) {
        condition.room = {};
      }
      condition.room.location = Like(`%${meetingRoomPosition}%`);
    }

    if (bookingTimeRangeStart) {
      if (typeof bookingTimeRangeStart === 'string') {
        bookingTimeRangeStart = parseInt(bookingTimeRangeStart);
      }

      if (typeof bookingTimeRangeEnd === 'string') {
        bookingTimeRangeEnd = parseInt(bookingTimeRangeEnd);
      }

      if (!bookingTimeRangeEnd) {
        bookingTimeRangeEnd = bookingTimeRangeStart + 60 * 60 * 1000;
      }

      condition.startTime = Between(
        new Date(bookingTimeRangeStart),
        new Date(bookingTimeRangeEnd),
      );
    }

    const [list, totalCount] = await this.bookingRepository.findAndCount({
      where: condition,
      relations: {
        user: true,
        room: true,
      },
      skip: skip,
      take: pageSize,
    });

    return {
      list: list.map((item) => {
        delete item.user.password;
        return item;
      }),
      totalCount,
    };
  }

  async apply(id: number) {
    await this.bookingRepository.update({ id }, { status: '审批通过' });

    return 'success';
  }

  async reject(id: number) {
    await this.bookingRepository.update({ id }, { status: '审批驳回' });

    return 'success';
  }

  async unbind(id: number) {
    await this.bookingRepository.update({ id }, { status: '已解除' });

    return 'success';
  }

  async urge(id: number) {
    const flag = await this.redisService.get('urge_' + id);

    if (flag) {
      return '半小时内只能催办一次，请耐心等待';
    }

    let email = await this.redisService.get('admin_email');

    if (!email) {
      const admin = await this.userRepository.findOne({
        select: {
          email: true,
        },
        where: {
          isAdmin: true,
        },
      });

      email = admin.email;

      this.redisService.set('admin_email', email);
    }

    await this.emailService.sendMail({
      to: email,
      subject: '预定申请催办提醒',
      html: `id:${id}的预定申请正在等待审批`,
    });

    this.redisService.set('urge_' + id, 1, 60 * 30);

    return 'success';
  }

  async initData() {
    const user1 = await this.userRepository.findOneBy({
      id: 1,
    });
    const user2 = await this.userRepository.findOneBy({
      id: 2,
    });

    const room1 = await this.meetingRoomRepository.findOneBy({
      id: 5,
    });
    const room2 = await await this.meetingRoomRepository.findOneBy({
      id: 6,
    });

    const booking1 = new BookingEntity();
    booking1.room = room1;
    booking1.user = user1;
    booking1.startTime = new Date();
    booking1.endTime = new Date(Date.now() + 1000 * 60 * 60);

    await this.bookingRepository.insert(booking1);

    const booking2 = new BookingEntity();
    booking2.room = room2;
    booking2.user = user2;
    booking2.startTime = new Date();
    booking2.endTime = new Date(Date.now() + 1000 * 60 * 60);

    await this.bookingRepository.insert(booking2);

    const booking3 = new BookingEntity();
    booking3.room = room1;
    booking3.user = user2;
    booking3.startTime = new Date();
    booking3.endTime = new Date(Date.now() + 1000 * 60 * 60);

    await this.bookingRepository.insert(booking3);

    const booking4 = new BookingEntity();
    booking4.room = room2;
    booking4.user = user1;
    booking4.startTime = new Date();
    booking4.endTime = new Date(Date.now() + 1000 * 60 * 60);

    await this.bookingRepository.insert(booking4);
  }
}
