import React, { Component } from 'react';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';
import { zoom, zoomIdentity, zoomTransform } from 'd3-zoom';
import { scaleLinear } from 'd3-scale';

const screenH = window.screen.height * window.devicePixelRatio;
const screenW = window.screen.width * window.devicePixelRatio;
console.log(screenW);
console.log(screenH);
const marginInt = Math.round( screenH / 45 );
const margin = {top: marginInt, right: marginInt, bottom: marginInt, left: marginInt};
const plotH = Math.round( screenH / 3 );
const plotW = plotH;
const svgW = plotW + margin.left + margin.right;
const svgH = plotH + margin.top + margin.bottom;
const squareSide = Math.round( screenH / 120 );

// this works bc all data is normalized ahead of time
const xScale = scaleLinear()
              .domain([0, 1])
              .range([0, plotW]);

const yScale = scaleLinear()
              .domain([0, 1])
              .range([0, plotH]);

const clusterColors = {
  0: 'rgba(255,0,0,0.5)', //red
  1: 'rgba(0,255,0,0.5)', //green
  2: 'rgba(0,0,255,0.5)', //blue
  3: 'rgba(255,255,0,0.5)', //yellow
  4: 'rgba(255,165,0,0.5)', //orange
  5: 'rgba(160,32,240,0.5)', //purple
  6: 'rgba(255,0,255,0.5)' //magenta
};

class Scatter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      unitMarker: zoomIdentity,
      canvasMarker: zoomIdentity,
    };

    this.drawSVG = this.drawSVG.bind(this);
    this.drawScatter = this.drawScatter.bind(this);
    this.moveScatter = this.moveScatter.bind(this);
    this.drawHighlight = this.drawHighlight.bind(this);
    this.removeHighlight = this.removeHighlight.bind(this);
    this.moveHighlight = this.moveHighlight.bind(this);
    this.drawCluster = this.drawCluster.bind(this);
    this.removeCluster = this.removeCluster.bind(this);
    this.moveCluster = this.moveCluster.bind(this);
    this.handleMouseover = this.handleMouseover.bind(this);
    this.handleMouseout = this.handleMouseout.bind(this);
    this.handleZoom = this.handleZoom.bind(this);
    this.resetZoom = this.resetZoom.bind(this);
    this.svgNode = React.createRef();
    this.svgPanel = React.createRef();
  }

  componentDidMount() {
    this.drawSVG();
  }

  // Probably not how you're supposed to use this function, but it works ---
  // the conditionals are necessary at least for any functions that set state,
  // because state changes always trigger componentDidUpdate
  componentDidUpdate(prevProps, prevState) {
    // conditional prevents infinite loop
    if (prevProps.data === null && prevProps.data !== this.props.data) {
      this.drawScatter();
    }

    if (prevProps.data !== null && prevProps.data !== this.props.data) {
      this.moveScatter();
    }

    if (prevProps.data !== null && prevProps.data !== this.props.data && this.props.highlight === true) {
      this.moveHighlight();
    }

    if (prevProps.data !== null && prevProps.data !== this.props.data && this.props.cluster === true) {
      this.moveCluster();
    }

    if (prevProps.highlight !== this.props.highlight && this.props.highlight === true) {
      this.drawHighlight();
    }

    if (prevProps.highlight !== this.props.highlight && this.props.highlight === false) {
      this.removeHighlight();
    }

    if (prevProps.selection !== this.props.selection && this.props.highlight === true) {
      this.drawHighlight();
    }

    if (prevProps.cluster !== this.props.cluster && this.props.cluster === true) {
      this.drawCluster();
    }

    if (prevProps.cluster !== this.props.cluster && this.props.cluster === false) {
      this.removeCluster();
    }

    if (prevProps.clusterCol !== this.props.clusterCol && this.props.cluster === true) {
      this.drawCluster();
    }

    if (prevProps.zoom !== this.props.zoom) {
      this.resetZoom();
    }

    if (prevProps.icon !== this.props.icon) {
      this.drawScatter();
    }
  }

  drawSVG() {
    const svgNode = this.svgNode.current;
    const svgPanel = this.svgPanel.current;

    select(svgNode)
      .selectAll('g.plotCanvas')
      .data([0]) // bc enter selection, prevents appending new 'g' on re-render
      .enter()
      .append('g')
      .attr('class', 'plotCanvas') // purely semantic
      .attr('transform', `translate(${margin.left},${margin.top})`);

    select(svgPanel)
      .selectAll('g.panelCanvas')
      .data([0]) // bc enter selection, prevents appending new 'g' on re-render
      .enter()
      .append('g')
      .attr('class', 'panelCanvas') // purely semantic
      .attr('transform', `translate(${margin.left},${margin.top})`);

    select(svgNode)
      .call(zoom()
        .extent([[0, 0], [plotW, plotH]])
        .scaleExtent([0.25, 5])
        .on('zoom', this.handleZoom));
    }

  resetZoom() {
    const svgNode = this.svgNode.current;

    /*
    I'm honestly not sure why the callback approach works below. The callback
    function won't execute until the state has been set, of course, but what
    guarantees that either will happen in time?

    Before, I had the zoom resetting after the setState, but not as a callback,
    and even the PREVIOUS setState hadn't fired yet, so I'd be resetting the
    zoom to an out-of-date zoom setting. Very bizarre.
    */

    if (this.props.zoom === 'unit') {

      // mark where we left the previous, plus zoom-resetting callback
      // using zoom().transform was the trick; tough to know this from d3 docs
      this.setState({ canvasMarker: zoomTransform(svgNode) }, function () {
          select(svgNode).call(zoom().transform, this.state.unitMarker);
        }
      );
    } else if (this.props.zoom === 'canvas'){

      // n.b.: we don't store the margin adjustment, bc we add it every time
      this.setState({ unitMarker: zoomTransform(svgNode) }, function () {
          select(svgNode).call(zoom().transform, this.state.canvasMarker);
        }
      );
    }
  }

  handleZoom(e) {
    const svgNode = this.svgNode.current;

    if (this.props.zoom === 'unit') {

      // because we apply this directly as a transform, we have to incl. margin
      const zx = e.transform.x + marginInt;
      const zy = e.transform.y + marginInt;
      const zk = e.transform.k;
      const adjustedTransform = zoomIdentity.translate(zx,zy).scale(zk);

      // Not sure why g.plotCanvas is the selection, since d3.zoom
      // is called on the just the svgNode. But it only works like this
      select(svgNode)
        .select('g.plotCanvas')
        .attr('transform', adjustedTransform.toString())

    } else if (this.props.zoom === 'canvas') {

      // here we use margin-unadjusted transform, because we are not actually
      // applying a transform to the node itself
      this.updatedxScale = e.transform.rescaleX(xScale);
      this.updatedyScale = e.transform.rescaleY(yScale);

      // needed for moving the correct highlights
      const highlighted = this.props.data.filter(d => d[this.props.selectionProp] === this.props.selection);

      // rescale x and y domains (above) then apply to all visible elements below
      select(svgNode)
        .select('g.plotCanvas')
        .selectAll('image')
        .data(this.props.data)
        .attr('x', d => this.updatedxScale(d.x) )
        .attr('y', d => this.updatedyScale(d.y) )

      select(svgNode)
        .select('g.plotCanvas')
        .selectAll('rect.highlight')
        .data(highlighted)
        .attr('x', d => this.updatedxScale(d.x) )
        .attr('y', d => this.updatedyScale(d.y) )

      select(svgNode)
        .select('g.plotCanvas')
        .selectAll('rect.cluster')
        .data(this.props.data)
        .attr('x', d => this.updatedxScale(d.x) )
        .attr('y', d => this.updatedyScale(d.y) )
    }
  }

  drawScatter() {
    const svgNode = this.svgNode.current;

    // This selection is non-empty only the first time
    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('image')
      .data(this.props.data)
      .enter()
      .append('image')
      .attr('id', d => 't' + d.fullname + '_textureImage')
      .attr('xlink:href', d => d[this.props.icon] )
      .attr('width', squareSide )
      .attr('height', squareSide )
      .attr('x', d => xScale(d.x) )
      .attr('y', d => yScale(d.y) )
      .on('mouseover', this.handleMouseover)
      .on('mouseout', this.handleMouseout)

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('image')
      .data(this.props.data)
      .attr('xlink:href', d => d[this.props.icon] )
    }

  moveScatter() {
    const svgNode = this.svgNode.current;
    const transitionSettings = transition().duration(this.props.tduration)

    if (this.props.zoom === 'unit') {

      // if we've canvas-zoomed and we switch models, we need to rescale, and
      // if we are in unit zoom, we need to grab the stored canvasMarker
      this.updatedxScale = this.state.canvasMarker.rescaleX(xScale);
      this.updatedyScale = this.state.canvasMarker.rescaleY(yScale);

    } else if (this.props.zoom === 'canvas') {

      // if we've canvas-zoomed and we switch models, we need to rescale, and
      // if we are in canvas zoom, we need to grab the CURRENT transform
      this.updatedxScale = zoomTransform(svgNode).rescaleX(xScale);
      this.updatedyScale = zoomTransform(svgNode).rescaleY(yScale);

    }

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('image')
      .data(this.props.data)
      .transition(transitionSettings)
        .attr('x', d => this.updatedxScale(d.x) )
        .attr('y', d => this.updatedyScale(d.y) )
  }

  drawHighlight() {
    const svgNode = this.svgNode.current;
    const highlighted = this.props.data.filter(d => d[this.props.selectionProp] === this.props.selection);

    /*
    This way of setting the 'x' and 'y' attributes of highlights gets around the
    problem that canvas zooming cannot account for future highlights. Canvas
    zooming moves all existing elements around, but when props.leaf is changed,
    the standard way of setting highlight 'x' and 'y' (from props.data) reverts
    to the x and y the highlight WOULD have had, had you not canvas zoomed. So
    we grab the CURRENT x and y of the texture image, which is there from the
    start and never exits, so it always gets moved by the canvas zoom.
    */

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect.highlight')
      .data(highlighted)
      .enter()
      .append('rect')
      .attr('class', 'highlight')
      .attr('id', d => 't' + d.fullname + '_highlight')
      .attr('width', squareSide )
      .attr('height', squareSide )
      .attr('x', d => select('#t' + d.fullname + '_textureImage').attr('x'))
      .attr('y', d => select('#t' + d.fullname + '_textureImage').attr('y'))
      .attr('fill', 'rgba(255, 128, 0, 0.5)')
      .on('mouseover', this.handleMouseover)
      .on('mouseout', this.handleMouseout)

    // this update selection is non-empty any time we change the
    // highlight selection, so we need to reset ids and positions
    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect.highlight')
      .data(highlighted)
      .attr('id', d => 't' + d.fullname + '_highlight')
      .attr('x', d => select('#t' + d.fullname + '_textureImage').attr('x'))
      .attr('y', d => select('#t' + d.fullname + '_textureImage').attr('y'))

    // even though we have a remove highlight function below, we still need
    // this exit selection for changes in props.selection
    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect.highlight')
      .data(highlighted)
      .exit()
      .remove()
    }

  removeHighlight() {
    const svgNode = this.svgNode.current;

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect.highlight')
      .remove()
  }

  moveHighlight() {
    const svgNode = this.svgNode.current;
    const transitionSettings = transition().duration(this.props.tduration);
    const highlighted = this.props.data.filter(d => d[this.props.selectionProp] === this.props.selection);

    if (this.props.zoom === 'unit') {

      this.updatedxScale = this.state.canvasMarker.rescaleX(xScale);
      this.updatedyScale = this.state.canvasMarker.rescaleY(yScale);

    } else if (this.props.zoom === 'canvas') {

      this.updatedxScale = zoomTransform(svgNode).rescaleX(xScale);
      this.updatedyScale = zoomTransform(svgNode).rescaleY(yScale);

    }

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect.highlight')
      .data(highlighted)
      .transition(transitionSettings)
        .attr('x', d => this.updatedxScale(d.x) )
        .attr('y', d => this.updatedyScale(d.y) )
  }

  drawCluster() {
    const svgNode = this.svgNode.current;
    // quick transition; slower transitions were more confusing here
    const transitionSettings = transition().duration(500)

    // we only accept cluster labels between 0 and 6
    const clustered = this.props.clusterFillData.filter(d => ( d[this.props.clusterFillCol]) > -1 && d[this.props.clusterFillCol] < 7 );

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect.cluster')
      .data(clustered)
      .enter()
      .append('rect')
      .attr('class','cluster')
      .attr('id', d => 't' + d.fullname + '_cluster')
      .attr('width', squareSide )
      .attr('height', squareSide )
      .attr('x', d => select('#t' + d.fullname + '_textureImage').attr('x'))
      .attr('y', d => select('#t' + d.fullname + '_textureImage').attr('y'))
      .attr('fill', d => clusterColors[d[this.props.clusterFillCol]])
      .on('mouseover', this.handleMouseover)
      .on('mouseout', this.handleMouseout)

    // this update selection is non-empty any time we change
    // clusterCol, so we need to reset ids, positions, and colors
    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect.cluster')
      .data(clustered)
      .attr('id', d => 't' + d.fullname + '_cluster')
      .attr('x', d => select('#t' + d.fullname + '_textureImage').attr('x'))
      .attr('y', d => select('#t' + d.fullname + '_textureImage').attr('y'))
      .transition(transitionSettings)
        .attr('fill', d => clusterColors[d[this.props.clusterFillCol]])

    // even though we have a remove cluster function below, we still need
    // this exit selection for changes in clusterCol
    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect.cluster')
      .data(clustered)
      .exit()
      .remove()
    }

  removeCluster() {
    const svgNode = this.svgNode.current;

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect.cluster')
      .remove()
  }

  moveCluster() {
    const svgNode = this.svgNode.current;
    const transitionSettings = transition().duration(this.props.tduration);

    if (this.props.zoom === 'unit') {

      this.updatedxScale = this.state.canvasMarker.rescaleX(xScale);
      this.updatedyScale = this.state.canvasMarker.rescaleY(yScale);

    } else if (this.props.zoom === 'canvas') {

      this.updatedxScale = zoomTransform(svgNode).rescaleX(xScale);
      this.updatedyScale = zoomTransform(svgNode).rescaleY(yScale);

    }

    // Here, we don't use clusterFillData because we need the x and y coords from
    // the new data file
    const clustered = this.props.data.filter(d => ( d[this.props.clusterCol]) > -1 && d[this.props.clusterCol] < 7 );

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect.cluster')
      .data(clustered)
      .transition(transitionSettings)
        .attr('x', d => this.updatedxScale(d.x) )
        .attr('y', d => this.updatedyScale(d.y) )
  }

  // note: 'e' here is the mouse event itself, which we don't need
  handleMouseover(e, d) {
    const svgPanel = this.svgPanel.current;

    select('#t' + d.fullname + '_textureImage')
      .attr('width', squareSide * 1.125 )
      .attr('height', squareSide * 1.125 )

    select('#t' + d.fullname + '_highlight')
      .attr('width', squareSide * 1.125 )
      .attr('height', squareSide * 1.125 )

    select('#t' + d.fullname + '_cluster')
      .attr('width', squareSide * 1.125 )
      .attr('height', squareSide * 1.125 )

    select(svgPanel)
      .select('g.panelCanvas')
      .append('text')
      .attr('x', 0 )
      .attr('y', 0)
      .attr('id', 't' + d.fullname)
      .text(d.fullname)

    select(svgPanel)
      .select('g.panelCanvas')
      .append('image')
      .attr('xlink:href', d.texturepath)
      .attr('width', 158 )
      .attr('height', 132 )
      .attr('x', 0 )
      .attr('y', 25)
      .attr('id', 't' + d.fullname + '_it')

    select(svgPanel)
      .select('g.panelCanvas')
      .append('image')
      .attr('xlink:href', d.printpath)
      .attr('width', 158 )
      .attr('height', 132 )
      .attr('x', 0 )
      .attr('y', 215)
      .attr('id', 't' + d.fullname + '_ip')

    select(svgPanel)
      .select('g.panelCanvas')
      .append('text')
      .attr('x', 0 )
      .attr('y', 400 )
      .attr('id', 't' + d.fullname + '_title')
      .text(d.title)

    select(svgPanel)
      .select('g.panelCanvas')
      .append('text')
      .attr('x', 0 )
      .attr('y', 425 )
      .attr('id', 't' + d.fullname + '_year')
      .text(d.year)

    select(svgPanel)
      .select('g.panelCanvas')
      .append('text')
      .attr('x', 0 )
      .attr('y', 480 )
      .attr('id', 't' + d.fullname + '_support')
      .text(d.support)

    select(svgPanel)
      .select('g.panelCanvas')
      .append('text')
      .attr('x', 0 )
      .attr('y', 505 )
      .attr('id', 't' + d.fullname + '_dims')
      .text(d.dims)

    select(svgPanel)
      .select('g.panelCanvas')
      .append('text')
      .attr('x', 0 )
      .attr('y', 560 )
      .attr('id', 't' + d.fullname + '_edition')
      .text('Edition: '+d.edition)

    }

  handleMouseout(e, d) {
      select('#t' + d.fullname + '_textureImage')
        .attr('width', squareSide )
        .attr('height', squareSide )

      select('#t' + d.fullname + '_highlight')
        .attr('width', squareSide )
        .attr('height', squareSide )

      select('#t' + d.fullname + '_cluster')
        .attr('width', squareSide )
        .attr('height', squareSide )

      select('#t' + d.fullname ).remove()
      select('#t' + d.fullname + '_title').remove()
      select('#t' + d.fullname + '_year').remove()
      select('#t' + d.fullname + '_support').remove()
      select('#t' + d.fullname + '_dims').remove()
      select('#t' + d.fullname + '_edition').remove()
      select('#t' + d.fullname + '_it').remove()
      select('#t' + d.fullname + '_ip').remove()
    }

  render() {
    return (
      <div>
        <div className='fieldPlot'>
          <svg
          ref={this.svgNode}
          width={svgW}
          height={svgH}
          />
        </div>
        <div className='fieldPanel'>
          <svg
          ref={this.svgPanel}
          width={svgW}
          height={svgH}
          />
        </div>
      </div>
    );
  }
}

export default Scatter;
