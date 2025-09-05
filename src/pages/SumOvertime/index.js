import React, { useState } from "react";

import dayjs from "dayjs";
import { Input, Button, message, Space } from "antd";
import mockData from "./mockData";

const SumOvertime = () => {
  const defaultData = mockData;
  const [data, setData] = useState(defaultData || []);

  const handleSummaryDataChange = (result) => {
    try {
      const currentDay = dayjs().format("YYYY-MM-DD");
      if (result?.code === "1") {
        let overtimeHours = 0;
        result?.data?.forEach((item) => {
          let offTime = item?.firstOffRgTime || "";
          if (offTime && item.isWorkingDays === "1") {
            const start = dayjs(`${currentDay} 18:30`);
            const end = dayjs(`${currentDay} ${offTime}`);
            if (end - start <= 0) return;
            let overtimeHour = end.diff(start, "minute");
            // 一小时内  加班时长不统计
            if (overtimeHour < 60) {
              overtimeHour = 0;
            }
            overtimeHours += overtimeHour / 60;
          }
          if (offTime && item.isWorkingDays === "0") {
            // 初始时间   在8.30之后取实际时间   在8.30前  取8.30
            const start =
              dayjs(`${currentDay} ${item.firstOnRgTime}`) >
              dayjs(`${currentDay} 08:30`)
                ? dayjs(`${currentDay} ${item.firstOnRgTime}`)
                : dayjs(`${currentDay} 08:30`);

            const end = dayjs(`${currentDay} ${offTime}`);

            if (end - start <= 0) return;
            // 剥离中午一个半小时时间点
            if (start < dayjs(`${currentDay} 11:30`)) {
              const overtimeHour = dayjs(`${currentDay} 11:30`).diff(
                start,
                "minute"
              );
              overtimeHours += overtimeHour / 60;
            }
            if (end > dayjs(`${currentDay} 13:00`)) {
              const overtimeHour = end.diff(
                dayjs(`${currentDay} 13:00`),
                "minute"
              );
              overtimeHours += overtimeHour / 60;
            }
          }
        });
        window.overtimeHours = overtimeHours.toFixed(2);
        console.log(overtimeHours.toFixed(2));
        message.success(overtimeHours.toFixed(2));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = () => {
    handleSummaryDataChange({ data, code: "1" });
  };

  return (
    <div style={{ width: "100vw" }}>
      <Space.Compact>
        <Input
          onChange={(e) => {
            try {
              const objList = JSON.parse(e.target.value || "[]");
              setData(objList);
            } catch (error) {}
          }}
        />
        <Button onClick={handleClick}>ok</Button>
      </Space.Compact>
    </div>
  );
};

export default SumOvertime;
