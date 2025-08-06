import { Form, Row, Col, InputGroup, FormControl, Button } from "react-bootstrap";
import { FaCalendarAlt, FaTimes } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateAssignment, setAssignments } from "./reducer";
import * as client from "./client"; 
import { useState, useEffect } from "react";

export default function AssignmentEditor() {
  const { cid, aid } = useParams<{ cid: string; aid: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [assignment, setAssignment] = useState<any>(null);
  const fetchAssignmentById = async (id: string) => {
    try {
      const fetchedAssignment = await client.findAssignmentById(id);
      setAssignment(fetchedAssignment);
    } catch (error) {
      console.error("Error fetching assignment:", error);
    }
  };

  useEffect(() => {
    if (aid) {
      fetchAssignmentById(aid);
    }
  }, [aid]); 
  if (!assignment) {
    return <div className="p-3">Assignment not found</div>;
  }


  const handleSave = async () => {
    if (assignment) {
      await client.updateAssignment(assignment);
      dispatch(updateAssignment(assignment)); // Update Redux state for immediate UI consistency
      navigate(`/Kambaz/Courses/${cid}/Assignments`);
    }
  };

  const handleCancel = () => {
    navigate(`/Kambaz/Courses/${cid}/Assignments`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, checked, name } = e.target as HTMLInputElement;

    setAssignment((prev: any) => {
      let updatedValue: any;
      let fieldName: string;
      switch (id) {
        case 'wd-name': fieldName = 'title'; break;
        case 'wd-description': fieldName = 'description'; break;
        case 'wd-points': fieldName = 'points'; updatedValue = parseFloat(value); break;
        case 'wd-assignment-group': fieldName = 'group'; break;
        case 'wd-display-grade-as': fieldName = 'displayGradeAs'; break;
        case 'wd-submission-type': fieldName = 'submissionType'; break;
        case 'wd-assign-to': fieldName = 'assignTo'; break; 
        case 'wd-due-date': fieldName = 'dueDate'; break;
        case 'wd-available-from': fieldName = 'availableFrom'; break;
        case 'wd-until-date': fieldName = 'untilDate'; break;
        default: fieldName = ''; break; 
      }
      if (name === "online-entry-options") {
        const onlineEntryOptions = prev.onlineEntryOptions ? [...prev.onlineEntryOptions] : [];
        if (checked) {
          if (!onlineEntryOptions.includes(value)) {
            onlineEntryOptions.push(value);
          }
        } else {
          const index = onlineEntryOptions.indexOf(value);
          if (index > -1) {
            onlineEntryOptions.splice(index, 1);
          }
        }
        return {
          ...prev,
          onlineEntryOptions,
        };
      } else if (fieldName) {
        return {
          ...prev,
          [fieldName]: updatedValue !== undefined ? updatedValue : value,
        };
      }
      return prev;
    });
  };

  return (
    <div id="wd-assignments-editor" className="p-3">
      <Form.Group className="mb-3">
        <Form.Label htmlFor="wd-name" className="fw-bold">
          Assignment Name
        </Form.Label>
        <FormControl
          id="wd-name"
          value={assignment.title || ''}
          onChange={handleChange}
        />
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
          value={assignment.description || ""}
          onChange={handleChange}
        />
      </Form.Group>

      <Row className="mb-3 align-items-center">
        <Form.Group as={Col} xs={4}>
          <Form.Label htmlFor="wd-points" className="text-end d-block">
            Points
          </Form.Label>
        </Form.Group>
        <Form.Group as={Col} xs={8}>
          <FormControl
            id="wd-points"
            value={assignment.points || 0}
            type="number"
            onChange={handleChange}
          />
        </Form.Group>
      </Row>

      <Row className="mb-3 align-items-center">
        <Form.Group as={Col} xs={4}>
          <Form.Label htmlFor="wd-assignment-group" className="text-end d-block">
            Assignment Group
          </Form.Label>
        </Form.Group>
        <Form.Group as={Col} xs={8}>
          <Form.Select
            id="wd-assignment-group"
            value={assignment.group || "ASSIGNMENTS"}
            onChange={handleChange}
          >
            <option>ASSIGNMENTS</option>
            <option>QUIZZES</option>
            <option>EXAMS</option>
          </Form.Select>
        </Form.Group>
      </Row>

      <Row className="mb-3 align-items-center">
        <Form.Group as={Col} xs={4}>
          <Form.Label htmlFor="wd-display-grade-as" className="text-end d-block">
            Display Grade as
          </Form.Label>
        </Form.Group>
        <Form.Group as={Col} xs={8}>
          <Form.Select
            id="wd-display-grade-as"
            value={assignment.displayGradeAs || "Percentage"}
            onChange={handleChange}
          >
            <option>Percentage</option>
            <option>Points</option>
            <option>Complete/Incomplete</option>
          </Form.Select>
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} xs={4}>
          <Form.Label htmlFor="wd-submission-type" className="text-end d-block">
            Submission Type
          </Form.Label>
        </Form.Group>
        <Form.Group as={Col} xs={8}>
          <Form.Select
            id="wd-submission-type"
            value={assignment.submissionType || "Online"}
            onChange={handleChange}
          >
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
              value="Text Entry"
              checked={assignment.onlineEntryOptions?.includes("Text Entry")}
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              id="wd-website-url"
              label="Website URL"
              name="online-entry-options"
              value="Website URL"
              checked={assignment.onlineEntryOptions?.includes("Website URL")}
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              id="wd-media-recordings"
              label="Media Recordings"
              name="online-entry-options"
              value="Media Recordings"
              checked={assignment.onlineEntryOptions?.includes("Media Recordings")}
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              id="wd-student-annotation"
              label="Student Annotation"
              name="online-entry-options"
              value="Student Annotation"
              checked={assignment.onlineEntryOptions?.includes("Student Annotation")}
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              id="wd-file-uploads"
              label="File Uploads"
              name="online-entry-options"
              value="File Uploads"
              checked={assignment.onlineEntryOptions?.includes("File Uploads")}
              onChange={handleChange}
            />
          </div>
        </Form.Group>
      </Row>

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
              value={assignment.assignTo || "Everyone"}
              readOnly
              className="bg-white"
              onChange={handleChange}
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
                  value={assignment.dueDate?.slice(0, 10) || ""}
                  onChange={handleChange}
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
                      value={assignment.availableFrom?.slice(0, 10) || ""}
                      onChange={handleChange}
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
                      value={assignment.untilDate?.slice(0, 10) || ""}
                      onChange={handleChange}
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
        <Button onClick={handleCancel} className="btn btn-light me-2 border">
          Cancel
        </Button>
        <Button onClick={handleSave} className="btn btn-danger">
          Save
        </Button>
      </div>
    </div>
  );
}