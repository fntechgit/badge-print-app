import React from 'react';
import './styles/styles_1.less';
import background_img from './images/background_1.png';


export default ({badge}) => {
    return (
    <>
        <div id="badge-artboard" className="bdg-artboard">
            <img id="badge-artboard-img" className="bdg-image" src={background_img}/>
            <div id="name-on-badge" className="bdg-content">
                <p className="badge-content">{badge.getFullName()}</p>
            </div>
            <div id="irc-handle" className="bdg-content ">
                <p className="badge-content">{badge.getIRC()}</p>
            </div>
        </div>
    </>
    );
}

