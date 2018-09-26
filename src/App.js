import React, { Component } from 'react';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import ServiceHandler from './scripts/utils/ServiceHandler';
import './scripts/utils/digio';
import config from './scripts/utils/config'

window.$ = window.jQuery = require('jquery');

class App extends Component {

  state = {
    status: 1,
    id: null,
    fileName: null,
    digio: null,
    pageNumber: null,
    numPages: null
  }

  onProceed = () => {
    this.setState({
      emailMobile: document.getElementById('emailMobile').value,
      status: 2
    });
  }

  onUploadSuccess = (response) => {
    if (response && response.data && response.data.id) {
      this.setState({ id: response.data.id, fileName: response.data.file_name });
      this.state.digio.esign(response.data.id, this.state.emailMobile);
    } else {
      this.state.digio.cancel();
    }
  }

  onUploadFailure = (response) => {
    this.state.digio.cancel();
  }

  onLoadSuccess = (page) => {
    this.setState({ numPages: page.numPages, pageNumber: 1 })
  }

  uploadDocument = () => {
    let options = {
      callback: (t) => {
        if (t.hasOwnProperty('error_code')) {
          document.getElementById("loading").style.display = 'none';
          document.getElementById("result").innerHTML = "failed to sign with error : " + t.message;
        }
        else {
          this.setState({ status: 3 });
        }
      },
      logo: "http://pharmacyvials.com/assets/images/yourlogohere.jpg"
    };

    this.state.digio = new Digio(options);
    this.state.digio.init();
    document.getElementById("result").innerHTML = "";
    document.getElementById("loading").style.display = 'block';

    ServiceHandler.post({
      url: "uploadagreement",
      data: {
        emailMobile: document.getElementById('emailMobile').value
      }
    }, this.onUploadSuccess, this.onUploadFailure)
  }

  render() {
    return (
      <div className="container">
        <div className="row col-sm-12">
          {
            this.state.status == 1 ?
              <div className='col-xs-10 col-sm-4 offset-sm-4 offset-xs-1' style={{ marginTop: '100px' }}>
                <div className="form-group">
                  <label htmlFor="email">Email address / Mobile:</label>
                  <input type="email" className="form-control" id="emailMobile" />
                </div>
                {/* <div id='loading'></div> */}
                {/* <div id='result'></div> */}
                <button type="submit" className="btn btn-primary" onClick={this.onProceed}>Submit</button>
              </div>
              :
              this.state.status == 2 ?
                <div className="col-sm-12">
                  <div id='loading'></div>
                  <div className='col-xs-12 col-sm-8 offset-sm-2 offset-xs-0' style={{ height: 'calc(100vh - 130px)', overflow: 'auto' }}>

                    <Document file={config.baseUrl + '/getagreement'} onLoadSuccess={this.onLoadSuccess}>
                      <Page pageNumber={this.state.pageNumber} />
                    </Document>

                  </div>

                  <div className="sign-button col-12">
                    {this.state.pageNumber}/{this.state.numPages}
                    <a onClick={() => this.state.pageNumber > 1 ? this.setState({ pageNumber: this.state.pageNumber - 1 }) : null} className={"fas fa-arrow-alt-circle-left " + (this.state.pageNumber > 1 ? '' : 'disabled')}></a>
                    <a onClick={() => this.state.numPages > this.state.pageNumber ? this.setState({ pageNumber: this.state.pageNumber + 1 }) : null} className={"fas fa-arrow-alt-circle-right " + (this.state.numPages > this.state.pageNumber ? '' : 'disabled')}></a>

                    <div id='result'></div>
                    <button type="button" id='link' className="btn btn-primary" onClick={this.uploadDocument}>Proceed to esign</button>
                  </div>
                </div>
                :

                this.state.status == 3 ?

                  <div className='success-message'>
                    Agreement has been signed successfully. <a href={config.baseUrl + '/downloadagreement?id=' + this.state.id + '&fileName=' + this.state.fileName}>Click here</a> to download your signed document
                </div>

                  : null
          }

        </div>
      </div>
    )
  }
}

export default App;
