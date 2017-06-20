import React from 'react';
import jquery from 'jquery';
import CustomInput from './components/CustomInput';
import CustomSubmit from './components/CustomSubmit';
import CustomSelect from './components/CustomSelect';
import PubSub from 'pubsub-js';
import ErrosProcess from './ErrorsProcess';


export class BookForm extends React.Component {

    state = { 
        list : [], 
        title : '', 
        price : '', 
        authId : ''
    };
    
    sendForm = event => {
        event.preventDefault();
        console.log('sending data');

        jquery.ajax({
            url:'http://localhost:8080/api/livros',
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({
                titulo: this.state.title, 
                preco: this.state.price, 
                autorId: this.state.authId
            }),
            success: response => {
                console.log(response);
                PubSub.publish('response-book-list', response);
                this.setState({list : [], title : '', price : '', authId : ''});
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
                    <CustomInput id="titulo" type="text" name="titulo" value={this.state.title} onChange={(event)=>this.handleChange('title', event)} label="Titulo" />
                    <CustomInput id="preco" type="number" name="preco" value={this.state.price} onChange={(event)=>this.handleChange('price', event)} label="Preco" />   
                    <CustomSelect id="autorId" name="autorId" value={this.state.authId} onChange={(event)=>this.handleChange('authId', event)} label="Autor" auths={this.props.auths} />
                    <CustomSubmit type="submit" className="pure-button pure-button-primary" label="Gravar"/>
                </form>             
            </div>  
        );
    }
}

export class BookTable extends React.Component {

    render(){
        return( 
            <div>            
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Titulo</th>
                            <th>Preco</th>
                            <th>Autor</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.list.map(book => {
                            return (
                                <tr key={book.id}>
                                    <td>{book.titulo}</td>
                                    <td>{book.preco}</td>
                                    <td>{book.autor.nome}</td>
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


export default class BookBox extends React.Component{

    state = {
        list:[],
        authList:[],
    };

    componentDidMount = () => {
        jquery.ajax({
            url:'http://localhost:8080/api/autores',
            dataType: 'json',
            success: response => {
                this.setState({authList:response});
            }
        });

        PubSub.subscribe('response-auth-list', (topic,response) => {
            this.setState({authList: response});
        });

        jquery.ajax({
            url:'http://localhost:8080/api/livros',
            dataType: 'json',
            success: response => {
                this.setState({list:response});
            }
        });

        PubSub.subscribe('response-book-list', (topic,response) => {
            this.setState({list: response});
        });
    }

    render(){
        return(
            <div>
                <div className="header">
                    <h1>Livros</h1>
                </div>
                <div className="content" id="content">
                    <BookForm auths={this.state.authList}/>
                    <BookTable list={this.state.list}/>
                </div>
            </div>
        );
    };
}