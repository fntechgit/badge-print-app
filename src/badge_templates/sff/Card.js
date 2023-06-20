import React, {
  useRef,
  useState,
  useEffect,
  useCallback
} from "react";
import { Textfit } from "react-textfit";

import background_img from "./images/background.png";
import "./styles/styles_1.less";

const useForceUpdate = () => {
  const [value, setValue] = useState(0);
  return () => setValue(value => value + 1);
}

export default ({ badge }) => {
  const forceUpdate = useForceUpdate();
  const fullNameRef = useRef(null);
  const companyRef = useRef(null);
  const [isFullNameMultiLine, setIsFullNameMultiLine] = useState(false);
  const [isCompanyMultiLine, setIsCompanyMultiLine] = useState(false);
  useEffect(() => {
    if (fullNameRef.current === null) return false;
    setIsFullNameMultiLine(fullNameRef.current.clientHeight > 46);
  }, [fullNameRef]);
  useEffect(() => {
    if (companyRef.current === null) return false;
    setIsCompanyMultiLine(companyRef.current.clientHeight > 42);
  }, [companyRef]);
  const companyMarginTop = useCallback(() => {
    if (!isFullNameMultiLine && !isCompanyMultiLine) return "16.3mm";
    if (!isFullNameMultiLine && isCompanyMultiLine) return "10.8mm";
    if (isFullNameMultiLine && !isCompanyMultiLine) return "8.3mm";
    if (isFullNameMultiLine && isCompanyMultiLine) return "3.3mm";
    return 0;
  }, [isFullNameMultiLine, isCompanyMultiLine]);
  return (
  <>
    <div id="badge-artboard" className="bdg-artboard">
      <img id="badge-artboard-img" className="bdg-image" src={background_img}/>
      <div className="text-boxes">
        {badge.getFullName() && !isFullNameMultiLine &&
        <span
          ref={fullNameRef}
          className="full-name"
          contentEditable
          suppressContentEditableWarning={true}
          onInput={() => setIsFullNameMultiLine(fullNameRef.current.clientHeight > 46)}
        >
          {badge.getFullName()}
        </span>
        }
        {isFullNameMultiLine && badge.getFirstName() &&
        <Textfit
          mode="single"
          max={32}
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
          max={32}
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
          ref={companyRef}
          className="company"
          contentEditable
          suppressContentEditableWarning={true}
          onInput={() => setIsCompanyMultiLine(companyRef.current.clientHeight > 42)}
          style={{
            marginTop: companyMarginTop(),
            fontSize: isCompanyMultiLine ? "18.83pt" : "24.5pt"
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
      {badge.getFeature("Partner Booth") &&
      <Textfit
        min={26}
        className="booth-staff-feature"
        onInput={forceUpdate}
        contentEditable
        suppressContentEditableWarning={true}
      >
        {badge.getFeature("Partner Booth")}
      </Textfit>
      }
    </div>
  </>
  );
}
