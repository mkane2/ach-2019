//create somewhere to put the force directed graph
        var svg_3 = d3.select("svg#war_of_1812"),
            width_3 = +svg_3.attr("width"),
            height_3 = +svg_3.attr("height");

        var radius_3 = function(d) {return d.degree + 10 };

        // Define the div for the tooltip
            var div_3 = d3.select("body").append("div")
              .attr("class", "tooltip");
            var toggle = 0;

d3.json("WarOf1812.json", function(error, graph_3) {
      if (error) throw error;

      //set up the simulation and add forces
      var simulation_3 = d3.forceSimulation()
                         .nodes(graph_3.nodes);

      var link_force_3 =  d3.forceLink(graph_3.links)
                          .id(function(d) { return d.name; });

      var charge_force_3 = d3.forceManyBody()
                            .strength(-50);

      var center_force_3 = d3.forceCenter(width_3 / 2, height_3 / 2);

      var collision_3 = d3.forceCollide().radius(function(d) { return d.degree + 20 });

      simulation_3
          .force("charge_force", charge_force_3)
          .force("center_force", center_force_3)
          .force("links",link_force_3)
          .force("collision", collision_3)
       ;


      //add tick instructions:
      simulation_3.on("tick", tickActions_3 );

      //add encompassing group for the zoom
      var g_3 = svg_3.append("g")
          .attr("class", "everything");

      //draw lines for the links
      var link_3 = g_3.append("g")
          .attr("class", "links")
          .selectAll("line")
          .data(graph_3.links)
          .enter().append("line")
          .attr("stroke-width", 2)
          .style("stroke", "darkgray");

      //draw circles for the nodes
      var node_3 = g_3.append("g")
              .attr("class", "nodes")
              .selectAll("circle")
              .data(graph_3.nodes)
              .enter()
              .append("circle")
              .attr("r", radius_3)
              .attr("fill", "black")
              .on("mouseover", function(d) {
                div_3.html("<h4>" + d.name + "</h4><strong>Gender:</strong> " + d.gender )
                  .style("left", (d3.event.pageX) + "px")
                  .style("top", (d3.event.pageY - 28) + "px")
                  .style("opacity", 1);
              })
              .on("mouseout", function(d) {
                div_3.transition()
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
      var drag_handler_3 = d3.drag()
        .on("start", drag_start_3)
        .on("drag", drag_drag_3)
        .on("end", drag_end_3);

      drag_handler_3(node_3);


      //add zoom capabilities
      var zoom_handler_3 = d3.zoom()
          .on("zoom", zoom_actions_3);

      zoom_handler_3(svg_3);

      /** Functions **/

      //Drag functions
      //d is the node
      function drag_start_3(d) {
       if (!d3.event.active) simulation_3.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
      }

      //make sure you can't drag the circle outside the box
      function drag_drag_3(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function drag_end_3(d) {
        if (!d3.event.active) simulation_3.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      //Zoom functions
      function zoom_actions_3(){
          g_3.attr("transform", d3.event.transform)
      }

      var fontsize_3 = function(d) { return d.degree + "px"; };
      var color_palette_3 = d3.scaleOrdinal().range(["#276478", "#CA3542", "#E8A631", "#AECBC9"]);
      var color_3 = function(d,i){ return color_palette_3(d.gender) };
      // var opacity = function(d){ if (d.type == 'Subject') { return 1 } else {return 0} };

      function tickActions_3() {
          //update circle positions each tick of the simulation
             node_3
              .attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; })
              .style("fill", color_3);

          //update link positions
          link_3
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
