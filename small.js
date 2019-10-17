//create somewhere to put the force directed graph
var svg_small = d3.select("svg#small"),
    width_small = +svg_small.attr("width"),
    height_small = +svg_small.attr("height");

    // Define the div for the tooltip
        var div_small = d3.select("body").append("div")
          .attr("class", "tooltip");
        var toggle = 0;

d3.json("small.json", function(error, graph) {
      if (error) throw error;

      var radius_small = function(d) {return d.degree};

      //set up the simulation and add forces
      var simulation_small = d3.forceSimulation()
                         .nodes(graph.nodes);

      var link_force_small =  d3.forceLink(graph.links)
                          .id(function(d) { return d.name; });

      var charge_force_small = d3.forceManyBody()
                            .strength(-50);

      var center_force_small = d3.forceCenter(width_small / 2, height_small / 2);

      var collision_small = d3.forceCollide().radius(function(d) { return d.degree + 10 });

      simulation_small
          .force("charge_force", charge_force_small)
          .force("center_force", center_force_small)
          .force("links",link_force_small)
          .force("collision", collision_small)
       ;


      //add tick instructions:
      simulation_small.on("tick", tickActions_small );

      //add encompassing group for the zoom
      var g_small = svg_small.append("g")
          .attr("class", "everything");

      //draw lines for the links
      var link_small = g_small.append("g")
          .attr("class", "links")
          .selectAll("line")
          .data(graph.links)
          .enter().append("line")
          .attr("stroke-width", 2)
          .style("stroke", "lightgray");

      //draw circles for the nodes
      var node_small = g_small.append("g")
              .attr("class", "nodes")
              .selectAll("circle")
              .data(graph.nodes)
              .enter()
              .append("circle")
              .attr("r", radius_small)
              .attr("fill", "black");

      // var label = g.append("g")
      //             .attr("class", "labels")
      //             .selectAll("text")
      //             .data(nodes_data)
      //             .enter().append("text")
      //             .attr("class", "label")
      //             .text(function(d) { return d.name; });


      //add drag capabilities
      var drag_handler_small = d3.drag()
        .on("start", drag_start_small)
        .on("drag", drag_drag_small)
        .on("end", drag_end_small);

      drag_handler_small(node_small);


      //add zoom capabilities
      var zoom_handler_small = d3.zoom()
          .on("zoom", zoom_actions_small);

      zoom_handler_small(svg_small);

      /** Functions **/

      //Drag functions
      //d is the node
      function drag_start_small(d) {
       if (!d3.event.active) simulation_small.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
      }

      //make sure you can't drag the circle outside the box
      function drag_drag_small(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function drag_end_small(d) {
        if (!d3.event.active) simulation_small.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      //Zoom functions
      function zoom_actions_small(){
          g_small.attr("transform", d3.event.transform)
      }

      var fontsize_small = function(d) { return d.degree + "px"; };
      var color_palette_small = d3.scaleOrdinal(d3.schemeCategory10);
      var color_small = function(d,i){ return color_palette_small(d.gender) };
      // var opacity = function(d){ if (d.type == 'Subject') { return 1 } else {return 0} };

      function tickActions_small() {
          //update circle positions each tick of the simulation
             node_small
              .attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; })
              .style("fill", color_small);

          //update link positions
          link_small
              .attr("x1", function(d) { return d.source.x; })
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x; })
              .attr("y2", function(d) { return d.target.y; });

          // label
          //     		.attr("x", function(d) { return d.x; })
          //         .attr("y", function(d) { return d.y; })
          //         .attr("text-anchor", "middle")
          //         .style("fill", color);
      }

    });
