import { DataSource } from 'typeorm';
import { config } from 'dotenv';

import { BookingEntity } from './booking/entity/booking.entity';
import { MeetingRoomEntity } from './meeting-room/entities/meeting-room.entity';
import { PermissionEntity } from './user/entities/permission.entity';
import { RoleEntity } from './user/entities/role.entity';
import { UserEntity } from './user/entities/user.entity';

config({ path: 'src/.env-migration' });

export default new DataSource({
  type: 'mysql',
  host: `${process.env.mysql_server_host}`,
  port: +`${process.env.mysql_server_port}`,
  username: `${process.env.mysql_server_username}`,
  password: `${process.env.mysql_server_password}`,
  database: `${process.env.mysql_server_database}`,
  synchronize: false,
  logging: true,
  entities: [
    BookingEntity,
    MeetingRoomEntity,
    PermissionEntity,
    RoleEntity,
    UserEntity,
  ],
  poolSize: 10,
  migrations: ['src/migrations/**.ts'],
});
