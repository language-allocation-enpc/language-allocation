import React, { Component } from 'react';
import './App.css';
import data_test from "./DummyData";
import creneaux_test from "./Creneaux";
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import url from "./url";
import "./MainContener.css"



class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { page: "Cours",data:[],id_course :0,creneaux:[]};
      }
     /* async componentDidMount() {
        const { data: data_serv } = await axios.get(url + "//");
        console.log(data_serv)
        let new_state = this.state;
        new_state.data=data_serv;
       this.setState(new_state);        
      }*/
      componentDidMount(){
        axios.get(url + "/creneaux/")
         .then(res => {let creneaux= res.data.result;
           let new_state = this.state;
           new_state.creneaux=creneaux;
           this.setState(new_state);})
        axios.get(url + "/courses/")
        .then(res => {let data_serv= res.data.result;
          let new_state = this.state;
          new_state.data=data_serv;
         this.setState(new_state);})
         
      }

    handlePageChange = page_name => {
        let new_state=this.state;
        new_state.page=page_name;
        this.setState(new_state);

    }
    get_data = ()=> {
        return this.state.data;
    }
  

    get_creneaux = ()=>{
      return this.state.creneaux;
    }

    set_data = (course)=>{
      axios.post(url + "/courses/" + course.id ,{name:course.name,language:course.language,creneaux:course.creneaux,min_students:course.min_students,max_students:course.max_students});
    }

    add_data = (course)=>{
      axios.put(url + "/courses/", {name:course.name,language:course.language,creneaux:course.creneaux,min_students:course.min_students,max_students:course.max_students});
    }

    get_id = ()=>{
      return this.state.id_course;
    }

    delete_course = index =>{ 
      //let alert_button = <div className='delete-button' onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) this.onCancel(item) } } />
      let new_state = this.state;
      new_state.data.splice(index,1);
      this.setState(new_state);
    }

    add_course = ()=>{
      let new_state = this.state;
      new_state.page="add";
      this.setState(new_state)
    }

    edit_course = id =>{
      let new_state = this.state;
      new_state.id_course = id;
      new_state.page="edit";
      this.setState(new_state);
    }
  render() {

      let page=null;
      if(this.state.page==="Cours"){
          page=<Cours get_data ={this.get_data} delete_course={this.delete_course} edit_course={this.edit_course} add_course={this.add_course} get_creneaux={this.get_creneaux}/>
      } else if(this.state.page==="login"){
        page=<LoginPage handlePageChange={this.handlePageChange}/>
      } else if(this.state.page === "edit"){
        page=<Edit handlePageChange={this.handlePageChange} get_id ={this.get_id} get_data = {this.get_data} set_data = {this.set_data} get_creneaux={this.get_creneaux}/>
      } else if (this.state.page === "add"){
        page=<Add handlePageChange={this.handlePageChange} add_data = {this.add_data} get_creneaux={this.get_creneaux}/>
      }

    return (
      <div className="main-container">{page}</div>
    );
  }
  }
  
  class LoginPage extends Component {
    render() {
      return (
        <div>nothing for the moment</div>
      );
    }
  }
  
  class Cours extends Component {
    render() {
      let L_creneaux = this.props.get_creneaux();
      let newdata=this.props.get_data();
        let cours_L=[];
        let add_button=<Button text = "+" onClick={()=>this.props.add_course()}/>
        cours_L.push(add_button);
        for(let index=0; index<newdata.length; index++){
          let quit_button=<Button text="x" onClick={()=>this.props.delete_course(index)}/>
          let course_info=[];
            course_info.push(<div  className="cours">
            <h1 className="name">{newdata[index].name}</h1>
            <p className="language">langue : {newdata[index].language}</p>
            {newdata[index].creneaux.map((id)=>{return <div><p> horaires : {L_creneaux[id].day}</p><p>{L_creneaux[id].begin} / {L_creneaux[id].end}</p></div>})}
            </div>)
            let change_button=<Button text="edit" onClick={()=>this.props.edit_course(index)}/>
            course_info.push(<div className = "buttons">{quit_button}{change_button}</div>)
          cours_L.push(<div className="course_info">{course_info}</div>)
          }
      return (
        <div className="cours_L">{cours_L}</div>
      );
    }
  }
  
  class Edit extends Component{
    constructor(props){
      super(props);
      this.state = {data:this.props.get_data()}
    }

    handleInputChange= (event) => {
      const target = event.target;
      const value = target.value;
      const id_cren = target.id;
      const name = target.name;
      let id = this.props.get_id();
      if (name === "changer_horaires"){
        let new_state = this.state;
        new_state.data[id].creneaux[id_cren]=parseInt(value);
        this.setState(new_state);
      }
      else if(name === "changer_nom"){
        let new_state = this.state;
        new_state.data[id].name=[value];
        this.setState(new_state);
      }
      else if (name === "changer_minimum"){
        let new_state = this.state;
        let parse = parseInt(value)

        if (isNaN(parse)===true){
          new_state.data[id].min_students=0;
          this.setState(new_state);
        }
        else if (typeof parse === "number"){
         new_state.data[id].min_students=[parse];
         this.setState(new_state);
          }
        }
      else if (name === "changer_maximum"){
        
        let new_state = this.state;
        let parse = parseInt(value)
        if (isNaN(parse)===true){
          new_state.data[id].max_students=0;
          this.setState(new_state);
        }
        else if (typeof parse === "number"){
         new_state.data[id].max_students=[parse];
         this.setState(new_state);
          }
        }
    }

    submit = () =>{
      let id = this.props.get_id();
      this.props.set_data(this.state.data[id]);
      this.props.handlePageChange("Cours");
    }

    render(){
      let id = this.props.get_id();
      let L_creneaux = this.props.get_creneaux();
      let change_course=[];
      let creneaux_op = [];
      for (let cren = 0;cren<L_creneaux.length; cren++){
        creneaux_op.push({ value:cren,label:L_creneaux[cren].day + " " + L_creneaux[cren].begin + " / " + L_creneaux[cren].end});
      }
      creneaux_op[0].label = "hors creneaux";
      change_course.push([<h1>changer cours</h1> ,<h2>{this.state.data[id].name}</h2>,<label>horaires : </label>,<div>{this.state.data[id].creneaux.map((cren)=>{
        return <select
        name="changer_horaires"
        type='select'
        value={cren}
        id = {this.state.data[id].creneaux.indexOf(cren)}
        onChange={this.handleInputChange} >
        {
            creneaux_op.map((creneaux)=>{
              return <option value ={creneaux.value} id = {this.state.data[id].creneaux.indexOf(cren)}>{creneaux.label} </option>;
            })
          }
           </select>
          })} </div>,<p><label>nom : </label><input
        name="changer_nom"
        type="text"
        value={this.state.data[id].name}
        onChange={this.handleInputChange} /> </p>,<p><label>changer la capacité : minimum :</label><input
        name = "changer_minimum"
        type = "text"
        value = {this.state.data[id].min_students}
        onChange = {this.handleInputChange} /><label> maximum : </label><input
        name = "changer_maximum"
        type = "text"
        value = {this.state.data[id].max_students}
        onChange = {this.handleInputChange} /> </p>])
        let submit_button = <Button text = "submit" onClick={this.submit}/>;
        change_course.push([submit_button]);
      return(<div className="changing_page">{change_course}</div>)
    }
  }

  class Add extends Component{
    constructor(props){
      super(props);
      this.state = {course:{id: 0, name: "", language: "", creneaux: [1], min_students:0,max_students:0}}
    }

    handleInputChange= (event) => {

      const target = event.target;
      const value = target.value;
      const id_cren = target.id;
      const name = target.name;

      if (name === "ajouter_horaires"){
        let new_state = this.state;
        console.log("value",value,id_cren)
        new_state.course.creneaux[id_cren]=parseInt(value);
        this.setState(new_state);
      }
      else if(name === "ajouter_nom"){
        let new_state = this.state;
        new_state.course.name=[value];
        this.setState(new_state);
      }
      else if (name === "ajouter_minimum"){
        let new_state = this.state;
        let parse = parseInt(value)

        if (isNaN(parse)===true){
          new_state.course.min_students=0;
          this.setState(new_state);
        }
        else if (typeof parse === "number"){
         new_state.course.min_students=[parse];
         this.setState(new_state);
          }
        }
      else if (name === "ajouter_maximum"){
        
        let new_state = this.state;
        let parse = parseInt(value)
        if (isNaN(parse)===true){
          new_state.course.max_students=0;
          this.setState(new_state);
        }
        else if (typeof parse === "number"){
         new_state.course.max_students=[parse];
         this.setState(new_state);
          }
        }
      }
    

    submit = () =>{

      this.props.add_data(this.state.course);
      this.props.handlePageChange("Cours");
    }

    change_nb_créneaux = (event)=>{
      const value = parseInt(event.target.value);
      let new_state = this.state;
      if (value === 1){
        new_state.course.creneaux = [1];
        }
      else if (value === 2){
        new_state.course.creneaux = [1,1];
      }
      this.setState(new_state);
    }

    render() {
      let add_course=[];
      let L_creneaux = this.props.get_creneaux();
      let creneaux_op = [];
      for (let cren = 0;cren<L_creneaux.length; cren++){
        creneaux_op.push({ value:cren,label:L_creneaux[cren].day + " " + L_creneaux[cren].begin + " / " + L_creneaux[cren].end});
      }
      creneaux_op[0].label = "hors creneaux";
      add_course.push([<h1>ajouter cours</h1> ,<label>nombre de créneaux</label>,<select
        name="nombre_créneaux"
        type="select"
        value={this.state.course.creneaux.length}
        onChange={this.change_nb_créneaux}>
        <option value={1}>1</option>
        <option value={2}>2</option></select>
        ,<div>{this.state.course.creneaux.map((cren)=>{
          return <select
          name="ajouter_horaires"
          type='select'
          value={cren}
          id={this.state.course.creneaux.indexOf(cren)}
          onChange={this.handleInputChange} >
          {
              creneaux_op.map((creneaux)=>{
                return <option value ={creneaux.value} id = {this.state.course.creneaux.indexOf(cren)}>{creneaux.label} </option>;
              })
            }
             </select>
            })} </div>,<p><label>nom : </label><input
        name="ajouter_nom"
        type="text"
        value={this.state.course.name}
        onChange={this.handleInputChange} /> </p>,<p><label>capacité : minimum :</label><input
        name = "ajouter_minimum"
        type = "text"
        value = {this.state.course.min_students}
        onChange = {this.handleInputChange} /><label> maximum : </label><input
        name = "ajouter_maximum"
        type = "text"
        value = {this.state.course.max_students}
        onChange = {this.handleInputChange} /> </p>])
        let submit_button = <Button text = "submit" onClick={()=>this.submit()}/>;
        add_course.push([submit_button]);
      return(<div className="adding_page">{add_course}</div>)
    }
  }

  class Button extends Component {
    render() {
      return (
        <button className="button" onClick={this.props.onClick}>{this.props.text}</button>
      );
    }
  }


  class alert extends React.Component {
    submit = () => {
      confirmAlert({
        title: 'Confirm to submit',
        message: 'Are you sure to do this.',
        buttons: [
          {
            label: 'Yes',
            onClick: () => alert('Click Yes')
          },
          {
            label: 'No',
            onClick: () => alert('Click No')
          }
        ]
      });
    };
   
    render() {
      return (
        <div className='alert'>
          <button onClick={this.submit}>Confirm dialog</button>
        </div>
      );
    }
  }
  export default MainContainer;
  