import {
  Button,
  FormControl,
  InputGroup,
  ListGroup,
  Badge
} from "react-bootstrap";
import {
  AiOutlineSearch,
  AiOutlinePlus,
  AiOutlineEllipsis,
  AiFillCheckCircle,
  AiOutlineFileText,
  AiOutlineEdit
} from "react-icons/ai";
import { LuGripVertical } from "react-icons/lu";
import { FaCaretDown } from "react-icons/fa";
import { useParams, Link } from "react-router-dom";
import { assignments } from "../../Database"; // update if needed

export default function Assignments() {
  const { cid } = useParams();

  // Filter assignments based on course ID
  const courseAssignments = assignments.filter((a) => a.course === cid);

  return (
    <div id="wd-assignments" className="p-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <InputGroup style={{ maxWidth: "300px" }}>
          <InputGroup.Text className="bg-white border-end-0">
            <AiOutlineSearch className="text-muted" />
          </InputGroup.Text>
          <FormControl
            placeholder="Search for Assignments"
            className="border-start-0"
          />
        </InputGroup>

        <div className="d-flex">
          <Button variant="light" className="me-2 border text-dark">
            <AiOutlinePlus className="me-1" />
            Group
          </Button>
          <Button variant="danger">
            <AiOutlinePlus className="me-1" />
            Assignment
          </Button>
        </div>
      </div>

      {/* Group Header */}
      <div className="border border-secondary-subtle rounded-0 mb-3 bg-light p-2 ps-3 d-flex justify-content-between align-items-center fw-bold">
        <div className="d-flex align-items-center">
          <LuGripVertical className="text-muted me-2 fs-5" />
          <FaCaretDown className="text-muted me-2 fs-6" />
          ASSIGNMENTS
        </div>
        <div className="d-flex align-items-center">
          <Badge
            bg="light"
            className="text-dark border rounded-pill me-2 fw-normal"
            style={{ fontSize: "0.8rem", padding: "0.35em 0.6em" }}
          >
            40% of Total
          </Badge>
          <Button
            variant="light"
            size="sm"
            className="me-2 border text-dark rounded-pill"
            style={{ fontSize: "0.8rem", padding: "0.2rem 0.6rem" }}
          >
            <AiOutlinePlus />
          </Button>
          <AiOutlineEllipsis className="text-muted fs-5" />
        </div>
      </div>

      {/* Assignment List */}
      <ListGroup className="rounded-0">
        {courseAssignments.map((assignment) => (
          <ListGroup.Item
            key={assignment._id}
            className="ps-0 pe-2 border-start border-0 border-success mb-2 d-flex align-items-center"
            style={{ borderLeft: "6px solid green" }}
          >
            <LuGripVertical className="text-muted me-2 fs-5" />
            <AiOutlineFileText className="text-muted me-2 fs-5" />
            <AiOutlineEdit className="text-muted me-3 fs-5" />

            <div className="flex-grow-1">
              <Link
                to={`/Kambaz/Courses/${cid}/Assignments/${assignment._id}`}
                className="fw-bold text-decoration-none"
                style={{ color: "#0055d4" }}
              >
                {assignment.title}
              </Link>
              <div className="text-muted small">
                {/* Placeholder values for subtext and due date */}
                Multiple Modules | Available now
              </div>
              <div className="text-muted small">
                <strong>Due</strong> Next Week | 100 pts
              </div>
            </div>
            <div className="d-flex align-items-center">
              <AiFillCheckCircle className="text-success me-2 fs-4" />
              <AiOutlineEllipsis className="text-muted fs-5" />
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
