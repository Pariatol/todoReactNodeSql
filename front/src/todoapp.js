import React, {Component} from 'react';
import aXios from 'axios';

import './Todo.css'

export default class TodoApp extends Component{
    constructor(props){
        super(props);
        this.state = {
            items: [
                
            ],
            input:''
        }
    }

    componentDidMount(){
        aXios.get('http://localhost:8080/')
        .then(res => {
            console.log(res.data);
            this.setState({
                items:res.data
            })
    
    })
}

    move = (key) => {
        let filtered = this.state.items.map(item => {
            if(key==item.id){
                item.done = !item.done;
            }
            return item;
        })
        this.setState({
            items:filtered
        })

        aXios.get('http://localhost:8080/toggle/'+key)
        .then(res => {

            console.log("toggle : it works");
    
    })
    }


    handleChange = (e) => {
        console.log(e.target.value);
        this.setState({input: e.target.value});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let newItem = {
            text: this.state.input,
            done:false,
            id: new Date().getMilliseconds()
        }

        this.setState({items: [newItem].concat(this.state.items),
                       input:''});

        aXios.get('http://localhost:8080/add/'+this.state.input)
        .then(res => {

            console.log("add: it works");
    
    })
        
    }

    countHowManyUndone = () => {
        var count = 0;
        this.state.items.map(item => {
            if(item.done===false){
                count = count+1;
            }
        })
        return count;
    }

    deleteItem = (id) => {
        let newItems = this.state.items.filter(item => item.id !== id);
        this.setState({items: newItems});

        aXios.get('http://localhost:8080/delete/'+id)
        .then(res => {

            console.log("delete: it works");
        })
    }


    render(){
        return(
            <div className="container">
                <br/>
                <div className="row">
                    <div className="col-md-6">
                        <div className="todolist">
                        <h2>To Do</h2>
                        
                        <ul className="no-padding  not-done">
                            {
                                this.state.items.map(item => {
                                    if(item.done===false){
                                    return(
                                            <li className="list-unstyled taskToDo" key={item.id} >
                                                <label onClick={()=>this.move(item.id)}>{item.text}<span className="doneQuestion">&nbsp;&nbsp;Click if it's done</span></label>
                                                
                                            </li>
                                    );
                                }
                                })
                            }
                        </ul>
                        <form onSubmit={(e) => this.handleSubmit(e)}>
                            <input 
                            placeholder="add todo" name="todoSubmit" id="todoSubmit" value={this.state.input}className="form-control form-control-lg add-todo" 
                            onChange={(e) => this.handleChange(e)}></input>
                            
                        </form>
                        


                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="todolist">
                        <h2>Done !</h2>

                        <ul id="done-items">
                            {
                                this.state.items.map(item => {
                                    if(item.done===true){
                                    return(
                                            <li className="list-unstyled done" key={item.id}>
                                                <label>{item.text}</label>
                                                &nbsp;&nbsp;&nbsp;
                                                <button 
                                                className="btn btn-sm"
                                                onClick={()=>this.deleteItem(item.id)}>
                                                    <i className="fas fa-trash fa-sm"></i>
                                                </button>
                                            </li>
                                    );
                                }
                                })
                            }

                        </ul>
                        </div>
                    </div>
                </div>
                <div className="todo-footer">
                            <span>{
                            this.countHowManyUndone()
                            }</span> tasks left
                        </div>
            </div>
        );
    }
}