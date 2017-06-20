import React from 'react';

export default class CustomSubmit extends React.Component{
    render(){
        return(
            <div className="pure-control-group">                                  
                <label></label> 
                <button type={this.props.type} className={this.props.className}>{this.props.label}</button>                                    
            </div>
        );
    }
}