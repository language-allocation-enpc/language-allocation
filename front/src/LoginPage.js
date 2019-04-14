import React, { Component } from 'react';
import './LoginPage.css';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {username: null, password: null, token: null};
      }
    
    getState=()=>{
        return this.state;
    }

    onSubmit=()=>{
        this.props.handlePageChange("questionnaire");//ajouter une requête
    }

    handleInputChange=(event)=>{
        const target = event.target;
        const value =  target.value;
        const name = target.name;

        let new_state= this.state;
        new_state[name]=value;
        this.setState(new_state);
    }

    render() {
      return (
        <div className="login-page"><LoginPageWelcomeMessage/><LoginPageForm handleInputChange={this.handleInputChange} getState={this.getState} onSubmit={this.onSubmit}/></div>
      );
    }
  }

class LoginPageWelcomeMessage extends Component {

    render() {
      return (
          <div className="login-page-welcome-message">
            <h2><p>Bienvenue sur le questionnaire en ligne pour l'attribution des cours de langues.</p><p> Veuillez vous identifier pour continuer.</p></h2>
          </div>
      );
    }
  }

class LoginPageForm extends Component {

    render() {
      return (
        <div className="login-page-form-box" >
          <form  className="login-page-form" onSubmit={this.props.onSubmit}>
            <label>Nom d'utilisateur</label>
            <input
                name="username"
                className="login-page-form-field"
                type="text"
                value={this.props.getState().username}
                onChange={this.props.handleInputChange} />
            <br/>
            <label>Mot de passe</label>
            <input
                name="password"
                className="login-page-form-field"
                type="password"
                value={this.props.getState().password}
                onChange={this.props.handleInputChange} />
            <br/>
            <input type="submit" value="Connexion" className="login-page-form-button"/>
        </form>
        </div>
      );
    }
  }

class LoginPageErrorMessage extends Component{

  render 
}

export default LoginPage;