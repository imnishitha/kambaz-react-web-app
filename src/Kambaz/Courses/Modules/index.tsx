import  { useState } from "react";
import { FormControl, ListGroup } from "react-bootstrap";
import ModulesControls from "./ModuleControls";
import { BsGripVertical } from "react-icons/bs";
import LessonControlButtons from "./LessonControlBUttons";
import { useParams } from "react-router";
import ModuleControlButtons from "./ModuleControlButtons";
import { addModule, editModule, updateModule, deleteModule }
  from "./reducer";
import { useSelector, useDispatch } from "react-redux";


export default function Modules() {
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const { modules } = useSelector((state: any) => state.modulesReducer);
  const dispatch = useDispatch();

  return (
    <div className="wd-modules">
       <div className="d-flex justify-content-end mb-3">
      <ModulesControls moduleName={moduleName} setModuleName={setModuleName}
        addModule={() => {
          dispatch(addModule({ name: moduleName, course: cid }));
          setModuleName("");
        }} /></div>
      <ListGroup className="rounded-0" id="wd-modules">
      {modules
          .filter((module: any) => module.course === cid)
          .map((module: any) => (
          <ListGroup.Item
            key={module._id}
            className="wd-module p-0 mb-5 fs-5 border-gray"
          >
            <div className="wd-title p-3 ps-2 bg-secondary">
              <BsGripVertical className="me-2 fs-3" />
              {!module.editing && module.name}
      { module.editing && (
        <FormControl className="w-50 d-inline-block"
               onChange={(e) => dispatch(updateModule({ ...module, name: e.target.value }))}
               onKeyDown={(e) => {
                 if (e.key === "Enter") {
                   dispatch(updateModule({ ...module, editing: false }));
                 }
               }}
               defaultValue={module.name}/>
      )}< ModuleControlButtons
        moduleId={module._id}
        deleteModule={(moduleId) => {
          dispatch(deleteModule(moduleId));
        }}
        editModule={(moduleId) => dispatch(editModule(moduleId))}/>
            </div>
            <ListGroup className="wd-lessons rounded-0">
              {module.lessons.map((lesson:any) => (
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