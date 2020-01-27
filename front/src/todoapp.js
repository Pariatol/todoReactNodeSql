import React, {Component} from 'react';
import aXios from 'axios';
import Cookies from 'js-cookie';

import './Todo.css'

export default class TodoApp extends Component{
    constructor(props){
        super(props);
        this.state = {
            items: [
                
            ],
            input:'',
            toggleSignIn:false,
            toggleLogIn:false,
            user:Cookies.get('user'),
            username:'',
            givenPwd:''
        }
    }

    componentDidMount(){
        if(this.state.user!==undefined){
        console.log("allons récup les données de "+this.state.user)
        aXios.get('http://localhost:8080/get/'+this.state.user)
        .then(res => {
            console.log(res.data);
            this.setState({
                items:res.data
            })
    
    })

    }//end if condition
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

        if(this.state.user!==undefined){            
        aXios.get('http://localhost:8080/add/'+this.state.input+'/'+newItem.id+'/'+this.state.user)
        .then(res => {

            console.log("add: it works");
    
            })
        }
        
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

    showSignIn = () => {
        this.setState({toggleSignIn: !this.state.toggleSignIn})
    }

    showLogIn = () => {
        this.setState({toggleLogIn: !this.state.toggleLogIn})
    }

    checkPwd = (e) => {
        aXios.get('http://localhost:8080/getpwd/'+this.state.username)
        .then(res => {
            // the pwd should be sent encrypted (for a further version...)
            console.log(res.data);
            if(res.data===this.state.givenPwd){

                console.log("yeah ! good pwd, login successful")
                Cookies.set('user', this.state.username);
                e.preventDefault();

            } else {
                e.preventDefault();
                alert("Wrong password. Please try again.");
            }
    
    })
    }

    getUsername = (e) => {
        this.setState({
            username:e.target.value
        })
    }

    getPwd = (e) => {
        this.setState({
            givenPwd:e.target.value
        })
    }

    closeSession = () => {
        Cookies.remove('user');
        this.setState({
            user:undefined,
            items:[]
        });

    }


    render(){

        return(
            <React.Fragment>

            {this.state.user===undefined?<div className="login text-right connexion"><button className="btn btn-primary" onClick={this.showLogIn}>Log in</button> 
            <button className="btn btn-primary connexion" onClick={this.showSignIn}>Sign in</button>
            </div>:null }

            {/* <div className="login text-right connexion"><button className="btn btn-primary" onClick={this.showLogIn}>Log in</button> 
            <button className="btn btn-primary connexion" onClick={this.showSignIn}>Sign in</button>
            </div> */}
            
            {this.state.user!==undefined?<LogOut closeSession={this.closeSession}/>:null}

            {this.state.toggleSignIn?<SignIn showSignIn={this.showSignIn} signIn={this.signIn}/>:null}
            {this.state.toggleLogIn?<LogIn showLogIn={this.showLogIn} checkPwd={this.checkPwd} getPwd={this.getPwd} getUsername={this.getUsername}/>:null}



            <h1 className="text-center">The best Todo App ever</h1>
            {this.state.user!==undefined?<h4 className="text-center">Connected as {this.state.user}</h4>:null}

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
                            <input type="submit" id="submitTodo" value="Add" className="center-block"/>
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
            </React.Fragment>
        );
    }
}


class LogIn extends Component {

    constructor(props){
        super(props);
        this.state = {
            username:'',
            givenPwd:''
        }
    }    





    render() {
        return (
            <React.Fragment>
                <div id="loginBox" className="container">
                <div className="cancelButton text-right" ><i onClick={this.props.showLogIn} className="far fa-window-close fa-lg"></i></div>

                    <form onSubmit={(e)=>this.props.checkPwd(e)}>
                        <input placeholder="email" type="email" name="emailSubmit" id="emailSubmit" className="form-control" onChange={(e)=>this.props.getUsername(e)}></input>
                        <input placeholder="pwd" type="password" name="pwdSubmit" id="pwdSubmit" className="form-control" onChange={(e)=>this.props.getPwd(e)}></input>
                        <input type="submit" value="Submit" className="center-block"/>
        
                    </form>
                </div>
            </React.Fragment>
        )
    }
}

class SignIn extends Component {

    constructor(props){
        super(props);
        this.state = {
            pwd1:'',
            pwd2:''
        }
    }
    
    setCookie = (e) => {
        Cookies.set('user', e.target.value);

    }



    savePwd1 = (e) => {
        this.setState({
            pwd1:e.target.value
        })
    }

    savePwd2 = (e) => {
        this.setState({
            pwd2:e.target.value
        })
    }

    testPwd = (e,first,second) => {
        console.log(first);
        console.log(second);
        if(first!==second){
            e.preventDefault();
            alert("Problem with your password. Please try again.");
        }
    }
    // onChange={(e)=>this.setCookie(e)}

    render() {
        return (
            <React.Fragment>
                <div id="loginBox" className="container">
                <div className="cancelButton text-right" ><i onClick={(e) => this.props.showSignIn(e)} className="far fa-window-close fa-lg"></i></div>

                    <form method="post" action="http://localhost:8080/createuser" onSubmit={(e)=>this.testPwd(e,this.state.pwd1,this.state.pwd2)}>
                        <input placeholder="Your email" type="email" name="emailsubmit" id="emailsubmit" className="form-control"  onChange={(e)=>this.setCookie(e)}></input>
                        <input placeholder="Enter A Password" type="password" name="pwdSubmit" id="pwdSubmit" className="form-control" onChange={(e)=>this.savePwd1(e)}></input>
                        <input placeholder="Enter This Password Again" type="password" name="pwdSubmitAgain" id="pwdSubmitAgain" className="form-control" onChange={(e)=>this.savePwd2(e)}></input>
                        <input type="submit" value="Submit" className="center-block" />
                    </form>
                </div>
            </React.Fragment>
        )
    }
}

class LogOut extends Component {

    
    render() {
        return (
            <div>
                <div className="text-right logout"><button className="btn btn-primary" onClick={this.props.closeSession}>Log out</button>
                </div>
            </div>
        )
    }
}
