import React, { Component } from 'react';
import './App.css';

import Dropzone from 'dropzone';

import FDS from 'fds.js';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isSending: false,
      hasSent: false
    };

  }

  componentDidMount(){

    let fds = new FDS();
    this.dropzone = new Dropzone(this.refs.dz, {
      url: 'dummy://', //dropzone requires a url even if we're not using it
      previewsContainer: false,
      maxFilesize: 1000,
      accept: async (file, done) => {

        this.setState({
          isSending: true
        });

        //send file to server     

        let random = Math.floor(Math.random() * 101010101);
        let account = await fds.CreateAccount(`${random}-swarmhole-throwaway`,'');
        await account.send('swarm19', file);           

        this.setState({
          hasSent: true
        });
      }
    });
  }


  render() {
    return (
      <div className="App-Wrapper">
        <div className={"Swarmhole-spinner " + (false ? 'Swarmhole-in' : 'Swarmhole-out')}>
        </div>
        <div className="Swarmhole container" ref="dz">
          <div className="Swarmhole-logo"><a href="/"><img src="/swarmhole.svg" alt="Swarmhole-logo"/></a></div>
          <div className="Swarmhole-widget-wrapper col-lg-6 col-sm-8">
              <div className="Swarmhole-widget-inner">
                { this.state.isSending === false && this.state.isSending === false &&
                  <div>
                    <p>DROP FILE HERE TO SEND TO</p> 
                    <p>swarm19.datafund.eth</p>
                  </div>
                }
                { (this.state.isSending !== false && this.state.hasSent === false) &&
                  <div>
                    <p>Sending <img className="Swarmhole-spinning-star" src="/fds-star-small.svg"/></p> 
                  </div>
                }
                { this.state.hasSent !== false &&
                 <div>
                    <p>Sent!</p>
                  </div>
                }
              </div>
          </div> { /* Swarmhole-widget-wrapper */ }
        </div>
      </div>
    );
  }
}

export default App;
