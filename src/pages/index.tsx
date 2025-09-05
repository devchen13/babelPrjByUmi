import { useState } from "react";

import SumOvertime from "./SumOvertime";
import Gua from "./Gua";
import { Layout, Row } from "antd";

export default function HomePage() {
  return (
    <Layout>
      <Row>
        <SumOvertime />
      </Row>
      <Row>
        <Gua />
      </Row>
    </Layout>
  );
}
