import { BookingEntity } from '../../booking/entity/booking.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'meeting_room' })
export class MeetingRoomEntity {
  @PrimaryGeneratedColumn({ comment: '会议室ID' })
  id: number;

  @Column({ length: 50, comment: '会议室名字', unique: true })
  name: string;

  @Column({ comment: '会议室容量' })
  capacity: number;

  @Column({ length: 50, comment: '会议室位置' })
  location: string;

  @Column({ length: 50, comment: '设备', default: '' })
  equipment: string;

  @Column({ length: 100, comment: '描述', default: '' })
  description: string;

  @Column({ comment: '是否被预定', default: false })
  isBooked: boolean;

  @OneToMany(() => BookingEntity, (BookingEntity) => BookingEntity.room)
  bookings: BookingEntity[];

  @CreateDateColumn({ comment: '创建时间' })
  createTime: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updateTime: Date;
}
