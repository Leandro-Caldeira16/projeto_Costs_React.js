import Message from "../layout/Message.js"
import { useLocation } from "react-router-dom"
import styles from "./projects.module.css"
import Container from "../layout/Container"
import Loading from "../layout/Loading.js"
import LinkButton from "../pages/LinkButton"
import ProjectCard from "../project/ProjectCard"

import { useEffect, useState } from "react"

function Projects(){

    const [projects, setProjects]=useState([])
    const [removeLoading, setRemoveLoading] = useState(false)
    const [projectMessage, setProjectMessage] = useState('')

    const location = useLocation()
    let message =''
    if(location.state) {
        message = location.state.message
    }

    useEffect(()=>{

        setTimeout(() => {
            
            fetch("http://localhost:5000/projects",{
                method:'GET',
                headers:{'Content-Type' : 'application/json',},
            })
            .then((resp)=>resp.json())
            .then((data)=>{
                console.log(data)
                setProjects(data)
                setRemoveLoading(true)
                
            })
            .catch((err)=> console.log(err))  
            
        }, 400);
        

    }
    ,[])

    function removeProject(id){

        fetch(`http://localhost:5000/projects/${id}`, {
            method: "DELETE",
            headers: {"Content-type" : "application/json"},
        })
        .then((resp)=> resp.json())
        .then(()=>{
            setProjects(projects.filter((project)=>project.id !== id))
            setProjectMessage('Projeto excluido com sucesso!')
        })
            
        
        .catch((err)=>console.log(err))
    }

    return(
        <div className={styles.project_container}>
            <div className={styles.title_container}>
                <h1>Meus Projetos</h1>  
                <LinkButton to={'/newproject'} name={'Criar projeto'}/>
            </div>
            {message && <Message msg = {message} type={"success"}/>}
            {projectMessage && <Message msg = {projectMessage} type={"success"}/>}

            <Container customClass= "start">
                {projects.length >0 && (
                    projects.map((project)=>(
                        <ProjectCard 
                        id={project.id}
                        name={project.name}
                        budget={project.budget}
                        category={project.category.name}
                        key={project.id}
                        handleRemove={removeProject}
                    />
                    )))}
                    {!removeLoading && (<Loading></Loading>)}
                    {removeLoading && projects.length === 0 && (<p>Não há projetos cadastrados</p>)}
            </Container>
        </div>
    )
}

export default Projects 