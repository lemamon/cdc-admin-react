import React from 'react';

export default class Home extends React.Component{
    render(){
        return(
            <div>
                <div className="header">
                <h1>Bem-Vindo Ao Sistema</h1>
                </div>
                <div className="content" id="content">
                </div>
            </div>
        );
    };
}