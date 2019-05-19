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

const init = {
    point: function(s) {
        return {
            tag: SHAPE.CIRCLE,
            id: s.id,
            cx: get(s, 'x', 0),
            cy: get(s, 'y', 0),
            rx: get(s, 'r', 3),
            ry: get(s, 'r', 3),
            fill: get(s, 'color', COLOR.BLACK),
        };
    },
    line: function(s) {
        return {
            tag: SHAPE.LINE,
            id: s.id,
            node: get(s, 'node', []),
            'stroke-width': get(s, 'width', 1),
            stroke: get(s, 'color', COLOR.BLACK),
        }
    }
};


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

    item.points = item.node.map((id) => position[id])
        .reduce((a, b) => {
            return a + ' ' + b.x + ',' + b.y;
        }, '');
    return item;
}

var text = `[
    { "type": "point", "id": "a", "x": 5, "y": 35 },
    { "type": "point", "id": "b", "x": 50, "y": 10 },
    { "type": "point", "id": "c", "x": 100, "y": 35 },
    { "type": "point", "id": "d", "x": 80, "y": 70 },
    { "type": "point", "id": "e", "x": 20, "y": 70 },
    { "type": "line", "id": "a-b-1", "node": ["a", "b"] },
    { "type": "line", "id": "a-c-1", "node": ["a", "c"] },
    { "type": "line", "id": "a-e-1", "node": ["a", "e"] },
    { "type": "line", "id": "c-e-1", "node": ["c", "e"] },
    { "type": "line", "id": "c-d-1", "node": ["c", "d"] },
    { "type": "line", "id": "d-e-1", "node": ["d", "e"] }
]`;

var data = JSON.parse(text);

data = data.map((item) => {
    return init[item.type](item);
});

data.forEach(savePosition);
data.map(collectPosition)
    .forEach((item) => {
        mother.appendChild(newSVG(item.tag, item));
    });
