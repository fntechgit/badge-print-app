import React, {
  useRef,
  useState,
  useEffect,
  useCallback
} from "react";
import { Textfit } from "react-textfit";

import header_img from "./images/header.png";
import "./styles/styles_1.less";

const useForceUpdate = () => {
  const [value, setValue] = useState(0);
  return () => setValue(value => value + 1);
}

export default ({ badge }) => {
  const forceUpdate = useForceUpdate();
  const fullNameRef = useRef(null);
  const [isFullNameMultiLine, setIsFullNameMultiLine] = useState(false);
  useEffect(() => {
    if (fullNameRef.current === null) return false;
    setIsFullNameMultiLine(fullNameRef.current.clientHeight > 50);
  }, [fullNameRef]);
  const companyMarginTop = useCallback(() => {
    return isFullNameMultiLine ? "3mm" : "9.5mm";
  }, [isFullNameMultiLine]);
  return (
  <>
    <div id="badge-artboard" className="bdg-artboard">
      <img id="badge-artboard-img" className="bdg-image" src={header_img}/>
      <div className="text-boxes">
        {badge.getFullName() && !isFullNameMultiLine &&
        <span
          ref={fullNameRef}
          className="full-name"
          contentEditable
          suppressContentEditableWarning={true}
          onInput={() => setIsFullNameMultiLine(fullNameRef.current.clientHeight > 50)}
        >
          {badge.getFullName()}
        </span>
        }
        {isFullNameMultiLine && badge.getFirstName() &&
        <Textfit
          mode="single"
          max={27}
          className="name"
          onInput={forceUpdate}
          contentEditable
          suppressContentEditableWarning={true}
        >
          {badge.getFirstName()}
        </Textfit>
        }
        {isFullNameMultiLine && badge.getLastName() &&
        <Textfit
          mode="single"
          max={27}
          className="name"
          onInput={forceUpdate}
          contentEditable
          suppressContentEditableWarning={true}
        >
          {badge.getLastName()}
        </Textfit>
        }
        {badge.getCompany() &&
        <span
          className="company"
          contentEditable
          suppressContentEditableWarning={true}
          onInput={forceUpdate}
          style={{
            marginTop: companyMarginTop(),
            fontSize: "17.3pt"
          }}
        >
          {badge.getCompany()}
        </span>
        }
        {badge.getExtraQuestionValue("jobTitle") &&
        <Textfit
          min={17}
          className="job-title"
          onInput={forceUpdate}
          contentEditable
          suppressContentEditableWarning={true}
        >
          {badge.getExtraQuestionValue("jobTitle")}
        </Textfit>
        }
      </div>
      {badge.getFeature("Speaker") &&
      <Textfit
        min={30}
        className="speaker-feature"
        onInput={forceUpdate}
        contentEditable
        suppressContentEditableWarning={true}
      >
        Speaker
      </Textfit>
      }
    </div>
  </>
  );
}
