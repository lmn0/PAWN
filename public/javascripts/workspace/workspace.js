jsPlumb.ready(function () {

    var j = window.j = jsPlumb.getInstance({
            DragOptions: { cursor: 'pointer', zIndex: 2000 },
            PaintStyle: { stroke: '#666' },
            EndpointHoverStyle: { fill: "orange" },
            HoverPaintStyle: { stroke: "orange" },
            EndpointStyle: { width: 20, height: 16, stroke: '#666' },
            Endpoint: "Rectangle",
            Anchors: ["TopCenter", "TopCenter"],
            Container: "canvas"
        });

    j.bind("connection", function(p) {
        p.connection.bind("click", function() {
            j.detach(this);
        });
    });
    ////////////////////
    var exampleDropOptions = {
                tolerance: "touch",
                hoverClass: "dropHover",
                activeClass: "dragActive"
            };
    var color2 = "#316b31";
    var exampleEndpoint2 = {
        endpoint: ["Dot", { radius: 5 }],
        paintStyle: { fill: color2 },
        isSource: true,
        scope: "green",
        connectorStyle: { stroke: color2, strokeWidth: 6 },
        connector: ["Bezier", { curviness: 63 } ],
        maxConnections: 3,
        isTarget: true,
        dropOptions: exampleDropOptions
    };
      var anchors = [
                    [0.5, 0.5, 0.5, 0.5]
                    //[0.8, 1, 0, 1],
                    //[0, 0.8, -1, 0],
                    //[0.2, 0, 0, -1]
                ];

     var e1 = j.addEndpoint('c3_1', { anchor: anchors}, exampleEndpoint2);
     var e1 = j.addEndpoint('c3_2', { anchor: anchors}, exampleEndpoint2);


    ////////////////////

    var evts = document.querySelector("#events");
    var _appendEvent = function(name, detail) {
        evts.innerHTML = "<br/><strong>" + name + "</strong><br/> " + detail + "<br/>" + evts.innerHTML;
    };
    j.bind("group:addMember", function(p) {
        _appendEvent("group:addMember", p.group.id + " - " + p.el.id);
    });
    j.bind("group:removeMember", function(p) {
        _appendEvent("group:removeMember", p.group.id + " - " + p.el.id);
    });
    j.bind("group:expand", function(p) {
        _appendEvent("group:expand", p.group.id);
    });
    j.bind("group:collapse", function(p) {
        _appendEvent("group:collapse", p.group.id);
    });
    j.bind("group:add", function(p) {
        _appendEvent("group:add", p.group.id);
    });
    j.bind("group:remove", function(p) {
        _appendEvent("group:remove", p.group.id);
    });



    j.draggable(c3_1);
    j.addGroup({
        el:container3,
        id:"three",
        revert:false,
        orphan:true,
        endpoint:["Dot", { radius:3 }]
    });
    j.addToGroup("three", c3_1);
    j.addToGroup("three", c3_2);
    j.draggable(c3_2);


////////////// Connector!
            var dragLinks = jsPlumb.getSelector(".drag-drop-demo .drag");
            j.on(dragLinks, "click", function (e) {
                var s = instance.toggleDraggable(this.getAttribute("rel"));
                this.innerHTML = (s ? 'disable dragging' : 'enable dragging');
                jsPlumbUtil.consume(e);
            });

            var detachLinks = jsPlumb.getSelector(".drag-drop-demo .detach");
            j.on(detachLinks, "click", function (e) {
                instance.detachAllConnections(this.getAttribute("rel"));
                jsPlumbUtil.consume(e);
            });
//////////////

    // the independent element that demonstrates the fact that it can be dropped onto a group
    j.draggable("standalone");



    j.on(canvas, "click", ".del", function() {
        var g = this.parentNode.getAttribute("group");
        j.removeGroup(g, this.getAttribute("delete-all") != null);
    });

    // collapse/expand group button
    j.on(canvas, "click", ".node-collapse", function() {
        var g = this.parentNode.getAttribute("group"), collapsed = j.hasClass(this.parentNode, "collapsed");

        j[collapsed ? "removeClass" : "addClass"](this.parentNode, "collapsed");
        j[collapsed ? "expandGroup" : "collapseGroup"](g);
    });

    jsPlumb.fire("jsPlumbDemoLoaded", j);

});

