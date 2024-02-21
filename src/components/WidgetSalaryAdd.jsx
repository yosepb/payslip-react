import { useMemo, useState } from "react";
import SalaryModel from "../models/SalaryModel";
import EmployeeModel from "../models/EmployeeModel";
import {
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import WidgetEmployeeChoice from "./WidgetEmployeeChoice";
import AllowanceModel from "../models/AllowanceModel";
import DeductionModel from "../models/DeductionModel";
import { FaTrash } from "react-icons/fa";
import configApi from "../config.api";

const WidgetSalaryAdd = ({ eventListener }) => {
  const [show, setShow] = useState(false);
  const [salary, setSalary] = useState(SalaryModel);
  const [otherAllowance, setOtherAllowance] = useState(AllowanceModel);
  const [otherDeduction, setOtherDeduction] = useState(DeductionModel);
  const [employee, setEmployee] = useState(EmployeeModel);
  const [totalSalary, setTotalSalary] = useState(0);

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => setShow(true);

  const employeeChoiceListener = (e) => {
    setEmployee(e.detail.employee);
    setSalary((values) => ({ ...values, employeeId: e.detail.employee._id }));
  };

  const handleOtherAllowance = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if (name === "total") {
      value = parseInt(value);
    }

    setOtherAllowance((values) => ({ ...values, [name]: value }));
  };

  const handleOtherDeduction = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if (name === "total") {
      value = parseInt(value);
    }

    setOtherDeduction((values) => ({ ...values, [name]: value }));
  };

  const addOtherAllowance = () => {
    if (!otherAllowance.total && !otherAllowance.name) return;

    setSalary((values) => {
      let currentSalary = { ...salary };
      let currentOtherAllowance = { ...otherAllowance };
      currentSalary.othersAllowance.push(currentOtherAllowance);
      setOtherAllowance(AllowanceModel);
      return currentSalary;
    });
  };

  const addOtherDeduction = () => {
    if (!otherDeduction.total && !otherDeduction.name) return;

    setSalary((values) => {
      let currentSalary = { ...salary };
      let currentOtherDeduction = { ...otherDeduction };
      currentSalary.othersDeduction.push(currentOtherDeduction);
      setOtherDeduction(DeductionModel);
      return currentSalary;
    });
  };

  const removeOthersAllowance = (index) => {
    setSalary((salary) => {
      let currentSalary = { ...salary };
      currentSalary.othersAllowance.splice(index, 1);
      return currentSalary;
    });
  };

  const removeOthersDeduction = (index) => {
    setSalary((salary) => {
      let currentSalary = { ...salary };
      currentSalary.othersDeduction.splice(index, 1);
      return currentSalary;
    });
  };

  useMemo(() => {
    let total = () => {
      let totalAllowances = 0;
      let totalDeductions = 0;

      // sum all others allowance
      if (salary.othersAllowance.length > 0) {
        totalAllowances += salary.othersAllowance.reduce(
          (t, item) => t + item.total,
          0
        );
      }

      // sum all others deduction
      if (salary.othersDeduction.length > 0) {
        totalDeductions += salary.othersDeduction.reduce(
          (t, item) => t + item.total,
          0
        );
      }

      if (employee._id) {
        // sum all allowances
        totalAllowances += employee.allowances.reduce(
          (t, item) => t + item.total,
          0
        );
        // sum all deductions
        totalDeductions += employee.deductions.reduce(
          (t, item) => t + item.total,
          0
        );
        setTotalSalary(
          employee.basicSalary + (totalAllowances - totalDeductions)
        );
      }
    };

    total();
    return () => {};
  }, [salary, employee]);

  const payslip = async () => {
    try {
      const response = await fetch(`${configApi.BASE_URL}/salary`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(salary),
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const content = await response.json();
      setSalary(SalaryModel);
      setOtherAllowance(AllowanceModel);
      setOtherDeduction(DeductionModel);
      setTotalSalary(0);
      setEmployee(EmployeeModel);
      handleClose();
      eventListener({ detail: { content, status: true } });
    } catch (error) {
      eventListener({ detail: { error, status: false } });
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Pay Slip
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Pay Slip </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <Col>
              <WidgetEmployeeChoice eventListener={employeeChoiceListener} />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Other Allowances</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="Name"
                    name="name"
                    value={otherAllowance.name}
                    onChange={handleOtherAllowance}
                  />
                  <Form.Control
                    placeholder="Price"
                    name="total"
                    value={otherAllowance.total || 0}
                    onChange={handleOtherAllowance}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={addOtherAllowance}
                  >
                    Add
                  </Button>
                </InputGroup>
              </Form.Group>
              {salary.othersAllowance.length > 0 && (
                <Table striped bordered>
                  <thead>
                    <tr>
                      <th>Allowance</th>
                      <th>Value</th>
                      <th>#</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salary.othersAllowance.map((allowance, index) => (
                      <tr key={index}>
                        <td>{allowance.name}</td>
                        <td>{allowance.total}</td>
                        <td>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => removeOthersAllowance(index)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Other Deductions</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="Name"
                    name="name"
                    value={otherDeduction.name}
                    onChange={handleOtherDeduction}
                  />
                  <Form.Control
                    placeholder="Price"
                    name="total"
                    value={otherDeduction.total || 0}
                    onChange={handleOtherDeduction}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={addOtherDeduction}
                  >
                    Add
                  </Button>
                </InputGroup>
              </Form.Group>
              {salary.othersDeduction.length > 0 && (
                <Table striped bordered>
                  <thead>
                    <tr>
                      <th>Deduction</th>
                      <th>Value</th>
                      <th>#</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salary.othersDeduction.map((deduction, index) => (
                      <tr key={index}>
                        <td>{deduction.name}</td>
                        <td>{deduction.total}</td>
                        <td>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => removeOthersDeduction(index)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Col>
          </Row>

          <Row>
            <Col>
              <Table striped borderless>
                <tbody>
                  <tr>
                    <td>Total Salary</td>
                  </tr>
                  <tr>
                    <th>{totalSalary}</th>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={payslip}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default WidgetSalaryAdd;
