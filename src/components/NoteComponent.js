import React, { Component } from 'react'
import { ReactContext } from './GlobalState';

export default class NoteComponent extends Component {
  static contextType = ReactContext;
  constructor() {
    super();
    this.state = {
      inputText: '',
      addLoading: false,
    }
    this.noteField = React.createRef();
  }

  componentDidMount() {
    this.getInputFocused();
  }

  getInputFocused = () => {
    this.noteField.current.focus();
  }

  addNote = (e) => {
    e && e.preventDefault();
    if (this.state.inputText === '') {
      return false;
    }
    this.setState({ addLoading: true });
    this.context.addNote(this.state.inputText, (ok = true) => {
      this.getInputFocused();
      this.setState(state => ({ inputText: ok ? '' : state.inputText, addLoading: false }));
    });
  }

  removeNote = (id) => {
    this.setState({ removeLoading: true });
    this.context.removeNote(id, () => {
      this.getInputFocused();
      this.setState({ removeLoading: false });
    })
  }

  render() {
    const { fetching } = this.context;
    const { addLoading, removeLoading } = this.state;
    return (
      <div className='note-list'>
        <form>
          <div className='add-note'>
            <input
              ref={this.noteField}
              className={`${fetching ? 'fetch' : ''}`}
              value={this.state.inputText}
              placeholder={`${fetching ? 'start typing... loading...' : 'start typing...'}`}
              onChange={(e) => this.setState({ inputText: e.target.value })}
            />
            {addLoading || removeLoading && <div className="spinner">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>}
            <button
              className={`${this.state.inputText === '' || addLoading ? 'disable' : ''}`}
              onClick={this.addNote}>+</button>
          </div>
        </form>
        <ul>
          {this.context.noteList && this.context.noteList.length > 0 && this.context.noteList.map((note, i) => {
            return <li key={i}>
              {note.value}
              <button
                onClick={() => this.removeNote(note._id)}> ✖</button>
            </li>
          })}
        </ul>
      </div >
    )
  }
}
