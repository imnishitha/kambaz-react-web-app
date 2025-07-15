import { Form, Button, Row, Col, InputGroup, FormControl } from "react-bootstrap";
import { FaCalendarAlt, FaTimes } from "react-icons/fa"; 
export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor" className="p-3">
      <Form.Group className="mb-3">
        <Form.Label htmlFor="wd-name" className="fw-bold">Assignment Name</Form.Label>
        <FormControl id="wd-name" defaultValue="A1" />
      </Form.Group>

      <hr className="my-4" />

      <Form.Group className="mb-3">
        <Form.Label htmlFor="wd-description" className="d-block">
          The assignment is <span className="text-danger fw-bold">available online</span>
        </Form.Label>
        <FormControl
          id="wd-description"
          as="textarea"
          rows={7}
          defaultValue="Submit a link to the landing page of your Web application running on Netlify. The landing page should include the following: Your full name and section Links to each of the lab assignments Link to the Kanbas application Links to all relevant source code repositories The Kanbas application should include a link to navigate back to the landing page."
        />
      </Form.Group>

      <Row className="mb-3 align-items-center">
        <Form.Group as={Col} xs={4}>
          <Form.Label htmlFor="wd-points" className="text-end d-block">Points</Form.Label>
        </Form.Group>
        <Form.Group as={Col} xs={8}>
          <FormControl id="wd-points" defaultValue={100} type="number" />
        </Form.Group>
      </Row>

      <Row className="mb-3 align-items-center">
        <Form.Group as={Col} xs={4}>
          <Form.Label htmlFor="wd-assignment-group" className="text-end d-block">Assignment Group</Form.Label>
        </Form.Group>
        <Form.Group as={Col} xs={8}>
          <Form.Select id="wd-assignment-group">
            <option>ASSIGNMENTS</option>
            <option>QUIZZES</option>
            <option>EXAMS</option>
          </Form.Select>
        </Form.Group>
      </Row>

      <Row className="mb-3 align-items-center">
        <Form.Group as={Col} xs={4}>
          <Form.Label htmlFor="wd-display-grade-as" className="text-end d-block">Display Grade as</Form.Label>
        </Form.Group>
        <Form.Group as={Col} xs={8}>
          <Form.Select id="wd-display-grade-as">
            <option>Percentage</option>
            <option>Points</option>
            <option>Complete/Incomplete</option>
          </Form.Select>
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} xs={4}>
          <Form.Label htmlFor="wd-submission-type" className="text-end d-block">Submission Type</Form.Label>
        </Form.Group>
        <Form.Group as={Col} xs={8}>
          <Form.Select id="wd-submission-type">
            <option>Online</option>
            <option>On Paper</option>
            <option>No Submission</option>
          </Form.Select>
          <div className="mt-3">
            <Form.Label className="fw-bold">Online Entry Options</Form.Label>
            <Form.Check
              type="checkbox"
              id="wd-text-entry"
              label="Text Entry"
              name="online-entry-options"
            />
            <Form.Check
              type="checkbox"
              id="wd-website-url"
              label="Website URL"
              name="online-entry-options"
              defaultChecked
            />
            <Form.Check
              type="checkbox"
              id="wd-media-recordings"
              label="Media Recordings"
              name="online-entry-options"
            />
            <Form.Check
              type="checkbox"
              id="wd-student-annotation"
              label="Student Annotation"
              name="online-entry-options"
            />
            <Form.Check
              type="checkbox"
              id="wd-file-uploads"
              label="File Uploads"
              name="online-entry-options"
            />
          </div>
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} xs={4}>
          <Form.Label htmlFor="wd-assign-to" className="text-end d-block">Assign</Form.Label>
        </Form.Group>
        <Form.Group as={Col} xs={8}>
          <Form.Label className="fw-bold mb-1">Assign to</Form.Label>
          <InputGroup className="mb-3">
            <FormControl
              id="wd-assign-to"
              defaultValue="Everyone"
              readOnly
              className="bg-white"
            />
            <InputGroup.Text className="bg-light text-muted border-start-0">
              <FaTimes />
            </InputGroup.Text>
          </InputGroup>
          <div className="border p-2 mb-3 rounded">
            <Form.Group className="mb-3">
              <Form.Label htmlFor="wd-due-date" className="fw-bold">Due</Form.Label>
              <InputGroup>
                <FormControl id="wd-due-date" type="date" defaultValue="2024-05-13" />
                <InputGroup.Text className="bg-white border-start-0">
                  <FaCalendarAlt />
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label htmlFor="wd-available-from" className="fw-bold">Available from</Form.Label>
                  <InputGroup>
                    <FormControl id="wd-available-from" type="date" defaultValue="2024-05-06" />
                    <InputGroup.Text className="bg-white border-start-0">
                      <FaCalendarAlt />
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label htmlFor="wd-until-date" className="fw-bold">Until</Form.Label>
                  <InputGroup>
                    <FormControl id="wd-until-date" type="date" defaultValue="2024-05-20" />
                    <InputGroup.Text className="bg-white border-start-0">
                      <FaCalendarAlt />
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Form.Group>
      </Row>

      <hr />
      <div className="d-flex justify-content-end">
        <Button variant="light" className="me-2 border">Cancel</Button>
        <Button variant="danger">Save</Button>
      </div>
    </div>
  );
}