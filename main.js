var tracker = (function() {
    var xScale, yScale, colorScale;
    var dataPoints;

    var matching = function(current) {
        var result;

        $.each(dataPoints, function(i, point) {
            var pointTime = point.timestamp;
            if (pointTime > current) {
                result = point;
                return false;
            }
        });

        return result;
    };

    return {
        setDuration: function(duration) {
            xScale = d3.scale.linear()
                .domain([0, 1920])
                .range([0,1066]);

            yScale = d3.scale.linear()
                .domain([0, 1080])
                .range([0,600]);

            colorScale = d3.scale.linear()
                .domain([0, 50])
                .range(['white', 'blue'])
        },

        setDataPoints: function(_dataPoints) {
            var start = parseInt(_dataPoints[0].timestamp);

            dataPoints = $.map(_dataPoints, function(point) {
                point.timestamp = (parseInt(point.timestamp) - start) / 1000;
                point.x = parseInt(point.x);
                point.y = parseInt(point.y);
                point.psize = parseInt(point.psize);
                return point;
            });
        },

        update: function() {
            if (!dataPoints) {
                return;
            }

            var currentTime = $("video")[0].currentTime;
            var point = matching(currentTime);

            if (point) {
                d3.select("svg circle")
                    .transition()
                    .attr("cx", xScale(point.x))
                    .attr("cy", yScale(point.y))
                    .style("fill", colorScale(point.psize));
            }
        }
    };
})();

$(function() {
    updateVideo = function(event) {
        var file = this.files[0];
        var type = file.type;

        var videoNode = document.querySelector('video');
        var canPlay = videoNode.canPlayType(type);
        canPlay = (canPlay === '' ? 'no' : canPlay);
        var isError = canPlay === 'no';

        if (!isError) {
            var fileURL = URL.createObjectURL(file);
            videoNode.src = fileURL;
        }

        tracker.setDuration($('video').duration);
    };

    updateDataPoints = function(event) {
        var file = this.files[0];
        blah = file;
        var reader = new FileReader();
        reader.onload = function(e) {
            dataPoints = $.csv.toObjects(e.target.result);
            tracker.setDataPoints(dataPoints);
        };
        reader.readAsText(file);
    };

    $('#video-file').change(updateVideo);
    $('#text-file').change(updateDataPoints);

    $("video").on("timeupdate", function(e) {
        tracker.update();
    });
});
