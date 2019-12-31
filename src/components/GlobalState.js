import React, { Component } from 'react';
import { addNote, getNotes } from '../services/NoteServices';

const initialState = {
  noteList: [
    { id: 1, value: 'This is initial note.' }
  ],
  addNote: () => { },
}

export const ReactContext = React.createContext(initialState);
export default class GlobalState extends Component {
  state = {
    noteList: [
      { id: 1, value: 'This is initial note.' }
    ],
    fetching: false
  }

  componentDidMount() {
    this.getNotes();
  }

  getNotes = () => {
    this.setState({ fetching: true });
    getNotes().then(res => {
      if (res.error) {
        this.setState({ fetching: false });
        return console.error(res.message);
      }
      const noteList = res.data && res.data.data ? res.data.data : [];
      this.setState({ noteList: noteList, fetching: false });
    }).catch(err => {
      console.log(err);
    })
  }

  getRandom = () => {
    return new Date().getTime().toString();
  }

  addNote = (text, callback) => {
    if (!text) {
      return false;
    }
    addNote({ note: text }).then(res => {
      if (res.error) {
        return console.error(res.message);
      }
      console.log(res.message);
      this.setState((state) => ({
        noteList: state.noteList.concat({ id: this.getRandom(), value: text })
      }), () => {
        callback();
        this.getNotes();
      });
    }).catch(err => {
      console.log(err);
    })
  }

  removeNote = (id) => {
    this.setState((state) => ({
      noteList: state.noteList.filter((note, i) => note.id !== id)
    }));
  }

  render() {
    return (
      <ReactContext.Provider
        value={{
          noteList: this.state.noteList,
          addNote: this.addNote,
          removeNote: this.removeNote,
          fetching: this.state.fetching
        }}>
        {this.props.children}
      </ReactContext.Provider>
    )
  }
}
