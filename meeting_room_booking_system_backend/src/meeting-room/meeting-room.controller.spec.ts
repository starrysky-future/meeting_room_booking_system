import { Test, TestingModule } from '@nestjs/testing';
import { MeetingRoomController } from './meeting-room.controller';
import { MeetingRoomService } from './meeting-room.service';

describe('MeetingRoomController', () => {
  let controller: MeetingRoomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeetingRoomController],
      providers: [MeetingRoomService],
    }).compile();

    controller = module.get<MeetingRoomController>(MeetingRoomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
