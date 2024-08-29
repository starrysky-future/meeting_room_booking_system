import {
  Button,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Table,
  TimePicker,
  message,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { useForm } from "antd/es/form/Form";
import "./index.css";
import { UserSearchResult } from "../UserManage/index";
import { MeetingRoomSearchResult } from "../MeetingRoomManage/index";
import dayjs from "dayjs";
import { getBookingList } from "@api/index";

export interface SearchBooking {
  username: string;
  meetingRoomName: string;
  meetingRoomPosition: string;
  rangeStartDate: Date;
  rangeStartTime: Date;
  rangeEndDate: Date;
  rangeEndTime: Date;
}

export interface SearchBookingParams extends SearchBooking {
  pageNo: number;
  pageSize: number;
}

interface BookingSearchResult {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
  note: string;
  createTime: string;
  updateTime: string;
  user: UserSearchResult;
  room: MeetingRoomSearchResult;
}

export function BookingManage() {
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [bookingSearchResult, setBookingSearchResult] = useState<
    Array<BookingSearchResult>
  >([]);
  const [num, setNum] = useState(0);

  const columns: ColumnsType<BookingSearchResult> = [
    {
      title: "会议室名称",
      dataIndex: "room",
      render(_, record) {
        return record.room.name;
      },
    },
    {
      title: "会议室位置",
      dataIndex: "room",
      render(_, record) {
        return record.room.location;
      },
    },
    {
      title: "预定人",
      dataIndex: "user",
      render(_, record) {
        return record.user.username;
      },
    },
    {
      title: "开始时间",
      dataIndex: "startTime",
      render(_, record) {
        return dayjs(new Date(record.startTime)).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      title: "结束时间",
      dataIndex: "endTime",
      render(_, record) {
        return dayjs(new Date(record.endTime)).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      title: "审批状态",
      dataIndex: "status",
    },
    {
      title: "预定时间",
      dataIndex: "createTime",
      render(_, record) {
        return dayjs(new Date(record.createTime)).format("YYYY-MM-DD hh:mm:ss");
      },
    },
    {
      title: "备注",
      dataIndex: "note",
    },
    {
      title: "描述",
      dataIndex: "description",
    },
    {
      title: "操作",
      render: (_, record) => <div></div>,
    },
  ];

  const searchBooking = useCallback(
    async (values: SearchBooking) => {
      const res = await getBookingList({ ...values, pageNo, pageSize });

      const { data } = res.data;
      if (res.status === 200 || res.status === 201) {
        setBookingSearchResult(
          data.list.map((item: BookingSearchResult) => {
            return {
              key: item.id,
              ...item,
            };
          })
        );
      }
    },
    [pageNo, pageSize]
  );

  const [form] = useForm();

  useEffect(() => {
    searchBooking({
      username: form.getFieldValue("username"),
      meetingRoomName: form.getFieldValue("meetingRoomName"),
      meetingRoomPosition: form.getFieldValue("meetingRoomPosition"),
      rangeStartDate: form.getFieldValue("rangeStartDate"),
      rangeStartTime: form.getFieldValue("rangeStartTime"),
      rangeEndDate: form.getFieldValue("rangeEndDate"),
      rangeEndTime: form.getFieldValue("rangeEndTime"),
    });
  }, [pageNo, pageSize, num]);

  const changePage = function (pageNo: number, pageSize: number) {
    setPageNo(pageNo);
    setPageSize(pageSize);
  };

  return (
    <div id="bookingManage-container">
      <div className="bookingManage-form">
        <Form
          form={form}
          onFinish={searchBooking}
          name="search"
          layout="inline"
          colon={false}
        >
          <Form.Item label="预定人" name="username">
            <Input />
          </Form.Item>

          <Form.Item label="会议室名称" name="meetingRoomName">
            <Input />
          </Form.Item>

          <Form.Item label="预定开始日期" name="rangeStartDate">
            <DatePicker />
          </Form.Item>

          <Form.Item label="预定开始时间" name="rangeStartTime">
            <TimePicker />
          </Form.Item>

          <Form.Item label="预定结束日期" name="rangeEndDate">
            <DatePicker />
          </Form.Item>

          <Form.Item label="预定结束时间" name="rangeEndTime">
            <TimePicker />
          </Form.Item>

          <Form.Item label="位置" name="meetingRoomPosition">
            <Input />
          </Form.Item>

          <Form.Item label=" ">
            <Button type="primary" htmlType="submit">
              搜索预定申请
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="bookingManage-table">
        <Table
          columns={columns}
          dataSource={bookingSearchResult}
          pagination={{
            current: pageNo,
            pageSize: pageSize,
            onChange: changePage,
          }}
        />
      </div>
    </div>
  );
}
