import React, { Component } from 'react';
import Scatter from './Scatter';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { // global state
      pca: false,
      tsne: true,
      umap: false,
      data: null,
      editions: null,
      leaves: null,
      dr: 'tsne',
      sp: true,
      pasfa: false,
      model: 'sp',
      tduration: 5000,
      highlight: false,
      cluster: false,
      edition: '1',
      leaf: '1249_4',
      unitzoom: true,
      canvaszoom: false,
      zoom: 'unit'
    };

    this.getEditions = this.getEditions.bind(this);
    this.getLeaves = this.getLeaves.bind(this);
    this.getData = this.getData.bind(this);
    this.handlePCA = this.handlePCA.bind(this);
    this.handleTSNE = this.handleTSNE.bind(this);
    this.handleUMAP = this.handleUMAP.bind(this);
    this.handleSP = this.handleSP.bind(this);
    this.handlePASFA = this.handlePASFA.bind(this);
    this.handleHighlight = this.handleHighlight.bind(this);
    this.handleCluster = this.handleCluster.bind(this);
    this.handleEdition = this.handleEdition.bind(this);
    this.handleLeaf = this.handleLeaf.bind(this);
    this.handleUnitZoom = this.handleUnitZoom.bind(this);
    this.handleCanvasZoom = this.handleCanvasZoom.bind(this);
  }

  getEditions() {
    fetch('http://localhost:8888/'+'__editions.json')
      .then(response => response.json())
      .then( data => this.setState({ editions: data.edition }) );
  }

  getLeaves() {
    fetch('http://localhost:8888/'+'__leaves.json')
      .then(response => response.json())
      .then( data => this.setState({ leaves: data.leaf }) );
  }

  getData() {
    fetch('http://localhost:8888/_'+this.state.model+'_'+this.state.dr+'.json')
      .then(response => response.json())
      .then(data => this.setState({ data: data }));
  }

  handlePCA() {
    this.setState({ pca: true, tsne: false, umap: false, dr: 'pca' });
  }

  handleTSNE() {
    this.setState({ pca: false, tsne: true, umap: false, dr: 'tsne' });
  }

  handleUMAP() {
    this.setState({ pca: false, tsne: false, umap: true, dr: 'umap' });
  }

  handleSP() {
    this.setState({ sp: true, pasfa: false, model: 'sp' });
  }

  handlePASFA() {
    this.setState({ sp: false, pasfa: true, model: 'pasfa' });
  }

  // need functional setState here because new state depends on old
  handleHighlight() {
    this.setState(state => ({
      highlight: !this.state.highlight
    }));
  }

  // need functional setState here because new state depends on old
  handleCluster() {
    this.setState(state => ({
      cluster: !this.state.cluster
    }));
  }

  handleEdition() {
    let randomEdition = this.state.editions[Math.floor(Math.random()*this.state.editions.length)];
    this.setState({ edition: randomEdition });
  }

  handleLeaf() {
    let randomLeaf = this.state.leaves[Math.floor(Math.random()*this.state.leaves.length)];
    this.setState({ leaf: randomLeaf });
  }

  handleUnitZoom() {
    this.setState({ unitzoom: true, canvaszoom: false, zoom: 'unit' });
  }

  handleCanvasZoom() {
    this.setState({ unitzoom: false, canvaszoom: true, zoom: 'canvas' });
  }

  componentDidMount() {
    this.getData();
    this.getEditions();
    this.getLeaves();
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
    const bkgd = '#212121';
    const stroke = '#dddddd';

    const unitZoomStyle = {
      backgroundColor: this.state.unitzoom ? 'white' : bkgd,
      color: this.state.unitzoom ? 'black' : stroke
    };

    const canvasZoomStyle = {
      backgroundColor: this.state.canvaszoom ? 'white' : bkgd,
      color: this.state.canvaszoom ? 'black' : stroke
    };

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

    const highlightStyle = {
      backgroundColor: this.state.highlight ? 'white' : bkgd,
      color: this.state.highlight ? 'black' : stroke
    };

    const clusterStyle = {
      backgroundColor: this.state.cluster ? 'white' : bkgd,
      color: this.state.cluster ? 'black' : stroke
    };

    const editionStyle = {
      backgroundColor: bkgd,
      color: stroke
    };

    const leafStyle = {
      backgroundColor: bkgd,
      color: stroke
    };

    return (
      <div className='app'>
        <div className='field'>
          <Scatter
            data={this.state.data}
            tduration={this.state.tduration}
            highlight={this.state.highlight}
            cluster={this.state.cluster}
            edition={this.state.edition}
            leaf={this.state.leaf}
            zoom={this.state.zoom}
          />
        </div>
        <div className='upperpanel'>
          <div className='buttonStrip'>
            <button onClick={this.handleHighlight} style={highlightStyle}>HIGHLIGHT</button>
            <button onClick={this.handleCluster} style={clusterStyle}>CLUSTER</button>
            <button onClick={this.handleEdition} style={editionStyle}>EDITION</button>
            <button onClick={this.handleLeaf} style={leafStyle}>LEAF</button>
          </div>
        </div>
        <div className='midpanel'>
          <div className='buttonStrip'>
            <button onClick={this.handleUnitZoom} style={unitZoomStyle}>UNIT ZOOM</button>
            <button onClick={this.handleCanvasZoom} style={canvasZoomStyle}>CANVAS ZOOM</button>
          </div>
        </div>
        <div className='panel'>
          <div className='buttonStrip'>
            <button onClick={this.handlePCA} style={pcaStyle}>PCA</button>
            <button onClick={this.handleTSNE} style={tsneStyle}>t-SNE</button>
            <button onClick={this.handleUMAP} style={umapStyle}>UMAP</button>
            <button onClick={this.handleSP} style={spStyle}>SP</button>
            <button onClick={this.handlePASFA} style={pasfaStyle}>PASFA</button>
          </div>
        </div>

      </div>
    );
  }
}

export default App;
