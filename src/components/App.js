import React, { Component } from 'react';
import Scatter from './Scatter';

const editions = ['1249','1253','1256','1265','1294','1295','1296','1297',
                  '1298','1299','1300','1301','1313','1324','1327','1331',
                  '1335','1348','1358','1359','1360','1361','1362','1363',
                  '1364','1365','1366','1367','1368','1387','1403','2589',
                  '2591','2592','2594','2595','2596','2597','2598','2599',
                  '2600','2601','2602','2603','2605','2606','2607','2608',
                  '2609','2610'];

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
      random3: false,
      random4: false,
      model: 'random1',
      tduration: 5000,
      highlight: false,
      edition: '1249'
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
    this.handleEdition = this.handleEdition.bind(this);
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

  handleEdition() {
    let randomEdition = editions[Math.floor(Math.random()*editions.length)];
    console.log(randomEdition);

    this.setState(state => ({
      edition: randomEdition
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

    const editionStyle = {
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
            edition={this.state.edition}
          />
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
        <div className='upperpanel'>
          <div className='buttonStrip'>
            <button onClick={this.handleHighlight} style={highlightStyle}>HIGHLIGHT</button>
            <button onClick={this.handleEdition} style={editionStyle}>EDITION</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
