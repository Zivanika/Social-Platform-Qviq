import React, { Component } from 'react'
import Loader from './Pulse.gif'

export default class BarLoader extends Component {
  render() {
    return (
      <div className="text-center">
        <img src={Loader} alt="Loading" className='h-12 w-20 mx-auto'/>
      </div>
    )
  }
}
