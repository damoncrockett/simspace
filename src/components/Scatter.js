import React, { Component } from 'react';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';
import { zoom } from 'd3-zoom';
import { scaleLinear } from 'd3-scale';

const margin = {top: 40, right: 40, bottom: 40, left: 40};
const plotH = 600;
const plotW = 600;
const svgW = plotW + margin.left + margin.right;
const svgH = plotH + margin.top + margin.bottom;
const squareSide = 15;

const clusterColors = {
  0: 'rgba(69,222,178,0.5)',
  1: 'rgba(249,13,160,0.5)',
  2: 'rgba(171,213,51,0.5)',
  3: 'rgba(189,108,243,0.5)'
};

class Scatter extends Component {
  constructor(props) {
    super(props);

    this.drawSVG = this.drawSVG.bind(this);
    this.drawScatter = this.drawScatter.bind(this);
    this.moveScatter = this.moveScatter.bind(this);
    this.drawHighlight = this.drawHighlight.bind(this);
    this.moveHighlight = this.moveHighlight.bind(this);
    this.drawCluster = this.drawCluster.bind(this);
    this.moveCluster = this.moveCluster.bind(this);
    this.drawGroup = this.drawGroup.bind(this);
    this.handleMouseover = this.handleMouseover.bind(this);
    this.handleMouseout = this.handleMouseout.bind(this);
    this.handleZoom = this.handleZoom.bind(this);
    this.svgNode = React.createRef();
    this.svgPanel = React.createRef();
  }

  componentDidMount() {
    this.drawSVG();
  }

  componentDidUpdate(prevProps, prevState) {
    // conditional prevents infinite loop
    if (prevProps.data === null) {
      this.drawScatter();
    } else if (prevProps.data !== null && prevProps.data !== this.props.data) {
      this.moveScatter();
    } else if (prevProps.data !== null && prevProps.data !== this.props.data && this.props.highlight === true) {
      this.moveHighlight();
    } else if (prevProps.data !== null && prevProps.data !== this.props.data && this.props.cluster === true) {
      this.moveCluster();
    }

    if (prevProps.highlight !== this.props.highlight) {
      this.drawHighlight();
    }

    if (prevProps.cluster !== this.props.cluster) {
      this.drawCluster();
    }

    if (prevProps.leaf !== this.props.leaf) {
      this.drawHighlight();
      this.drawGroup();
    }
  }

  handleZoom(e) {
    const svgNode = this.svgNode.current;
    const zoomTransform = e.transform;

    if (this.props.zoom === 'unit') {

      // Not sure why g.plotCanvas is the selection, since d3.zoom
      // is called on the just the svgNode. But it only works like this
      select(svgNode)
        .select('g.plotCanvas')
        .attr('transform', `translate(${zoomTransform.x},${zoomTransform.y}) scale(${zoomTransform.k})`)

    } else if (this.props.zoom === 'canvas') {

      const xScale = scaleLinear()
                    .domain([0, 1])
                    .range([0, plotW]);
      const yScale = scaleLinear()
                    .domain([0, 1])
                    .range([0, plotH]);

      this.updatedxScale = zoomTransform.rescaleX(xScale);
      this.updatedyScale = zoomTransform.rescaleY(yScale);

      // needed for moving the correct highlights
      const highlighted = this.props.data.filter(d => d.leaf === this.props.leaf);

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
      .on("zoom", this.handleZoom));
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
      .attr('xlink:href', d => d.imgpath )
      .attr('width', squareSide )
      .attr('height', squareSide )
      .attr('x', d => d.x * plotH )
      .attr('y', d => d.y * plotH )
      .on('mouseover', this.handleMouseover)
      .on('mouseout', this.handleMouseout)
    }

  moveScatter() {
    const svgNode = this.svgNode.current;
    const transitionSettings = transition().duration(this.props.tduration)

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('image')
      .data(this.props.data)
      .transition(transitionSettings)
        .attr('x', d => d.x * plotH )
        .attr('y', d => d.y * plotH )
  }

  drawHighlight() {
    const svgNode = this.svgNode.current;

    //const highlighted = this.props.data.filter(d => d.edition === this.props.edition);
    const highlighted = this.props.data.filter(d => d.leaf === this.props.leaf);

    /*
    This selection is non-empty only the first time. This way of setting the
    'x' and 'y' attributes of highlights gets around the problem that canvas
    zooming cannot account for future highlights. Canvas zooming moves all
    existing elements around, but when props.leaf is changed, the standard
    way of setting highlight 'x' and 'y' (from props.data) will revert back to
    the x and y the highlight WOULD have had, had you not canvas zoomed. So we
    grab the CURRENT x and y of the texture image, which is there from the
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

    // this update selection is non-empty any time we change 'leaf', so we need
    // to reset ids and positions
    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect.highlight')
      .data(highlighted)
      .attr('id', d => 't' + d.fullname + '_highlight')
      .attr('x', d => select('#t' + d.fullname + '_textureImage').attr('x'))
      .attr('y', d => select('#t' + d.fullname + '_textureImage').attr('y'))

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect.highlight')
      .data(highlighted)
      .exit()
      .remove()
    }

  moveHighlight() {
    const svgNode = this.svgNode.current;
    const transitionSettings = transition().duration(this.props.tduration);

    //const highlighted = this.props.data.filter(d => d.edition === this.props.edition);
    const highlighted = this.props.data.filter(d => d.leaf === this.props.leaf);

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect.highlight')
      .data(highlighted)
      .transition(transitionSettings)
        .attr('x', d => d.x * plotH )
        .attr('y', d => d.y * plotH )
    }

  drawCluster() {
    const svgNode = this.svgNode.current;

    // This selection is non-empty only the first time
    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect.cluster')
      .data(this.props.data)
      .enter()
      .append('rect')
      .attr('class','cluster')
      .attr('id', d => 't' + d.fullname + '_cluster')
      .attr('width', squareSide )
      .attr('height', squareSide )
      .attr('x', d => select('#t' + d.fullname + '_textureImage').attr('x'))
      .attr('y', d => select('#t' + d.fullname + '_textureImage').attr('y'))
      .attr('fill', clusterColors[d.clusterNum])
      .on('mouseover', this.handleMouseover)
      .on('mouseout', this.handleMouseout)
    }

  moveCluster() {
    const svgNode = this.svgNode.current;
    const transitionSettings = transition().duration(this.props.tduration);

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect.cluster')
      .data(this.props.data)
      .transition(transitionSettings)
        .attr('x', d => d.x * plotH )
        .attr('y', d => d.y * plotH )
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
      .attr('xlink:href', d.imgpath)
      .attr('width', 158 )
      .attr('height', 132 )
      .attr('x', 0 )
      .attr('y', 40)
      .attr('id', 't' + d.fullname + '_i')
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
      select('#t' + d.fullname + '_i').remove()
    }

  drawGroup() {
    const svgPanel = this.svgPanel.current;

    select(svgPanel)
      .select('g.panelCanvas')
      .append('text')
      .attr('id','groupLabel')
      .attr('x', 0 )
      .attr('y', 200 )

    select('#groupLabel')
      .text(this.props.leaf)

    select('#groupLabel')
      .text(this.props.leaf)
      .exit()
      .remove()
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
          height={svgH / 2}
          />
        </div>
      </div>
    );
  }
}

export default Scatter;
