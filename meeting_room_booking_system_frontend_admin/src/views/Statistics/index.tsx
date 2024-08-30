import { Button, DatePicker, Form, Select, message } from "antd";
import "./index.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as echarts from "echarts";
import dayjs from "dayjs";
import { meetingRoomUsedCount, userBookingCount } from "@/api";
import { useForm } from "antd/es/form/Form";

interface UserBookingData {
  userId: number;
  username: string;
  bookingCount: string;
}

interface MeetingRoomData {
  meetingRoomId: number;
  meetingRoomName: string;
  usedCount: string;
}

export interface StatisticParams {
  startTime: string;
  endTime: string;
}

export function Statistics() {
  const [form] = useForm();
  const [_, setUserBookingChartType] = useState("bar");
  const userBookingRef = useRef<HTMLDivElement>(null);
  const meetingRoomRef = useRef<HTMLDivElement>(null);

  const [userBookingData, setUserBookingData] =
    useState<Array<UserBookingData>>();
  const [meetingRoomData, setMeetingRoomData] =
    useState<Array<MeetingRoomData>>();

  useEffect(() => {
    const userBookingCharts = echarts.init(userBookingRef.current);

    if (!userBookingData) {
      return;
    }

    userBookingCharts.setOption({
      title: {
        text: "用户预定情况",
      },
      tooltip: {},
      xAxis: {
        data: userBookingData?.map((item) => item.username),
      },
      yAxis: {},
      series: [
        {
          name: "预定次数",
          type: form.getFieldValue("chartType"),
          data: userBookingData?.map((item) => {
            return {
              name: item.username,
              value: item.bookingCount,
            };
          }),
        },
      ],
    });
  }, [userBookingData, form.getFieldValue("chartType")]);

  useEffect(() => {
    const meetingRoomCharts = echarts.init(meetingRoomRef.current);

    if (!meetingRoomData) {
      return;
    }

    meetingRoomCharts.setOption({
      title: {
        text: "会议室使用情况",
      },
      tooltip: {},
      xAxis: {
        data: meetingRoomData?.map((item) => item.meetingRoomName),
      },
      yAxis: {},
      series: [
        {
          name: "使用次数",
          type: form.getFieldValue("chartType"),
          data: meetingRoomData?.map((item) => {
            return {
              name: item.meetingRoomName,
              value: item.usedCount,
            };
          }),
        },
      ],
    });
  }, [meetingRoomData, form.getFieldValue("chartType")]);

  const getStatisticData = useCallback(async (values: StatisticParams) => {
    const startTime = dayjs(values.startTime).format("YYYY-MM-DD");
    const endTime = dayjs(values.endTime).format("YYYY-MM-DD");

    const res = await userBookingCount(startTime, endTime);
    const { data } = res.data;

    if (res.status === 200 || res.status === 201) {
      setUserBookingData(data);
    } else {
      message.error(data || "系统繁忙，请稍后再试");
    }

    const res2 = await meetingRoomUsedCount(startTime, endTime);

    const { data: data2 } = res2.data;
    if (res2.status === 201 || res2.status === 200) {
      setMeetingRoomData(data2);
    } else {
      message.error(data2 || "系统繁忙，请稍后再试");
    }
  }, []);

  const handleChange = useCallback((value: string) => {
    // 触犯form.getFieldValue("chartType")值变化
    setUserBookingChartType(value);
  }, []);

  return (
    <div id="statistics-container">
      <div className="statistics-form">
        <Form
          onFinish={getStatisticData}
          form={form}
          name="search"
          layout="inline"
          colon={false}
        >
          <Form.Item label="开始日期" name="startTime">
            <DatePicker />
          </Form.Item>

          <Form.Item label="结束日期" name="endTime">
            <DatePicker />
          </Form.Item>

          <Form.Item label="图表类型" name="chartType" initialValue="bar">
            <Select onChange={handleChange}>
              <Select.Option value="pie">饼图</Select.Option>
              <Select.Option value="bar">柱形图</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="statistics-chart" ref={userBookingRef}></div>
      <div className="statistics-chart" ref={meetingRoomRef}></div>
    </div>
  );
}
