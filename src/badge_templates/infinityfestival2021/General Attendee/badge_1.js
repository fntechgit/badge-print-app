import React, { useState } from 'react';
import { Textfit } from 'react-textfit';

import './styles/styles_1.less';

import background_img from './images/general95x140.png';


function useForceUpdate(){
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
}

export default ({badge}) => {

    const forceUpdate = useForceUpdate();

    return (
    <>
        <div id="badge-artboard" className="bdg-artboard">
            <img id="badge-artboard-img" className="bdg-image" src={background_img}/>
            <div className="text-box">
                <Textfit mode="single" max={40} className="first-name" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getFirstName()}</Textfit>
                <Textfit mode="single" max={40} className="last-name" onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getLastName()}</Textfit>
                <Textfit mode="single" max={24} className="company"  onInput={forceUpdate} contentEditable suppressContentEditableWarning={true}>{badge.getCompany()}</Textfit>
            </div>
            {badge.hasQRCode() &&
            <div id="qrcode" className="bdg-content qrcode-box">
                {badge.getQRCode({ fgColor: '#000', size: 80 })}
            </div>
            }
            <div className="icon-features">
                {badge.getFeature('Media') &&
                <div id="icon-feature-media" className="icon-feature">
                    <img className="bdg-image" src={badge.getFeature('Media').image}/>
                </div>
                }
                {badge.getFeature('Partners') &&
                <div id="icon-feature-partners" className="icon-feature">
                    <img className="bdg-image" src={badge.getFeature('Partners').image}/>
                </div>
                }
                {badge.getFeature('Speaker') &&
                <div id="icon-feature-speaker" className="icon-feature">
                    <img className="bdg-image" src={badge.getFeature('Speaker').image}/>
                </div>
                }
                {badge.getFeature('Student') &&
                <div id="icon-feature-student" className="icon-feature">
                    <img className="bdg-image" src={badge.getFeature('Student').image}/>
                </div>
                }
            </div>
        </div>
    </>
    );
}

