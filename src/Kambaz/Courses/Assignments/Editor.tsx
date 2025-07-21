import { Form, Button, Row, Col, InputGroup, FormControl } from "react-bootstrap";
import { FaCalendarAlt, FaTimes } from "react-icons/fa";
import { useParams, Link } from "react-router-dom";
import * as db from "../../Database";

export default function AssignmentEditor() {
  const { cid, aid } = useParams<{ cid: string; aid: string }>();
  const assignment = db.assignments.find((a) => a._id === aid);

  if (!assignment) {
    return <div className="p-3">Assignment not found</div>;
  }

  return (
    <div id="wd-assignments-editor" className="p-3">
      <Form.Group className="mb-3">
        <Form.Label htmlFor="wd-name" className="fw-bold">
          Assignment Name
        </Form.Label>
        <FormControl id="wd-name" defaultValue={assignment.title} />
      </Form.Group>

      <hr className="my-4" />

      <Form.Group className="mb-3">
        <Form.Label htmlFor="wd-description" className="d-block">
          The assignment is{" "}
          <span className="text-danger fw-bold">
            {assignment.available ? "available online" : "not available"}
          </span>
        </Form.Label>
        <FormControl
          id="wd-description"
          as="textarea"
          rows={7}
          defaultValue={assignment.description || ""}
        />
      </Form.Group>

      <Row className="mb-3 align-items-center">
        <Form.Group as={Col} xs={4}>
          <Form.Label htmlFor="wd-points" className="text-end d-block">
            Points
          </Form.Label>
        </Form.Group>
        <Form.Group as={Col} xs={8}>
          <FormControl id="wd-points" defaultValue={assignment.points} type="number" />
        </Form.Group>
      </Row>

      {/* Assignment Group */}
      <Row className="mb-3 align-items-center">
        <Form.Group as={Col} xs={4}>
          <Form.Label htmlFor="wd-assignment-group" className="text-end d-block">
            Assignment Group
          </Form.Label>
        </Form.Group>
        <Form.Group as={Col} xs={8}>
          <Form.Select id="wd-assignment-group" defaultValue={assignment.group || "ASSIGNMENTS"}>
            <option>ASSIGNMENTS</option>
            <option>QUIZZES</option>
            <option>EXAMS</option>
          </Form.Select>
        </Form.Group>
      </Row>

      {/* Display Grade as */}
      <Row className="mb-3 align-items-center">
        <Form.Group as={Col} xs={4}>
          <Form.Label htmlFor="wd-display-grade-as" className="text-end d-block">
            Display Grade as
          </Form.Label>
        </Form.Group>
        <Form.Group as={Col} xs={8}>
          <Form.Select id="wd-display-grade-as" defaultValue={assignment.displayGradeAs || "Percentage"}>
            <option>Percentage</option>
            <option>Points</option>
            <option>Complete/Incomplete</option>
          </Form.Select>
        </Form.Group>
      </Row>

      {/* Submission Type */}
      <Row className="mb-3">
        <Form.Group as={Col} xs={4}>
          <Form.Label htmlFor="wd-submission-type" className="text-end d-block">
            Submission Type
          </Form.Label>
        </Form.Group>
        <Form.Group as={Col} xs={8}>
          <Form.Select id="wd-submission-type" defaultValue={assignment.submissionType || "Online"}>
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
              defaultChecked={assignment.onlineEntryOptions?.includes("Text Entry")}
            />
            <Form.Check
              type="checkbox"
              id="wd-website-url"
              label="Website URL"
              name="online-entry-options"
              defaultChecked={assignment.onlineEntryOptions?.includes("Website URL")}
            />
            <Form.Check
              type="checkbox"
              id="wd-media-recordings"
              label="Media Recordings"
              name="online-entry-options"
              defaultChecked={assignment.onlineEntryOptions?.includes("Media Recordings")}
            />
            <Form.Check
              type="checkbox"
              id="wd-student-annotation"
              label="Student Annotation"
              name="online-entry-options"
              defaultChecked={assignment.onlineEntryOptions?.includes("Student Annotation")}
            />
            <Form.Check
              type="checkbox"
              id="wd-file-uploads"
              label="File Uploads"
              name="online-entry-options"
              defaultChecked={assignment.onlineEntryOptions?.includes("File Uploads")}
            />
          </div>
        </Form.Group>
      </Row>

      {/* Assign To */}
      <Row className="mb-3">
        <Form.Group as={Col} xs={4}>
          <Form.Label htmlFor="wd-assign-to" className="text-end d-block">
            Assign
          </Form.Label>
        </Form.Group>
        <Form.Group as={Col} xs={8}>
          <Form.Label className="fw-bold mb-1">Assign to</Form.Label>
          <InputGroup className="mb-3">
            <FormControl
              id="wd-assign-to"
              defaultValue={assignment.assignTo || "Everyone"}
              readOnly
              className="bg-white"
            />
            <InputGroup.Text className="bg-light text-muted border-start-0">
              <FaTimes />
            </InputGroup.Text>
          </InputGroup>

          <div className="border p-2 mb-3 rounded">
            <Form.Group className="mb-3">
              <Form.Label htmlFor="wd-due-date" className="fw-bold">
                Due
              </Form.Label>
              <InputGroup>
                <FormControl
                  id="wd-due-date"
                  type="date"
                  defaultValue={assignment.dueDate?.slice(0, 10) || ""}
                />
                <InputGroup.Text className="bg-white border-start-0">
                  <FaCalendarAlt />
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label htmlFor="wd-available-from" className="fw-bold">
                    Available from
                  </Form.Label>
                  <InputGroup>
                    <FormControl
                      id="wd-available-from"
                      type="date"
                      defaultValue={assignment.availableFrom?.slice(0, 10) || ""}
                    />
                    <InputGroup.Text className="bg-white border-start-0">
                      <FaCalendarAlt />
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label htmlFor="wd-until-date" className="fw-bold">
                    Until
                  </Form.Label>
                  <InputGroup>
                    <FormControl
                      id="wd-until-date"
                      type="date"
                      defaultValue={assignment.untilDate?.slice(0, 10) || ""}
                    />
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
        {/* Use Link from react-router-dom for navigation */}
        <Link to={`/Kambaz/Courses/${cid}/Assignments`} className="btn btn-light me-2 border">
          Cancel
        </Link>
        <Link to={`/Kambaz/Courses/${cid}/Assignments`} className="btn btn-danger">
          Save
        </Link>
      </div>
    </div>
  );
}
