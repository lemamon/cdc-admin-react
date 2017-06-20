import React from 'react';
import PubSub from 'pubsub-js';

export default class CustomSelect extends React.Component{
    
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
                <select id={this.props.id} value={this.props.value} name={this.props.name} onChange={this.props.onChange}>
                    <option value="">Selecione</option>
                    {
                        this.props.auths.map(auth => {
                            return <option key={auth.id} value={auth.id}>{auth.nome}</option>;
                        })  
                    }                    
                </select>
                <span className="error">{this.state.errorMsg}</span>                
            </div>
        );
    }


}