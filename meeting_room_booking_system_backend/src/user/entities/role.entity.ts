import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PermissionEntity } from './permission.entity';

@Entity({ name: 'role' })
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 20,
    comment: '角色名',
  })
  name: string;

  @JoinTable({ name: 'role_permissions' })
  @ManyToMany(() => PermissionEntity)
  permissions: PermissionEntity[];
}
