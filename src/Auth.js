import React from 'react';
import jquery from 'jquery';
import CustomInput from './components/CustomInput';
import CustomSubmit from './components/CustomSubmit';
import PubSub from 'pubsub-js';
import ErrosProcess from './ErrorsProcess';

export class AuthForm extends React.Component {

    state = { 
        list : [], 
        name : '', 
        email : '', 
        password : ''
    };
    
    sendForm = event => {
        event.preventDefault();
        console.log('sending data');

        jquery.ajax({
            url:'http://localhost:8080/api/autores',
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({
                nome: this.state.name, 
                email: this.state.email, 
                senha: this.state.password
            }),
            success: response => {
                PubSub.publish('response-auth-list', response);
                this.setState({list : [], name : '', email : '', password : ''});
            },
            error: response => {
                if(response.status === 400)
                    new ErrosProcess().errorsPublish(response.responseJSON);
            },
            beforeSend: () => {
                PubSub.publish('clear-errors',{});
            }
        });
    }

    handleChange = (name,event) => {
        this.setState({[name]: event.target.value});
    }

    render(){
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.sendForm} >
                    <CustomInput id="nome" type="text" name="nome" value={this.state.name} onChange={(event)=>this.handleChange('name', event)} label="Nome"/>
                    <CustomInput id="email" type="email" name="email" value={this.state.email} onChange={(event)=>this.handleChange('email', event)} label="email" />                  
                    <CustomInput id="senha" type="password" name="senha"  value={this.state.password} onChange={(event)=>this.handleChange('password', event)} label="senha"/>
                    <CustomSubmit type="submit" className="pure-button pure-button-primary" label="Gravar"/>
                </form>             
            </div>  
        );
    }
}

export class AuthTable extends React.Component {

    render(){
        return( 
            <div>            
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>email</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.list.map(function(author){
                            return (
                                <tr key={author.id}>
                                    <td>{author.nome}</td>
                                    <td>{author.email}</td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table> 
            </div> 
        );
    }
}

export default class AuthBox  extends React.Component{

    state = {
        list:[],
    };

    componentDidMount = () => {
        jquery.ajax({
            url:'http://localhost:8080/api/autores',
            dataType: 'json',
            success: response => {
                this.setState({list:response});
            }
        });

        PubSub.subscribe('response-auth-list', (topic,response) => {
            this.setState({list: response});
        });
    }

    render(){
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de autores</h1>
                </div>
                <div className="content" id="content">
                    <AuthForm/>
                    <AuthTable list={this.state.list}/>
                </div>
            </div>
        );
    };
}