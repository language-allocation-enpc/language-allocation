import React, {Component} from 'react';
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import url from "./url";

axios.defaults.withCredentials = true
class AdminPage extends Component {
  constructor(props) {
      super(props);
      this.state = {token:window.sessionStorage.getItem("jwt_token"), isAuth:null};

    }


  componentDidMount(){
    axios.get(url+'admin/check-auth', {withCredentials:true, headers:{Authorization: 'Bearer '+this.state.token}}).then(
      (res)=>{
        this.setState({isAuth:true});
        console.log("Successfully authentified")
    },
      (err)=>{
        console.log("in the error loop")
        this.setState({isAuth:false});
        this.props.history.push('/admin/login')
      }
    )
  }

  getAuth=()=>{
    axios.get(url+'admin/check-auth', {withCredentials:false, Authorization: 'Bearer '+this.state.token}).then(
      (res)=>{
        this.state.isAuth=true;
        return true;
    },
      (err)=>{
        console.log(err);
        this.state.isAuth=false;
        return false;
      }
    )
  }

  logout=()=>{
    axios.delete(url+'admin/logout', {withCredentials:false, Authorization: 'Bearer '+this.state.token}).then(
      (res)=>{
        this.state.isAuth=false;
        this.props.history.push('/admin/login');
    },
      (err)=>{
        console.log(err);
        this.state.isAuth=false;
        this.props.history.push('/admin/login');
      }
    )
  }


  render() {
      if (this.state.isAuth){
        return (
        <div className="buttonList" style={{
          textAlign:'center',
        position: 'absolute', left: '50%', top: '40%',
        transform: 'translate(-50%, -50%)'
    }}><h2>Bienvenue sur le portail de gestion du questionnaire de langues de la DLC<br/><br/></h2>
        <form>
        <input type="button" style={{  backgroundColor: "#4CAF50",border: "none",color: "white",padding: "15px 32px",textAlign: "center",textDecoration: "none",display: "inlineBlock",fontSize: "16px"}} value="Gestion des Cours" onClick={()=>window.location.href='/admin/manage-courses'} />
        </form>
        <br/>
        <form>
        <input type="button" style={{  backgroundColor: "#4CAF50",border: "none",color: "white",padding: "15px 32px",textAlign: "center",textDecoration: "none",display: "inlineBlock",fontSize: "16px"}} value="Gestion des étudiants" onClick={()=>window.location.href='/admin/manage-students'} />
        </form>
        <br/>
        <form>
        <input type="button" style={{  backgroundColor: "#4CAF50",border: "none",color: "white",padding: "15px 32px",textAlign: "center",textDecoration: "none",display: "inlineBlock",fontSize: "16px"}} value="Résultats" onClick={()=>window.location.href='/admin/get-affect'} />
        </form>
        <br/>
        <form>
        <input type="button" style={{  backgroundColor: "#BB3C21",border: "none",color: "white",padding: "15px 32px",textAlign: "center",textDecoration: "none",display: "inlineBlock",fontSize: "16px"}} value="Se déconnecter" onClick={()=>window.location.href='/admin/login'} />
        </form>
        </div>
      )
    }
    else{
      return(<div>En cours d'authentification</div>)
    }

  }
}

export default AdminPage;
