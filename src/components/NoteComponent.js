import React, { Component } from 'react'
import { ReactContext } from './GlobalState';

export default class NoteComponent extends Component {
  static contextType = ReactContext;
  state = {
    inputText: '',
    addLoading: false,
  }

  addNote = (e) => {
    e && e.preventDefault();
    if (this.state.inputText === '') {
      return false;
    }
    this.setState({ addLoading: true });
    this.context.addNote(this.state.inputText, () => {
      this.setState({ inputText: '', addLoading: false });
    });
  }
  render() {
    const { removeNote, fetching } = this.context;
    const { addLoading } = this.state;
    return (
      <div className='note-list'>
        <form>
          <div className='add-note'>
            <input
              className={`${fetching ? 'fetch' : ''}`}
              disabled={fetching}
              value={this.state.inputText}
              placeholder={`${fetching ? 'start typing... loading...' : 'start typing...'}`}
              onChange={(e) => this.setState({ inputText: e.target.value })}
            />
            {addLoading && <div className="spinner">
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
              <span
                tabIndex={0}
                onClick={() => removeNote(note.id)}> ✖</span>
            </li>
          })}
        </ul>
      </div >
    )
  }
}
