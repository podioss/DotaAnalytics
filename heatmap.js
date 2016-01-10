var margin = {top: 20, right: 20, bottom: 30, left: 40};
var viewWidth = window.innerWidth - margin.left - margin.right;
var viewHeight = window.innerHeight - margin.top - margin.bottom;

//d3.select(window).on("resize", resize);

$('input').change(drawHeatmap);

var svg = d3.select("svg")
    .attr("width", '100%')
    .attr("height", '360px');

function drawHeatmap() {
    // Update range indicator
    var percentage = $('input').val() * 5;
    $('#range-indicator').text(percentage + '% - ' + (percentage + 5) + '%');

    d3.selectAll('image').remove();
    d3.selectAll('rect').remove();
    d3.selectAll('g').remove();

    var types = ['nframes', 'hframes', 'vhframes', 'pframes'];
    var typenames = ['Normal', 'High', 'Very high', 'Pro'];
    var x = 0;

    for (var i in types) {
        var type = types[i];
        var typename = typenames[i];

        var selectedIndex = $('input').val();
        var subData = data[type][selectedIndex]['pf'];

        // We tried to introduce a ratio of influence to make single points stand out more
        /*var influence = 1;
        var newSubData = [];

        for (var x = 0; x < 123; x++) {
            for (var y = 0; y < 123; y++) {
                var centerValue = subData[y * 123 + x];

                newSubData[y * 123 + x] = centerValue;

                if (centerValue != 0) {
                    for (var xx = x - influence; xx <= x + influence; xx++) {
                        for (var yy = y - influence; yy <= y + influence; yy++) {
                            if (xx >= 0 && yy >= 0 && xx < 123 && yy < 123) {
                                var dx = xx - x;
                                var dy = yy - y;
                                var dist = Math.sqrt(dx * dx + dy * dy);

                                var curValue = subData[yy * 123 + xx];
                                newSubData[yy * 123 + xx] = curValue + centerValue / (dist + 1);
                            }
                        }
                    }
                }
            }
        }

        subData = newSubData;*/

        var max = 0;
        for (var pixel of subData) {
            max = Math.max(pixel, max);
        }

        var color = d3.scale.sqrt()
            .domain([0, max])
            .range(["yellow", "red"]);

        var g = svg.append('g')
            .style('transform', 'translate(' + x + 'px, 0px)');

        var newSubData = [];

        for (var i in subData) {
            var px = i % 123;
            var py = Math.floor(i / 123);

            if (subData[i] != 0) {
                newSubData.push({
                    x: px,
                    y: py + 3,
                    p: subData[i]
                });
            }
        }

        g.append('image')
            .attr('xlink:href', 'map.jpg')
            .attr('width', '370px')
            .attr('height', '360px')
            .attr('x', '0')
            .attr('y', '0');

        g.append('text')
            .attr('x', '5px')
            .attr('y', '20px')
            .style('fill', 'white')
            .style('font-size', '20')
            .text(typename);

        g.selectAll('rect')
            .data(newSubData)
            .enter()
            .append('rect')
            .attr('x', function(pixel, i) { return pixel.x * 3; })
            .attr('y', function(pixel, i) { return (123 - pixel.y) * 3; })
            .attr('width', '3px')
            .attr('height', '3px')
            .attr('fill', function(pixel) { return color(pixel.p); });

        x += 370 + 10;
    }
}

function resize() {
    viewWidth = window.innerWidth - margin.left - margin.right;
    viewHeight = window.innerHeight - margin.top - margin.bottom;

    svg.selectAll('*').remove();

    svg = d3.select("svg")
        .attr("width", viewWidth)
        .attr("height", viewHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    drawHeatmap();
}

drawHeatmap();