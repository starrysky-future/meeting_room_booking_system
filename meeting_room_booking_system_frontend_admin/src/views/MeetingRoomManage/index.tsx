import {
  Badge,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Table,
  message,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useMemo, useState } from "react";
import "./index.css";
import {
  deleteMeetingRoom,
  getMeetingRoomList,
  createMeetingRoom,
  findMeetingRoom,
  updateMeetingRoom,
} from "@api/index";
import { layout_6_18 } from "../layout";
import TextArea from "antd/es/input/TextArea";

interface SearchMeetingRoom {
  name: string;
  capacity: number;
  location: string;
  equipment: string;
}

export interface SearchMeetingRoomParams extends SearchMeetingRoom {
  pageNo: number;
  pageSize: number;
}

export interface MeetingRoomSearchResult {
  id: number;
  name: string;
  capacity: number;
  location: string;
  equipment: string;
  description: string;
  isBooked: boolean;
  createTime: Date;
  updateTime: Date;
}

export function MeetingRoomManage() {
  const [form] = useForm();

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [num, setNum] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateId, setUpdateId] = useState<number>();

  const [meetingRoomResult, setMeetingRoomResult] = useState<
    Array<MeetingRoomSearchResult>
  >([]);

  const columns: ColumnsType<MeetingRoomSearchResult> = useMemo(
    () => [
      {
        title: "名称",
        dataIndex: "name",
      },
      {
        title: "容纳人数",
        dataIndex: "capacity",
      },
      {
        title: "位置",
        dataIndex: "location",
      },
      {
        title: "设备",
        dataIndex: "equipment",
      },
      {
        title: "描述",
        dataIndex: "description",
      },
      {
        title: "添加时间",
        dataIndex: "createTime",
      },
      {
        title: "上次更新时间",
        dataIndex: "updateTime",
      },
      {
        title: "预定状态",
        dataIndex: "isBooked",
        render: (_, record) =>
          record.isBooked ? (
            <Badge status="error">已被预定</Badge>
          ) : (
            <Badge status="success">可预定</Badge>
          ),
      },
      {
        title: "操作",
        render: (_, record) => (
          <div>
            <Popconfirm
              title="会议室删除"
              description="确认删除吗?"
              onConfirm={() => handleDelete(record.id)}
              okText="确认"
              cancelText="取消"
            >
              <a href="#">删除</a>
            </Popconfirm>
            <br />
            <a
              href="#"
              onClick={() => {
                setUpdateId(record.id);
                setIsUpdateModalOpen(true);
              }}
            >
              更新
            </a>
          </div>
        ),
      },
    ],

    []
  );

  useEffect(() => {
    searchMeetingRoom({
      name: form.getFieldValue("name"),
      capacity: form.getFieldValue("capacity"),
      location: form.getFieldValue("location"),
      equipment: form.getFieldValue("equipment"),
    });
  }, [pageNo, pageSize, num]);

  const searchMeetingRoom = useCallback(
    async (values: SearchMeetingRoom) => {
      const res = await getMeetingRoomList({
        ...values,
        pageNo,
        pageSize,
      });

      const { data } = res.data;

      if (res.status === 200 || res.status === 201) {
        setMeetingRoomResult(
          data.list.map((item: MeetingRoomSearchResult) => {
            return {
              key: item.id,
              ...item,
            };
          })
        );
        setTotal(data.total);
      } else {
        message.error(data || "系统繁忙，请稍后再试");
      }
    },
    [pageNo, pageSize]
  );

  const onChange = useCallback((pageNo: number, pageSize: number) => {
    setPageNo(pageNo);
    setPageSize(pageSize);
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteMeetingRoom(id);
      setNum(Math.random());
      message.success("删除成功");
    } catch (e) {
      console.log(e);
      message.success("删除失败");
    }
  }, []);

  return (
    <div id="meetingRoomManage-container">
      <div className="meetingRoomManage-form">
        <Form
          form={form}
          onFinish={searchMeetingRoom}
          name="search"
          layout="inline"
          colon={false}
        >
          <Form.Item label="会议室名称" name="name">
            <Input />
          </Form.Item>

          <Form.Item label="容纳人数" name="capacity">
            <Input />
          </Form.Item>

          <Form.Item label="位置" name="location">
            <Input />
          </Form.Item>

          <Form.Item label="设备" name="equipment">
            <Input />
          </Form.Item>

          <Form.Item label=" ">
            <Button type="primary" htmlType="submit">
              搜索会议室
            </Button>
            <Button
              type="primary"
              style={{ background: "green" }}
              onClick={() => setIsCreateModalOpen(true)}
            >
              添加会议室
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div className="meetingRoomManage-table">
        <Table
          columns={columns}
          dataSource={meetingRoomResult}
          pagination={{
            current: pageNo,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            onChange: onChange,
          }}
        ></Table>
      </div>

      <CreateOrUpdateMeetingRoomMoadl
        title="创建会议室"
        isOpen={isCreateModalOpen}
        handleClose={() => {
          setNum(Math.random());
          setIsCreateModalOpen(false);
        }}
      ></CreateOrUpdateMeetingRoomMoadl>
      <CreateOrUpdateMeetingRoomMoadl
        title="更新会议室"
        updateId={updateId}
        isOpen={isUpdateModalOpen}
        handleClose={() => {
          setNum(Math.random());
          setIsUpdateModalOpen(false);
        }}
      ></CreateOrUpdateMeetingRoomMoadl>
    </div>
  );
}

interface CreateOrUpdateMeetingRoomMoadlProps {
  isOpen: boolean;
  title: string;
  updateId?: number;
  handleClose: Function;
}

export interface CreateOrUpdateMeetingRoom {
  id: number;
  name: string;
  capacity: number;
  location: string;
  equipment: string;
  description: string;
}

export function CreateOrUpdateMeetingRoomMoadl(
  props: CreateOrUpdateMeetingRoomMoadlProps
) {
  const [form] = useForm<CreateOrUpdateMeetingRoom>();

  const handleOk = useCallback(async () => {
    const values = form.getFieldsValue();

    values.description = values.description || "";
    values.equipment = values.equipment || "";

    let res;
    if (!props.updateId) {
      res = await createMeetingRoom(values);
    } else {
      res = await updateMeetingRoom({ ...values, id: props.updateId });
    }

    const { data } = res.data;

    if (res.status === 200 || res.status === 201) {
      form.resetFields();
      message.success(data);
      props.handleClose();
    } else {
      message.success(data);
    }
  }, [props.updateId]);

  useEffect(() => {
    async function query() {
      if (!props.updateId) {
        return;
      }

      const res = await findMeetingRoom(props.updateId);
      const { data } = res.data;

      if (res.status === 200 || res.status === 201) {
        form.setFieldValue("id", data.id);
        form.setFieldValue("name", data.name);
        form.setFieldValue("location", data.location);
        form.setFieldValue("capacity", data.capacity);
        form.setFieldValue("equipment", data.equipment);
        form.setFieldValue("description", data.description);
      } else {
        message.error(res.data.data);
      }
    }
    query();
  }, [props.updateId]);

  return (
    <Modal
      title={props.title}
      open={props.isOpen}
      onOk={handleOk}
      onCancel={() => props.handleClose()}
      okText="确认"
      cancelText="取消"
    >
      <Form {...layout_6_18} form={form} colon={false}>
        <Form.Item
          label="会议室名称"
          name="name"
          rules={[{ required: true, message: "请输入会议室名称!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="容纳人数"
          name="capacity"
          rules={[{ required: true, message: "请输入容纳人数!" }]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          label="位置"
          name="location"
          rules={[{ required: true, message: "请输入会议室位置!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="设备" name="equipment">
          <Input />
        </Form.Item>

        <Form.Item label="描述" name="description">
          <TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
}
