import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'font-awesome/css/font-awesome.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'Assets/css/App.scss';
window.$ = window.jQuery = require('jquery');

ReactDOM.render(<App />, document.getElementById('root'));
