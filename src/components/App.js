import React, { Component } from 'react';
import Scatter from './Scatter';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = { // global state
      model: 'umap',
      data: null
    };

    this.handleModel = this.handleModel.bind(this);
  }


  handleModel() {
    let modelname = this.state.model;
    if (modelname==='umap') {
      modelname = 'tsne';
    } else if (modelname==='tsne') {
      modelname = 'umap';
    }

    this.setState(state => ({
      model: modelname
    }));
  }

  getData() {
    fetch('http://localhost:8888/'+this.state.model+'.json')
      .then(response => response.json())
      .then(data => this.setState(state => ({
        data: data
      })));
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps, prevState) {
    // conditional prevents infinite loop from render to cDU
    if (prevState.model !== this.state.model) {
      this.getData();
    }
  }

  render() {
    const bkgd = '#e8e3cd';
    const stroke = '#9f9a86';

    const modelStyle = {
      backgroundColor: bkgd,
      color: stroke,
    };

    return (
      <div className='app'>
        <div className='field'>
          <Scatter
            data={this.state.data}
          />
        </div>
        <div className='panel'>
          <div className='buttonStrip'>
            <button onClick={this.handleModel} style={modelStyle}>MODEL</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
