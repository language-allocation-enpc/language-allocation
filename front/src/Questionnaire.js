import React, { Component } from 'react';
import axios from 'axios';
import dummyData from "./DummyData";
import url from "./url";
import vowGenerator from "./VowGenerator";
import error_panel from './images/error_panel.png';
import './Questionnaire.css';
import queryString from 'query-string'
import Cookies from 'js-cookie';

class Questionnaire extends Component {
    constructor(props) {
        super(props);
        this.state = { data: {courses: dummyData, schedules: [], user_id: null, user_name: null, user_vows: null}, is_loaded: false, step_list: ["initial_questions"], step_index: 0, answers_are_sent: false, answers: { year: '', TOEIC: '', justification_no_english: '', justification_no_english_text: '', number_english_courses: 1, number_other_courses: 0, english_courses_ranking:[], other_courses_ranking:[]}};

      }

    getUser(key){
      let res = Cookies.get('user_'+key);
      return res
    }

    componentDidMount(){
      let new_state=this.state;
      new_state.data.user_name=window.sessionStorage.getItem("name");
      new_state.data.user_email = window.sessionStorage.getItem("email");
      new_state.data.vows=window.sessionStorage.getItem("vows");
      new_state.is_loaded=true
      this.setState({
        new_state
      });



      axios.get(url+"courses/")
      .then(
        (result) => {
          let new_state=this.state;
          new_state.data.courses=result.data.result
          new_state.is_loaded=true
          this.setState({
            new_state
          });
        },
        (error) => {
          this.setState({
            is_loaded: false
          });
        }
      );
      axios.get(url+"creneaux/")
      .then(
        (result) => {
          let new_state=this.state;
          new_state.data.schedules=result.data.result
          new_state.is_loaded=true
          this.setState({
            new_state
          });
        },
        (error) => {
          this.setState({
            is_loaded: false
          });
        }
      );

      //this.setState({data: dummyData})
    }

    buildStepList=(answers)=>{
      let step_list=["initial_questions"];
      if(answers.number_english_courses>0){
        step_list.push("ranking_english_courses");
      }
      if(answers.number_other_courses>0){
        step_list.push("ranking_other_courses");
      }
      step_list.push("final_question")
      return step_list
    }

    getStepIndex=()=>{return this.state.step_index;}

    getUserName=()=>{return this.state.data.user_name;}

    handleStepChange = (direction) => {
      if(direction==="previous"&&this.state.step_index>0){
        this.setState({step_index: this.state.step_index-1});
      } else if(direction==="next"&&this.state.step_index<this.state.step_list.length-1){
        this.setState({step_index: this.state.step_index+1});
      }
    }

    getStepList=()=>{return this.state.step_list;}

    setStepList=(new_step_list)=>{this.setState({step_list: new_step_list});}

    getAnswers=()=>{ return this.state.answers;}

    setAnswers=(new_answers)=>{
      let new_step_list=this.buildStepList(new_answers);
      this.setState({answers: new_answers, step_list: new_step_list});
    }

    getAnswersAreSent=()=>{
        return this.state.answers_are_sent;
    }

    sendAnswers=()=>{
      let answers=this.state.answers;
      let user_vows=vowGenerator(answers.number_english_courses, answers.number_other_courses, answers.english_courses_ranking, answers.other_courses_ranking, this.state.data.schedules)
      let new_state=this.state;
      new_state.data.user_vows=user_vows;
      this.setState(new_state);
      console.log(user_vows)
      this.setState({answers_are_sent: true})
    }

    getSchedules = ()=>{
      return this.state.data.schedules;
    }

    render() {
        let data=this.state.data;
        let step=null;
        let current_step_name=this.state.step_list[this.state.step_index];
        if(current_step_name==="initial_questions"){
          step=<InitialQuestions
          getStepIndex={this.getStepIndex}
          getUserName = {this.getUserName}
          handleStepChange={this.handleStepChange}
          getStepList={this.getStepList}
          setStepList={this.setStepList}
          getAnswers={this.getAnswers}
          setAnswers={this.setAnswers}
          />;
        }else if(current_step_name==="ranking_english_courses"){
          let list_english_courses=data.courses.filter(function(value, index, arr){return value.language==="Anglais";});
          step=<CourseRankingQuestion
          instructions="Veuillez ordonner les cours d'Anglais par ordre de préférence"
          courses={list_english_courses}
          key="english_courses_ranking"
          answer="english_courses_ranking"
          getStepIndex={this.getStepIndex}
          handleStepChange={this.handleStepChange}
          getStepList={this.getStepList}
          setStepList={this.setStepList}
          getAnswers={this.getAnswers}
          setAnswers={this.setAnswers}
          getSchedules={this.getSchedules}
          />;
        }else if(current_step_name==="ranking_other_courses"){
          let list_other_courses=data.courses.filter(function(value, index, arr){return value.language!=="Anglais";});
          step=<CourseRankingQuestion
          instructions="Veillez classer les autres cours par ordre de préférence"
          courses={list_other_courses}
          key="other_courses_ranking"
          answer="other_courses_ranking"
          getStepIndex={this.getStepIndex}
          handleStepChange={this.handleStepChange}
          getStepList={this.getStepList}
          setStepList={this.setStepList}
          getAnswers={this.getAnswers}
          setAnswers={this.setAnswers}
          getSchedules={this.getSchedules}
          />;
        }else if(current_step_name==="final_question"){
            step=<FinalQuestion
            instructions="Ce questionnaire est maintenant terminé. Veuillez envoyer vos réponses pour que celles-ci soient prises en compte."
            key="final-question"
            getStepIndex={this.getStepIndex}
            handleStepChange={this.handleStepChange}
            getStepList={this.getStepList}
            setStepList={this.setStepList}
            getAnswersAreSent={this.getAnswersAreSent}
            sendAnswers={this.sendAnswers}
            />;
          }
      return (
        <div className="questionnaire">{step}</div>
      );
    }
  }

class InitialQuestions extends Component {

  constructor(props) {
    super(props);
    this.state = {error_messages: []};
  }

  handleInputChange= (event) => {
    const target = event.target;
    const value = target.type === 'number' ? Math.min(Math.max(target.value, 0), 4) : (target.type==='text' ? target.value.substring(0,200) : target.value);
    const name = target.name;

    let new_answers= this.props.getAnswers();
    new_answers[name]=value;
    this.props.setAnswers(new_answers);
  }

  verificationFunction =()=>{
    let answers=this.props.getAnswers();
    let all_questions_answered_properly=(answers.year!=='')&&(answers.TOEIC!=='')&&!((answers.number_english_courses===0)&&(answers.justification_no_english===''))&&!((answers.number_english_courses===0)&&(answers.justification_no_english==='Autre')&&(answers.justification_no_english_text===''));
    let current_error_messages=[];
    if(!all_questions_answered_properly){
      current_error_messages.push(<ErrorMessage text="Veuillez répondre à toutes les questions de cette page."/>);
    }
    this.setState({error_messages: current_error_messages});
    //ajouter d'autres erreurs éventuelles
    return all_questions_answered_properly;
  }

  render() {
    let additionnal_question_about_english_courses=[];
    if(this.props.getAnswers().number_english_courses<1)
    {
      additionnal_question_about_english_courses.push(
        [
        <label>Veuillez justifier l'absence de cours d'anglais dans vos choix.</label>,
        <select
          name="justification_no_english"
          type='select'
          className="questionnaire-form-select"
          value={this.props.getAnswers().justification_no_english}
          onChange={this.handleInputChange} >
          <option value="" selected disabled hidden>Choisir</option>
          <option value="Je suis le CIM ou j'ai validé le CIM">Je suis le CIM ou j'ai validé le CIM</option>
          <option value="J'ai validé tous mes ECTS d'Anglais et l'obligation TOEIC">J'ai validé tous mes ECTS d'Anglais et l'obligation TOEIC</option>
          <option value='Je dois me concentrer sur ma LV2 ce semestre'>Je dois me concentrer sur ma LV2 ce semestre</option>
          <option value="Je suis des cours hors ENPC">Je suis des cours hors ENPC</option>
          <option value="Je ne suis pas à l'ENPC ce semestre">Je ne suis pas à l'ENPC ce semestre</option>
          <option value="Je suis stagiaire étranger(e)">Je suis stagiaire étranger(e)</option>
          <option value='Autre'>Autre</option>
        </select>,
        <br/>
        ]
      );
    }
    if((this.props.getAnswers().number_english_courses<1)&&(this.props.getAnswers().justification_no_english==="Autre"))
    {
      additionnal_question_about_english_courses.push(
      [
      <label>Veuillez préciser cette autre raison.</label>,
      <input
        name="justification_no_english_text"
        type="text"
        className="questionnaire-form-text"
        value={this.props.getAnswers().justification_no_english_text}
        onChange={this.handleInputChange} />,
        <br/>
      ]
      );
    }
    let instructions="Bienvenue "+this.props.getUserName()+". Veuillez répondre aux questions suivantes. Il vous sera demandé de classer les cours par ordre de préférence dans la suite du questionnaire.";
    if(this.state.error_messages.length>0){
      instructions=this.state.error_messages;
    }
    return (
      <div className="question">
      <QuestionInstructions text={instructions}/>
      <div className="question-content">
      <form className="initial-questions-form">
        <label>
          En quelle année êtes-vous ? </label>
          <select
            name="year"
            type='select'
            className="questionnaire-form-select"
            value={this.props.getAnswers().year}
            onChange={this.handleInputChange} >
            <option value="" disabled hidden>Choisir</option>
            <option value='1A'>1A</option>
            <option value='2/3A'>2/3A</option>
            <option value='Cycle Master'>Cycle Master</option>
          </select>
          <br/>
        <label>
          Quelle note avez-vous obtenue au TOEIC ? </label>
          <select
            name="TOEIC"
            type='select'
            className="questionnaire-form-select"
            value={this.props.getAnswers().TOEIC}
            onChange={this.handleInputChange} >
            <option value="" disabled hidden>Choisir</option>
            <option value='moins de 650'>moins de 650</option>
            <option value='entre 650 et 785'>entre 650 et 785</option>
            <option value='plus de 785'>plus de 785</option>
          </select>
          <br/>
        <label>
          Combien de cours d'Anglais souhaitez-vous suivre ? (Attention, une justification sera demandée si vous ne souhaitez pas en suivre)</label>
          <input
            name="number_english_courses"
            type="number"
            className="questionnaire-form-number"
            value={this.props.getAnswers().number_english_courses}
            onChange={this.handleInputChange} />
          <br/>
        {additionnal_question_about_english_courses}
        <label>
          Combien de cours de langues différentes de l'anglais souhaitez-vous suivre ?</label>
          <input
            name="number_other_courses"
            type="number"
            className="questionnaire-form-number"
            value={this.props.getAnswers().number_other_courses}
            onChange={this.handleInputChange} />
      </form>
      </div>
      <QuestionFooter handleStepChange={this.props.handleStepChange} getStepList={this.props.getStepList} getStepIndex={this.props.getStepIndex} verificationFunction={this.verificationFunction}/>
      </div>
    );
  }
}

class CourseRankingQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {error_messages: []};
      }

    setRanking=(new_ranking)=>{
      let new_answers=this.props.getAnswers();
      new_answers[this.props.answer]=new_ranking;
      this.props.setAnswers(new_answers)
    }

    getRanking=()=>{
      return this.props.getAnswers()[this.props.answer];
    }

    handleAddCourseToRanking = course =>{
        if(!(this.getRanking().includes(course))){
            let new_ranking=this.getRanking();
            new_ranking.push(course);
            this.setRanking(new_ranking);
        }
    }

    handleRankUp = (index_in_ranking) =>{//fait gagner une place dans le classement
        if(index_in_ranking>0){
            let new_ranking=this.getRanking();
            let course_to_move=this.getRanking()[index_in_ranking];//swap
            new_ranking[index_in_ranking]=new_ranking[index_in_ranking-1];
            new_ranking[index_in_ranking-1]=course_to_move;
            this.setRanking(new_ranking);
        }
    }

    handleRankDown = (index_in_ranking) =>{//fait perdre une place dans le classement
        if(index_in_ranking<this.getRanking().length-1){
          let new_ranking=this.getRanking();
          let course_to_move=this.getRanking()[index_in_ranking];//swap
          new_ranking[index_in_ranking]=new_ranking[index_in_ranking+1];
          new_ranking[index_in_ranking+1]=course_to_move;
          this.setRanking(new_ranking);
      }
    }

    handleDeletionFromRanking =(index_in_ranking)=>{
        let new_ranking=this.getRanking();
        new_ranking.splice(index_in_ranking, 1);
        this.setRanking(new_ranking);
    }

    verificationFunction=()=>{
        let answers = this.props.getAnswers();
        let current_error_messages=[];
        let all_is_right=true;
        if(answers[this.props.answer].length===0){//classement vide affiche un message d'erreur
            current_error_messages.push(<ErrorMessage text="Attention ! Vous n'avez classé aucun cours ! Veuillez modifier le nombre de cours en début de questionnaire si vous ne souhaitez en suivre aucun dans cette catégorie."/>);
            all_is_right=false;
        }
        this.setState({error_messages: current_error_messages});
        return all_is_right;
    }

    render() {
        let instructions=this.props.instructions;
        if(this.state.error_messages.length>0){
            instructions=this.state.error_messages;
          }
      return (
        <div className="question">
          <QuestionInstructions text={instructions}/>
          <div className="question-content">
              <CourseList courses={this.props.courses} handleAddCourseToRanking={this.handleAddCourseToRanking} getSchedules={this.props.getSchedules}/>
              <CourseRanking ranking= {this.getRanking()} handleRankUp={this.handleRankUp} handleRankDown={this.handleRankDown} handleDeletionFromRanking={this.handleDeletionFromRanking} getSchedules={this.props.getSchedules}/>
          </div>
          <QuestionFooter handleStepChange={this.props.handleStepChange} getStepList={this.props.getStepList} getStepIndex={this.props.getStepIndex} verificationFunction={this.verificationFunction}/>
        </div>
      );
    }
  }

class CourseRanking extends Component {
    render() {
        let ranking_display=[];
        for(let index=0; index<this.props.ranking.length; index++){
            ranking_display.push(
            <CourseBox key={index} course={this.props.ranking[index]} getSchedules={this.props.getSchedules} buttons={[
                <Button text="monter" onClick={()=>this.props.handleRankUp(index)} key="monter"/>,
                <Button text="descendre" onClick={()=>this.props.handleRankDown(index)} key="descendre"/>,
                <Button text="supprimer" onClick={()=>this.props.handleDeletionFromRanking(index)} key="supprimer"/>]}/>
            );
        }
      return (
      <div className="course-ranking"><h1 className="course-ranking-header">Mon classement</h1>{ranking_display.length===0 ?
        <div className="ranking-instructions"><p>Les cours que vous ajouterez au classement s'afficheront ici.</p><p> (De haut en bas par ordre de préférence décroissante)</p><p>Seuls les cours que vous avez classés pourront vous être attibués.</p><p>ATTENTION ! Veillez à classer suffisamment de cours pour être certain(e) d'en avoir en cas de forte demande de vos premiers choix.</p><p>Vous ne maximisez pas vos chances d'avoir vos cours préférés en en classant peu, au contraire, vous augmentez celles d'avoir moins de cours que vous ne le souhaitiez !</p></div>:
        <CourseBoxList content={ranking_display}/>}</div>
      );
    }
  }


class FinalQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {answers_are_sent: false};
      }

    render() {
        return (
          <div className="question">
            <QuestionInstructions text={this.props.instructions}/>
            <div className="question-content">
            {this.props.getAnswersAreSent() ? <div className="final-buttons-box">Vos réponses ont bien été envoyées.</div> :
                <div className="final-buttons-box">
                <FinalButton text={"Envoyer les réponses"} onClick={this.props.sendAnswers}/>
                <FinalButton text={"Annuler le questionnaire"}/>
                </div>}
            </div>
            {this.props.getAnswersAreSent() ? null : <QuestionFooter handleStepChange={this.props.handleStepChange} getStepList={this.props.getStepList} getStepIndex={this.props.getStepIndex}/>}
          </div>
        );
      }
  }

class CourseList extends Component {
  constructor(props) {
    super(props);
    this.state = {current_filters: {language:"", schedule:"", level:""}, criteria_with_options: this.buildCriteriaWithOptions()};//pas de filtrage par défaut
  }

  getCurrentFilters=()=>{
    return this.state.current_filters;
  }

  handleFilterChange=(event) => {
    const target = event.target;
    const value =  target.value;
    const name = target.name;

    let new_filters= this.state.current_filters;
    new_filters[name]=value;
    this.setState({current_filters: new_filters});
  }

  buildCriteriaWithOptions=()=>{
    let list_languages=[];
    let list_schedules=[];
    let list_levels=[];
    for(let index=0; index<this.props.courses.length; index++){
      let current_course=this.props.courses[index];
      if(!list_languages.includes(current_course.language)){list_languages.push(current_course.language)};
      if(!list_levels.includes(current_course.level)){list_levels.push(current_course.level)};
      for(let index_schedule=0; index_schedule<current_course.creneaux.length; index_schedule++){
        let schedule=current_course.creneaux[index_schedule];
        if(!list_schedules.includes(schedule)){list_schedules.push(schedule)};
      }
    }
    let criteria_with_options ={};
    if(list_languages.length>1){
      criteria_with_options.language=list_languages;
    }
    if(list_schedules.length>1){
      criteria_with_options.schedule=list_schedules;
    }
    if(list_levels.length>1){
      criteria_with_options.level=list_levels;
    }
    return criteria_with_options;

  }

  buildListCoursesToDisplay=()=>{
    let list_courses_to_display=this.props.courses;
    if(this.state.current_filters.language!==""){
      list_courses_to_display = list_courses_to_display.filter((value, index, arr)=>{return value.language===this.state.current_filters.language;});
    }
    if(this.state.current_filters.schedule!==""){
      list_courses_to_display = list_courses_to_display.filter((value, index, arr)=>{return value.creneaux.includes(parseInt(this.state.current_filters.schedule));});
    }
    if(this.state.current_filters.level!==""){
      list_courses_to_display = list_courses_to_display.filter((value, index, arr)=>{return value.level===this.state.current_filters.level;});
    }
    return list_courses_to_display;
  }

    render() {
        let list_display=[];
        let list_courses_to_display=this.buildListCoursesToDisplay();
        for(let index=0; index<list_courses_to_display.length; index++){
            list_display.push(
            <CourseBox key={index} course={list_courses_to_display[index]} getSchedules={this.props.getSchedules} buttons={[
                <Button text="ajouter au classement" onClick={()=>this.props.handleAddCourseToRanking(list_courses_to_display[index])} key="ajouter"/>
                ]}/>
            );
        }
      return (
        <div className="course-list">
          <h1 className="course-list-header">Liste des cours</h1>
          <CourseListFilter criteriaWithOptions={this.state.criteria_with_options} getCurrentFilters={this.getCurrentFilters} handleFilterChange={this.handleFilterChange} getSchedules={this.props.getSchedules}/>
          <CourseBoxList content={list_display}/>
        </div>
      );
    }
  }

class CourseListFilter extends Component {
  render() {
    let schedules=this.props.getSchedules();
    let criteria_selection=[];
    for(let criterion in this.props.criteriaWithOptions){
      let list_options=[<option value="" key={""}></option>];
      for(let index=0; index<this.props.criteriaWithOptions[criterion].length; index++){
        let option_name=this.props.criteriaWithOptions[criterion][index];
        if(criterion!=='schedule'){
          list_options.push(<option value={option_name} key={option_name}>{option_name}</option>);
        } else {
          list_options.push(<option value={option_name} key={option_name}>{schedules[option_name].day+(schedules[option_name].day==="hors-créneaux"? "":(" "+schedules[option_name].begin+"-"+schedules[option_name].end))}</option>);
        }

      }
      criteria_selection.push(
        <div className="course-list-filter-option" key={criterion}>
        <label >{criterion==="language"?"Langue : ":(criterion==="schedule"?"Horaire : ":(criterion==="level"?"Niveau : ":"erreur"))}</label>
        <select
            name={criterion}
            type='select'
            value={this.props.getCurrentFilters()[criterion]}
            onChange={this.props.handleFilterChange} >
            {list_options}
          </select>
      </div>

      );
    }


  return (
    <div className="course-list-filter">{criteria_selection}</div>
  );
}
}

//structure générale de question
class QuestionInstructions extends Component {
    render() {
      return (
        <h2 className="question-instructions"> {this.props.text}</h2>
      );
    }
  }

class QuestionFooter extends Component {

    render() {
      let current_step_index=this.props.getStepIndex();
      let step_list_length=this.props.getStepList().length;
      let left_button=null;
      let right_button=null;
      if(current_step_index>0){
        left_button=<ChangeStepButton text="Précédent" onClick={()=>this.props.handleStepChange("previous")}/>
      }
      let nextButtonEffect=()=>{this.props.handleStepChange("next")}
      if(this.props.verificationFunction){//s'il y a une vérification à faire, elle est faite avant de passer à la question suivante
        nextButtonEffect=()=>{
          if(this.props.verificationFunction())
          {
            this.props.handleStepChange("next");
          }
        }
      }
      if(current_step_index<step_list_length-1){
        right_button=<ChangeStepButton text="Suivant" onClick={nextButtonEffect }/>
      }
      return (
        <div className="question-footer"> <div className="question-footer-left"> {left_button}</div><div className="question-footer-right">{right_button}</div></div>
      );
    }
  }

//classes utiles
class CourseBox extends Component {
    render() {
      let schedules=this.props.getSchedules();
      let current_course_schedules_list=this.props.course.creneaux.map(schedule_index => <p key={schedule_index}>{schedules[schedule_index].day+(schedules[schedule_index].day==="hors-créneaux"?"":(" "+schedules[schedule_index].begin+"-"+schedules[schedule_index].end))}</p>)
      return (
        <div className="course-box"> <div><h2>{this.props.course.name}</h2> <h3>{this.props.course.language}</h3>{current_course_schedules_list}</div> <div className="course-box-buttons">{this.props.buttons}</div></div>
      );
    }
  }


class Button extends Component {
  render() {
    return (
      <button className="button" onClick={this.props.onClick}>{this.props.text}</button>
    );
  }
}

class ChangeStepButton extends Component {
  render() {
    return (
      <button className="change-step-button" onClick={this.props.onClick}>{this.props.text}</button>
    );
  }
}

class FinalButton extends Component {
    render() {
      return (
        <button className="final-button" onClick={this.props.onClick}>{this.props.text}</button>
      );
    }
  }


class ErrorMessage extends Component {
  render() {
    return (
      <div className="error-message" ><img src={error_panel} alt="error_panel" style={{height: "5vh"}}/>{this.props.text}</div>
    );
  }
}

class CourseBoxList extends Component {
  render() {
    return (
      <div className="course-box-list" >{this.props.content}</div>
    );
  }
}


export default Questionnaire;
