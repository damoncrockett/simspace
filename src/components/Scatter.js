import React, { Component } from 'react';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';

const margin = {top: 40, right: 40, bottom: 40, left: 40};
const plotH = 500;
const plotW = 500;
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
      .attr('width', 32 )
      .attr('height', 32 )


    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('image')
      .data(this.props.data)
      .transition()
        .attr('x', d => d.x * 500 )
        .attr('y', d => d.y * 500 )


      //window.scrollTo( 0, this.state.svgH );
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
