import React, { useRef, useState, useEffect, useCallback } from "react";
import { Textfit } from "react-textfit";
import background_img from "./images/background.png";
import mdi_feature from "./images/mdi.png";
import "./styles/styles_1.less";

const calculateNumberOfLines = (ref) => {
  if (!ref.current) return 0;
  const rect = ref.current.getBoundingClientRect();
  const lineHeight = parseInt(getComputedStyle(ref.current).lineHeight);
  return Math.floor(ref.current.clientHeight / lineHeight);
};

const useForceUpdate = () => {
  const [value, setValue] = useState(0);
  return () => setValue(value => value + 1);
}

const FullName = ({ badge, fullNameLines, setFullNameLines, forceUpdate }) => {
  const fullNameRef = useRef(null);

  useEffect(() => {
    if (fullNameRef.current) {
      setFullNameLines(calculateNumberOfLines(fullNameRef));
    }
  }, [fullNameRef, setFullNameLines]);

  return (
    <>
      {badge.getFullName() && fullNameLines === 1 && (
        <span
          ref={fullNameRef}
          className="full-name"
          contentEditable
          suppressContentEditableWarning={true}
          onInput={() => setFullNameLines(calculateNumberOfLines(fullNameRef))}
        >
          {badge.getFullName()}
        </span>
      )}
      {fullNameLines > 1 && badge.getFirstName() && (
        <Textfit
          mode="single"
          max={32}
          className="name"
          contentEditable
          suppressContentEditableWarning={true}
          onInput={forceUpdate}
          onReady={() => window.dispatchEvent(new CustomEvent("resize"))}
        >
          {badge.getFirstName()}
        </Textfit>
      )}
      {fullNameLines > 1 && badge.getLastName() && (
        <Textfit
          mode="single"
          max={32}
          className="name"
          contentEditable
          suppressContentEditableWarning={true}
          onInput={forceUpdate}
          onReady={() => window.dispatchEvent(new CustomEvent("resize"))}
        >
          {badge.getLastName()}
        </Textfit>
      )}
    </>
  );
};

const Company = ({
  badge,
  company,
  companyLines,
  setCompanyLines,
  companyMarginTop,
  setCompany,
  forceUpdate
}) => {
  const companyRef = useRef(null);
  const [companyLineHeight, setCompanyLineHeight] = useState();

  useEffect(() => {
    if (companyRef.current) {
      setCompanyLines(calculateNumberOfLines(companyRef));
      setCompanyLineHeight(parseInt(getComputedStyle(companyRef.current).lineHeight));
    }
  }, [companyRef, setCompanyLines, setCompanyLineHeight]);

  const handleCompanyInput = (event) => {
    setCompany(event.target.innerText);
    setCompanyLines(calculateNumberOfLines(companyRef));
  };

  const partnerBooth = badge.getFeature("Booth Staff") || badge.getFeature("Partner Booth");
  const mdi = badge.getFeature("MDI Alliance");

  const overCrowded = partnerBooth && mdi;
  const lineLimit = overCrowded ? 1 : 2;

  return (
    <>
      {companyLines <= lineLimit && (
        <span
          ref={companyRef}
          className="company"
          contentEditable
          suppressContentEditableWarning={true}
          onInput={handleCompanyInput}
          style={{
            marginTop: companyMarginTop(),
            fontSize: "20pt",
          }}
        >
          {badge.getCompany()}
        </span>
      )}
      {companyLines > lineLimit && (
        <Textfit
          mode="multi"
          max={overCrowded ? 20 : 24}
          className="company"
          contentEditable
          suppressContentEditableWarning={true}
          onInput={forceUpdate}
          style={{
            marginTop: overCrowded ? "5px" : companyMarginTop(),
            height: overCrowded ? (companyLineHeight * 1.8) - 5 : companyLineHeight * 1.8,
            marginBottom: overCrowded ? 0 : "inherit"
          }}
        >
          {company}
        </Textfit>
      )}
    </>
  );
};

const Badge = ({ badge }) => {
  const forceUpdate = useForceUpdate();
  const [fullNameLines, setFullNameLines] = useState(1);
  const [companyLines, setCompanyLines] = useState(1);
  const [company, setCompany] = useState(badge.getCompany());

  const partnerBooth = badge.getFeature("Booth Staff") || badge.getFeature("Partner Booth");
  const mdi = badge.getFeature("MDI Alliance");

  const companyMarginTop = useCallback(() => {
    if (fullNameLines === 1 && companyLines <= 1) return "11.3mm";
    if (fullNameLines === 1 && companyLines > 1) return "10.8mm";
    if (fullNameLines > 1 && companyLines <= 1 && partnerBooth && mdi) return "0.7mm";
    if (fullNameLines > 1 && companyLines <= 1) return "2.3mm";
    if (fullNameLines > 1 && companyLines > 1) return "2.5mm";
    return 0;
  }, [fullNameLines, companyLines, partnerBooth, mdi]);

  return (
    <>
      <div id="badge-artboard" className="bdg-artboard">
        <img id="badge-artboard-img" className="bdg-image no-print" src={background_img} alt="Background" />
        <div className="text-boxes">
          <FullName
            badge={badge}
            fullNameLines={fullNameLines}
            setFullNameLines={setFullNameLines}
            forceUpdate={forceUpdate}
          />
          <Company
            badge={badge}
            company={company}
            setCompany={setCompany}
            companyLines={companyLines}
            setCompanyLines={setCompanyLines}
            companyMarginTop={companyMarginTop}
            forceUpdate={forceUpdate}
          />
          {badge.getExtraQuestionValue("jobTitle") && (
          <Textfit
            min={13}
            max={18}
            className="job-title"
            contentEditable
            suppressContentEditableWarning={true}
            onInput={forceUpdate}
            style={{ height: 20 }}
          >
            {badge.getExtraQuestionValue("jobTitle")}
          </Textfit>
          )}
        </div>
        {partnerBooth &&
        <Textfit
          min={26}
          className="booth-staff-feature"
          contentEditable
          suppressContentEditableWarning={true}
          style={{
            bottom: mdi ? "12mm" : "4mm"
          }}
        >
          Partner Booth
        </Textfit>
        }
        {mdi &&
        <img 
          src={mdi_feature} 
          className="mdi-feature"
        />
        }
      </div>
    </>
  );
};

export default Badge;
