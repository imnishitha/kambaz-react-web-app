import { useState } from "react";
import { FormControl } from "react-bootstrap";


const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000"// Fallback for local development

export default function QueryParameters() {
  const [a, setA] = useState(34); 
  const [b, setB] = useState(23); 

  return (
    <div id="wd-query-parameters">
      <h3>Query Parameters</h3>
      <FormControl
        id="wd-query-parameter-a"
        className="mb-2"
        defaultValue={a}
        type="number"
        onChange={(e) => setA(parseInt(e.target.value))}
      />
      <FormControl
        id="wd-query-parameter-b"
        className="mb-2"
        defaultValue={b}
        type="number"
        onChange={(e) => setB(parseInt(e.target.value))}
      />
      <a
        id="wd-query-parameter-add"
        href={`${REMOTE_SERVER}/lab5/calculator?operation=add&a=${a}&b=${b}`}
        className="btn btn-primary me-2"
      >
        Add {a} + {b}
      </a>
      <a
        id="wd-query-parameter-subtract"
        href={`${REMOTE_SERVER}/lab5/calculator?operation=subtract&a=${a}&b=${b}`}
        className="btn btn-primary me-2"
      >
        Subtract {a} - {b}
      </a>
      <a
        id="wd-query-parameter-multiply"
        href={`${REMOTE_SERVER}/lab5/calculator?operation=multiply&a=${a}&b=${b}`}
        className="btn btn-primary me-2"
      >
        Multiply {a} * {b}
      </a>
      <a
        id="wd-query-parameter-divide"
        href={`${REMOTE_SERVER}/lab5/calculator?operation=divide&a=${a}&b=${b}`}
        className="btn btn-primary"
      >
        Divide {a} / {b}
      </a>

      
      <h4 className="mt-4">Module Routes</h4>
      <a
        id="wd-get-module"
        href={`${REMOTE_SERVER}/lab5/module`}
        className="btn btn-info me-2"
        target="_blank" 
        rel="noopener noreferrer" 
      >
        Get Module
      </a>
      <a
        id="wd-get-module-name"
        href={`${REMOTE_SERVER}/lab5/module/name`}
        className="btn btn-info"
        target="_blank" 
        rel="noopener noreferrer" 
      >
        Get Module Name
      </a>
      <hr />
    </div>
  );
}