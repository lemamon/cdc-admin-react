import React from 'react';
import PubSub from 'pubsub-js';

export default class CustomInput extends React.Component{
    
    state = {
        errorMsg : '',
    };
    
    componentDidMount = () => {
        PubSub.subscribe('validation-error',(topic, error)=>{
            if(error.field === this.props.name)
                this.setState({errorMsg : error.defaultMessage});
        });

        PubSub.subscribe('clear-errors', topic => {
            this.setState({errorMsg:''});
        });
    }

    render(){
        return(
            <div className="pure-control-group">
                <label htmlFor={this.props.id}>{this.props.label}</label> 
                <input {... this.props} />                  
                <span className="error">{this.state.errorMsg}</span>
            </div>
        );
    }


}