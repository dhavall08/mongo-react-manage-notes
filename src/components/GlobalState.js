import React, { Component } from 'react';
import { addNote, getNotes, deleteNote } from '../services/NoteServices';

const initialState = {
  noteList: [],
  addNote: () => { },
}

export const ReactContext = React.createContext(initialState);
export default class GlobalState extends Component {
  state = {
    noteList: [],
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
        return console.error(res.data.message);
      }
      const noteList = res.data && res.data.data ? res.data.data : [];
      this.setState({ noteList: noteList, fetching: false });
    }).catch(err => {
      console.log(err);
      this.setState({ noteList: [], fetching: false });

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
        callback(false);
        return console.error(res.data.message);
      }
      console.log(res.data.message);
      this.getNotes();
      callback();
    }).catch(err => {
      callback(false);
      console.error(err);
    })
  }

  removeNote = (id, callback) => {
    deleteNote({ id: id }).then(res => {
      if (res.error) {
        callback();
        return console.error(res.data.message);
      }
      console.log(res.data.message);
      this.getNotes();
      callback();
    }).catch(err => {
      console.log(err);
    });
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
