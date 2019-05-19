var GrimGrib = (function() {
    const COLOR = {
        BLACK: 'black'
    };

    const SHAPE = {
        CIRCLE: 'ellipse',
        TEXT: 'text',
        LINE: 'polygon',
    };


    const svgGenerator = {};
    Object.values(SHAPE).forEach((item) => {
        svgGenerator[item] = (s) => newSVG(item, s);
    });

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
        },
        text: function(s) {
            return {
                tag: SHAPE.TEXT,
                id: s.id,
                ref: get(s, 'ref', undefined),
                'font-size': get(s, 'size', 10),
                x: get(s, 'x', 0),
                y: get(s, 'y', 0),
                text: get(s, 'text', ''),
                padding: get(s, 'padding', {
                    x: 0,
                    y: 10
                })
            }
        }
    };


    function get(obj, key, defaultValue) {
        return obj[key] === undefined ? defaultValue : obj[key];
    }

    function newSVG(tag, values) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', tag);
        delete values.tag;
        delete values.id;
        delete values.padding;
        for (var key in values) {
            svg.setAttribute(key, values[key]);
        }
        return svg;
    }


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
        return calcPosition[item.tag](item);
    }

    const calcPosition = {};
    calcPosition[SHAPE.CIRCLE] = item => item;
    calcPosition[SHAPE.LINE] = function(item) {
        if (!item['node']) {
            return item;
        }

        item.points = item.node.map((id) => position[id])
            .reduce((a, b) => {
                return a + ' ' + b.x + ',' + b.y;
            }, '');
        return item;
    };
    calcPosition[SHAPE.TEXT] = function(item) {
        if (item['ref']) {
            item.x = position[item['ref']].x - item.padding.x;
            item.y = position[item['ref']].y - item.padding.y;
        }
        return item;
    }


    function draw(svg, data) {
        data = data.map((item) => {
            return init[item.type](item);
        });

        data.forEach(savePosition);
        data.map(collectPosition)
            .forEach((item) => {
                const child = newSVG(item.tag, item);
                if (item.text) {
                    child.innerHTML = item.text;
                }
                svg.appendChild(child);
            });
    }

    return {
        fromJSONText: function(id, text) {
            const svg = document.getElementById(id);
            draw(svg, JSON.parse(text));
        }
    };
})();
