const svg = document.querySelector('.svg-container');

let editPath = null; //selected curve
let dot1 = null; //markers for drag and drop
let dot2 = null;
let pair = null; //pair dots for line
let infoEditDot = null;

const getNode = (newItem, attrs) => {
    newItem = document.createElementNS("http://www.w3.org/2000/svg", newItem);
    for (let nameAttr in attrs)
        newItem.setAttributeNS(null, nameAttr, attrs[nameAttr]);
    return newItem
};



const getDot = (x, y) => {
    return getNode('circle', {
        cx: x,
        cy: y,
        r: "4",
        stroke: "#73FFEE",
        fill: "transparent",
        "stroke-width": "9"
    })
};

const editMode = ({x1, y1, x2, y2, xx1, yy1, xx2, yy2}) => {
    dot1 = getDot(xx1, yy1);
    dot2 = getDot(xx2, yy2);
    svg.appendChild(dot1);
    svg.appendChild(dot2);
};

const turnOffEditMode = () => {
    editPath = null;
    svg.removeChild(dot1);
    svg.removeChild(dot2);
    dot1 = null;
    dot2 = null;
    infoEditDot = null;
    pair = null;

};

const getCoordsFromPath = (path) => {
    const crds = path.split(' ');
    return {
        x1: crds[1],
        y1: crds[2],
        x2: crds[10],
        y2: crds[11],
        xx1: crds[4],
        yy1: crds[5],
        xx2: crds[7],
        yy2: crds[8]
    }
};

const clickHandler = (evt) => {
    if (evt.target.tagName !== 'path' && !editPath) {
        if (pair) {
            const path = getNode('path', {
                d: `M ${evt.clientX} ${evt.clientY} C ${evt.clientX} ${evt.clientY} , ${pair.x2} ${pair.y2} , ${pair.x2} ${pair.y2}`,
                stroke: "violet",
                fill: "transparent",
                "stroke-width": "8"
            });

            svg.appendChild(path);
            pair = null;
            return
        }

        pair = pair ? pair : {x2: evt.clientX, y2: evt.clientY};
    } else
        if (evt.target.tagName === 'path' && !editPath) {
        //enable edit mode
        editPath = evt.target;
        editMode(getCoordsFromPath(editPath.getAttribute('d')));
    } else
        if (evt.target.tagName === 'path' && evt.target !== editPath) turnOffEditMode();

}

const mouseDownHandler = (evt) => {
    if (editPath && evt.target.tagName === 'circle') {
        if (evt.target === dot1) {
            infoEditDot = {
                number: 1,
                targetDot: evt.target
            }
        } else {
            infoEditDot = {
                number: 2,
                targetDot: evt.target
            }
        }

    } else infoEditDot = null;
};

const mouseMoveHandler = (evt) => {
    if (infoEditDot) {
        infoEditDot.targetDot.setAttribute('cx', evt.clientX);
        infoEditDot.targetDot.setAttribute('cy', evt.clientY);
        pathSettings = getCoordsFromPath(editPath.getAttribute('d'));
        const {x1, y1, x2, y2, xx1, yy1, xx2, yy2} = pathSettings;
        if (infoEditDot.number === 1) {
            editPath.setAttribute('d', `M ${x1} ${y1} C ${evt.clientX} ${evt.clientY} , ${xx2} ${yy2} , ${x2} ${y2}`)
        } else {
            editPath.setAttribute('d', `M ${x1} ${y1} C ${xx1} ${yy1} , ${evt.clientX} ${evt.clientY} , ${x2} ${y2}`)

        }
    }
};

const mouseUpHandler = () => {
    infoEditDot = null;
};

svg.addEventListener('click', clickHandler);
svg.addEventListener('mousedown', mouseDownHandler);
svg.addEventListener('mousemove', mouseMoveHandler);
svg.addEventListener('mouseup', mouseUpHandler);
svg.addEventListener('dblclick', turnOffEditMode);

