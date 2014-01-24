/** @jsx React.DOM */

'use strict';

var Project = require('Project')

var $c = require('classNames')

var Reactodo = React.createClass({
  getInitialState: function() {
    return {
      activeProjectId: 2
    , projects: [
        {id: 1, name: 'ABC', doing: null, todos: [
          {id: 1, done: true,  text: 'Test 1'}
        , {id: 2, done: false, text: 'Test 2'}
        , {id: 3, done: false, text: 'Test 3'}
        ]}
      , {id: 2, name: 'DEF', doing: 5, todos: [
           {id: 4, done: true,  text: 'Test 4'}
         , {id: 5, done: false, text: 'Test 5'}
         , {id: 6, done: false, text: 'Test 6'}
        ]}
      ]
    }
  }

, setActiveProject: function(projectId) {
    this.setState({activeProjectId: projectId})
  }

, render: function() {
    var tabs = [], activeProject
    this.state.projects.forEach(function(project) {
      var isActiveProject = (this.state.activeProjectId === project.id)
      tabs.push(<li key={project.id}
        className={$c({active: isActiveProject})}
        onClick={!isActiveProject && this.setActiveProject.bind(this, project.id)}
        >
        {project.name}
      </li>)
      if (isActiveProject) {
        activeProject = <Project project={project}/>
      }
    }.bind(this))

    return <div>
      <h1>reactodo</h1>
      <ul className="project-tabs">{tabs}</ul>
      {activeProject}
    </div>
  }
})

module.exports = Reactodo