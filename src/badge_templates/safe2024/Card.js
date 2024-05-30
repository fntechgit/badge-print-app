import React, {
  useRef,
  useState,
  useEffect,
  useCallback
} from "react";
import { Textfit } from "react-textfit";

import background_img from "./images/background.png";
import mdi_feature from "./images/mdi.png";
import "./styles/styles_1.less";

const useForceUpdate = () => {
  const [value, setValue] = useState(0);
  return () => setValue(value => value + 1);
}

export default ({ badge }) => {
  const forceUpdate = useForceUpdate();
  return (
  <>
    <div id="badge-artboard" className="bdg-artboard">
      <img id="badge-artboard-img" className="bdg-image" src={background_img}/>
      <div className="text-boxes">
        <div style={{ height: "70px"}}>
        {badge.getFullName() && 
          <Textfit
            max={32}
            className="full-name"
            onInput={forceUpdate}
            contentEditable
            suppressContentEditableWarning={true}
            style={{
              height: "70px"
            }}
          >
            {badge.getFullName()}
          </Textfit>
        }
        </div>
        {badge.getCompany() &&
        <Textfit
          max={24}
          mode="single"
          className="company"
          onInput={forceUpdate}
          contentEditable
          suppressContentEditableWarning={true}
        >
          {badge.getCompany()}
        </Textfit>
        }
        {badge.getExtraQuestionValue("jobTitle") &&
        <Textfit
          max={17}
          mode="single"
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
      {(badge.getFeature("Booth Staff") || badge.getFeature("Partner Booth"))  &&
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
      {badge.getFeature("MDI Alliance") &&
        <img 
          src={mdi_feature} 
          className="mdi-feature"
        />
      }
    </div>
  </>
  );
}
