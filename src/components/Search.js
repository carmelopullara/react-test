import React, { Component } from 'react';
import axios from 'axios';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      repo: '',
      error: false,
      loading: false,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      repo: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.repo) return;
    
    this.setState({
      error: false,
      loading: true,
    })
    
    axios.get(`https://api.github.com/repos/${this.state.repo}`).then((data) => {
      this.setState({
        loading: false,
        error: false,
      });
      this.props.history.push('/repo/' + this.state.repo);
    })
    .catch((e) => {
      this.setState({
        loading: false,
        error: true,
      });
    })
  }

  render() {
    const { loading, error, repo } = this.state;
    const messageClass = error ? 'text-red-500' : 'text-gray-700';
    return (
      <div className="bg-gray-300 flex h-screen items-center justify-center">
        <div className="container text-center">
          <form className="w-1/2 m-auto" onSubmit={this.handleSubmit}>
            <input
              className="w-3/4 bg-white outline-none px-6 py-4 rounded-l shadow-lg text-gray-800 focus:border-blue-600 border border-white text-sm"
              placeholder="Repository name"
              type="text"
              value={repo}
              required
              onChange={this.handleChange}
            />
            <button className="w-1/4 bg-blue-600 border focus:outline-none border-blue-600 px-4 py-4 rounded-r shadow-lg text-white hover:bg-blue-700 hover:border-blue-700 text-sm font-semibold" type="submit">
              Search
            </button>
          </form>
          <p className={`h-5 my-5 text-xs ${messageClass}`}>{ (loading && 'Loading...') || (error && 'Repository name not valid') }</p>
        </div>
      </div>
    );
  }
}

export default Search;
