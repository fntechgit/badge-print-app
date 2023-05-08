import React, { useState, useLayoutEffect } from "react";
import { Textfit } from "react-textfit";

import {
  useForceUpdate
} from "@/utils/utils";

import "./styles/zebra-card.less";

import general_background_img from "./images/general89x142.2.jpg";
import staff_background_img from "./images/staff89x142.2.jpg";
import media_background_img from "./images/media89x142.2.jpg";

const BadgeTypes = {
  generalAttendee: "General Attendee Badge",
  staff: "Staff/Employee Badge",
  media: "Media Badge"
};

export default ({badge}) => {
  const forceUpdate = useForceUpdate();
  const badgeType = badge.getBadgeTypeName();
  const [backgroundImg, setBackgroundImg] = useState(null);
  useLayoutEffect(() => {
    if (badgeType == null) return;
    switch (badgeType) {
    case BadgeTypes.generalAttendee:
      setBackgroundImg(general_background_img);
      break;
    case BadgeTypes.staff:
      setBackgroundImg(staff_background_img);
      break;
    case BadgeTypes.media:
      setBackgroundImg(media_background_img);
      break;
    }
  }, [badgeType]);
  return (
  <>
    <div id="badge-artboard" className="bdg-artboard zebra-card">
      { backgroundImg &&
      <img id="badge-artboard-img" className="bdg-image" src={backgroundImg}/>
      }
      <div className={`text-box ${badgeType === BadgeTypes.staff ? "staff" : ""}`}>
        <Textfit mode="single" max={39} className="first-name" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getFirstName()}</Textfit>
        <Textfit mode="single" max={39} className="last-name" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getLastName()}</Textfit>
        { badge.getExtraQuestionValue("Pronouns") &&
        <Textfit mode="single" max={badgeType === BadgeTypes.staff ? 20 : 16} className="pronouns" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getExtraQuestionValue("Pronouns")}</Textfit>
        }
        { badge.getExtraQuestionValue("Job Title") && badgeType !== BadgeTypes.staff &&
        <Textfit mode="single" max={20} className="title" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getExtraQuestionValue("Job Title")}</Textfit>
        }
        { badge.getCompany() !== "N/A" &&
        <Textfit mode="single" max={20} className="company" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getCompany()}</Textfit>
        }
      </div>
    </div>
  </>
  );
}
