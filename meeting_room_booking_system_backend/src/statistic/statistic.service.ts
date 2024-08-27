import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { BookingEntity } from 'src/booking/entity/booking.entity';
import { MeetingRoomEntity } from 'src/meeting-room/entities/meeting-room.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class StatisticService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  async userBookingCount(startTime: string, endTime: string) {
    const res = await this.entityManager
      .createQueryBuilder(BookingEntity, 'b')
      .select('u.id', 'userId')
      .addSelect('u.username', 'username')
      .addSelect('count(1)', 'bookingCount')
      .leftJoin(UserEntity, 'u', 'u.id = b.userId')
      .where('b.startTime between :time1 and :time2', {
        time1: startTime,
        time2: endTime,
      })
      .groupBy('b.userId')
      .getRawMany();

    return res;
  }

  async meetingRoomUsedCount(startTime: string, endTime: string) {
    const res = await this.entityManager
      .createQueryBuilder(MeetingRoomEntity, 'm')
      .select('m.id', 'meetingRoomId')
      .addSelect('m.name', 'meetingRoomName')
      .addSelect('count(1)', 'usedCount')
      .leftJoin(BookingEntity, 'b', 'b.roomId = m.id')
      .where('b.startTime between :time1 and :time2', {
        time1: startTime,
        time2: endTime,
      })
      .groupBy('b.roomId')
      .getRawMany();

    return res;
  }
}
