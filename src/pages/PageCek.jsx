import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Modal,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import configApi from "../config.api";
import SalaryModel from "../models/SalaryModel";
import WidgetEmployeePreview from "../components/WidgetEmployeePreview";
import WidgetCommonIDR from "../components/WidgetCommonIDR";
import EmployeeModel from "../models/EmployeeModel";
import WidgetCommonHumanDate from "../components/WidgetCommonHumanDate";
import InputModel from "../models/InputModel";

const PageCek = () => {
  const [show, setShow] = useState(false);
  const [salary, setSalary] = useState(SalaryModel);
  const [employee, setEmployee] = useState(EmployeeModel);
  const [input, setInput] = useState(InputModel);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const get = async () => {
    try {
      const response = await fetch(
        `${configApi.BASE_URL}/salary/cek/slip-gaji`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(input),
        }
      );

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      let content = await response.json();
      setSalary(content);
      // eventListener({detail: { status: true, content }})
    } catch (error) {
      // eventListener({detail: { status: false, error }})
    }
  };

  const employeePreviewListener = (e) => {
    if (e.detail.status) {
      setEmployee(e.detail.content);
    } else {
    }
  };

  const handleInput = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    if (e.target.type === "number") {
      value = parseInt(value);
    }

    setInput((values) => ({ ...values, [name]: value }));
  };

  return (
    <>
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Payslip App Karyawan</Card.Title>
                <Form.Group className="mt-3 mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    value={input.email}
                    onChange={handleInput}
                    name="email"
                    type="email"
                    placeholder="Enter email"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Payroll Month</Form.Label>
                  <Form.Control
                    value={input.payrollMonth}
                    onChange={handleInput}
                    name="payrollMonth"
                    type="text"
                    placeholder="Enter payroll month"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Payroll Year</Form.Label>
                  <Form.Control
                    value={input.payrollYear}
                    onChange={handleInput}
                    name="payrollYear"
                    type="text"
                    placeholder="Enter payroll year"
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button onClick={handleShow} variant="primary">
                    Cek Payslip
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Modal
          show={show}
          onHide={handleClose}
          onShow={get}
          size="lg"
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {employee.email}
              <br />
              <WidgetCommonHumanDate date={salary.payrollDate} />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <WidgetEmployeePreview
              employeeId={salary.employeeId}
              eventListener={employeePreviewListener}
            />
            <Row>
              <Col>
                <Table striped bordered hover>
                  <caption style={{ captionSide: "top" }}>
                    Others Allowance
                  </caption>
                  <thead>
                    <tr>
                      <th>Allowance</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salary.othersAllowance.map((allowance, index) => (
                      <tr key={index}>
                        <td>{allowance.name}</td>
                        <td>{allowance.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
              <Col>
                <Table striped bordered hover>
                  <caption style={{ captionSide: "top" }}>
                    Others Deduction
                  </caption>
                  <thead>
                    <tr>
                      <th>Deduction</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salary.othersDeduction.map((deduction, index) => (
                      <tr key={index}>
                        <td>{deduction.name}</td>
                        <td>{deduction.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>

            <Row>
              <Col>
                <Table striped bordered hover>
                  <caption style={{ captionSide: "top" }}>Pay Slip</caption>
                  <thead>
                    <tr>
                      <th>Total Allowance</th>
                      <th>Total Deduction</th>
                      <th>Total Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <WidgetCommonIDR value={salary.totalAllowance} />
                      </td>
                      <td>
                        <WidgetCommonIDR value={salary.totalDeduction} />
                      </td>
                      <td>
                        <WidgetCommonIDR value={salary.totalSalary} />
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default PageCek;
