import React, { useState } from 'react';
import { Textfit } from 'react-textfit';

import '../shared/styles/styles_1.less';

import background_img from '../shared/images/general92x140.png';
import info_img from '../shared/images/info.png';

const useForceUpdate = () => {
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
}

export default ({ badge }) => {
    const forceUpdate = useForceUpdate();
    return (
    <>
        <div id="badge-artboard" className="bdg-artboard">
            {badge.hasQRCode() &&
            <div className="qrcode-box">
                {badge.getQRCode({ fgColor: '#000', size: 60 })}
            </div>
            }
            <img id="badge-artboard-img" className="bdg-image" src={background_img}/>
            <div className="text-boxes">
                { badge.getFullName() &&
                    <>
                        <span className="title">NAME</span>
                        <Textfit
                            mode="single"
                            max={36}
                            className="text-box full-name"
                            onInput={forceUpdate}
                            contentEditable
                            suppressContentEditableWarning={true}
                        >
                            {badge.getFullName()}
                        </Textfit>
                    </>
                }
                { badge.getIRC() != 'N/A' &&
                    <>
                        <span className="title">IRC</span>
                        <Textfit
                            mode="single"
                            max={19}
                            className="text-box"
                            onInput={forceUpdate}
                            contentEditable
                            suppressContentEditableWarning={true}
                        >
                            {badge.getIRC()}
                        </Textfit>
                    </>
                }
                { badge.getCompany() &&
                    <>
                        <span className="title">COMPANY</span>
                        <Textfit
                            mode="single"
                            max={19}
                            className="text-box"
                            onInput={forceUpdate}
                            contentEditable
                            suppressContentEditableWarning={true}
                        >
                            {badge.getCompany()}
                        </Textfit>
                    </>
                }
                { badge.getTwitter() != 'N/A' &&
                    <>
                        <span className="title">TWITTER</span>
                        <Textfit
                            mode="single"
                            max={19}
                            className="text-box"
                            onInput={forceUpdate}
                            contentEditable
                            suppressContentEditableWarning={true}
                        >
                            {badge.getTwitter()}
                        </Textfit>
                    </>
                }
            </div>
            <div className="features">
                {badge.getFeature('Contributor') &&
                    <img src={badge.getFeature('Contributor').image}/>
                }
                {badge.getFeature('Speaker') &&
                    <img src={badge.getFeature('Speaker').image}/>
                }
                {badge.getFeature('Board') &&
                    <img src={badge.getFeature('Board').image}/>
                }
                {badge.getFeature('Media') &&
                    <img src={badge.getFeature('Media').image}/>
                }
            </div>
            <img className="bdg-image bdg-image-back" src={info_img}/>
        </div>
    </>
    );
}
