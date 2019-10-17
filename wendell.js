//create somewhere to put the force directed graph
var svg_wendell = d3.select("svg#wendell"),
    width_wendell = +svg_wendell.attr("width"),
    height_wendell = +svg_wendell.attr("height");

    // Define the div for the tooltip
        var div_wendell = d3.select("body").append("div")
          .attr("class", "tooltip");
        var toggle = 0;

d3.json("wendell.json", function(error, graph) {
      if (error) throw error;

      var radius_wendell = function(d) {return d.degree + 1};

      //set up the simulation and add forces
      var simulation_wendell = d3.forceSimulation()
                         .nodes(graph.nodes);

      var link_force_wendell =  d3.forceLink(graph.links)
                          .id(function(d) { return d.id; });

      var charge_force_wendell = d3.forceManyBody()
                            .strength(-30);

      var center_force_wendell = d3.forceCenter(width_wendell / 2, height_wendell / 2);

      var collision_wendell = d3.forceCollide().radius(radius_wendell);

      simulation_wendell
          .force("charge_force", charge_force_wendell)
          .force("center_force", center_force_wendell)
          .force("links",link_force_wendell)
          .force("collision", collision_wendell)
       ;


      //add tick instructions:
      simulation_wendell.on("tick", tickActions_wendell );

      //add encompassing group for the zoom
      var g_wendell = svg_wendell.append("g")
          .attr("class", "everything");

      //draw lines for the links
      var link_wendell = g_wendell.append("g")
          .attr("class", "links")
          .selectAll("line")
          .data(graph.links)
          .enter().append("line")
          .attr("stroke-width", 2)
          .style("stroke", "darkgray");

      //draw circles for the nodes
      var node_wendell = g_wendell.append("g")
              .attr("class", "nodes")
              .selectAll("circle")
              .data(graph.nodes)
              .enter()
              .append("circle")
              .attr("r", radius_wendell)
              .attr("fill", "black")
              .on("mouseover", function(d) {
                div_1.html("<h4>" + d.name + "</h4><strong>Race:</strong> " + d.race + "</br><strong>Gender:</strong> " + d.gender + "</br><strong>Nation:</strong> " + d.Nation )
                  .style("left", (d3.event.pageX) + "px")
                  .style("top", (d3.event.pageY - 28) + "px")
                  .style("opacity", 1);
              })
              .on("mouseout", function(d) {
                div_1.transition()
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
      var drag_handler_wendell = d3.drag()
        .on("start", drag_start_wendell)
        .on("drag", drag_drag_wendell)
        .on("end", drag_end_wendell);

      drag_handler_wendell(node_wendell);


      //add zoom capabilities
      var zoom_handler_wendell = d3.zoom()
          .on("zoom", zoom_actions_wendell);

      zoom_handler_wendell(svg_wendell);

      /** Functions **/

      //Drag functions
      //d is the node
      function drag_start_wendell(d) {
       if (!d3.event.active) simulation_wendell.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
      }

      //make sure you can't drag the circle outside the box
      function drag_drag_wendell(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function drag_end_wendell(d) {
        if (!d3.event.active) simulation_wendell.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      //Zoom functions
      function zoom_actions_wendell(){
          g_wendell.attr("transform", d3.event.transform)
      }

      var fontsize_wendell = function(d) { return d.degree + "px"; };
      var color_palette_wendell = d3.scaleOrdinal().range(["#276478", "#CA3542", "#E8A631", "#AECBC9"]);
      var color_wendell = function(d,i){ return color_palette_wendell(d.gender) };
      // var opacity = function(d){ if (d.type == 'Subject') { return 1 } else {return 0} };

      function tickActions_wendell() {
          //update circle positions each tick of the simulation
             node_wendell
              .attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; })
              .style("fill", color_wendell);

          //update link positions
          link_wendell
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
