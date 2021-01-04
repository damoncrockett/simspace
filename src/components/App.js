import React, { Component } from 'react';
import Scatter from './Scatter';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { // global state
      pca: true,
      tsne: false,
      umap: false,
      data: null,
      dr: 'pca',
      sp: false,
      pasfa: false,
      random1: true,
      random2: false,
      model: 'random1',
      tduration: 5000
    };

    this.handlePCA = this.handlePCA.bind(this);
    this.handleTSNE = this.handleTSNE.bind(this);
    this.handleUMAP = this.handleUMAP.bind(this);
    this.handleSP = this.handleSP.bind(this);
    this.handlePASFA = this.handlePASFA.bind(this);
    this.handleRandom1 = this.handleRandom1.bind(this);
    this.handleRandom2 = this.handleRandom2.bind(this);
  }

  handlePCA() {
    this.setState(state => ({
      pca: true,
      tsne: false,
      umap: false,
      dr: 'pca'
    }));
  }

  handleTSNE() {
    this.setState(state => ({
      pca: false,
      tsne: true,
      umap: false,
      dr: 'tsne'
    }));
  }

  handleUMAP() {
    this.setState(state => ({
      pca: false,
      tsne: false,
      umap: true,
      dr: 'umap'
    }));
  }

  handleSP() {
    this.setState(state => ({
      sp: true,
      pasfa: false,
      random1: false,
      random2: false,
      model: 'sp'
    }));
  }

  handlePASFA() {
    this.setState(state => ({
      sp: false,
      pasfa: true,
      random1: false,
      random2: false,
      model: 'pasfa'
    }));
  }

  handleRandom1() {
    this.setState(state => ({
      sp: false,
      pasfa: false,
      random1: true,
      random2: false,
      model: 'random1'
    }));
  }

  handleRandom2() {
    this.setState(state => ({
      sp: false,
      pasfa: false,
      random1: false,
      random2: true,
      model: 'random2'
    }));
  }

  getData() {
    fetch('http://localhost:8888/'+this.state.model+'_'+this.state.dr+'.json')
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

    if (prevState.dr !== this.state.dr) {
      this.getData();
    }
  }

  render() {
    const bkgd = '#e8e3cd';
    const stroke = '#9f9a86';

    const pcaStyle = {
      backgroundColor: this.state.pca ? 'white' : bkgd,
      color: this.state.pca ? 'black' : stroke
    };

    const tsneStyle = {
      backgroundColor: this.state.tsne ? 'white' : bkgd,
      color: this.state.tsne ? 'black' : stroke
    };

    const umapStyle = {
      backgroundColor: this.state.umap ? 'white' : bkgd,
      color: this.state.umap ? 'black' : stroke
    };

    const spStyle = {
      backgroundColor: this.state.sp ? 'white' : bkgd,
      color: this.state.sp ? 'black' : stroke
    };

    const pasfaStyle = {
      backgroundColor: this.state.pasfa ? 'white' : bkgd,
      color: this.state.pasfa ? 'black' : stroke
    };

    const random1Style = {
      backgroundColor: this.state.random1 ? 'white' : bkgd,
      color: this.state.random1 ? 'black' : stroke
    };

    const random2Style = {
      backgroundColor: this.state.random2 ? 'white' : bkgd,
      color: this.state.random2 ? 'black' : stroke
    };

    return (
      <div className='app'>
        <div className='field'>
          <Scatter
            data={this.state.data}
            tduration={this.state.tduration}
          />
        </div>
        <div className='panel'>
          <div className='buttonStrip'>
            <button onClick={this.handlePCA} style={pcaStyle}>PCA</button>
            <button onClick={this.handleTSNE} style={tsneStyle}>t-SNE</button>
            <button onClick={this.handleUMAP} style={umapStyle}>UMAP</button>
            <button onClick={this.handleRandom1} style={random1Style}>RANDOM 1</button>
            <button onClick={this.handleRandom2} style={random2Style}>RANDOM 2</button>
            <button onClick={this.handleSP} style={spStyle}>SP</button>
            <button onClick={this.handlePASFA} style={pasfaStyle}>PASFA</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
