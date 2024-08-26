import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from './entity/booking.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { MeetingRoomEntity } from 'src/meeting-room/entities/meeting-room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingEntity, UserEntity, MeetingRoomEntity]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
