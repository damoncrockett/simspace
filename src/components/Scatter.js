import React, { Component } from 'react';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';
import { zoom } from 'd3-zoom';

const margin = {top: 40, right: 40, bottom: 40, left: 40};
const plotH = 1200;
const plotW = 1200;
const svgW = plotW + margin.left + margin.right;
const svgH = plotH + margin.top + margin.bottom;
const squareSide = 30;

class Scatter extends Component {
  constructor(props) {
    super(props);

    this.drawScatter = this.drawScatter.bind(this);
    this.drawHighlight = this.drawHighlight.bind(this);
    this.moveHighlight = this.moveHighlight.bind(this);
    this.drawGroup = this.drawGroup.bind(this);
    this.handleMouseover = this.handleMouseover.bind(this);
    this.handleMouseout = this.handleMouseout.bind(this);
    this.handleZoom = this.handleZoom.bind(this);
    this.svgNode = React.createRef();
    this.svgPanel = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    // conditional prevents infinite loop
    if (prevProps.data !== this.props.data) {
      this.drawScatter();
      this.moveHighlight();
    }

    if (prevProps.highlight !== this.props.highlight) {
      this.drawHighlight();
      this.drawGroup();
    }

    if (prevProps.leaf !== this.props.leaf) {
      this.drawHighlight();
      this.drawGroup();
    }
  }

  handleZoom(e) {
    const svgNode = this.svgNode.current;
    const eTransform = e.transform
    const transform = `translate(${eTransform.x},${eTransform.y}) scale(${eTransform.k})`;

    select(svgNode)
      .select('g.plotCanvas')
      .attr('transform', transform)
  }

  drawScatter() {
    const svgNode = this.svgNode.current;
    const transitionSettings = transition().duration(this.props.tduration)

    select(svgNode)
      .call(zoom()
      .extent([[0, 0], [plotW, plotH]])
      .scaleExtent([1, 8])
      .on("zoom", this.handleZoom));

    // Can this be in a separate function? It seems to get used even
    // by other functions
    select(svgNode)
      .selectAll('g.plotCanvas')
      .data([0]) // bc enter selection, prevents appending new 'g' on re-render
      .enter()
      .append('g')
      .attr('class', 'plotCanvas') // purely semantic
      .attr('transform', `translate(${margin.left},${margin.top})`);

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
      .on('mouseover', this.handleMouseover)
      .on('mouseout', this.handleMouseout)

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

    // This selection is non-empty only the first time
    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect')
      .data(highlighted)
      .enter()
      .append('rect')
      .attr('id', d => 't' + d.fullname + '_highlight')
      .attr('width', squareSide )
      .attr('height', squareSide )
      .on('mouseover', this.handleMouseover)
      .on('mouseout', this.handleMouseout)

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect')
      .data(highlighted)
      .attr('id', d => 't' + d.fullname + '_highlight')
      .attr('fill', this.props.highlight ? 'rgba(30, 144, 255, 0.5)' : 'rgba(0,0,0,0)')
      .attr('x', d => d.x * plotH )
      .attr('y', d => d.y * plotH )

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect')
      .data(highlighted)
      .exit()
      .remove()
    }

  moveHighlight() {
    const svgNode = this.svgNode.current;
    const transitionSettings = transition().duration(this.props.tduration);

    //const highlighted = this.props.data.filter(d => d.edition === this.props.edition);
    const highlighted = this.props.data.filter(d => d.leaf === this.props.leaf);

    // This selection is non-empty only the first time
    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect')
      .data(highlighted)
      .enter()
      .append('rect')
      .attr('id', d => 't' + d.fullname + '_highlight')
      .attr('width', squareSide )
      .attr('height', squareSide )
      .on('mouseover', this.handleMouseover)
      .on('mouseout', this.handleMouseout)

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect')
      .data(highlighted)
      .attr('id', d => 't' + d.fullname + '_highlight')
      .attr('fill', this.props.highlight ? 'rgba(30, 144, 255, 0.5)' : 'rgba(0,0,0,0)')
      .transition(transitionSettings)
        .attr('x', d => d.x * plotH )
        .attr('y', d => d.y * plotH )

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect')
      .data(highlighted)
      .exit()
      .remove()
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

    select(svgPanel)
      .selectAll('g.panelCanvas')
      .data([0]) // bc enter selection, prevents appending new 'g' on re-render
      .enter()
      .append('g')
      .attr('class', 'panelCanvas') // purely semantic
      .attr('transform', `translate(${margin.left},${margin.top})`);

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

      select('#t' + d.fullname ).remove()
      select('#t' + d.fullname + '_i').remove()
    }

  drawGroup() {
    const svgPanel = this.svgPanel.current;

    // not sure but this might fail if it were possible to mouse over
    // and click 'leaf' at the same time
    // is selectAll really selecting ALL text elements in this div?

    select(svgPanel)
      .select('g.panelCanvas')
      .selectAll('text')
      .data([0])
      .enter()
      .append('text')
      .attr('x', 0 )
      .attr('y', 200 )

    select(svgPanel)
      .select('g.panelCanvas')
      .selectAll('text')
      .data([0])
      .text(this.props.leaf)

    select(svgPanel)
      .select('g.panelCanvas')
      .selectAll('text')
      .data([0])
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
          height={svgH / 4}
          />
        </div>
      </div>
    );
  }
}

export default Scatter;
