import { Form } from "antd";
import { useForm } from "antd/es/form/Form";
import { useCallback } from "react";

export interface SearchMeetingRoom {
  name: string;
  capacity: number;
  equipment: string;
}

export function MeetingRoomManage() {
  const [form] = useForm();

  const searchMeetingRoom = useCallback(async (values: SearchMeetingRoom) => {},
  []);

  return (
    <div id="meetingRoomManage-container">
      <div className="meetingRoomManage-form">
        <Form
          form={form}
          onFinish={searchMeetingRoom}
          name="search"
          layout="inline"
          colon={false}
        ></Form>
      </div>
    </div>
  );
}
