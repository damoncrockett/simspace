import React, { Component } from 'react';
import Scatter from './Scatter';
import { uniq } from 'lodash';
import { histogram } from 'd3-array';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { // global state
      pca: false,
      tsne: true,
      umap: false,
      data: null,
      leaves: [''],
      editions: [''],
      years: [''],
      supports: [''],
      dims: [''],
      dr: 'tsne',
      sp: true,
      pasfa: false,
      model: 'sp',
      tduration: 5000,
      highlight: false,
      cluster: false,
      selection: '1249_4',
      selectionProp: 'leaf',
      unitzoom: true,
      canvaszoom: false,
      zoom: 'unit',
      icon: 'texturepath',
      texture: true,
      print: false
    };

    this.getData = this.getData.bind(this);
    this.handlePCA = this.handlePCA.bind(this);
    this.handleTSNE = this.handleTSNE.bind(this);
    this.handleUMAP = this.handleUMAP.bind(this);
    this.handleSP = this.handleSP.bind(this);
    this.handlePASFA = this.handlePASFA.bind(this);
    this.handleHighlight = this.handleHighlight.bind(this);
    this.handleCluster = this.handleCluster.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.handleSelectionProp = this.handleSelectionProp.bind(this);
    this.handleUnitZoom = this.handleUnitZoom.bind(this);
    this.handleCanvasZoom = this.handleCanvasZoom.bind(this);
    this.handleTextureImage = this.handleTextureImage.bind(this);
    this.handlePrintImage = this.handlePrintImage.bind(this);
  }

  getData() {
    fetch('http://localhost:8888/_'+this.state.model+'_'+this.state.dr+'.json')
      .then(response => response.json())
      .then(data => this.setState({
        data: data,
        leaves: data.map(d => d.leaf),
        editions: data.map(d => d.edition),
        years: data.map(d => d.year),
        supports: data.map(d => d.support),
        dims: data.map(d => d.dims),
      }));
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

  handleTextureImage() {
    this.setState({ texture: true, print: false, icon: 'texturepath' });
  }

  handlePrintImage() {
    this.setState({ texture: false, print: true, icon: 'printpath' });
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

  handleSelectionProp(e) {
    this.setState({ selectionProp: e.target.value, highlight: true });
  }

  handleSelection(e) {
    this.setState({ selection: e.target.value, highlight: true });
  }

  handleUnitZoom() {
    this.setState({ unitzoom: true, canvaszoom: false, zoom: 'unit' });
  }

  handleCanvasZoom() {
    this.setState({ unitzoom: false, canvaszoom: true, zoom: 'canvas' });
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

    const textureStyle = {
      backgroundColor: this.state.texture ? 'white' : bkgd,
      color: this.state.texture ? 'black' : stroke
    };

    const printStyle = {
      backgroundColor: this.state.print ? 'white' : bkgd,
      color: this.state.print ? 'black' : stroke
    };

    const highlightStyle = {
      backgroundColor: this.state.highlight ? 'white' : bkgd,
      color: this.state.highlight ? 'black' : stroke
    };

    const clusterStyle = {
      backgroundColor: this.state.cluster ? 'white' : bkgd,
      color: this.state.cluster ? 'black' : stroke
    };

    const selectStyle = {
      backgroundColor: bkgd,
      color: stroke
    };

    let selectionOptions = '';
    if (this.state.selectionProp === 'leaf') {
      selectionOptions = uniq(this.state.leaves)
    } else if (this.state.selectionProp === 'edition') {
      selectionOptions = uniq(this.state.editions)
    } else if (this.state.selectionProp === 'year') {
      selectionOptions = uniq(this.state.years)
    } else if (this.state.selectionProp === 'support') {
      selectionOptions = uniq(this.state.supports)
    } else if (this.state.selectionProp === 'dims') {
      selectionOptions = uniq(this.state.dims)
    }

    return (
      <div className='app'>
        <div className='field'>
          <Scatter
            data={this.state.data}
            tduration={this.state.tduration}
            highlight={this.state.highlight}
            cluster={this.state.cluster}
            selection={this.state.selection}
            selectionProp={this.state.selectionProp}
            zoom={this.state.zoom}
            icon={this.state.icon}
          />
        </div>
        <div className='upperpanel'>
          <div className='buttonStrip'>
            <button onClick={this.handleHighlight} style={highlightStyle}>HIGHLIGHT</button>
            <select style={selectStyle} value={this.state.selectionProp} onChange={this.handleSelectionProp}>
              <option value='leaf'>leaf</option>
              <option value='edition'>edition</option>
              <option value='year'>year</option>
              <option value='support'>support</option>
              <option value='dims'>dimensions</option>
            </select>
            <select style={selectStyle} value={this.state.selection} onChange={this.handleSelection}>
              {selectionOptions.map( (value, i) => {return <option value={value} key={i}>{value}</option>} )}
            </select>
          </div>
        </div>
        <div className='midpanel'>
          <div className='buttonStrip'>
            <button onClick={this.handleUnitZoom} style={unitZoomStyle}>UNIT ZOOM</button>
            <button onClick={this.handleCanvasZoom} style={canvasZoomStyle}>CANVAS ZOOM</button>
            <button onClick={this.handleTextureImage} style={textureStyle}>TEXTURE</button>
            <button onClick={this.handlePrintImage} style={printStyle}>PRINT</button>
            <button onClick={this.handleCluster} style={clusterStyle}>CLUSTER</button>
          </div>
        </div>
        <div className='lowerpanel'>
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
