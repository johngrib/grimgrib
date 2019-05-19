const COLOR = {
    BLACK: 'black'
};

const SHAPE = {
    CIRCLE: 'ellipse',
    TEXT: 'text',
    LINE: 'polygon',
};

const svgGenerator = {};
svgGenerator[SHAPE.CIRCLE] = function(s) {
    return newSVG(SHAPE.CIRCLE, s);
};
svgGenerator[SHAPE.LINE] = function(s) {
    return newSVG(SHAPE.LINE, s);
}

function point(s) {
    return {
        tag: SHAPE.CIRCLE,
        id: s.id,
        cx: get(s, 'x', 0),
        cy: get(s, 'y', 0),
        rx: get(s, 'r', 3),
        ry: get(s, 'r', 3),
        fill: get(s, 'color', COLOR.BLACK),
    };
}

function line(s) {
    return {
        tag: SHAPE.LINE,
        id: s.id,
        node: get(s, 'node', []),
        'stroke-width': get(s, 'width', 1),
        stroke: get(s, 'color', COLOR.BLACK),
    }
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


const mother = document.getElementById('test');

const position = {};

function savePosition(item) {
    if (typeof item.cx === 'number' && typeof item.cy === 'number') {
        position[item.id] = {
            x: item.cx,
            y: item.cy
        };
    }
}

function collectPosition(item) {

    if (!item['node']) {
        return item;
    }
    console.log(item);
    console.log(item.node)
    console.log(item.node.map(id => position[id]));

    const points = item.node.map((id) => position[id])
        .reduce((a, b) => {
            return a + ' ' + b.x + ',' + b.y;
        }, '');
    console.log(points);
    item.points = points;
    return item;
}

var data = [
    point({
        id: 'a',
        x: 5,
        y: 35
    }),
    point({
        id: 'b',
        x: 50,
        y: 10
    }),
    point({
        id: 'c',
        x: 100,
        y: 35
    }),
    point({
        id: 'd',
        x: 80,
        y: 70
    }),
    point({
        id: 'e',
        x: 20,
        y: 70
    }),
    line({
        id: 'a-b-1',
        node: ['a', 'b'],
    }),
    line({
        id: 'a-c-1',
        node: ['a', 'c'],
    }),
    line({
        id: 'a-e-1',
        node: ['a', 'e'],
    }),
    line({
        id: 'c-e-1',
        node: ['c', 'e'],
    }),
    line({
        id: 'c-d-1',
        node: ['c', 'd'],
    }),
    line({
        id: 'd-e-1',
        node: ['d', 'e'],
    }),
];

data.forEach(savePosition);
data.map(collectPosition)
    .forEach((item) => {
        mother.appendChild(newSVG(item.tag, item));
    });
