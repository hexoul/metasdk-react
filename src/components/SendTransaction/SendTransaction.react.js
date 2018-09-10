import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class SendTransaction extends Component {
  static propTypes = {
    request: PropTypes.array,
    service: PropTypes.string,
    callback: PropTypes.func,
  }

  constructor() {
    super();
  }

  render() {
    return (
      <div>
        SendTransaction
      </div>
    )
  }
}
