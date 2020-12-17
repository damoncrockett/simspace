import React, { Component } from 'react';
import { select } from 'd3-selection';

const margin = {top: 40, right: 40, bottom: 40, left: 40};
const plotH = 1000;
const plotW = 1000;
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

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('image')
      .data(this.props.data)
      .attr('width', 100 )
      .attr('height', 100 )
      .attr('x', d => d.x * 1000 )
      .attr('y', d => d.y * 1000 )
      .attr('xlink:href', d => d.imgpath )

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
