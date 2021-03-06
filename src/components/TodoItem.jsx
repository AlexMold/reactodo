'use strict';

var React = require('react')

var $c = require('classNames')
var normaliseContentEditableHTML = require('normaliseContentEditableHTML')
var partial = require('partial')

var {CHECK, DRAG_HANDLE, NBSP} = require('Constants')

var TodoItem = React.createClass({
  getInitialState() {
    return {
      dragging: false
    , editing: this.props.initialEdit || false
    }
  },

  componentDidMount() {
    if (this.props.initialEdit) {
      this.refs.text.getDOMNode().focus()
    }
  },

  componentDidUpdate (prevProps, prevState) {
    if (this.state.editing && !prevState.editing) {
      this.refs.text.getDOMNode().focus()
    }
  },

  handleTextClick() {
    if (!this.state.editing) {
      this.setState({editing: true})
    }
  },

  handleTextBlur() {
    if (this.state.editing) {
      var text = normaliseContentEditableHTML(this.refs.text.getDOMNode().innerHTML)
      // Re-apply normalised HTML to the TODO's text
      if (text) {
        this.refs.text.getDOMNode().innerHTML = text
      }
      this.setState({editing: false})
      if (!text) {
        this.props.onDelete(this.props.todo)
      }
      else {
        this.props.onEdit(this.props.todo, text)
      }
    }
  },

  handleDragStart(e) {
    e.dataTransfer.setData('text', '' + this.props.index)
    this.setState({dragging: true})
  },

  handleDragEnd(e) {
    this.setState({dragging: false})
    this.props.onDragEnd()
  },

  /** Indicates that this TODO is a drop target. */
  handleDragEnter(e) {
    e.preventDefault()
  },

  /** Sets the drop effect for this TODO. */
  handleDragOver(e) {
    if (this.state.dragging) {
      return
    }
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    this.props.onDragOver(this.props.todo)
  },

  /** Handles another TODO being dropped on this one. */
  handleDrop(e) {
    e.preventDefault()
    var fromIndex = Number(e.dataTransfer.getData('text'))
    this.props.onMoveTodo(fromIndex, this.props.index)
  },

  /**
   * IE9 doesn't support draggable="true" on <span>s. This hack manually starts
   * the drag & drop process onMouseDown. The setTimeout not only bothers me but
   * doesn't always seem to work - without it, the classes which set style for
   * the item being dragged and dropzones being dragged over aren't applied.
   */
  handleIE9DragHack(e) {
    e.preventDefault()
    if (window.event.button === 1) {
      var target = e.nativeEvent.target
      setTimeout(function() { target.dragDrop() }, 50)
    }
  },

  render() {
    var todoItemClassName = $c('todo-item', {
      'is-todo': !this.props.todo.done
    , 'is-done': this.props.todo.done
    , 'is-doing': this.props.doing
    , 'dropzone': !this.props.doing
    , 'dragging': this.state.dragging
    , 'dragover': this.props.dragover
    })

    var dragHandle
    if (!this.props.doing) {
      dragHandle = <div className="todo-item-handle">
        <span
          className="handle"
          draggable="true"
          onDragStart={this.handleDragStart}
          onDragEnd={this.handleDragEnd}
          onMouseDown={typeof window.isIE9 != 'undefined' && this.handleIE9DragHack}
        >{DRAG_HANDLE}</span>
      </div>
    }

    // onDrop is handled by the [DOING] dropZone if that's where this TODO is
    // being displayed.
    return <div
             className={todoItemClassName}
             onDragEnter={this.handleDragEnter}
             onDragOver={this.handleDragOver}
             onDragLeave={!this.props.doing && this.props.onDragLeave}
             onDrop={!this.props.doing && this.handleDrop}
           >
      <div className="todo-item-toolbar">
        <span className="control" onClick={partial(this.props.onToggle, this.props.todo)}>[{this.props.todo.done ? CHECK : NBSP}]</span>
      </div>
      <div
        className="todo-item-text"
        ref="text"
        onClick={this.handleTextClick}
        onBlur={this.handleTextBlur}
        contentEditable={this.state.editing}
        dangerouslySetInnerHTML={{__html: this.props.todo.text || '&nbsp;'}}
      />
      {dragHandle}
    </div>
  }
})

module.exports = TodoItem