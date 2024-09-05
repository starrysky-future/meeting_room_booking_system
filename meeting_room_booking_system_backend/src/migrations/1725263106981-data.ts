import { MigrationInterface, QueryRunner } from 'typeorm';

export class Data1725263106981 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "INSERT INTO `user` (username,password,nick_name,email,head_pic,phone_number,isFrozen,isAdmin,createTime,updateTime) VALUES ('shu','670b14728ad9902aecba32e22fa4f6bd','舒','2840777097@qq.com','',NULL,1,0,'2024-08-17 09:38:54.255041','2024-09-03 13:03:52.094969'), ('zhangsan','e10adc3949ba59abbe56e057f20f883e','张三','2840777097@qq.com','1725446086041-571109044-home.jpg','13233323333',0,1,'2024-08-18 07:55:41.683000','2024-09-03 13:03:52.211000'), ('lisi','1a100d2c0dab19c4430e7d73762b3423','李四','2840777097@qq.com','',NULL,0,0,'2024-08-18 07:55:41.706394','2024-09-03 13:03:52.279047'), ('kunkun','e3ceb5881a0a1fdaad01296d7554868d','鸡你太美','2840777097@qq.com',NULL,NULL,0,0,'2024-08-22 10:30:48.789521','2024-08-24 13:27:08')",
    );
    await queryRunner.query(
      "INSERT INTO `meeting_room` (name,capacity,location,equipment,description,isBooked,createTime,updateTime) VALUES('木星',10,'一层西','白板','发给对方公司',0,'2024-08-26 05:40:09.390000','2024-08-26 05:40:09.390000'),('金星',5,'二层东','','',0,'2024-08-26 05:40:09.390947','2024-08-26 05:40:09.390947'),('天王星',30,'三层东','白板，电视','',0,'2024-08-26 05:40:09.390947','2024-08-26 05:40:09.390947'),('冥王星',30,'一层东','','',0,'2024-08-28 07:30:20.556033','2024-08-28 07:30:20.556033'),('火星',20,'一层北','白板','',0,'2024-08-28 07:31:40.297267','2024-08-28 07:31:40.297267'),('水星',20,'二层北','电视','能用电视',0,'2024-08-28 08:34:21.519000','2024-08-28 08:34:21.519000')",
    );
    await queryRunner.query(
      "INSERT INTO `booking` (startTime,endTime,status,note,createTime,updateTime,userId,roomId) VALUES ('2024-08-26 16:41:05','2024-08-26 17:41:05','已解除','','2024-08-26 08:41:05.185041','2024-08-30 06:37:20',1,5),('2024-08-26 16:41:06','2024-08-26 17:41:06','审批通过','','2024-08-26 08:41:05.548120','2024-08-30 06:38:12',2,6),('2024-08-26 16:41:06','2024-08-26 17:41:06','审批驳回','','2024-08-26 08:41:05.626717','2024-08-30 06:38:19',2,5),('2024-08-26 16:41:06','2024-08-26 17:41:06','申请中','','2024-08-26 08:41:05.692680','2024-08-30 06:38:03.075706',1,6),('2024-08-26 16:41:06','2024-08-26 17:41:06','审批通过','','2024-08-26 08:41:05.692680','2024-08-30 06:35:28',3,4),('2024-08-26 16:41:06','2024-08-26 17:41:06','审批通过','','2024-08-26 08:41:05.692680','2024-08-30 06:35:28',4,4),('2024-08-26 16:41:06','2024-08-26 17:41:06','已解除','','2024-08-26 08:41:05.692680','2024-09-01 06:33:56',3,5),('2024-08-26 16:41:06','2024-08-26 17:41:06','审批通过','','2024-08-26 08:41:05.692680','2024-08-30 06:35:28',4,6),('2024-08-26 18:41:06','2024-08-26 19:41:06','审批通过','','2024-08-26 08:41:05.692680','2024-08-30 06:35:28',4,6),('2024-08-26 20:41:06','2024-08-26 21:41:06','审批通过','','2024-08-26 08:41:05.692680','2024-08-30 06:35:28',4,6),('2024-08-26 22:41:06','2024-08-26 23:41:06','申请中','','2024-08-26 08:41:05.692680','2024-08-26 08:41:05.692680',4,6),('2024-09-01 16:00:00','2024-09-01 17:00:00','申请中','开会开会','2024-09-01 05:33:32.636446','2024-09-01 05:33:32.636446',3,4),('2024-09-02 18:00:00','2024-09-02 19:00:00','申请中','下班会议','2024-09-01 06:15:28.902787','2024-09-01 06:15:28.902787',3,5)",
    );
    await queryRunner.query(
      "INSERT INTO `role` (name) VALUES('管理员'),('普通用户');",
    );
    await queryRunner.query(
      "INSERT INTO `permission` (code,description) VALUES('ccc','访问 ccc 接口'),('ddd','访问 ddd 接口');",
    );
    await queryRunner.query(
      'INSERT INTO `role_permissions` (roleId,permissionId) VALUES(1,1),(1,2),(2,1);',
    );
    await queryRunner.query(
      'INSERT INTO `user_roles` (userId,roleId) VALUES(2,1),(3,2);',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('TRUNCATE TABLE booking');
    await queryRunner.query('TRUNCATE TABLE meeting_room');
    await queryRunner.query('TRUNCATE TABLE role_permissions');
    await queryRunner.query('TRUNCATE TABLE user_roles');
    await queryRunner.query('TRUNCATE TABLE permission');
    await queryRunner.query('TRUNCATE TABLE role');
    await queryRunner.query('TRUNCATE TABLE user');
  }
}
