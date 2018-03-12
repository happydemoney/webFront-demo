import _ from 'lodash';
import './style.css';
import Icon from './icon.png';
import Data from './data.xml';

function component() {
    var element = document.createElement('div');

    // lodash, now imported by this script
    element.innerHTML = _.join(['你好', 'webpack'], ' ');
    element.classList.add('hello');

    // Add the image to your existing div.
    var myIcon = new Image();
    myIcon.src = Icon;

    element.appendChild(myIcon);

    console.log(Data);

    return element;
}

document.body.appendChild(component());