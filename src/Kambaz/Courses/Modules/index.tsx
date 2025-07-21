import { ListGroup } from "react-bootstrap";
import ModulesControls from "./ModuleControls";
import { BsGripVertical } from "react-icons/bs";
import LessonControlButtons from "./LessonControlBUttons";
import { useParams } from "react-router";
import * as db from "../../Database";

export default function Modules() {
  const { cid } = useParams();
  const courseModules = db.modules.filter((module) => module.course === cid);

  return (
    <div>
      <ModulesControls />
      <br /><br /><br /><br />
      <ListGroup className="rounded-0" id="wd-modules">
        {courseModules.map((module) => (
          <ListGroup.Item
            key={module._id}
            className="wd-module p-0 mb-5 fs-5 border-gray"
          >
            <div className="wd-title p-3 ps-2 bg-secondary">
              <BsGripVertical className="me-2 fs-3" />
              {module.name}
            </div>
            <ListGroup className="wd-lessons rounded-0">
              {module.lessons.map((lesson) => (
                <ListGroup.Item
                  key={lesson._id}
                  className="wd-lesson p-3 ps-1"
                >
                  <BsGripVertical className="me-2 fs-3" />
                  {lesson.name} <LessonControlButtons />
                </ListGroup.Item>
              ))}
            </ListGroup>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}