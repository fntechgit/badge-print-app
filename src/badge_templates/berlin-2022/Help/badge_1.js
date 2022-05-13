import React, { useState } from 'react';
import { Textfit } from 'react-textfit';

import '../shared/styles/styles_1.less';

import background_img from '../shared/images/help92x140.png';
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
            <img id="badge-artboard-img" className="bdg-image" src={background_img}/>
            <img className="bdg-image bdg-image-back" src={info_img}/>
        </div>
    </>
    );
}
