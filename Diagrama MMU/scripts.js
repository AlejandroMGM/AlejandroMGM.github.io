function init() {
  var $ = go.GraphObject.make; // for conciseness in defining templates

  myDiagram = new go.Diagram('myDiagramDiv', {
    validCycle: go.CycleMode.NotDirected, // don't allow loops
    'undoManager.isEnabled': true,
  });

  myDiagram.toolManager.mouseDownTools.add(
    new RowResizingTool({
      doResize: function (rowdef, height) {
        const panel = rowdef.panel.elt(rowdef.index);
        if (panel) {
          const tb = panel.findObject('TB');
          if (tb) tb.height = height;
        }
        rowdef.height = height;
      },
    })
  );
  myDiagram.toolManager.mouseDownTools.add(new ColumnResizingTool());

  // This template is a Panel that is used to represent each item in a Panel.itemArray.
  // The Panel is data bound to the item object.
  var fieldTemplate = $(go.Panel,
    'TableRow', // this Panel is a row in the containing Table
    new go.Binding('portId', 'name'), // this Panel is a "port"
    {
      background: 'transparent', // so this port's background can be picked by the mouse
      fromSpot: go.Spot.Right, // links only go from the right side to the left side
      toSpot: go.Spot.Left,
      // allow drawing links from or to this port:
      fromLinkable: true,
      toLinkable: true,
    },
    $(go.Shape,
      {
        column: 0,
        width: 12,
        height: 12,
        margin: 4,
        // but disallow drawing links from or to this shape:
        fromLinkable: false,
        toLinkable: false,
      },
      new go.Binding('figure', 'figure'),
      new go.Binding('fill', 'color')
    ),
    $(go.TextBlock,
      {
        name: 'TB',
        column: 1,
        margin: new go.Margin(0, 2),
        stretch: go.Stretch.Horizontal,
        font: 'bold 13px sans-serif',
        wrap: go.Wrap.None,
        overflow: go.TextOverflow.Ellipsis,
        // and disallow drawing links from or to this text:
        fromLinkable: false,
        toLinkable: false,
      },
      new go.Binding('height').makeTwoWay(),
      new go.Binding('text', 'name')
    ),
    $(go.TextBlock,
      {
        column: 2,
        margin: new go.Margin(0, 2),
        stretch: go.Stretch.Horizontal,
        font: '13px sans-serif',
        maxLines: 2,
        overflow: go.TextOverflow.Ellipsis,
        editable: true,
      },
      new go.Binding('text', 'info').makeTwoWay()
    )
  );

  // Return initialization for a RowColumnDefinition, specifying a particular column
  // and adding a Binding of RowColumnDefinition.width to the IDX'th number in the data.widths Array
  function makeWidthBinding(idx) {
    // These two conversion functions are closed over the IDX variable.
    // This source-to-target conversion extracts a number from the Array at the given index.
    function getColumnWidth(arr) {
      if (Array.isArray(arr) && idx < arr.length) return arr[idx];
      return NaN;
    }
    // This target-to-source conversion sets a number in the Array at the given index.
    function setColumnWidth(w, data) {
      var arr = data.widths;
      if (!arr) arr = [];
      if (idx >= arr.length) {
        for (var i = arr.length; i <= idx; i++) arr[i] = NaN; // default to NaN
      }
      arr[idx] = w;
      return arr; // need to return the Array (as the value of data.widths)
    }
    return [{ column: idx }, new go.Binding('width', 'widths', getColumnWidth).makeTwoWay(setColumnWidth)];
  }

  // This template represents a whole "record".
  myDiagram.nodeTemplate = $(go.Node,
    'Auto',
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    // this rectangular shape surrounds the content of the node
    $(go.Shape, { fill: 'rgba(255, 165, 0, 0.8)' }),
    // the content consists of a header and a list of items
    $(go.Panel,
      'Vertical',
      { stretch: go.Stretch.Horizontal, margin: 0.5 },
      // this is the header for the whole node
      $(go.Panel,
        'Auto',
        { stretch: go.Stretch.Horizontal }, // as wide as the whole node
        $(go.Shape, { fill: 'Black', strokeWidth: 0 }),
        $(go.TextBlock,
          {
            alignment: go.Spot.Center,
            margin: 3,
            stroke: 'orange',
            textAlign: 'center',
            font: 'bold 12pt sans-serif',
          },
          new go.Binding('text', 'key')
        )
      ),
      // this Panel holds a Panel for each item object in the itemArray;
      // each item Panel is defined by the itemTemplate to be a TableRow in this Table
      $(go.Panel,
        'Table',
        {
          name: 'TABLE',
          stretch: go.Stretch.Horizontal,
          minSize: new go.Size(100, 10),
          defaultAlignment: go.Spot.Left,
          defaultStretch: go.Stretch.Horizontal,
          defaultColumnSeparatorStroke: 'black',
          defaultRowSeparatorStroke: 'black',
          itemTemplate: fieldTemplate,
        },
        $(go.RowColumnDefinition, makeWidthBinding(0)),
        $(go.RowColumnDefinition, makeWidthBinding(1)),
        new go.Binding('itemArray', 'fields')
      ) // end Table Panel of items
    ) // end Vertical Panel
  ); // end Node

  myDiagram.linkTemplate = $(go.Link,
    { relinkableFrom: true, relinkableTo: true, toShortLength: 4 }, // let user reconnect links
    $(go.Shape, { strokeWidth: 1.5 }),
    $(go.Shape, { toArrow: 'Standard',stroke: "white" })
  );

  myDiagram.model = new go.GraphLinksModel({
    copiesArrays: true,
    copiesArrayObjects: true,
    linkFromPortIdProperty: 'fromPort',
    linkToPortIdProperty: 'toPort',
    // automatically update the model that is shown on this page
    Changed: (e) => {
      if (e.isTransactionFinished); //showModel();
    },
    nodeDataArray: [
      {
        key: 'Espacio de direcciones virtuales',
        widths: [NaN, NaN],
        fields: [
          { name: 'F3A7K9L', color: 'RebeccaPurple', info: "X", figure: 'Ellipse' },
          { name: 'D5E8G2P', color: 'RebeccaPurple', info: "X", figure: 'Ellipse' },
          { name: 'R9S4T1H', color: 'RebeccaPurple', info: "X", figure: 'Ellipse' },
          { name: 'U6V3W2J', color: 'RebeccaPurple', info: "X", figure: 'Ellipse' },
          { name: 'C4D8E2F', color: 'Lime', info: "7", figure: 'Diamond' },
          { name: 'H1J4K8L', color: 'RebeccaPurple', info: "X", figure: 'Ellipse' },
          { name: 'N2P8Q4R', color: 'DarkGreen', info: "5", figure: 'Diamond' },
          { name: 'T7U1V5X', color: 'RebeccaPurple', info: "X", figure: 'Ellipse' },
          { name: 'M5N8P2R', color: 'RebeccaPurple', info: "X", figure: 'Ellipse' },
          { name: 'S6T9U1V', color: 'RebeccaPurple', info: "X", figure: 'Ellipse' },
          { name: 'K3L7M9N', color: 'Cyan', info: "3", figure: 'Diamond' },
          { name: 'G2H8J3K', color: 'SteelBlue', info: "4", figure: 'Diamond' },
          { name: 'V4X1Y7Z', color: 'DeepPink', info: "0", figure: 'Diamond' },
          { name: 'W8X3Y2Z', color: 'Crimson', info: "6", figure: 'Diamond' },
          { name: 'Q9R2S1T', color: 'Indigo', info: "1", figure: 'Diamond' },
          { name: 'B6C1D9E', color: 'MediumSpringGreen', info: "2", figure: 'Diamond' },
        ],
        loc: '0 0',
      },
      {
        key: 'Direccion de memoria fisica',
        widths: [NaN, NaN],
        fields: [
          { name: 'L5M9N2P', color: 'Lime', figure: 'Diamond' },
          { name: 'E8F1G7H', color: 'Crimson', figure: 'Diamond' },
          { name: 'J3K6L8M', color: 'DarkGreen', figure: 'Diamond' },
          { name: 'P2Q7R4S', color: 'SteelBlue', figure: 'Diamond' },
          { name: 'Y9Z2A6B', color: 'Cyan', figure: 'Diamond' },
          { name: 'U1V5X3Y', color: 'MediumSpringGreen', figure: 'Diamond' },
          { name: 'W4X8Y1Z', color: 'Indigo', figure: 'Diamond' },
          { name: 'R7S1T5U', color: 'DeepPink', figure: 'Diamond' },
        ],
        loc: '375 175',
      },
    ],
    linkDataArray: [
      { from: 'Espacio de direcciones virtuales', fromPort: 'C4D8E2F', to: 'Direccion de memoria fisica', toPort: 'L5M9N2P' },
      { from: 'Espacio de direcciones virtuales', fromPort: 'N2P8Q4R', to: 'Direccion de memoria fisica', toPort: 'J3K6L8M' },
      { from: 'Espacio de direcciones virtuales', fromPort: 'K3L7M9N', to: 'Direccion de memoria fisica', toPort: 'Y9Z2A6B' },
      { from: 'Espacio de direcciones virtuales', fromPort: 'G2H8J3K', to: 'Direccion de memoria fisica', toPort: 'P2Q7R4S' },
      { from: 'Espacio de direcciones virtuales', fromPort: 'V4X1Y7Z', to: 'Direccion de memoria fisica', toPort: 'R7S1T5U' },
      { from: 'Espacio de direcciones virtuales', fromPort: 'W8X3Y2Z', to: 'Direccion de memoria fisica', toPort: 'E8F1G7H' },
      { from: 'Espacio de direcciones virtuales', fromPort: 'Q9R2S1T', to: 'Direccion de memoria fisica', toPort: 'W4X8Y1Z' },
      { from: 'Espacio de direcciones virtuales', fromPort: 'B6C1D9E', to: 'Direccion de memoria fisica', toPort: 'U1V5X3Y' },
    ],
  });

  // showModel();  show the diagram's initial model

  /*function showModel() {
    document.getElementById('mySavedModel').textContent = myDiagram.model.toJson();
  }*/
}
window.addEventListener('DOMContentLoaded', init);