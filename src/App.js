import React, { Component } from 'react';
import './App.css';

import Dropzone from 'dropzone';

import FDS from 'fds.js';

class App extends Component {

  constructor(props) {
    super(props);

    var urlParams = new URLSearchParams(window.location.search);
    let recipient = urlParams.get('recipient');

    this.state = {
      recipient: recipient,
      isSending: false,
      hasSent: false,
      feedback: '',
      uploaded: 0,
      found: false
    };

  }

  setFeedback(feedback){
    this.setState({
      feedback: feedback
    });
  }

  setUploaded(uploaded){
    this.setState({
      uploaded: uploaded
    });
  }  

  async setAccount(event){
    event.preventDefault();
    let account = event.target.value;
    let fds = new FDS();
    this.setState({
      found: false,
      finding: true,
      feedback: 'finding account...',
    })        
    let availiable = await fds.Account.isMailboxNameAvailable(account);
    if(availiable === false){
      this.setState({
        found: true,
        finding: false,
        feedback: 'account found! your Swarmhole is at...',
        swarmholeAddress: "https://swarmhole.com/?recipient="+account
      })      
    }else{
      this.setState({
        found: false,
        finding: false,
        feedback: 'couldn\'t find that account, please register at fairdrop.xyz',
        swarmholeAddress: "https://swarmhole.com/?recipient="+account
      })        
    }
  }

  componentDidMount(){

    let fds = new FDS();
    this.dropzone = new Dropzone(this.refs.dz, {
      url: 'dummy://', //dropzone requires a url even if we're not using it
      previewsContainer: false,
      clickable: true,
      maxFilesize: 1000,
      accept: async (file, done) => {

        this.setState({
          isSending: true,
          status: 'Creating Account'
        });

        //create account

        let random = Math.floor(Math.random() * 101010101);
        let account = await fds.CreateAccount(
          `${random}-swarmhole-throwaway`,
          '',
          this.setFeedback.bind(this)
        );

        this.setState({
          isSending: true,
          status: 'Sending'
        });

        //send file to server

        await account.send(
          'swarm19', 
          file, 
          this.setFeedback.bind(this), 
          this.setUploaded.bind(this),
          this.setFeedback.bind(this)
        );

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
                { this.state.recipient !== null && 
                  <div>
                      { this.state.isSending === false && this.state.isSending === false &&
                        <div>
                          <p>DROP A FILE HERE TO SEND TO...</p> 
                          <p>{this.state.recipient}.datafund.eth</p>
                        </div>
                      }
                      { (this.state.isSending !== false && this.state.hasSent === false) &&
                        <div>
                          <p>{this.state.status} <img className="Swarmhole-spinning-star" src="/fds-star-small.svg"/></p> 
                          <p className="feedback">{this.state.feedback}</p>
                          {this.state.uploaded > 0 &&
                            <p className="uploaded">{this.state.uploaded}%</p>
                          }
                        </div>
                      }
                      { this.state.hasSent !== false &&
                        <div>
                          <p>Sent!</p>
                        </div>
                      }
                    <p><a className="orange" target="_blank" href="https://swarmhole.com">get yours...</a></p>
                  </div>
                }
                { this.state.recipient === null && 
                  <div>
                    <div class="feedback">
                      <p>Enter your <a target="_blank" href="https://fairdrop.xyz">fairdrop.xyz</a><br/>account name...</p> 
                      <input type="text" onChange={this.setAccount.bind(this)}></input>
                        <p>
                          {this.state.feedback}
                          <br/>
                          { this.state.found &&
                            <a target="_blank" href={this.state.swarmholeAddress}>{this.state.swarmholeAddress}</a>
                          }
                        </p>
                    </div>
                  </div>
                }
              </div>
          </div> { /* Swarmhole-widget-wrapper */ }
        </div>
        <div className="Powered-by">
          powered by... <br/>
          <a target="_blank" href="https://github.com/fairDataSociety/fds.js">
            fds.js
          </a>
        </div>
      </div>
    );
  }
}

export default App;
