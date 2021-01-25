import React, { Component } from 'react';
import Scatter from './Scatter';

const editions = ['1249','1253','1256','1265','1294','1295','1296','1297',
                  '1298','1299','1300','1301','1313','1324','1327','1331',
                  '1335','1348','1358','1359','1360','1361','1362','1363',
                  '1364','1365','1366','1367','1368','1387','1403','2589',
                  '2591','2592','2594','2595','2596','2597','2598','2599',
                  '2600','2601','2602','2603','2605','2606','2607','2608',
                  '2609','2610'];

const leaves = ['1249_4', '1249_5', '1249_essai_10', '1249_essai', '1253_4',
       '1253_epreuve_5', '1253_essai_a', '1253_essai_b', '1256_4',
       '1256_8', '1256_essai_japon', '1256_essai', '1265_4', '1265_essai',
       '1294_10', '1294_29', '1294_40', '1294_41', '1294_4', '1294_7',
       '1294_epreuve_8', '1294_essai', '1295_13', '1295_20', '1295_25',
       '1295_26', '1295_32', '1295_38', '1295_41', '1295_46', '1295_7',
       '1295_essai', '1296_16', '1296_28_treated', '1296_32',
       '1296_9_treated', '1296_epreuve_6', '1296_essai',
       '1297_essai_japon', '1298_49', '1298_50', '1298_5',
       '1298_epeuve_7', '1298_essai', '1299_19', '1299_24', '1299_42',
       '1299_50', '1299_essai', '1300_34', '1300_4', '1300_6', '1300_81',
       '1300_83', '1301_39', '1301_45', '1301_50', '1301_5',
       '1301_essai_a', '1301_essai_b', '1301_essai_japon', '1313_13',
       '1313_4', '1313_epreuve_10', '1313_essai', '1324_40', '1324_41',
       '1324_66', '1324_72', '1324_73', '1324_7', '1324_essai_japon',
       '1324_essai', '1324_premier_etat', '1327_18', '1327_29', '1327_35',
       '1327_41', '1327_49', '1327_64', '1327_68', '1331_10',
       '1331_epreuve_8', '1331_essai_a', '1331_essai_b',
       '1331_essai_japon', '1335', '1348_18', '1348_21', '1348_essai',
       '1358_16', '1358_23', '1358_2', '1358_essai', '1359_14', '1359_22',
       '1359_5', '1359_essai', '1360_11', '1360_9', '1360_essai',
       '1361_12', '1361_16', '1361_19', '1361_24', '1361_essai',
       '1362_13', '1362_17', '1362_20', '1362_22', '1362_essai',
       '1363_14', '1363_8', '1363_essai', '1364_16', '1364_1', '1364_20',
       '1364_23', '1365_11', '1365_16', '1366_12', '1366_18', '1366_20',
       '1366_6', '1367_21', '1367_24', '1367_3', '1367_8',
       '1367_epeuve_2', '1368_1', '1368_6', '1368_epeuve_1', '1387_10',
       '1387_18', '1387_22', '1387_epreuve_4', '1403_13', '1403_21',
       '1403_32', '1403_33', '1403_4', '2589_11', '2589_18', '2589_3',
       '2589_essai', '2591_16', '2591_6', '2591_epreuve_6', '2591_essai',
       '2592_13', '2592_6', '2592_essai_a', '2592_essai_b', '2594_3',
       '2594_7', '2594_essai', '2595_12', '2595_20', '2595_6',
       '2595_essai', '2596_12', '2596_18', '2596_3', '2596_essai',
       '2597_1', '2597_21', '2597_9', '2597_essai', '2598_19', '2598_4',
       '2598_essai_a', '2598_essai_b', '2599_23', '2599_5',
       '2599_epreuve_5', '2599_essai', '2600_10', '2600_19', '2600_4',
       '2600_essai', '2601_16', '2601_9', '2601_epreuve_5', '2601_essai',
       '2602_24', '2602_4', '2602_epreuve_3', '2602_essai', '2603_12',
       '2603_21', '2603_3', '2603_essai', '2605_10', '2605_19', '2605_1',
       '2605_essai', '2606_16', '2606_7', '2606_epreuve_6', '2606_essai',
       '2607_18', '2607_8', '2607_epreuve_4', '2607_essai', '2608_17',
       '2608_6', '2608_epreuve_1', '2608_essai', '2609_11', '2609_23',
       '2609_7', '2609_epreuve_2', '2610_11', '2610_23', '2610_5']

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { // global state
      pca: false,
      tsne: true,
      umap: false,
      data: null,
      dr: 'tsne',
      sp: true,
      pasfa: false,
      random1: false,
      random2: false,
      random3: false,
      random4: false,
      model: 'sp',
      tduration: 5000,
      highlight: false,
      cluster: false,
      edition: '1249',
      leaf: '1249_4',
      unitzoom: true,
      canvaszoom: false,
      zoom: 'unit'
    };

    this.handlePCA = this.handlePCA.bind(this);
    this.handleTSNE = this.handleTSNE.bind(this);
    this.handleUMAP = this.handleUMAP.bind(this);
    this.handleSP = this.handleSP.bind(this);
    this.handlePASFA = this.handlePASFA.bind(this);
    this.handleRandom1 = this.handleRandom1.bind(this);
    this.handleRandom2 = this.handleRandom2.bind(this);
    this.handleRandom3 = this.handleRandom3.bind(this);
    this.handleRandom4 = this.handleRandom4.bind(this);
    this.handleHighlight = this.handleHighlight.bind(this);
    this.handleCluster = this.handleCluster.bind(this);
    this.handleEdition = this.handleEdition.bind(this);
    this.handleLeaf = this.handleLeaf.bind(this);
    this.handleUnitZoom = this.handleUnitZoom.bind(this);
    this.handleCanvasZoom = this.handleCanvasZoom.bind(this);
  }

  // most of these functional setStates are not necessary, I believe
  handleUnitZoom() {
    this.setState(state => ({
      unitzoom: true,
      canvaszoom: false,
      zoom: 'unit'
    }));
  }

  handleCanvasZoom() {
    this.setState(state => ({
      unitzoom: false,
      canvaszoom: true,
      zoom: 'canvas'
    }));
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
      random3: false,
      random4: false,
      model: 'sp'
    }));
  }

  handlePASFA() {
    this.setState(state => ({
      sp: false,
      pasfa: true,
      random1: false,
      random2: false,
      random3: false,
      random4: false,
      model: 'pasfa'
    }));
  }

  handleRandom1() {
    this.setState(state => ({
      sp: false,
      pasfa: false,
      random1: true,
      random2: false,
      random3: false,
      random4: false,
      model: 'random1'
    }));
  }

  handleRandom2() {
    this.setState(state => ({
      sp: false,
      pasfa: false,
      random1: false,
      random2: true,
      random3: false,
      random4: false,
      model: 'random2'
    }));
  }

  handleRandom3() {
    this.setState(state => ({
      sp: false,
      pasfa: false,
      random1: false,
      random2: false,
      random3: true,
      random4: false,
      model: 'random3'
    }));
  }

  handleRandom4() {
    this.setState(state => ({
      sp: false,
      pasfa: false,
      random1: false,
      random2: false,
      random3: false,
      random4: true,
      model: 'random4'
    }));
  }

  handleHighlight() {
    this.setState(state => ({
      highlight: !this.state.highlight
    }));
  }

  handleCluster() {
    this.setState(state => ({
      cluster: !this.state.cluster
    }));
  }

  handleEdition() {
    let randomEdition = editions[Math.floor(Math.random()*editions.length)];

    this.setState(state => ({
      edition: randomEdition
    }));
  }

  handleLeaf() {
    let randomLeaf = leaves[Math.floor(Math.random()*leaves.length)];

    this.setState(state => ({
      leaf: randomLeaf
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

    const random1Style = {
      backgroundColor: this.state.random1 ? 'white' : bkgd,
      color: this.state.random1 ? 'black' : stroke
    };

    const random2Style = {
      backgroundColor: this.state.random2 ? 'white' : bkgd,
      color: this.state.random2 ? 'black' : stroke
    };

    const random3Style = {
      backgroundColor: this.state.random3 ? 'white' : bkgd,
      color: this.state.random3 ? 'black' : stroke
    };

    const random4Style = {
      backgroundColor: this.state.random4 ? 'white' : bkgd,
      color: this.state.random4 ? 'black' : stroke
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
            <button onClick={this.handleRandom1} style={random1Style}>RANDOM 1</button>
            <button onClick={this.handleRandom2} style={random2Style}>RANDOM 2</button>
            <button onClick={this.handleRandom3} style={random3Style}>RANDOM 3</button>
            <button onClick={this.handleRandom4} style={random4Style}>RANDOM 4</button>
            <button onClick={this.handleSP} style={spStyle}>SP</button>
            <button onClick={this.handlePASFA} style={pasfaStyle}>PASFA</button>
          </div>
        </div>

      </div>
    );
  }
}

export default App;
