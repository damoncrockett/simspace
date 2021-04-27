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
      clusterFillData: null,
      leaves: [''],
      editions: [''],
      years: [''],
      supports: [''],
      dims: [''],
      suffixes: [''],
      sides: [''],
      lightangles: [''],
      portraits: [''],
      leafsides: [''],
      leaflightangles: [''],
      suffixportraits: [''],
      rvportraits: [''],
      editionportraits: [''],
      editionsuffixes: [''],
      editionsuffixportraits: [''],
      editionsides: [''],
      editionsideportraits: [''],
      editionlightangles: [''],
      editionlightangleportraits: [''],
      dr: 'tsne',
      sp: true,
      pasfa: false,
      model: 'sp',
      tduration: 5000,
      highlight: false,
      cluster: false,
      clusterModel: 'sp',
      clusterMethod: 'kmeans',
      clusterNum: '4',
      clusterCol: 'sp_kmeans_4',
      clusterFillCol: 'sp_kmeans_3__sp_kmeans_4',
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
    this.getNewCoords = this.getNewCoords.bind(this);
    this.getClusterFillData = this.getClusterFillData.bind(this);
    this.handlePCA = this.handlePCA.bind(this);
    this.handleTSNE = this.handleTSNE.bind(this);
    this.handleUMAP = this.handleUMAP.bind(this);
    this.handleSP = this.handleSP.bind(this);
    this.handlePASFA = this.handlePASFA.bind(this);
    this.handleHighlight = this.handleHighlight.bind(this);
    this.handleCluster = this.handleCluster.bind(this);
    this.handleClusterModel = this.handleClusterModel.bind(this);
    this.handleClusterMethod = this.handleClusterMethod.bind(this);
    this.handleClusterNum = this.handleClusterNum.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.handleSelectionProp = this.handleSelectionProp.bind(this);
    this.handleUnitZoom = this.handleUnitZoom.bind(this);
    this.handleCanvasZoom = this.handleCanvasZoom.bind(this);
    this.handleTextureImage = this.handleTextureImage.bind(this);
    this.handlePrintImage = this.handlePrintImage.bind(this);
  }

  getData() {
    //fetch('http://localhost:8888/_'+this.state.model+'_'+this.state.dr+'.json')
    fetch('_'+this.state.model+'_'+this.state.dr+'.json')
      .then(response => response.json())
      .then(data => this.setState({
        data: data,
        leaves: uniq(data.map(d => d.leaf)).sort(),
        editions: uniq(data.map(d => d.edition)).sort(),
        years: uniq(data.map(d => d.year)).sort(),
        supports: uniq(data.map(d => d.support)).sort(),
        dims: uniq(data.map(d => d.dims)).sort(),
        suffixes: uniq(data.map(d => d.suffix)).sort(),
        sides: uniq(data.map(d => d.side)).sort(),
        lightangles: uniq(data.map(d => d.lightangle)).sort(),
        portraits: uniq(data.map(d => d.portrait)).sort(),
        leafsides: uniq(data.map(d => d.leafside)).sort(),
        leaflightangles: uniq(data.map(d => d.leaflightangle)).sort(),
        suffixportraits: uniq(data.map(d => d.suffixportrait)).sort(),
        rvportraits: uniq(data.map(d => d.rvportrait)).sort(),
        editionportraits: uniq(data.map(d => d.editionportrait)).sort(),
        editionsuffixes: uniq(data.map(d => d.editionsuffix)).sort(),
        editionsuffixportraits: uniq(data.map(d => d.editionsuffixportrait)).sort(),
        editionsides: uniq(data.map(d => d.editionside)).sort(),
        editionsideportraits: uniq(data.map(d => d.editionsideportrait)).sort(),
        editionlightangles: uniq(data.map(d => d.editionlightangle)).sort(),
        editionlightangleportraits: uniq(data.map(d => d.editionlightangleportrait)).sort()
      }));
    }

  getNewCoords() {
    //fetch('http://localhost:8888/_'+this.state.model+'_'+this.state.dr+'.json')
    fetch('_'+this.state.model+'_'+this.state.dr+'.json')
      .then(response => response.json())
      .then(data => this.setState({
        data: data,
      }));
    }

  getClusterFillData() {
    //fetch('http://localhost:8888/__clusterfills.json')
    fetch('__clusterfills.json')
      .then(response => response.json())
      .then(data => this.setState({
        clusterFillData: data
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

  handleClusterModel(e) {
    const clusterModel = e.target.value
    this.setState(state => ({
      clusterModel: clusterModel,
      clusterCol: clusterModel + '_' + this.state.clusterMethod + '_' + this.state.clusterNum,
      clusterFillCol: this.state.clusterFillCol.split('__')[1] + '__' + clusterModel + '_' + this.state.clusterMethod + '_' + this.state.clusterNum
    }));
  }

  handleClusterMethod(e) {
    const clusterMethod = e.target.value
    this.setState(state => ({
      clusterMethod: clusterMethod,
      clusterCol: this.state.clusterModel + '_' + clusterMethod + '_' + this.state.clusterNum,
      clusterFillCol: this.state.clusterFillCol.split('__')[1] + '__' + this.state.clusterModel + '_' + clusterMethod + '_' + this.state.clusterNum
    }));
  }

  handleClusterNum(e) {
    const clusterNum = e.target.value
    this.setState(state => ({
      clusterNum: clusterNum,
      clusterCol: this.state.clusterModel + '_' + this.state.clusterMethod + '_' + clusterNum,
      clusterFillCol: this.state.clusterFillCol.split('__')[1] + '__' + this.state.clusterModel + '_' + this.state.clusterMethod + '_' + clusterNum
    }));
  }

  handleSelectionProp(e) {
    const selectionProp = e.target.value;
    let newSelection = '';

    // if we change selectionProp, selection is changed to first value
    // of the new selectionProp
    if (selectionProp === 'leaf') {
      newSelection = this.state.leaves[0]
    } else if (selectionProp === 'edition') {
      newSelection = this.state.editions[0]
    } else if (selectionProp === 'year') {
      newSelection = this.state.years[0]
    } else if (selectionProp === 'support') {
      newSelection = this.state.supports[0]
    } else if (selectionProp === 'dims') {
      newSelection = this.state.dims[0]
    } else if (selectionProp === 'suffix') {
      newSelection = this.state.suffixes[0]
    } else if (selectionProp === 'side') {
      newSelection = this.state.sides[0]
    } else if (selectionProp === 'lightangle') {
      newSelection = this.state.lightangles[0]
    } else if (selectionProp === 'portrait') {
      newSelection = this.state.portraits[0]
    } else if (selectionProp === 'leafside') {
      newSelection = this.state.leafsides[0]
    } else if (selectionProp === 'leaflightangle') {
      newSelection = this.state.leaflightangles[0]
    } else if (selectionProp === 'suffixportrait') {
      newSelection = this.state.suffixportraits[0]
    } else if (selectionProp === 'rvportrait') {
      newSelection = this.state.rvportraits[0]
    } else if (selectionProp === 'editionportrait') {
      newSelection = this.state.editionportraits[0]
    } else if (selectionProp === 'editionsuffix') {
      newSelection = this.state.editionsuffixes[0]
    } else if (selectionProp === 'editionsuffixportrait') {
      newSelection = this.state.editionsuffixportraits[0]
    } else if (selectionProp === 'editionside') {
      newSelection = this.state.editionsides[0]
    } else if (selectionProp === 'editionsideportrait') {
      newSelection = this.state.editionsideportraits[0]
    } else if (selectionProp === 'editionlightangle') {
      newSelection = this.state.editionlightangles[0]
    } else if (selectionProp === 'editionlightangleportrait') {
      newSelection = this.state.editionlightangleportraits[0]
    }

    this.setState({ selectionProp: e.target.value, selection: newSelection });
  }

  handleSelection(e) {
    this.setState({ selection: e.target.value });
  }

  handleUnitZoom() {
    this.setState({ unitzoom: true, canvaszoom: false, zoom: 'unit' });
  }

  handleCanvasZoom() {
    this.setState({ unitzoom: false, canvaszoom: true, zoom: 'canvas' });
  }

  componentDidMount() {
    this.getData();
    this.getClusterFillData();
  }

  componentDidUpdate(prevProps, prevState) {
    // conditional prevents infinite loop from render to cDU
    if (prevState.model !== this.state.model) {
      this.getNewCoords();
    }

    if (prevState.dr !== this.state.dr) {
      this.getNewCoords();
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
      selectionOptions = this.state.leaves
    } else if (this.state.selectionProp === 'edition') {
      selectionOptions = this.state.editions
    } else if (this.state.selectionProp === 'year') {
      selectionOptions = this.state.years
    } else if (this.state.selectionProp === 'support') {
      selectionOptions = this.state.supports
    } else if (this.state.selectionProp === 'dims') {
      selectionOptions = this.state.dims
    } else if (this.state.selectionProp === 'suffix') {
      selectionOptions = this.state.suffixes
    } else if (this.state.selectionProp === 'side') {
      selectionOptions = this.state.sides
    } else if (this.state.selectionProp === 'lightangle') {
      selectionOptions = this.state.lightangles
    } else if (this.state.selectionProp === 'portrait') {
      selectionOptions = this.state.portraits
    } else if (this.state.selectionProp === 'leafside') {
      selectionOptions = this.state.leafsides
    } else if (this.state.selectionProp === 'leaflightangle') {
      selectionOptions = this.state.leaflightangles
    } else if (this.state.selectionProp === 'suffixportrait') {
      selectionOptions = this.state.suffixportraits
    } else if (this.state.selectionProp === 'rvportrait') {
      selectionOptions = this.state.rvportraits
    } else if (this.state.selectionProp === 'editionportrait') {
      selectionOptions = this.state.editionportraits
    } else if (this.state.selectionProp === 'editionsuffix') {
      selectionOptions = this.state.editionsuffixes
    } else if (this.state.selectionProp === 'editionsuffixportrait') {
      selectionOptions = this.state.editionsuffixportraits
    } else if (this.state.selectionProp === 'editionside') {
      selectionOptions = this.state.editionsides
    } else if (this.state.selectionProp === 'editionsideportrait') {
      selectionOptions = this.state.editionsideportraits
    } else if (this.state.selectionProp === 'editionlightangle') {
      selectionOptions = this.state.editionlightangles
    } else if (this.state.selectionProp === 'editionlightangleportrait') {
      selectionOptions = this.state.editionlightangleportraits
    }

    return (
      <div className='app'>
        <div className='field'>
          <Scatter
            data={this.state.data}
            clusterFillData={this.state.clusterFillData}
            tduration={this.state.tduration}
            highlight={this.state.highlight}
            selection={this.state.selection}
            selectionProp={this.state.selectionProp}
            cluster={this.state.cluster}
            clusterCol={this.state.clusterCol}
            clusterFillCol={this.state.clusterFillCol}
            zoom={this.state.zoom}
            icon={this.state.icon}
          />
        </div>
        <div className='highlightPanel'>
          <div className='buttonStrip'>
            <button onClick={this.handleHighlight} style={highlightStyle}>HIGHLIGHT</button>
            <select style={selectStyle} value={this.state.selectionProp} onChange={this.handleSelectionProp}>
              <option value='leaf'>leaf</option>
              <option value='edition'>edition</option>
              <option value='year'>year</option>
              <option value='support'>support</option>
              <option value='dims'>dimensions</option>
              <option value='suffix'>suffix</option>
              <option value='side'>side</option>
              <option value='lightangle'>light angle</option>
              <option value='portrait'>orientation</option>
              <option value='leafside'>leafside</option>
              <option value='leaflightangle'>leaf light angle</option>
              <option value='suffixportrait'>suffix orientation</option>
              <option value='rvportrait'>side orientation</option>
              <option value='editionportrait'>edition orientation</option>
              <option value='editionsuffix'>edition suffix</option>
              <option value='editionsuffixportrait'>edition suffix orientation</option>
              <option value='editionside'>edition side</option>
              <option value='editionsideportrait'>edition side orientation</option>
              <option value='editionlightangle'>edition light angle</option>
              <option value='editionlightangleportrait'>edition light angle orientation</option>
            </select>
            <select style={selectStyle} value={this.state.selection} onChange={this.handleSelection}>
              {selectionOptions.map( (value, i) => {return <option value={value} key={i}>{value}</option>} )}
            </select>
          </div>
        </div>
        <div className='clusterPanel'>
          <div className='buttonStrip'>
            <button onClick={this.handleCluster} style={clusterStyle}>CLUSTER</button>
            <select style={selectStyle} value={this.state.clusterModel} onChange={this.handleClusterModel}>
              <option value='sp'>SP</option>
              <option value='pasfa'>PASFA</option>
            </select>
            <select style={selectStyle} value={this.state.clusterMethod} onChange={this.handleClusterMethod}>
              <option value='kmeans'>k-means</option>
              <option value='hierarchical'>hierarchical</option>
              <option value='spectral'>spectral</option>
            </select>
            <select style={selectStyle} value={this.state.clusterNum} onChange={this.handleClusterNum}>
              <option value='2'>2</option>
              <option value='3'>3</option>
              <option value='4'>4</option>
              <option value='5'>5</option>
              <option value='6'>6</option>
              <option value='7'>7</option>
            </select>
          </div>
        </div>
        <div className='zoomPanel'>
          <div className='buttonStrip'>
            <button onClick={this.handleUnitZoom} style={unitZoomStyle}>ZOOM</button>
            <button onClick={this.handleCanvasZoom} style={canvasZoomStyle}>SPREAD</button>
          </div>
        </div>
        <div className='iconPanel'>
          <div className='buttonStrip'>
            <button onClick={this.handleTextureImage} style={textureStyle}>TEXTURE</button>
            <button onClick={this.handlePrintImage} style={printStyle}>DRAWING</button>
          </div>
        </div>
        <div className='drPanel'>
          <div className='buttonStrip'>
            <button onClick={this.handlePCA} style={pcaStyle}>PCA</button>
            <button onClick={this.handleTSNE} style={tsneStyle}>t-SNE</button>
            <button onClick={this.handleUMAP} style={umapStyle}>UMAP</button>
          </div>
        </div>
        <div className='modelPanel'>
          <div className='buttonStrip'>
            <button onClick={this.handleSP} style={spStyle}>SP</button>
            <button onClick={this.handlePASFA} style={pasfaStyle}>PASFA</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
