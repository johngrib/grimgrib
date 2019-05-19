const COLOR = {
    BLACK: 'black'
};

const SHAPE = {
    CIRCLE: 'ellipse',
    TEXT: 'text',
    LINE: 'polygon',
};

const map = {};

function point(s) {
    const attr = {
        cx: get(s, 'x', 0),
        cy: get(s, 'y', 0),
        rx: get(s, 'r', 3),
        ry: get(s, 'r', 3),
        fill: get(s, 'color', COLOR.BLACK),
    };
    map[s.id] = attr;
    return newSVG(SHAPE.CIRCLE, attr);
}

function get(obj, key, defaultValue) {
    return obj[key] === undefined ? defaultValue : obj[key];
}

function newSVG(tag, values) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var key in values) {
        svg.setAttribute(key, values[key]);
    }
    return svg;
}

var data = [
    point({
        id: 'a',
        x: 30,
        y: 30
    }),
    point({
        id: 'b',
        x: 35,
        y: 35
    }),
];

const mother = document.getElementById('test');

data.forEach((item) => {
    mother.appendChild(item);
});
