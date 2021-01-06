import React, { Component } from 'react';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';

const margin = {top: 40, right: 40, bottom: 40, left: 40};
const plotH = 600;
const plotW = 600;
const svgW = plotW + margin.left + margin.right;
const svgH = plotH + margin.top + margin.bottom;

class Scatter extends Component {
  constructor(props) {
    super(props);
    this.drawScatter = this.drawScatter.bind(this);
    this.drawHighlight = this.drawHighlight.bind(this);
    this.moveHighlight = this.moveHighlight.bind(this);
    this.drawEdition = this.drawEdition.bind(this);
    this.svgNode = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    // conditional prevents infinite loop
    if (prevProps.data !== this.props.data) {
      this.drawScatter();
      this.moveHighlight();
    }

    if (prevProps.highlight !== this.props.highlight) {
      this.drawHighlight();
      this.drawEdition();
    }

    if (prevProps.edition !== this.props.edition) {
      this.drawHighlight();
      this.drawEdition();
    }
  }

  drawScatter() {
    const svgNode = this.svgNode.current;
    const transitionSettings = transition().duration(this.props.tduration)

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
      .attr('xlink:href', d => d.imgpath )
      .attr('width', 16 )
      .attr('height', 16 )

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('image')
      .data(this.props.data)
      .transition(transitionSettings)
        .attr('x', d => d.x * plotW )
        .attr('y', d => d.y * plotH )
    }

  drawHighlight() {
    const svgNode = this.svgNode.current;

    // data is filtered by edition number
    const highlighted = this.props.data.filter(d => d.edition === this.props.edition);

    // This selection is non-empty only the first time
    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect')
      .data(highlighted)
      .enter()
      .append('rect')
      .attr('width', 16 )
      .attr('height', 16 )

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect')
      .data(highlighted)
      .attr('fill', this.props.highlight ? 'rgba(30, 144, 255, 0.5)' : 'rgba(0,0,0,0)')
      .attr('x', d => d.x * plotW )
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

    // data is filtered by edition number
    const highlighted = this.props.data.filter(d => d.edition === this.props.edition);

    // This selection is non-empty only the first time
    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect')
      .data(highlighted)
      .enter()
      .append('rect')
      .attr('width', 16 )
      .attr('height', 16 )

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect')
      .data(highlighted)
      .attr('fill', this.props.highlight ? 'rgba(30, 144, 255, 0.5)' : 'rgba(0,0,0,0)')
      .transition(transitionSettings)
        .attr('x', d => d.x * plotW )
        .attr('y', d => d.y * plotH )

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect')
      .data(highlighted)
      .exit()
      .remove()
    }

  drawEdition() {
    const svgNode = this.svgNode.current;

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('text')
      .data([0])
      .enter()
      .append('text')
      .attr('x', plotW - 10 )
      .attr('y', plotH - 10 )

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('text')
      .data([0])
      .text(this.props.edition)

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('text')
      .data([0])
      .exit()
      .remove()
  }

  render() {
    return <svg
             ref={this.svgNode}
             width={svgW}
             height={svgH}
           />;
  }
}

export default Scatter;
