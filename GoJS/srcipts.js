function init() {

  // Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
  // For details, see https://gojs.net/latest/intro/buildingObjects.html
  const $ = go.GraphObject.make;  // for conciseness in defining templates

  myDiagram = new go.Diagram("myDiagramDiv",  // must name or refer to the DIV HTML element
    {
      initialContentAlignment: go.Spot.Left,
      allowSelect: false,  // the user cannot select any part
      // create a TreeLayout for the decision tree
      layout: $(go.TreeLayout, { arrangement: go.TreeLayout.ArrangementFixedRoots })
    });

  // custom behavior for expanding/collapsing half of the subtree from a node
  function buttonExpandCollapse(e, port) {
    var node = port.part;
    node.diagram.startTransaction("expand/collapse");
    var portid = port.portId;
    node.findLinksOutOf(portid).each(l => {
      if (l.visible) {
        // collapse whole subtree recursively
        collapseTree(node, portid);
      } else {
        // only expands immediate children and their links
        l.visible = true;
        var n = l.getOtherNode(node);
        if (n !== null) {
          n.location = node.getDocumentPoint(go.Spot.TopRight);
          n.visible = true;
        }
      }
    });
    myDiagram.toolManager.hideToolTip();
    node.diagram.commitTransaction("expand/collapse");
  }

  // recursive function for collapsing complete subtree
  function collapseTree(node, portid) {
    node.findLinksOutOf(portid).each(l => {
      l.visible = false;
      var n = l.getOtherNode(node);
      if (n !== null) {
        n.visible = false;
        collapseTree(n, null);  // null means all links, not just for a particular portId
      }
    });
  }

  // get the text for the tooltip from the data on the object being hovered over
  function tooltipTextConverter(data) {
    var str = "";
    var e = myDiagram.lastInput;
    var currobj = e.targetObject;
    if (currobj !== null && (currobj.name === "ButtonA" ||
      (currobj.panel !== null && currobj.panel.name === "ButtonA"))) {
      str = data.aToolTip;
    } else {
      str = data.bToolTip;
    }
    return str;
  }

  // define tooltips for buttons
  var tooltipTemplate =
    $("ToolTip",
      { "Border.fill": "rgba(47, 79, 79, 0.7)", "Border.stroke": "rgba(47, 79, 79, 0.7)" },
      $(go.TextBlock,
        {
          font: "8pt sans-serif",
          wrap: go.TextBlock.WrapFit,
          desiredSize: new go.Size(200, NaN),
          alignment: go.Spot.Center,
          margin: 6
        },
        new go.Binding("text", "", tooltipTextConverter))
    );

  // define the Node template for non-leaf nodes
  myDiagram.nodeTemplateMap.add("decision",
    $(go.Node, "Auto",
      new go.Binding("text", "key"),
      // define the node's outer shape, which will surround the Horizontal Panel
      $(go.Shape, "Rectangle",
        { fill: "rgba(128, 0, 0, 0.7)", stroke: "rgba(128, 0, 0, 0.7)" }),
      // define a horizontal Panel to place the node's text alongside the buttons
      $(go.Panel, "Horizontal",
        $(go.TextBlock,
          { font: "30px Roboto, sans-serif", margin: 5 },
          new go.Binding("text", "key")),
        // define a vertical panel to place the node's two buttons one above the other
        $(go.Panel, "Vertical",
          { defaultStretch: go.GraphObject.Fill, margin: 3 },
          $("Button",  // button A
            {
              name: "ButtonA",
              click: buttonExpandCollapse,
              toolTip: tooltipTemplate
            },
            new go.Binding("portId", "a"),
            $(go.TextBlock,
              { font: '500 16px Roboto, sans-serif' },
              new go.Binding("text", "aText"))
          ),  // end button A
          $("Button",  // button B
            {
              name: "ButtonB",
              click: buttonExpandCollapse,
              toolTip: tooltipTemplate
            },
            new go.Binding("portId", "b"),
            $(go.TextBlock,
              { font: '500 16px Roboto, sans-serif' },
              new go.Binding("text", "bText"))
          )  // end button B
        )  // end Vertical Panel
      )  // end Horizontal Panel
    ));  // end Node and call to add

  // define the Node template for leaf nodes
  myDiagram.nodeTemplateMap.add("personality",
    $(go.Node, "Auto",
      new go.Binding("text", "key"),
      $(go.Shape, "Rectangle",
        { fill: "rgba(255, 215, 0, 0.5)", stroke: " rgba(255, 215, 0, 0.5)" }),
      $(go.TextBlock,
        {
          font: '13px Roboto, sans-serif',
          wrap: go.TextBlock.WrapFit, desiredSize: new go.Size(200, NaN), margin: 5
        },
        new go.Binding("text", "text"))
    ));

  // define the only Link template
  myDiagram.linkTemplate =
    $(go.Link, go.Link.Orthogonal,  // the whole link panel
      { fromPortId: "" },
      new go.Binding("fromPortId", "fromport"),
      $(go.Shape,  // the link shape
        { stroke: "lightblue", strokeWidth: 2 })
    );

  // create the model for the decision tree
  var model =
    new go.GraphLinksModel(
      { linkFromPortIdProperty: "fromport" });
  // set up the model with the node and link data
  makeNodes(model);
  makeLinks(model);
  myDiagram.model = model;

  // make all but the start node invisible
  myDiagram.nodes.each(n => {
    if (n.text !== "Start") n.visible = false;
  });
  myDiagram.links.each(l => {
    l.visible = false;
  });
}

function makeNodes(model) {
  var nodeDataArray = [
    { key: "Start" },  // the root node

    // intermediate nodes: decisions on personality characteristics
    { key: "T" },
    { key: "M" },

    { key: "TA" },
    { key: "TF" },
    { key: "MA" },
    { key: "MF" },

    // terminal nodes: the personality descriptions
    {
      key: "TFP",
      text: "Grado Menor: Incendio forestal es el fuego que se extiende sin planificación, sin gestión y sin control en terreno forestal o silvestre, afectando a combustibles vegetales, flora y fauna."
    },
    {
      key: "TFG",
      text: "Grado Mayor: Erupción volcánica catastrófica, con expulsión de magma, cenizas y gases, amenazando vidas humanas y ecosistemas con devastación."
    },
    {
      key: "TAP",
      text: "Grado Menor: Viento fuerte, con ráfagas que pueden causar daños menores a estructuras y árboles, así como interrupciones en servicios públicos."
    },
    {
      key: "TAG",
      text: "Grado Mayor: Tornado devastador, con vientos extremadamente violentos capaces de destruir edificios, arrancar árboles y causar pérdidas humanas significativas."
    },
    {
      key: "MAP",
      text: "Grado Menor: Tormenta tropical, con vientos fuertes y lluvias moderadas, causando marejadas y algunas interrupciones en la navegación."
    },
    {
      key: "MAG",
      text: "Grado Mayor: Ciclón tropical de categoría 5, con vientos extremadamente violentos, marejadas ciclónicas destructivas y lluvias torrenciales, provocando devastación en áreas costeras y mar adentro."
    },
    {
      key: "MFP",
      text: "Grado Menor: Quema natural de gases inflamables en aguas volcánicas submarinas."
    },
    {
      key: "MFG",
      text: "Grado Mayor: Erupción submarina de un volcán, provocando explosiones, liberación de gases y formación de corrientes letales, afectando ecosistemas marinos y costas."
    },
  ];

  // Provide the same choice information for all of the nodes on each level.
  // The level is implicit in the number of characters in the Key, except for the root node.
  // In a different application, there might be different choices for each node, so the initialization would be above, where the Info's are created.
  // But for this application, it makes sense to share the initialization code based on tree level.
  for (var i = 0; i < nodeDataArray.length; i++) {
    var d = nodeDataArray[i];
    if (d.key === "Start") {
      d.category = "decision";
      d.a = "T";
      d.aText = "Tierra";
      d.aToolTip = "La Tierra es sólida y estable, pero también puede desencadenar terremotos y deslizamientos de tierra, recordándonos su poder impredecible.";
      d.b = "M";
      d.bText = "Mar";
      d.bToolTip = "El Mar es vasto y en constante movimiento, pero puede generar tormentas violentas y tsunamis, mostrándonos su fuerza y la importancia de la precaución.";
    } else {
      switch (d.key.length) {
        case 1:
          d.category = "decision";
          d.a = "F";
          d.aText = "Fuego";
          d.aToolTip = "El elemento Fuego representa la intuición y la capacidad de previsión. A menudo, las personas con este elemento tienden a ser visionarias y disfrutan planificando el futuro. Sin embargo, es importante recordar que un enfoque excesivamente orientado hacia el futuro puede llevar a ignorar las realidades actuales y a no considerar los riesgos inmediatos.";
          d.b = "A";
          d.bText = "Aire";
          d.bToolTip = "El elemento Aire representa la capacidad de adaptación y la atención a los detalles del presente. Las personas con este elemento suelen ser prácticas y realistas, centrándose en resolver los problemas que tienen delante. Es importante recordar que un enfoque excesivamente basado en el presente puede dificultar la planificación a largo plazo y la consideración de las consecuencias futuras.";
          break;
        case 2:
            d.category = "decision";
            d.a = "P";
            d.aText = "Grado Menor";
            d.aToolTip = "El Grado Menor indica un nivel moderado de riesgo.";
            d.b = "G";
            d.bText = "Grado Mayor";
            d.bToolTip = "El Grado Mayor indica un nivel peligroso de riesgo.";
            break;
        default:
          d.category = "personality";
          break;
      }
    }
  }
  model.nodeDataArray = nodeDataArray;
}

// The key strings implicitly hold the relationship information, based on their spellings.
// Other than the root node ("Start"), each node's key string minus its last letter is the
// key to the "parent" node.
function makeLinks(model) {
  var linkDataArray = [];
  var nda = model.nodeDataArray;
  for (var i = 0; i < nda.length; i++) {
    var key = nda[i].key;
    if (key === "Start" || key.length === 0) continue;
    // e.g., if key=="INTJ", we want: prefix="INT" and letter="J"
    var prefix = key.slice(0, key.length - 1);
    var letter = key.charAt(key.length - 1);
    if (prefix.length === 0) prefix = "Start";
    var obj = { from: prefix, fromport: letter, to: key };
    linkDataArray.push(obj);
  }
  model.linkDataArray = linkDataArray;
}
window.addEventListener('DOMContentLoaded', init);
