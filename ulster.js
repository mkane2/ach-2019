//create somewhere to put the force directed graph
var svg_2 = d3.select("svg#ulster"),
    width_2 = +svg_2.attr("width"),
    height_2 = +svg_2.attr("height");

    // Define the div for the tooltip
        var div_2 = d3.select("body").append("div")
          .attr("class", "tooltip");
        var toggle = 0;

d3.json("ulster.json", function(error, graph) {
      if (error) throw error;

      var radius_2 = function(d) {return d.degree};

      //set up the simulation and add forces
      var simulation_2 = d3.forceSimulation()
                         .nodes(graph.nodes);

      var link_force_2 =  d3.forceLink(graph.links)
                          .id(function(d) { return d.name; });

      var charge_force_2 = d3.forceManyBody()
                            .strength(-30);

      var center_force_2 = d3.forceCenter(width_2 / 2, height_2 / 2);

      var collision_2 = d3.forceCollide().radius(function(d) { return d.degree + 10 });

      simulation_2
          .force("charge_force", charge_force_2)
          .force("center_force", center_force_2)
          .force("collision", collision_2)
          .force("links",link_force_2)
       ;


      //add tick instructions:
      simulation_2.on("tick", tickActions_2 );

      //add encompassing group for the zoom
      var g_2 = svg_2.append("g")
          .attr("class", "everything");

      //draw lines for the links
      var link_2 = g_2.append("g")
          .attr("class", "links")
          .selectAll("line")
          .data(graph.links)
          .enter().append("line")
          .attr("stroke-width", 2)
          .style("stroke", "darkgray");

      //draw circles for the nodes
      var node_2 = g_2.append("g")
              .attr("class", "nodes")
              .selectAll("circle")
              .data(graph.nodes)
              .enter()
              .append("circle")
              .attr("r", radius_2)
              .attr("fill", "black")
              .on("mouseover", function(d) {
                div_2.html("<h4>" + d.name + "</h4><strong>Race:</strong> " + d.race + "</br><strong>Gender:</strong> " + d.gender )
                  .style("left", (d3.event.pageX) + "px")
                  .style("top", (d3.event.pageY - 28) + "px")
                  .style("opacity", 1);
              })
              .on("mouseout", function(d) {
                div_2.transition()
                  .duration(50) // duration is critical for mouse over.. if a user is moving the mouse fast the tooltip is not responsive
                  .style("opacity", 0);
              });

      // var label = g.append("g")
      //             .attr("class", "labels")
      //             .selectAll("text")
      //             .data(nodes_data)
      //             .enter().append("text")
      //             .attr("class", "label")
      //             .text(function(d) { return d.name; });


      //add drag capabilities
      var drag_handler_2 = d3.drag()
        .on("start", drag_start_2)
        .on("drag", drag_drag_2)
        .on("end", drag_end_2);

      drag_handler_2(node_2);


      //add zoom capabilities
      var zoom_handler_2 = d3.zoom()
          .on("zoom", zoom_actions_2);

      zoom_handler_2(svg_2);

      /** Functions **/

      //Drag functions
      //d is the node
      function drag_start_2(d) {
       if (!d3.event.active) simulation_2.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
      }

      //make sure you can't drag the circle outside the box
      function drag_drag_2(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function drag_end_2(d) {
        if (!d3.event.active) simulation_2.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      //Zoom functions
      function zoom_actions_2(){
          g_2.attr("transform", d3.event.transform)
      }

      var fontsize_2 = function(d) { return d.degree + "px"; };
      var color_palette_2 = d3.scaleOrdinal().range(["#276478", "#CA3542", "#E8A631", "#AECBC9"]);
      var color_2 = function(d,i){ return color_palette_2(d.gender) };
      // var opacity = function(d){ if (d.type == 'Subject') { return 1 } else {return 0} };

      function tickActions_2() {
          //update circle positions each tick of the simulation
             node_2
              .attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; })
              .style("fill", color_2);

          //update link positions
          link_2
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
