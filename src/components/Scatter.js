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
    this.svgNode = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    // conditional prevents infinite loop
    if (prevProps.data !== this.props.data) {
      this.drawScatter();
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
        .attr('x', d => d.x * 600 )
        .attr('y', d => d.y * 600 )
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
