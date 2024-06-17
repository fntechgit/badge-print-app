import React, {
    useState,
} from 'react';
import { Textfit } from 'react-textfit';

import './styles/zebra-card.less';

import background_partner from '../images/partner.png';

const useForceUpdate = () => {
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
}

export default ({ badge }) => {
    const forceUpdate = useForceUpdate();
    return (
        <div id="badge-artboard" className="bdg-artboard card zebra-card partner">
            <img id="badge-artboard-img" className="bdg-image bdg-image-front" src={background_partner}/>
            <div className="text-box">
                <div className="first-name-wrapper name-wrapper">
                    <Textfit mode="single" max={42} onInput={forceUpdate} className="first-name name" contentEditable suppressContentEditableWarning={true}>{badge.getFirstName()}</Textfit>
                </div>
                <div className="last-name-wrapper name-wrapper">
                    <Textfit mode="single" max={35} onInput={forceUpdate} className="last-name name" contentEditable suppressContentEditableWarning={true}>{badge.getLastName()}</Textfit>               
                </div>       
            </div>
            <div className="company-section">
                <Textfit 
                    mode="single" 
                    max={20} 
                    className="company"
                    onInput={forceUpdate} 
                    contentEditable 
                    suppressContentEditableWarning={true} 
                >
                {badge.getCompany()}
                </Textfit>
            </div>
        </div>
    );
}
