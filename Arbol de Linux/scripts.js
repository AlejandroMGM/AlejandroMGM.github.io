function init() {

  // Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
  // For details, see https://gojs.net/latest/intro/buildingObjects.html
  const $ = go.GraphObject.make;  // for conciseness in defining templates

  // some constants that will be reused within templates
  var mt8 = new go.Margin(8, 0, 0, 0);
  var mr8 = new go.Margin(0, 8, 0, 0);
  var ml8 = new go.Margin(0, 0, 0, 8);
  var roundedRectangleParams = {
    parameter1: 2,  // set the rounded corner
    spot1: go.Spot.TopLeft, spot2: go.Spot.BottomRight  // make content go all the way to inside edges of rounded corners
  };

  myDiagram =
    new go.Diagram("myDiagramDiv",  // the DIV HTML element
      {
        // Put the diagram contents at the top center of the viewport
        initialDocumentSpot: go.Spot.Top,
        initialViewportSpot: go.Spot.Top,
        // OR: Scroll to show a particular node, once the layout has determined where that node is
        // "InitialLayoutCompleted": e => {
        //  var node = e.diagram.findNodeForKey(28);
        //  if (node !== null) e.diagram.commandHandler.scrollToPart(node);
        // },
        layout:
          $(go.TreeLayout,  // use a TreeLayout to position all of the nodes
            {
              isOngoing: false,  // don't relayout when expanding/collapsing panels
              treeStyle: go.TreeLayout.StyleLastParents,
              // properties for most of the tree:
              angle: 90,
              layerSpacing: 80,
              // properties for the "last parents":
              alternateAngle: 0,
              alternateAlignment: go.TreeLayout.AlignmentStart,
              alternateNodeIndent: 15,
              alternateNodeIndentPastParent: 1,
              alternateNodeSpacing: 15,
              alternateLayerSpacing: 40,
              alternateLayerSpacingParentOverlap: 1,
              alternatePortSpot: new go.Spot(0.001, 1, 20, 0),
              alternateChildPortSpot: go.Spot.Left
            })
      });

  // This function provides a common style for most of the TextBlocks.
  // Some of these values may be overridden in a particular TextBlock.
  function textStyle(field) {
    return [
      {
        font: "12px Roboto, sans-serif", stroke: "rgba(0, 0, 0, .60)",
        visible: false  // only show textblocks when there is corresponding data for them
      },
      new go.Binding("visible", field, val => val !== undefined)
    ];
  }

  // define Converters to be used for Bindings
  function theNationFlagConverter(nation) {
    return "https://www.nwoods.com/images/emojiflags/" + nation + ".png";
  }

  // define the Node template
  myDiagram.nodeTemplate =
    $(go.Node, "Auto",
      {
        locationSpot: go.Spot.Top,
        isShadowed: true, shadowBlur: 1,
        shadowOffset: new go.Point(0, 1),
        shadowColor: "rgba(0, 0, 0, .14)",
        selectionAdornmentTemplate:  // selection adornment to match shape of nodes
          $(go.Adornment, "Auto",
            $(go.Shape, "RoundedRectangle", roundedRectangleParams,
              { fill: null, stroke: "#7986cb", strokeWidth: 3 }
            ),
            $(go.Placeholder)
          )  // end Adornment
      },
      $(go.Shape, "RoundedRectangle", roundedRectangleParams,
        { name: "SHAPE", fill: "rgba(255, 215, 0, 0.5)", strokeWidth: 0 },
        // gold if highlighted, white otherwise
        new go.Binding("fill", "isHighlighted", h => h ? "gold" : "rgba(57, 230, 255, 0.7)").ofObject()
      ),
      $(go.Panel, "Vertical",
        $(go.Panel, "Horizontal",
          { margin: 8 },
          $(go.Picture,
            { margin: 8, visible: true, desiredSize: new go.Size(50, 50) },
              new go.Binding("source", "icon"),  // Usa la propiedad 'icon' para especificar la ruta del icono
              new go.Binding("visible", "icon", icon => !!icon)  // Muestra el icono solo si la propiedad 'icon' está definida
            ),
          $(go.Panel, "Table",
            $(go.TextBlock,
              {
                row: 0, alignment: go.Spot.Left,
                font: "16px Roboto, sans-serif",
                stroke: "rgba(0, 0, 0, .87)",
                maxSize: new go.Size(160, NaN)
              },
              new go.Binding("text", "name")
            ),
            $(go.TextBlock, textStyle("title"),
              {
                row: 1, alignment: go.Spot.Left,
                maxSize: new go.Size(160, NaN)
              },
              new go.Binding("text", "title")
            ),
            $("PanelExpanderButton", "INFO",
              { row: 0, column: 1, rowSpan: 2, margin: ml8 }
            )
          )
        ),
        $(go.Shape, "LineH",
          {
            stroke: "rgba(255, 255, 255, 3)", strokeWidth: 1,
            height: 1, stretch: go.GraphObject.Horizontal
          },
          new go.Binding("visible").ofObject("INFO")  // only visible when info is expanded
        ),
        $(go.Panel, "Vertical",
          {
            name: "INFO",  // identify to the PanelExpanderButton
            stretch: go.GraphObject.Horizontal,  // take up whole available width
            margin: 8,
            defaultAlignment: go.Spot.Left,  // thus no need to specify alignment on each element
            
          },
          $(go.TextBlock, textStyle("Conexion"),
            new go.Binding("text", "Conexion", head => "Conexion: " + head)
          ),
          $(go.TextBlock, textStyle("boss"),
            new go.Binding("margin", "Conexion", head => mt8), // some space above if there is also a headOf value
            new go.Binding("text", "boss", boss => {
              var boss = myDiagram.model.findNodeDataForKey(boss);
              if (boss !== null) {
                return "Descendiente de: " + boss.name;
              }
              return "";
            })
          ),
        )
      )
    );

  // define the Link template, a simple orthogonal line
  myDiagram.linkTemplate =
    $(go.Link, go.Link.Orthogonal,
      { corner: 5, selectable: false },
      $(go.Shape, { strokeWidth: 3, stroke: " #FFA500" }));  // Naranja Neon, rounded corner links


  // set up the nodeDataArray, describing each person/position
  var nodeDataArray = [
    { key: 0, name: "Unix", title: "Sistema operativo precursor de Linux", icon: "https://static-00.iconduck.com/assets.00/unix-icon-1940x2048-3dtyhlda.png" },
    { key: 1, boss: 0, name: "Linux", title: "Núcleo de sistema operativo de código abierto", icon: "https://cdn-icons-png.flaticon.com/512/518/518713.png" },
    { key: 2, boss: 0, name: "MS-DOS", title: "Sistema operativo precursor de Windows", Conexion: "Unix se desarrolló como un sistema operativo robusto para entornos multiusuario y multitarea, mientras que MS-DOS fue diseñado inicialmente para manejar una sola tarea a la vez en sistemas personales. No comparten una relación directa en términos de derivación o influencia técnica.", icon: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Msdos-icon.png" }, // Antecesor de Windows
    { key: 3, boss: 2, name: "Windows", title: "Sistema operativo propietario desarrollado por Microsoft",  Conexion: "Windows y MS-DOS tienen una relación histórica muy estrecha. Las primeras versiones de Windows (como Windows 1.0, 2.0, 3.x) eran esencialmente interfaces gráficas que se ejecutaban sobre MS-DOS.", icon: "https://cdn.icon-icons.com/icons2/1195/PNG/512/1490889710-windows_82514.png" }, // Conexión con Windows
    { key: 4, boss: 1, name: "Debian", title: "Distribución Linux robusta y estable", icon: "https://www.debian.org/logos/openlogo-100.png" },
    { key: 5, boss: 1, name: "Red Hat", title: "Distribución Linux enfocada en el entorno empresarial", icon: "https://cdn.icon-icons.com/icons2/2415/PNG/512/redhat_plain_logo_icon_146370.png" },
    { key: 6, boss: 1, name: "Arch Linux", title: "Distribución Linux orientada a usuarios avanzados y personalizable", icon: "https://cdn.icon-icons.com/icons2/2699/PNG/512/archlinux_logo_icon_167835.png" },
    { key: 7, boss: 5, name: "Fedora", title: "Distribución Linux enfocada en innovación y tecnologías actuales", icon: "https://cdn.icon-icons.com/icons2/1159/PNG/256/fedora_81599.png" },
    { key: 8, boss: 1, name: "SUSE", title: "Distribución Linux con enfoque en estabilidad y soporte empresarial", icon: "https://cdn.icon-icons.com/icons2/159/PNG/256/logo_opensuse_22360.png" },
    { key: 9, boss: 4, name: "Kali Linux", title: "Distribución Linux utilizada para pruebas de seguridad y auditorías", icon: "https://ih1.redbubble.net/image.4788568999.2005/st,small,507x507-pad,600x600,f8f8f8.jpg" },
    { key: 10, boss: 4, name: "Ubuntu", title: "Distribución Linux popular y amigable para el usuario", icon: "https://cdn-icons-png.flaticon.com/512/888/888879.png" },
    { key: 11, boss: 10, name: "Linux Mint", title: "Distribución Linux basada en Ubuntu y amigable para principiantes", icon: "https://cdn.icon-icons.com/icons2/1508/PNG/512/distributorlogolinuxmint_104017.png" },
    { key: 12, boss: 10, name: "Pop!_OS", title: "Distribución Linux desarrollada por System76 con enfoque en productividad", icon: "https://static-00.iconduck.com/assets.00/distributor-logo-pop-os-icon-256x256-gk0affqc.png" },
    { key: 13, boss: 10, name: "Xubuntu", title: "Distribución Linux ligera basada en Ubuntu con entorno Xfce", icon: "https://e7.pngegg.com/pngimages/211/735/png-clipart-xubuntu-xfce-menu-element-hand-logo.png" },
    { key: 14, boss: 10, name: "Lubuntu", title: "Distribución Linux ligera basada en Ubuntu con entorno LXQt", icon: "https://cdn.icon-icons.com/icons2/1381/PNG/512/distributorlogolubuntu_93705.png" },
    { key: 15, boss: 10, name: "Kubuntu", title: "Distribución Linux basada en Ubuntu con entorno KDE", icon: "https://static-00.iconduck.com/assets.00/kubuntu-icon-2048x2048-5wq4gzxj.png" },
    { key: 16, boss: 5, name: "CentOS", title: "Distribución Linux de código abierto y orientada a empresas", icon: "https://static-00.iconduck.com/assets.00/centos-icon-144x144-5vyw7rll.png" },
    { key: 17, boss: 6, name: "Manjaro", title: "Distribución Linux basada en Arch Linux con enfoque en facilidad de uso", icon: "https://static-00.iconduck.com/assets.00/manjaro-logo-icon-512x506-x22yhdux.png" },
    { key: 18, boss: 10, name: "Elementary OS", title: "Distribución Linux con diseño y usabilidad enfocados en la estética", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Elementary_logo.svg/1200px-Elementary_logo.svg.png" },
    { key: 19, boss: 1, name: "Android", title: "Sistema operativo móvil basado en el núcleo de Linux", Conexion: "Aunque no es una distribución de Linux de escritorio, se basa en el núcleo de Linux y es ampliamente utilizado en dispositivos móviles.", icon: "https://w7.pngwing.com/pngs/658/459/png-transparent-android-computer-icons-android-text-logo-grass.png" },
    { key: 20, boss: 0, name: "iOS", title: "Sistema operativo móvil para iPhone y iPad de Apple",  Conexion: "No está basado en Linux, sino en el sistema operativo Darwin de Apple, que tiene raíces en Unix.", icon: "https://cdn.icon-icons.com/icons2/2170/PNG/512/apple_ios_brand_logo_icon_133257.png" },
    { key: 21, boss: 8, name: "OpenSUSE", title: "Distribución Linux comunitaria con enfoque en el uso empresarial", icon: "https://cdn.icon-icons.com/icons2/1508/PNG/512/distributorlogoopensuse_104071.png" }
];

  // create the Model with data for the tree, and assign to the Diagram
  myDiagram.model =
    new go.TreeModel(
      {
        nodeParentKeyProperty: "boss",  // this property refers to the parent node data
        nodeDataArray: nodeDataArray
      });

  // Overview
  myOverview =
    new go.Overview("myOverviewDiv",  // the HTML DIV element for the Overview
      { observed: myDiagram, contentAlignment: go.Spot.Center });   // tell it which Diagram to show and pan
}

// the Search functionality highlights all of the nodes that have at least one data property match a RegExp
function searchDiagram() {  // called by button
  var input = document.getElementById("mySearch");
  if (!input) return;
  myDiagram.focus();

  myDiagram.startTransaction("highlight search");

  if (input.value) {
    // search four different data properties for the string, any of which may match for success
    // create a case insensitive RegExp from what the user typed
    var safe = input.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var regex = new RegExp(safe, "i");
    var results = myDiagram.findNodesByExample({ name: regex },
      { nation: regex },
      { title: regex },
      { headOf: regex });
    myDiagram.highlightCollection(results);
    // try to center the diagram at the first node that was found
    if (results.count > 0) myDiagram.centerRect(results.first().actualBounds);
  } else {  // empty string only clears highlighteds collection
    myDiagram.clearHighlighteds();
  }

  myDiagram.commitTransaction("highlight search");
}
window.addEventListener('DOMContentLoaded', init);
