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
  const companyRef = useRef(null);
  const [isCompanyMultiLine, setIsCompanyMultiLine] = useState(false);
  useEffect(() => {
    if (companyRef.current === null) return false;
    setIsCompanyMultiLine(companyRef.current.clientHeight > 26);
  }, [companyRef]);
  const companyMarginTop = useCallback(() => {
    if (!isCompanyMultiLine) return "2.3mm";
    if (isCompanyMultiLine) return "10.8mm";
    return 0;
  }, [isCompanyMultiLine]);
  const companyHeight = useCallback(() => isCompanyMultiLine ? "75px" : "38px", [isCompanyMultiLine])
  return (
  <>
    <div id="badge-artboard" className="bdg-artboard">
      <img id="badge-artboard-img" className="bdg-image" src={background_img}/>
      <div className="text-boxes">
        {badge.getFullName() && 
          <Textfit
            max={32}
            className="full-name"
            onInput={forceUpdate}
            contentEditable
            suppressContentEditableWarning={true}
            style={{
              height: "75px"
            }}
          >
            {badge.getFullName()} 
          </Textfit>
        }
        <div style={{ position: "relative", display: "flex"}}>
          {badge.getCompany() &&
            <Textfit
              max={24}
              min={22}
              mode="multi"
              className="company"
              onInput={forceUpdate}
              contentEditable
              suppressContentEditableWarning={true}
              style={{
                // width: "282px",
                // maxHeight: "75px",
                // height: "75px",
                display: "flex"
              }}
            >
              <span ref={companyRef}>{badge.getCompany()}</span>
            </Textfit>
          }
        </div>
        {badge.getExtraQuestionValue("jobTitle") &&
          <Textfit
            max={17}
            className="job-title"
            onInput={forceUpdate}
            contentEditable
            suppressContentEditableWarning={true}
            style={{
              height: "35px"
            }}
          >
            {badge.getExtraQuestionValue("jobTitle")}
          </Textfit>
        }
      </div>
      {(badge.getFeature("Booth Staff") || badge.getFeature("Partner Booth")) &&
      <Textfit
        min={26}
        className="booth-staff-feature"
        onInput={forceUpdate}
        contentEditable
        suppressContentEditableWarning={true}
      >
        Partner Booth
      </Textfit>
      }
    </div>
  </>
  );
}
